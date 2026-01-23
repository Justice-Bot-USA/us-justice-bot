import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";
import { createAdminClient } from "../_shared/db.ts";

// Stripe price IDs (Live Mode) - $4.99 one-time, $59.99/month, $79.99/year
const PRICE_IDS = {
  per_form: "price_1SspQoPr9cYwQq3CUtFuCkxA", // $4.99 one-time (primary conversion)
  monthly: "price_1SspbEPr9cYwQq3CLNwkxqCN",  // $59.99/month
  annual: "price_1SsptaPr9cYwQq3CFcwxD0Ps",   // $79.99/year
};

function getStripe(): Stripe {
  const secretKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY not configured");
  }
  return new Stripe(secretKey, {
    apiVersion: "2025-08-27.basil",
  });
}

async function getOrCreateCustomer(stripe: Stripe, email: string, userId: string): Promise<string> {
  // Check if customer already exists
  const customers = await stripe.customers.list({ email, limit: 1 });
  if (customers.data.length > 0) {
    return customers.data[0].id;
  }
  
  // Create new customer
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
  const priceId = data.planType === "annual" ? PRICE_IDS.annual : PRICE_IDS.monthly;
  const accessType = data.planType === "annual" ? "yearly" : "monthly";
  
  const session = await createCheckoutSession(stripe, {
    priceId,
    mode: "subscription",
    userId: data.userId,
    email: data.email,
    successUrl: `${origin}/payment-success?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}/pricing?subscription=cancelled`,
    metadata: { 
      access_type: accessType,
      plan_type: data.planType,
      source: "pricing_page",
      app: "justicebot",
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
  const session = await createCheckoutSession(stripe, {
    priceId: PRICE_IDS.per_form,
    mode: "payment",
    userId: data.userId,
    email: data.email,
    successUrl: `${origin}/payment-success?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}/pricing?payment=cancelled`,
    metadata: {
      access_type: "single_form",
      form_type: data.formType || "general",
      case_id: data.caseId || "",
      source: "pricing_page",
      app: "justicebot",
    },
  });

  console.log("One-time payment checkout session created:", session.id);
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
  
  if (session.mode === "subscription") {
    // Handle subscription
    const planType = session.metadata?.plan_type || "monthly";
    const subscriptionId = session.subscription as string;
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const endDate = new Date(subscription.current_period_end * 1000);
    
    const { error } = await supabase.from("subscriptions").insert({
      user_id: data.userId,
      plan_type: planType,
      status: "active",
      amount: planType === "annual" ? 79.99 : 9.99,
      start_date: new Date().toISOString(),
      end_date: endDate.toISOString(),
      paypal_subscription_id: subscriptionId, // reusing column for stripe ID
    });

    if (error) {
      console.error("Error saving subscription:", error);
      throw new Error("Failed to save subscription");
    }

    return successResponse({ success: true, type: "subscription", planType });
  } else {
    // Handle one-time payment
    const formType = session.metadata?.form_type || "general";
    const caseId = session.metadata?.case_id;
    
    const { error } = await supabase.from("form_payments").insert({
      user_id: data.userId,
      paypal_payment_id: session.payment_intent as string, // reusing column
      amount: 4.99,
      status: "completed",
      form_type: formType,
    });

    if (error) {
      console.error("Error saving payment:", error);
      throw new Error("Failed to save payment");
    }

    return successResponse({ 
      success: true, 
      type: "payment", 
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
    
    const { userId, email } = await requireUser(req);
    const { action, ...data } = await req.json();
    const stripe = getStripe();
    const origin = req.headers.get("origin") || "https://us-justice-bot.lovable.app";

    switch (action) {
      case "create_subscription":
        return await handleCreateSubscription(stripe, { ...data, userId, email }, origin);
      case "create_one_time_payment":
        return await handleCreateOneTimePayment(stripe, { ...data, userId, email }, origin);
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
