import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { corsHeaders } from "../_shared/auth.ts";
import { createAdminClient } from "../_shared/db.ts";

import { getStripe, subscriptionPeriodEnd, validateStripePricesOnce } from "../_shared/stripe.ts";

const stripe = getStripe();
const stripePriceValidation = validateStripePricesOnce(stripe);

type AdminClient = ReturnType<typeof createAdminClient>;

/**
 * public.subscriptions.status only allows active, cancelled or expired (CHECK constraint).
 * A lapsed payment (past_due, unpaid, ...) is stored as expired and becomes active again if
 * Stripe later collects it.
 */
function rowStatus(subscription: Stripe.Subscription): "active" | "cancelled" | "expired" {
  if (subscription.status === "active" || subscription.status === "trialing") return "active";
  return subscription.status === "canceled" ? "cancelled" : "expired";
}

/**
 * Updates every row for this Stripe subscription (matched on the reused paypal_subscription_id
 * column, so it works whether or not the subscription carries user_id metadata). end_date only
 * moves while the subscription is in good standing. Returns how many rows matched.
 */
async function syncSubscriptionRow(supabase: AdminClient, subscription: Stripe.Subscription): Promise<number> {
  const status = rowStatus(subscription);
  const { data, error } = await supabase
    .from("subscriptions")
    .update({
      status,
      ...(status === "active"
        ? { end_date: new Date(subscriptionPeriodEnd(subscription) * 1000).toISOString() }
        : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("paypal_subscription_id", subscription.id) // reusing column for stripe ID
    .select("id");
  if (error) throw new Error(`Failed to update subscription ${subscription.id}: ${error.message}`);
  return data?.length ?? 0;
}

/**
 * Inserts the row for a Stripe subscription, or refreshes it if it already exists, so webhook
 * retries and stripe-checkout's verify_session (same logic there; keep in step) never create a
 * second row. The column has no unique constraint, so if two inserts race the newer duplicates
 * are deleted, keeping the oldest row.
 */
async function saveSubscriptionRow(supabase: AdminClient, userId: string, subscription: Stripe.Subscription): Promise<void> {
  if (await syncSubscriptionRow(supabase, subscription) > 0) return;

  const { error } = await supabase.from("subscriptions").insert({
    user_id: userId,
    plan_type: subscription.items.data[0]?.price.recurring?.interval === "year" ? "yearly" : "monthly",
    status: rowStatus(subscription),
    amount: (subscription.items.data[0]?.price.unit_amount ?? 0) / 100,
    start_date: new Date().toISOString(),
    end_date: new Date(subscriptionPeriodEnd(subscription) * 1000).toISOString(),
    paypal_subscription_id: subscription.id, // reusing column for stripe ID
  });
  if (error) throw new Error(`Failed to save subscription ${subscription.id}: ${error.message}`);

  const { data: rows } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("paypal_subscription_id", subscription.id)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });
  if (rows && rows.length > 1) {
    await supabase.from("subscriptions").delete().in("id", rows.slice(1).map((r) => r.id));
  }
}

/**
 * The subscription an invoice belongs to. API 2025-03-31.basil and later moved it to
 * invoice.parent.subscription_details; payloads sent with an older endpoint version still
 * carry invoice.subscription.
 */
function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const legacy = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription;
  const ref = invoice.parent?.subscription_details?.subscription ?? legacy;
  if (!ref) return null;
  return typeof ref === "string" ? ref : ref.id;
}

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

  let event: Stripe.Event;
  try {
    // Startup Price Validation (hard rule)
    await stripePriceValidation;

    const body = await req.text();
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return new Response("Webhook validation failed", {
      status: 400,
    });
  }

  // Handlers are idempotent, so a failure returns 500 and Stripe retries the event.
  try {
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

            console.log(`📅 Saving ${accessType} subscription: ${subscriptionId}`);

            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            await saveSubscriptionRow(supabase, userId, subscription);
            console.log(`✅ ${accessType} subscription saved for user ${userId}, ends: ${new Date(subscriptionPeriodEnd(subscription) * 1000).toISOString()}`);
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
        // Re-read the subscription so an out-of-order event cannot roll the row back.
        const subscription = await stripe.subscriptions.retrieve((event.data.object as Stripe.Subscription).id);
        console.log(`📝 Subscription updated: ${subscription.id}, status: ${subscription.status}, cancel_at_period_end: ${subscription.cancel_at_period_end}`);

        const matched = await syncSubscriptionRow(supabase, subscription);
        console.log(`✅ Subscription ${subscription.id} updated in database (${matched} row(s))`);
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

        if (error) throw new Error(`Failed to cancel subscription ${subscription.id}: ${error.message}`);
        console.log(`✅ Subscription ${subscription.id} cancelled in database`);
        break;
      }

      // A renewal was paid: extend end_date to the subscription's new period end.
      case "invoice.paid":
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoiceSubscriptionId(invoice);
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const matched = await syncSubscriptionRow(supabase, subscription);

        // No row yet (checkout.session.completed not processed): create it, but only for a
        // subscription our checkout started, since this endpoint sees the whole Stripe account.
        const userId = subscription.metadata?.user_id;
        if (matched === 0 && userId && subscription.metadata?.app === "justice_bot_usa") {
          await saveSubscriptionRow(supabase, userId, subscription);
        }
        console.log(`✅ Invoice ${invoice.id} paid for subscription ${subscriptionId}, ends: ${new Date(subscriptionPeriodEnd(subscription) * 1000).toISOString()}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`❌ Payment failed for invoice: ${invoice.id}`);

        const subscriptionId = invoiceSubscriptionId(invoice);
        if (subscriptionId) {
          await syncSubscriptionRow(supabase, await stripe.subscriptions.retrieve(subscriptionId));
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
    console.error(`❌ Webhook handler error (${event.type}):`, err);
    return new Response("Webhook handler failed", {
      status: 500,
    });
  }
});
