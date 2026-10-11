import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";
import { createAdminClient } from "../_shared/db.ts";
import { getStripe, subscriptionPeriodEnd } from "../_shared/stripe.ts";

// Self-serve cancellation. California (Bus. & Prof. Code 17602) requires an online way to
// cancel, and New York (Gen. Bus. Law 527-a) requires cancelling to be as easy as signing up.
//
// A paid-up subscription is set to cancel at the end of the period already paid for: Stripe
// stops renewing it, the row stays active until end_date, and stripe-webhook marks it cancelled
// when Stripe ends the subscription. A subscription whose renewal payment failed has no paid
// period left, so it is cancelled now and Stripe stops retrying the charge.

const stripe = getStripe();

const CANCELLABLE: Stripe.Subscription.Status[] = ["active", "trialing", "past_due", "unpaid", "incomplete"];

/** The caller's Stripe subscriptions that can still charge them. */
async function findCancellable(supabase: ReturnType<typeof createAdminClient>, userId: string): Promise<Stripe.Subscription[]> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("paypal_subscription_id")
    .eq("user_id", userId);
  if (error) throw new Error(`Failed to load subscriptions: ${error.message}`);

  // The column is reused for Stripe ids; older rows may hold PayPal ids.
  const ids = [...new Set((data ?? [])
    .map((row) => row.paypal_subscription_id as string | null)
    .filter((id): id is string => !!id && id.startsWith("sub_")))];

  const found: Stripe.Subscription[] = [];
  for (const id of ids) {
    try {
      found.push(await stripe.subscriptions.retrieve(id));
    } catch (error) {
      // A stale id (test mode, another Stripe account, malformed) must not block cancelling the others.
      if ((error as { code?: string })?.code !== "resource_missing") throw error;
      console.warn(`Skipping subscription id Stripe does not know: ${id}`);
    }
  }

  // If the checkout webhook never wrote a row, find the subscription by the user_id that
  // checkout stamps on it (search results can lag Stripe by about a minute).
  if (!found.some((s) => CANCELLABLE.includes(s.status))) {
    try {
      const result = await stripe.subscriptions.search({ query: `metadata['user_id']:'${userId}'`, limit: 10 });
      found.push(...result.data.filter((s) => !ids.includes(s.id)));
    } catch (error) {
      console.error("Stripe subscription search failed:", error);
    }
  }

  return found.filter((s) =>
    CANCELLABLE.includes(s.status) && (!s.metadata?.user_id || s.metadata.user_id === userId)
  );
}

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { userId } = await requireUser(req);
    const supabase = createAdminClient();

    const subscriptions = await findCancellable(supabase, userId);
    if (subscriptions.length === 0) {
      return errorResponse("NOT_FOUND", "No active subscription found for this account");
    }

    let accessUntil: number | null = null;
    for (const subscription of subscriptions) {
      if (subscription.status === "active" || subscription.status === "trialing") {
        const updated = subscription.cancel_at_period_end
          ? subscription
          : await stripe.subscriptions.update(subscription.id, { cancel_at_period_end: true });
        const periodEnd = subscriptionPeriodEnd(updated);
        accessUntil = Math.max(accessUntil ?? 0, periodEnd);

        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: "active",
            end_date: new Date(periodEnd * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("paypal_subscription_id", subscription.id); // reusing column for stripe ID
        if (error) console.error("Error updating subscription row:", error);
        console.log(`Subscription ${subscription.id} set to cancel at period end for user ${userId}`);
      } else {
        await stripe.subscriptions.cancel(subscription.id);

        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("paypal_subscription_id", subscription.id);
        if (error) console.error("Error updating subscription row:", error);
        console.log(`Subscription ${subscription.id} (${subscription.status}) cancelled now for user ${userId}`);
      }
    }

    return successResponse({
      success: true,
      cancelled: subscriptions.length,
      // When access ends; null if nothing was left to run out (e.g. a failed renewal).
      access_until: accessUntil ? new Date(accessUntil * 1000).toISOString() : null,
    });
  } catch (error) {
    console.error("Error in cancel-subscription:", error);
    return handleError(error);
  }
});
