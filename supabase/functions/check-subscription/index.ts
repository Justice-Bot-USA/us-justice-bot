import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { createAdminClient } from "../_shared/db.ts";
import { getStripe, subscriptionPeriodEnd } from "../_shared/stripe.ts";
import { scrubError } from "../_shared/email.ts";
import { findUserSubscriptions, subscriptionCustomerId } from "../stripe-webhook/toolkitSubscriptions.ts";

// Live Stripe status of the signed-in person's Toolkit plan, for the account menu's "Cancel
// subscription" link and the Your plan page.
//
// The plan is found through the person's own subscriptions rows and the user_id our checkout stamps
// on each Stripe subscription, never by email address alone (an email change must not hide a plan
// or its cancel button, and an address can be reused by someone else).

// Statuses where the renewal payment failed: no access, but Stripe may still retry the charge.
const LAPSED_STATUSES: Stripe.Subscription.Status[] = ["past_due", "unpaid", "incomplete"];

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  let userId: string;
  try {
    ({ userId } = await requireUser(req));
  } catch {
    return json(401, { error: "Please sign in and try again.", code: "UNAUTHORIZED" });
  }

  try {
    const stripe = getStripe();
    // Every subscription found is ours: either its id is in the person's own subscriptions rows, or
    // our checkout stamped their user_id on it. Same set cancel-subscription can cancel.
    const candidates = await findUserSubscriptions(createAdminClient(), stripe, userId);

    // The active or trialing plan that runs longest; otherwise one whose renewal failed.
    let subscription: Stripe.Subscription | null = null;
    let lapsed: Stripe.Subscription | null = null;
    for (const candidate of candidates) {
      if (LAPSED_STATUSES.includes(candidate.status)) {
        lapsed ??= candidate;
        continue;
      }
      if (candidate.status !== "active" && candidate.status !== "trialing") continue;
      if (!subscription || subscriptionPeriodEnd(candidate) > subscriptionPeriodEnd(subscription)) {
        subscription = candidate;
      }
    }

    if (!subscription) {
      // A lapsed plan gives no access but can still be charged by Stripe's retries, so report it
      // as cancellable for the cancel button.
      return json(200, {
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        customer_id: lapsed ? subscriptionCustomerId(lapsed) : null,
        ...(lapsed && { cancellable: true, subscription_status: lapsed.status }),
      });
    }

    return json(200, {
      subscribed: true,
      subscription_tier: subscription.items.data[0]?.price.recurring?.interval === "year" ? "annual" : "monthly",
      subscription_end: new Date(subscriptionPeriodEnd(subscription) * 1000).toISOString(),
      subscription_status: subscription.status,
      // true once the person has cancelled: access continues until subscription_end, then stops.
      cancel_at_period_end: subscription.cancel_at_period_end,
      customer_id: subscriptionCustomerId(subscription),
    });
  } catch (error) {
    console.error("check-subscription failed:", scrubError(error instanceof Error ? error.message : String(error)));
    return json(500, { error: "We couldn't check your plan just now. Please try again.", code: "INTERNAL_ERROR" });
  }
});
