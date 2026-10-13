// Stripe webhook (signature-verified). Keeps public.subscriptions in step with Stripe and sends the
// Toolkit plan's billing notices.
//
// Events (the endpoint must be subscribed to each; see the launch checklist):
//   checkout.session.completed      Records the subscription, links the consent row, stops a
//                                   duplicate plan (refund, then cancel, the newer one; alert the owner),
//                                   and sends the purchase acknowledgment.
//   customer.subscription.created / .updated / .deleted
//                                   Syncs status, end_date, cancel_at_period_end, customer and start;
//                                   sends the cancellation confirmation once the plan is cancelled
//                                   (also covers a cancel the owner makes in Stripe for someone who
//                                   asked by email).
//   invoice.paid (or invoice.payment_succeeded), invoice.payment_failed
//                                   Moves end_date on renewal; records a failed renewal.
//   charge.refunded                 Terms §7: a full refund of the most recent charge ends the plan
//                                   now, unless the charge or refund has metadata keep_plan=true.
//
// The handlers live in handlers.ts. They are idempotent. Any failure other than email returns 500 so
// Stripe retries the event; email failures are recorded in billing_notices and retried by
// billing-notices instead.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { corsHeaders } from "../_shared/auth.ts";
import { createAdminClient } from "../_shared/db.ts";
import { getStripe } from "../_shared/stripe.ts";
import { scrubError } from "../_shared/email.ts";
import { createWebhookHandlers } from "./handlers.ts";

const stripe = getStripe();
const handlers = createWebhookHandlers(stripe);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature check failed:", err instanceof Error ? err.message : String(err));
    return new Response("Webhook validation failed", { status: 400 });
  }

  try {
    console.log(`Webhook received: ${event.type} (${event.id})`);
    const admin = createAdminClient();

    await handlers.dispatch(admin, event);

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`Webhook handler error (${event.type}, ${event.id}):`, scrubError(err instanceof Error ? err.message : String(err)));
    return new Response("Webhook handler failed", { status: 500 });
  }
});
