import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";
import { createAdminClient } from "../_shared/db.ts";

const PAYPAL_BASE_URL = "https://api.paypal.com"; // Production mode for live payments

// Get PayPal access token
async function getAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
  
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }
  
  const auth = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  
  const tokenData = await response.json();
  return tokenData.access_token;
}

async function createSubscription(accessToken: string, data: { planType: string; userId: string; email?: string }) {
  const { planType, email } = data;
  
  const planDetails = planType === "monthly" 
    ? { amount: "9.99", interval: "MONTH" }
    : { amount: "79.00", interval: "YEAR" };

  // Create subscription plan
  const planResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/plans`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: `legal-bot-${planType}`,
      name: `Legal Bot ${planType === "monthly" ? "Monthly" : "Yearly"} Plan`,
      description: `Legal assistance bot ${planType} subscription`,
      status: "ACTIVE",
      billing_cycles: [{
        frequency: {
          interval_unit: planDetails.interval,
          interval_count: 1,
        },
        tenure_type: "REGULAR",
        sequence: 1,
        total_cycles: 0,
        pricing_scheme: {
          fixed_price: {
            value: planDetails.amount,
            currency_code: "USD",
          },
        },
      }],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
    }),
  });

  const plan = await planResponse.json();

  // Create subscription
  const subscriptionResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: plan.id,
      subscriber: {
        email_address: email || "customer@example.com",
      },
      application_context: {
        brand_name: "US Justice Bot",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        payment_method: {
          payer_selected: "PAYPAL",
          payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
        },
        return_url: "https://justicebot-usa.com/pricing?subscription=success",
        cancel_url: "https://justicebot-usa.com/pricing?subscription=cancelled",
      },
    }),
  });

  const subscription = await subscriptionResponse.json();
  console.log("Subscription created:", subscription);

  return successResponse({ 
    subscriptionId: subscription.id,
    approvalUrl: subscription.links.find((link: { rel: string; href: string }) => link.rel === "approve")?.href 
  });
}

async function createOneTimePayment(accessToken: string, data: { userId: string; formType?: string }) {
  const { formType, userId } = data;
  
  const paymentResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        reference_id: userId,
        amount: {
          currency_code: "USD",
          value: "4.99",
        },
        description: `Legal form processing - ${formType}`,
      }],
      application_context: {
        brand_name: "US Justice Bot",
        return_url: "https://justicebot-usa.com/pricing?payment=success",
        cancel_url: "https://justicebot-usa.com/pricing?payment=cancelled",
      },
    }),
  });

  const payment = await paymentResponse.json();
  console.log("Payment order created:", payment);

  return successResponse({ 
    paymentId: payment.id,
    approvalUrl: payment.links.find((link: { rel: string; href: string }) => link.rel === "approve")?.href 
  });
}

async function verifyPayment(accessToken: string, data: { paymentId: string; userId: string; formType?: string }) {
  const { paymentId, userId, formType } = data;
  
  // Capture the payment
  const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${paymentId}/capture`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const captureResult = await captureResponse.json();
  console.log("Payment captured:", captureResult);

  if (captureResult.status === "COMPLETED") {
    // Verify the order was created for this user (IDOR protection)
    const orderUserId = captureResult.purchase_units?.[0]?.reference_id;
    if (!orderUserId || orderUserId !== userId) {
      console.error("Payment ownership mismatch", { orderUserId, userId });
      return errorResponse("FORBIDDEN", "Payment order does not belong to this user");
    }

    // Save payment to database using admin client
    const supabase = createAdminClient();
    
    const { error } = await supabase
      .from("form_payments")
      .insert({
        user_id: userId,
        paypal_payment_id: paymentId,
        amount: 4.99,
        status: "completed",
        form_type: formType || "general",
      });

    if (error) {
      console.error("Error saving payment:", error);
      throw new Error("Failed to save payment");
    }

    return successResponse({ success: true, paymentId });
  }

  throw new Error("Payment verification failed");
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    console.log("PayPal payments function called");
    
    // Extract authenticated user ID from JWT token
    const { userId } = await requireUser(req);
    
    const { action, ...data } = await req.json();
    const accessToken = await getAccessToken();

    // Pass the verified userId instead of trusting request body
    switch (action) {
      case "create_subscription":
        return await createSubscription(accessToken, { ...data, userId });
      case "create_one_time_payment":
        return await createOneTimePayment(accessToken, { ...data, userId });
      case "verify_payment":
        return await verifyPayment(accessToken, { ...data, userId });
      default:
        return errorResponse("BAD_REQUEST", "Invalid action");
    }
  } catch (error) {
    console.error("Error in PayPal payments function:", error);
    return handleError(error);
  }
});
