import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, handleError } from "../_shared/errors.ts";
import { subscriptionPeriodEnd } from "../_shared/stripe.ts";

// Product IDs for tier identification. Only subscriptions to these products, or ones our
// checkout started (metadata app "justice_bot_usa"), count: anything else on the same Stripe
// customer (another product in this Stripe account) does not unlock Justice Bot USA.
const PRODUCT_TIERS: Record<string, string> = {
  "prod_Tod1LkWiqa7gey": "monthly",
  "prod_TyyZmnGjOH4QrU": "monthly", // Justice Bot USA Access ($25/month)
  "prod_Tod3SaiL3B4ntU": "annual",
};

// Statuses where the renewal payment failed: no access, but Stripe may still retry the charge.
const LAPSED_STATUSES: Stripe.Subscription.Status[] = ["past_due", "unpaid", "incomplete"];

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

    // A lapsed subscription (renewal payment failed) gives no access but can still be charged
    // by Stripe's retries, so report it as cancellable for the cancel button on /pricing.
    const unsubscribed = (customerId: string | null, lapsed: Stripe.Subscription | null = null) => successResponse({
      subscribed: false,
      subscription_tier: null,
      subscription_end: null,
      customer_id: customerId,
      ...(lapsed && { cancellable: true, subscription_status: lapsed.status }),
    });

    // customers.list without an email filter returns any customer, i.e. someone else's.
    if (!email) {
      logStep("User has no email, returning unsubscribed");
      return unsubscribed(null);
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Find customers by email (there can be more than one)
    const customers = await stripe.customers.list({ email, limit: 10 });
    
    if (customers.data.length === 0) {
      logStep("No Stripe customer found, returning unsubscribed");
      return unsubscribed(null);
    }

    // Pick the active or trialing subscription to one of our products that runs longest.
    let subscription: Stripe.Subscription | null = null;
    let lapsed: Stripe.Subscription | null = null;
    let customerId = customers.data[0].id;
    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 20 });
      for (const candidate of subscriptions.data) {
        const productId = candidate.items.data[0]?.price.product as string;
        if (!PRODUCT_TIERS[productId] && candidate.metadata?.app !== "justice_bot_usa") continue;
        // Checkout stamps user_id on the subscription; one started by another account is not this user's.
        const ownerId = candidate.metadata?.user_id;
        if (ownerId && ownerId !== userId) continue;
        if (LAPSED_STATUSES.includes(candidate.status)) {
          lapsed ??= candidate;
          continue;
        }
        if (candidate.status !== "active" && candidate.status !== "trialing") continue;
        if (!subscription || subscriptionPeriodEnd(candidate) > subscriptionPeriodEnd(subscription)) {
          subscription = candidate;
          customerId = customer.id;
        }
      }
    }

    if (!subscription) {
      logStep("No active or trialing subscription found", {
        customers: customers.data.length,
        lapsedStatus: lapsed?.status ?? null,
      });
      return unsubscribed(customerId, lapsed);
    }

    const productId = subscription.items.data[0]?.price.product as string;
    const tier = PRODUCT_TIERS[productId] ??
      (subscription.items.data[0]?.price.recurring?.interval === "year" ? "annual" : "monthly");
    const subscriptionEnd = new Date(subscriptionPeriodEnd(subscription) * 1000).toISOString();

    logStep("Found subscription", { 
      subscriptionId: subscription.id, 
      status: subscription.status,
      tier, 
      endDate: subscriptionEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });

    return successResponse({
      subscribed: true,
      subscription_tier: tier,
      subscription_end: subscriptionEnd,
      subscription_status: subscription.status,
      // true once the user has cancelled: access continues until subscription_end, then stops.
      cancel_at_period_end: subscription.cancel_at_period_end,
      customer_id: customerId,
    });

  } catch (error) {
    logStep("ERROR", { message: error instanceof Error ? error.message : String(error) });
    return handleError(error);
  }
});
