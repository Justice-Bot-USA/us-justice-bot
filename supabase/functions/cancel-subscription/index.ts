import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { createAdminClient } from "../_shared/db.ts";
import { getStripe, subscriptionPeriodEnd } from "../_shared/stripe.ts";
import { scrubError } from "../_shared/email.ts";
import { BILLING_EMAIL } from "../_shared/billingDisclosure.ts";
import {
  CANCELLABLE_STATUSES,
  findUserSubscriptions,
  sendCancellationNotice,
} from "../stripe-webhook/toolkitSubscriptions.ts";

// Self-serve cancellation. California (Bus. & Prof. Code 17602) requires an online way to
// cancel, and New York (Gen. Bus. Law 527-a) requires cancelling to be as easy as signing up.
// The /account/billing page calls this; billing@justicebot-usa.com is the offline route.
//
// A paid-up subscription is set to cancel at the end of the period already paid for: Stripe
// stops renewing it, the row stays active until end_date, and stripe-webhook marks it cancelled
// when Stripe ends the subscription. A subscription whose renewal payment failed has no paid
// period left, so it is cancelled now and Stripe stops retrying the charge.
//
// Each cancelled subscription gets one cancellation confirmation email (billing_notices).

const stripe = getStripe();

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  let auth: { userId: string; email?: string };
  try {
    auth = await requireUser(req);
  } catch {
    return json(401, { error: "Please sign in and try again.", code: "UNAUTHORIZED" });
  }

  try {
    const supabase = createAdminClient();
    const subscriptions = (await findUserSubscriptions(supabase, stripe, auth.userId)).filter((s) =>
      CANCELLABLE_STATUSES.includes(s.status)
    );
    if (subscriptions.length === 0) {
      return json(404, {
        error: `We couldn't find a plan to cancel on this account. If you were charged, email ${BILLING_EMAIL}.`,
        code: "NOT_FOUND",
      });
    }

    let accessUntil: number | null = null;
    for (const subscription of subscriptions) {
      let result: Stripe.Subscription;
      if (subscription.status === "active" || subscription.status === "trialing") {
        result = subscription.cancel_at_period_end
          ? subscription
          : await stripe.subscriptions.update(subscription.id, { cancel_at_period_end: true });
        const periodEnd = subscriptionPeriodEnd(result);
        accessUntil = Math.max(accessUntil ?? 0, periodEnd);

        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: "active",
            end_date: new Date(periodEnd * 1000).toISOString(),
            cancel_at_period_end: true,
            updated_at: new Date().toISOString(),
          })
          .eq("paypal_subscription_id", subscription.id); // reusing column for stripe ID
        if (error) console.error(`Error updating subscription row ${subscription.id}: ${error.message}`);
        console.log(`Subscription ${subscription.id} set to cancel at period end for user ${auth.userId}`);
      } else {
        result = await stripe.subscriptions.cancel(subscription.id);

        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "cancelled", cancel_at_period_end: false, updated_at: new Date().toISOString() })
          .eq("paypal_subscription_id", subscription.id);
        if (error) console.error(`Error updating subscription row ${subscription.id}: ${error.message}`);
        console.log(`Subscription ${subscription.id} (${subscription.status}) cancelled now for user ${auth.userId}`);
      }

      // Confirmation email to the account's address. Never throws; a failure is retried daily.
      await sendCancellationNotice(supabase, result, auth.userId, auth.email ?? null);
    }

    // Say "emailed" only if every confirmation is recorded as sent.
    const { data: notices } = await supabase
      .from("billing_notices")
      .select("status")
      .eq("kind", "cancellation")
      .in("subscription_id", subscriptions.map((s) => s.id));
    const allSent = (notices ?? []).length === subscriptions.length &&
      (notices ?? []).every((n: { status: string }) => n.status === "sent");

    return json(200, {
      success: true,
      cancelled: subscriptions.length,
      // When access ends; null if nothing was left to run out (e.g. a failed renewal).
      access_until: accessUntil ? new Date(accessUntil * 1000).toISOString() : null,
      // 'sent' when every confirmation email is recorded as sent.
      confirmation_email: allSent ? "sent" : "not_sent",
    });
  } catch (error) {
    console.error("Error in cancel-subscription:", scrubError(error instanceof Error ? error.message : String(error)));
    return json(500, {
      error: `We couldn't cancel your plan just now. Please try again, or email ${BILLING_EMAIL} from the address on your account and we'll cancel it for you.`,
      code: "INTERNAL_ERROR",
    });
  }
});
