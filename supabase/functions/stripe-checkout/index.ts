import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";
import { createAdminClient } from "../_shared/db.ts";

import { getStripe, PRICE_IDS, subscriptionPeriodEnd, validateStripePricesOnce } from "../_shared/stripe.ts";

// Fail fast on cold start if Stripe prices are misconfigured
const stripe = getStripe();
const stripePriceValidation = validateStripePricesOnce(stripe);

// The $25/month plan is paused for new purchases: every court form, form guide and the
// public-records letter are free, so the plan gates nothing. It returns as the Toolkit plan
// (case binder, hearing calendar, course tracker); set this to false then. Subscriptions that
// already exist are unaffected and can be cancelled online through cancel-subscription.
const NEW_SUBSCRIPTIONS_PAUSED = true;

function planPausedResponse(): Response {
  return new Response(
    JSON.stringify({
      error: "The $25/month plan is paused and is not available for new purchases. All court forms, form guides and the public-records letter tool are free in California and New York.",
      code: "PLAN_PAUSED",
    }),
    { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

async function getOrCreateCustomer(stripe: Stripe, email: string | undefined, userId: string): Promise<string> {
  // customers.list without an email filter returns any customer, i.e. someone else's.
  if (!email) throw new Error("An email address is required to check out");
  const customers = await stripe.customers.list({ email, limit: 1 });
  if (customers.data.length > 0) {
    return customers.data[0].id;
  }
  const customer = await stripe.customers.create({
    email,
    metadata: { user_id: userId },
  });
  return customer.id;
}

async function createCheckoutSession(
  stripe: Stripe,
  data: {
    priceId: string;
    mode: "payment" | "subscription";
    userId: string;
    email?: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }
): Promise<Stripe.Checkout.Session> {
  const customerId = await getOrCreateCustomer(stripe, data.email, data.userId);

  return await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: data.priceId, quantity: 1 }],
    mode: data.mode,
    success_url: data.successUrl,
    cancel_url: data.cancelUrl,
    metadata: {
      user_id: data.userId,
      ...data.metadata,
    },
    // Session metadata is not copied to the subscription; stripe-webhook and cancel-subscription
    // need user_id on the subscription itself.
    ...(data.mode === "subscription"
      ? { subscription_data: { metadata: { user_id: data.userId, app: "justice_bot_usa" } } }
      : {}),
    allow_promotion_codes: true,
  });
}

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
 * Inserts the subscriptions row for a Stripe subscription, or refreshes the existing one from
 * Stripe's current state. verify_session and stripe-webhook both record the same checkout (keep
 * this in step with saveSubscriptionRow there). The column has no unique constraint, so if both
 * insert at once the newer duplicates are deleted, keeping the oldest row.
 */
async function saveSubscriptionRow(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  subscription: Stripe.Subscription,
): Promise<void> {
  const status = rowStatus(subscription);
  const endDate = new Date(subscriptionPeriodEnd(subscription) * 1000).toISOString();
  const { data: updated, error: updateError } = await supabase
    .from("subscriptions")
    .update({
      status,
      ...(status === "active" ? { end_date: endDate } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("paypal_subscription_id", subscription.id) // reusing column for stripe ID
    .select("id");
  if (updateError) throw new Error(`Failed to save subscription: ${updateError.message}`);
  if (updated && updated.length > 0) return;

  const { error } = await supabase.from("subscriptions").insert({
    user_id: userId,
    plan_type: subscription.items.data[0]?.price.recurring?.interval === "year" ? "yearly" : "monthly",
    status,
    amount: (subscription.items.data[0]?.price.unit_amount ?? 0) / 100,
    start_date: new Date().toISOString(),
    end_date: endDate,
    paypal_subscription_id: subscription.id,
  });
  if (error) throw new Error(`Failed to save subscription: ${error.message}`);

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

async function handleCreateSubscription(
  stripe: Stripe,
  data: { planType: string; userId: string; email?: string },
  origin: string
) {
  // Only monthly subscription now
  const priceId = PRICE_IDS.monthly;
  
  const session = await createCheckoutSession(stripe, {
    priceId,
    mode: "subscription",
    userId: data.userId,
    email: data.email,
    successUrl: `${origin}/payment-success?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}/pricing?subscription=cancelled`,
    metadata: { 
      access_type: "monthly",
      plan_type: "monthly",
      product_type: "subscription",
      country: "US",
      source: "pricing_page",
      app: "justice_bot_usa",
    },
  });

  console.log("Subscription checkout session created:", session.id);
  return successResponse({ url: session.url, sessionId: session.id });
}

async function handleVerifySession(
  stripe: Stripe,
  data: { sessionId: string; userId: string }
) {
  const session = await stripe.checkout.sessions.retrieve(data.sessionId);
  
  if (session.payment_status !== "paid") {
    return errorResponse("PAYMENT_REQUIRED", "Payment not completed");
  }

  // Prevent session-claim IDOR: ensure the session was created for this user
  const sessionUserId = session.metadata?.user_id;
  if (!sessionUserId || sessionUserId !== data.userId) {
    return errorResponse("FORBIDDEN", "Session does not belong to this user");
  }

  const supabase = createAdminClient();
  const accessType = session.metadata?.access_type || "single_form";
  
  if (session.mode === "subscription") {
    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await saveSubscriptionRow(supabase, data.userId, subscription);

    return successResponse({ success: true, type: "subscription", planType: "monthly" });
  } else {
    // Handle one-time payment (single_form or bundle)
    const formType = session.metadata?.form_type || "general";
    const caseId = session.metadata?.case_id;
    const amount = accessType === "bundle" ? 49.99 : accessType === "foia_bundle" ? 29.99 : 9.99;
    
    const { error } = await supabase.from("form_payments").insert({
      user_id: data.userId,
      paypal_payment_id: session.payment_intent as string,
      amount,
      status: "completed",
      form_type: (accessType === "bundle" || accessType === "foia_bundle") ? accessType : formType,
    });

    if (error) {
      console.error("Error saving payment:", error);
      throw new Error("Failed to save payment");
    }

    return successResponse({ 
      success: true, 
      type: (accessType === "bundle" || accessType === "foia_bundle") ? "bundle" : "payment", 
      accessType,
      formType,
      caseId: caseId || null,
    });
  }
}

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    console.log("Stripe checkout function called");
    
    await stripePriceValidation;

    const { userId, email } = await requireUser(req);
    const { action, ...data } = await req.json();
    const origin = req.headers.get("origin") || "https://justicebot-usa.com";

    switch (action) {
      case "create_subscription":
        if (NEW_SUBSCRIPTIONS_PAUSED) return planPausedResponse();
        return await handleCreateSubscription(stripe, { ...data, userId, email }, origin);
      // Older one-time prices are no longer offered; sessions already paid for them still
      // verify below.
      case "create_one_time_payment":
      case "create_bundle_payment":
        return errorResponse("BAD_REQUEST", "One-time purchases are no longer offered. All court forms and filling instructions are free.");
      case "verify_session":
        return await handleVerifySession(stripe, { ...data, userId });
      default:
        return errorResponse("BAD_REQUEST", "Invalid action");
    }
  } catch (error) {
    console.error("Error in Stripe checkout function:", error);
    return handleError(error);
  }
});
