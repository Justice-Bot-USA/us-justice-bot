import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')!;
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET')!;
const PAYPAL_BASE_URL = 'https://api.paypal.com'; // Production mode for live payments

// Extract user ID from JWT token in Authorization header
const getUserIdFromToken = async (req: Request): Promise<string> => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  // Create a client with the user's token to verify and extract user info
  const userSupabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
  
  const { data: { user }, error } = await userSupabase.auth.getUser();
  
  if (error || !user) {
    console.error('Failed to verify user token:', error);
    throw new Error('Invalid or expired token');
  }
  
  console.log('Authenticated user:', user.id);
  return user.id;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('PayPal payments function called');
    
    // Extract authenticated user ID from JWT token (not from request body)
    const userId = await getUserIdFromToken(req);
    
    const { action, ...data } = await req.json();
    
    // Get access token from PayPal
    const getAccessToken = async () => {
      const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
      const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });
      const tokenData = await response.json();
      return tokenData.access_token;
    };

    const accessToken = await getAccessToken();

    // Pass the verified userId instead of trusting request body
    switch (action) {
      case 'create_subscription':
        return await createSubscription(accessToken, { ...data, userId });
      case 'create_one_time_payment':
        return await createOneTimePayment(accessToken, { ...data, userId });
      case 'verify_payment':
        return await verifyPayment(accessToken, { ...data, userId });
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in PayPal payments function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function createSubscription(accessToken: string, data: any) {
  const { planType, userId } = data;
  
const planDetails = planType === 'monthly' 
    ? { amount: '9.99', interval: 'MONTH' }
    : { amount: '79.00', interval: 'YEAR' };

  // Create subscription plan if it doesn't exist
  const planResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: `legal-bot-${planType}`,
      name: `Legal Bot ${planType === 'monthly' ? 'Monthly' : 'Yearly'} Plan`,
      description: `Legal assistance bot ${planType} subscription`,
      status: 'ACTIVE',
      billing_cycles: [{
        frequency: {
          interval_unit: planDetails.interval,
          interval_count: 1,
        },
        tenure_type: 'REGULAR',
        sequence: 1,
        total_cycles: 0,
        pricing_scheme: {
          fixed_price: {
            value: planDetails.amount,
            currency_code: 'USD',
          },
        },
      }],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
    }),
  });

  const plan = await planResponse.json();

  // Create subscription
  const subscriptionResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plan_id: plan.id,
      subscriber: {
        email_address: data.email || 'customer@example.com',
      },
      application_context: {
        brand_name: 'US Justice Bot',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
        },
        return_url: 'https://justicebot-usa.com/pricing?subscription=success',
        cancel_url: 'https://justicebot-usa.com/pricing?subscription=cancelled',
      },
    }),
  });

  const subscription = await subscriptionResponse.json();
  console.log('Subscription created:', subscription);

  return new Response(
    JSON.stringify({ 
      subscriptionId: subscription.id,
      approvalUrl: subscription.links.find((link: any) => link.rel === 'approve')?.href 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createOneTimePayment(accessToken: string, data: any) {
  const { userId, formType } = data;
  
  const paymentResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: '4.99',
        },
        description: `Legal form processing - ${formType}`,
      }],
      application_context: {
        brand_name: 'US Justice Bot',
        return_url: 'https://justicebot-usa.com/pricing?payment=success',
        cancel_url: 'https://justicebot-usa.com/pricing?payment=cancelled',
      },
    }),
  });

  const payment = await paymentResponse.json();
  console.log('Payment order created:', payment);

  return new Response(
    JSON.stringify({ 
      paymentId: payment.id,
      approvalUrl: payment.links.find((link: any) => link.rel === 'approve')?.href 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function verifyPayment(accessToken: string, data: any) {
  const { paymentId, userId } = data;
  
  // Capture the payment
  const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${paymentId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const captureResult = await captureResponse.json();
  console.log('Payment captured:', captureResult);

  if (captureResult.status === 'COMPLETED') {
    // Save payment to database
    const { error } = await supabase
      .from('form_payments')
      .insert({
        user_id: userId,
        paypal_payment_id: paymentId,
        amount: 4.99,
        status: 'completed',
        form_type: data.formType || 'general',
      });

    if (error) {
      console.error('Error saving payment:', error);
      throw new Error('Failed to save payment');
    }

    return new Response(
      JSON.stringify({ success: true, paymentId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  throw new Error('Payment verification failed');
}