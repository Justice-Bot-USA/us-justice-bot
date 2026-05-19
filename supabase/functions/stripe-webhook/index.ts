import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { corsHeaders } from "../_shared/auth.ts";
import { createAdminClient } from "../_shared/db.ts";

import { getStripe, validateStripePricesOnce } from "../_shared/stripe.ts";

const stripe = getStripe();
const stripePriceValidation = validateStripePricesOnce(stripe);

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!webhookSecret) {
    console.error("❌ STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  if (!signature) {
    console.error("❌ Missing Stripe-Signature header");
    return new Response("Missing signature", { status: 400 });
  }

  try {
    // Startup Price Validation (hard rule)
    await stripePriceValidation;

    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    console.log(`✅ Webhook received: ${event.type}`);
    const supabase = createAdminClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const accessType = session.metadata?.access_type;
        
        console.log("✅ checkout.session.completed:", {
          sessionId: session.id,
          userId,
          accessType,
          paymentStatus: session.payment_status,
          mode: session.mode,
        });

        if (session.payment_status !== "paid") {
          console.log(`⏳ Payment not yet complete for session ${session.id}`);
          break;
        }

        if (!userId) {
          console.error("❌ No user_id in session metadata");
          break;
        }

        // Route based on access_type metadata (not price ID)
        switch (accessType) {
          case "single_form": {
            const formType = session.metadata?.form_type || "general";
            const caseId = session.metadata?.case_id;
            
            console.log(`📄 Unlocking single form access: ${formType}`);
            
            const { error } = await supabase.from("form_payments").insert({
              user_id: userId,
              paypal_payment_id: session.payment_intent as string,
              amount: 9.99,
              status: "completed",
              form_type: formType,
            });

            if (error) {
              console.error("❌ Error saving form payment:", error);
            } else {
              console.log(`✅ Form access unlocked for user ${userId}, form: ${formType}${caseId ? `, case: ${caseId}` : ""}`);
            }
            break;
          }

          case "monthly":
          case "yearly": {
            const subscriptionId = session.subscription as string;
            
            if (!subscriptionId) {
              console.error("❌ No subscription ID for subscription access type");
              break;
            }

            console.log(`📅 Creating ${accessType} subscription: ${subscriptionId}`);
            
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const endDate = new Date(subscription.current_period_end * 1000);
            const amount = accessType === "yearly" ? 499.99 : 59.99;

            const { error } = await supabase.from("subscriptions").insert({
              user_id: userId,
              plan_type: accessType === "yearly" ? "annual" : "monthly",
              status: "active",
              amount,
              start_date: new Date().toISOString(),
              end_date: endDate.toISOString(),
              paypal_subscription_id: subscriptionId, // reusing column for stripe ID
            });

            if (error) {
              console.error("❌ Error saving subscription:", error);
            } else {
              console.log(`✅ ${accessType} subscription created for user ${userId}, ends: ${endDate.toISOString()}`);
            }
            break;
          }

          default:
            console.log(`ℹ️ Unknown access_type: ${accessType}, session mode: ${session.mode}`);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("✅ payment_intent.succeeded:", paymentIntent.id);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;
        
        console.log(`📝 Subscription updated: ${subscription.id}, status: ${subscription.status}`);
        
        if (userId) {
          const { error } = await supabase
            .from("subscriptions")
            .update({
              status: subscription.status === "active" ? "active" : "cancelled",
              end_date: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("paypal_subscription_id", subscription.id); // reusing column for stripe ID
          
          if (error) {
            console.error("Error updating subscription:", error);
          } else {
            console.log(`✅ Subscription ${subscription.id} updated in database`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`🚫 Subscription cancelled: ${subscription.id}`);
        
        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("paypal_subscription_id", subscription.id);
        
        if (error) {
          console.error("Error cancelling subscription:", error);
        } else {
          console.log(`✅ Subscription ${subscription.id} cancelled in database`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`❌ Payment failed for invoice: ${invoice.id}`);
        
        if (invoice.subscription) {
          const { error } = await supabase
            .from("subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("paypal_subscription_id", invoice.subscription as string);
          
          if (error) {
            console.error("Error updating subscription status:", error);
          }
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return new Response("Webhook validation failed", {
      status: 400,
    });
  }
});
