import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, handleError } from "../_shared/errors.ts";

// Product IDs for tier identification
const PRODUCT_TIERS: Record<string, string> = {
  "prod_Tod1LkWiqa7gey": "monthly",
  "prod_Tod3SaiL3B4ntU": "annual",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    logStep("Stripe key verified");

    const { userId, email } = await requireUser(req);
    logStep("User authenticated", { userId, email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Find customer by email
    const customers = await stripe.customers.list({ email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No Stripe customer found, returning unsubscribed");
      return successResponse({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        customer_id: null,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // Check for trialing subscriptions
      const trialingSubscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "trialing",
        limit: 1,
      });

      if (trialingSubscriptions.data.length === 0) {
        logStep("No active or trialing subscription found");
        return successResponse({
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          customer_id: customerId,
        });
      }

      // Has trialing subscription
      const subscription = trialingSubscriptions.data[0];
      const productId = subscription.items.data[0]?.price.product as string;
      const tier = PRODUCT_TIERS[productId] || "unknown";
      const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();

      logStep("Found trialing subscription", { 
        subscriptionId: subscription.id, 
        tier, 
        endDate: subscriptionEnd 
      });

      return successResponse({
        subscribed: true,
        subscription_tier: tier,
        subscription_end: subscriptionEnd,
        subscription_status: "trialing",
        customer_id: customerId,
      });
    }

    // Has active subscription
    const subscription = subscriptions.data[0];
    const productId = subscription.items.data[0]?.price.product as string;
    const tier = PRODUCT_TIERS[productId] || "unknown";
    const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();

    logStep("Found active subscription", { 
      subscriptionId: subscription.id, 
      tier, 
      endDate: subscriptionEnd 
    });

    return successResponse({
      subscribed: true,
      subscription_tier: tier,
      subscription_end: subscriptionEnd,
      subscription_status: subscription.status,
      customer_id: customerId,
    });

  } catch (error) {
    logStep("ERROR", { message: error instanceof Error ? error.message : String(error) });
    return handleError(error);
  }
});
