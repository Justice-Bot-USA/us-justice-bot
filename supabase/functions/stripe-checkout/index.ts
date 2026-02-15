import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";
import { createAdminClient } from "../_shared/db.ts";

import { getStripe, PRICE_IDS, validateStripePricesOnce } from "../_shared/stripe.ts";

// Fail fast on cold start if Stripe prices are misconfigured
const stripe = getStripe();
const stripePriceValidation = validateStripePricesOnce(stripe);

async function getOrCreateCustomer(stripe: Stripe, email: string, userId: string): Promise<string> {
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
    email: string;
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
    allow_promotion_codes: true,
  });
}

async function handleCreateSubscription(
  stripe: Stripe,
  data: { planType: string; userId: string; email: string },
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
      app: "veritas_path",
    },
  });

  console.log("Subscription checkout session created:", session.id);
  return successResponse({ url: session.url, sessionId: session.id });
}

async function handleCreateOneTimePayment(
  stripe: Stripe,
  data: { userId: string; email: string; formType?: string; caseId?: string },
  origin: string
) {
  // Route FOIA requests to dedicated FOIA price
  const isFoia = data.formType === "foia_records_request";
  const priceId = isFoia ? PRICE_IDS.foia_single : PRICE_IDS.per_form;

  const session = await createCheckoutSession(stripe, {
    priceId,
    mode: "payment",
    userId: data.userId,
    email: data.email,
    successUrl: `${origin}/payment-success?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}/pricing?payment=cancelled`,
    metadata: {
      access_type: isFoia ? "foia_single" : "single_form",
      product_type: isFoia ? "foia_single" : "single_form",
      country: "US",
      form_type: data.formType || "general",
      case_id: data.caseId || "",
      source: isFoia ? "foia_generator" : "pricing_page",
      app: "veritas_path",
    },
  });

  console.log("One-time payment checkout session created:", session.id, "foia:", isFoia);
  return successResponse({ url: session.url, sessionId: session.id });
}

async function handleCreateBundlePayment(
  stripe: Stripe,
  data: { userId: string; email: string; caseId?: string; bundleType?: string },
  origin: string
) {
  // Route FOIA bundle to dedicated price
  const isFoiaBundle = data.bundleType === "foia_bundle";
  const priceId = isFoiaBundle ? PRICE_IDS.foia_bundle : PRICE_IDS.bundle;

  const session = await createCheckoutSession(stripe, {
    priceId,
    mode: "payment",
    userId: data.userId,
    email: data.email,
    successUrl: `${origin}/payment-success?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}/pricing?payment=cancelled`,
    metadata: {
      access_type: isFoiaBundle ? "foia_bundle" : "bundle",
      product_type: isFoiaBundle ? "foia_bundle" : "bundle",
      country: "US",
      case_id: data.caseId || "",
      bundle_type: data.bundleType || "case_prep",
      source: isFoiaBundle ? "foia_generator" : "pricing_page",
      app: "veritas_path",
    },
  });

  console.log("Bundle payment checkout session created:", session.id, "foia:", isFoiaBundle);
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

  const supabase = createAdminClient();
  const accessType = session.metadata?.access_type || "single_form";
  
  if (session.mode === "subscription") {
    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const endDate = new Date(subscription.current_period_end * 1000);
    
    const { error } = await supabase.from("subscriptions").insert({
      user_id: data.userId,
      plan_type: "monthly",
      status: "active",
      amount: 19.99,
      start_date: new Date().toISOString(),
      end_date: endDate.toISOString(),
      paypal_subscription_id: subscriptionId,
    });

    if (error) {
      console.error("Error saving subscription:", error);
      throw new Error("Failed to save subscription");
    }

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
      type: accessType === "bundle" ? "bundle" : "payment", 
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
    const origin = req.headers.get("origin") || "https://us-justice-bot.lovable.app";

    switch (action) {
      case "create_subscription":
        return await handleCreateSubscription(stripe, { ...data, userId, email }, origin);
      case "create_one_time_payment":
        return await handleCreateOneTimePayment(stripe, { ...data, userId, email }, origin);
      case "create_bundle_payment":
        return await handleCreateBundlePayment(stripe, { ...data, userId, email }, origin);
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
