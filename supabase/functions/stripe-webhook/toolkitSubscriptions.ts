// Toolkit subscriptions in Stripe and in public.subscriptions, shared by the billing functions
// (stripe-webhook, stripe-checkout, cancel-subscription, check-subscription, billing-notices and
// delete-my-data import it from here). Deploying any of those functions must include this file and
// ../_shared/{stripe,email,billingDisclosure}.ts.
//
// public.subscriptions mirrors Stripe: one row per Stripe subscription, keyed by the Stripe id in
// the reused paypal_subscription_id column (unique). Only the service role writes it.

import Stripe from "https://esm.sh/stripe@18.5.0";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.4";
import { PRICE_IDS, subscriptionPeriodEnd } from "../_shared/stripe.ts";
import {
  acknowledgmentEmail,
  CANCEL_COMMENT_DUPLICATE,
  cancellationEmail,
  type CancellationVariant,
  endedCancellationVariant,
} from "../_shared/billingDisclosure.ts";
import { accountEmail, formatBillingDate, sendBillingNotice, type NoticeOutcome } from "../_shared/email.ts";

type Admin = SupabaseClient;

/** metadata.app on every checkout session and subscription our checkout creates. */
export const APP_TAG = "justice_bot_usa";

/** The Stripe product the Toolkit price belongs to. */
export const TOOLKIT_PRODUCT_IDS = ["prod_TyyZmnGjOH4QrU"];

/** Statuses where the subscription still exists and can charge (or is charging) the person. */
export const LIVE_STATUSES: Stripe.Subscription.Status[] = ["active", "trialing", "past_due", "unpaid"];

/** Statuses cancel-subscription can stop. */
export const CANCELLABLE_STATUSES: Stripe.Subscription.Status[] = [...LIVE_STATUSES, "incomplete"];

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

function idOf(ref: string | { id: string } | null | undefined): string | null {
  if (!ref) return null;
  return typeof ref === "string" ? ref : ref.id;
}

/** True for the Toolkit plan: started by our checkout, or on the Toolkit price or product. */
export function isToolkitSubscription(subscription: Stripe.Subscription): boolean {
  if (subscription.metadata?.app === APP_TAG) return true;
  const price = subscription.items?.data?.[0]?.price;
  if (!price) return false;
  return price.id === PRICE_IDS.monthly || TOOLKIT_PRODUCT_IDS.includes(idOf(price.product as string | { id: string }) ?? "");
}

export function subscriptionCustomerId(subscription: Stripe.Subscription): string | null {
  return idOf(subscription.customer as string | { id: string } | null);
}

/**
 * public.subscriptions.status only allows active, cancelled or expired (CHECK constraint).
 * A lapsed payment (past_due, unpaid, ...) is stored as expired and becomes active again if
 * Stripe later collects it.
 */
export function rowStatus(subscription: Stripe.Subscription): "active" | "cancelled" | "expired" {
  if (subscription.status === "active" || subscription.status === "trialing") return "active";
  return subscription.status === "canceled" ? "cancelled" : "expired";
}

function syncedFields(subscription: Stripe.Subscription): Record<string, unknown> {
  const status = rowStatus(subscription);
  return {
    status,
    ...(status === "active" ? { end_date: new Date(subscriptionPeriodEnd(subscription) * 1000).toISOString() } : {}),
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
    stripe_customer_id: subscriptionCustomerId(subscription),
    stripe_started_at: subscription.start_date ? new Date(subscription.start_date * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Refreshes the row for this Stripe subscription from Stripe's current state. end_date only moves
 * while the subscription is in good standing. Returns how many rows matched (0 or 1).
 */
export async function syncSubscriptionRow(admin: Admin, subscription: Stripe.Subscription): Promise<number> {
  const { data, error } = await admin
    .from("subscriptions")
    .update(syncedFields(subscription))
    .eq("paypal_subscription_id", subscription.id) // reusing column for the Stripe id
    .select("id");
  if (error) throw new Error(`Failed to update subscription ${subscription.id}: ${error.message}`);
  return data?.length ?? 0;
}

/**
 * Inserts the row for a Stripe subscription, or refreshes it if it already exists. The unique
 * constraint on paypal_subscription_id means two callers racing (webhook retries, verify_session)
 * can never create a second row: the loser's insert fails with 23505 and it updates instead.
 */
export async function saveSubscriptionRow(admin: Admin, userId: string, subscription: Stripe.Subscription): Promise<void> {
  if ((await syncSubscriptionRow(admin, subscription)) > 0) return;

  const price = subscription.items?.data?.[0]?.price;
  const { error } = await admin.from("subscriptions").insert({
    user_id: userId,
    plan_type: price?.recurring?.interval === "year" ? "yearly" : "monthly",
    amount: (price?.unit_amount ?? 0) / 100,
    start_date: new Date().toISOString(),
    end_date: new Date(subscriptionPeriodEnd(subscription) * 1000).toISOString(),
    paypal_subscription_id: subscription.id,
    ...syncedFields(subscription),
  });
  if (!error) return;
  if (error.code === "23505") {
    await syncSubscriptionRow(admin, subscription);
    return;
  }
  throw new Error(`Failed to save subscription ${subscription.id}: ${error.message}`);
}

/**
 * Every Stripe subscription that belongs to this person: the ids in their subscriptions rows, plus
 * (when nothing live was found, or always with alwaysSearch) a Stripe search on the user_id our
 * checkout stamps on each subscription. Search results can lag Stripe by about a minute. A
 * subscription stamped with a different user_id is never returned.
 */
export async function findUserSubscriptions(
  admin: Admin,
  stripe: Stripe,
  userId: string,
  options: { alwaysSearch?: boolean } = {},
): Promise<Stripe.Subscription[]> {
  if (!isUuid(userId)) throw new Error("Invalid user id");

  const { data, error } = await admin.from("subscriptions").select("paypal_subscription_id").eq("user_id", userId);
  if (error) throw new Error(`Failed to load subscriptions: ${error.message}`);

  // The column is reused for Stripe ids; older rows may hold PayPal ids.
  const ids = [
    ...new Set(
      (data ?? [])
        .map((row: { paypal_subscription_id: string | null }) => row.paypal_subscription_id)
        .filter((id: string | null): id is string => !!id && id.startsWith("sub_")),
    ),
  ];

  const found = new Map<string, Stripe.Subscription>();
  for (const id of ids) {
    try {
      found.set(id, await stripe.subscriptions.retrieve(id));
    } catch (err) {
      // A stale id (test mode, another Stripe account, malformed) must not block the others.
      if ((err as { code?: string })?.code !== "resource_missing") throw err;
      console.warn(`Skipping a subscription id Stripe does not know: ${id}`);
    }
  }

  const anyLive = [...found.values()].some((s) => CANCELLABLE_STATUSES.includes(s.status));
  if (options.alwaysSearch || !anyLive) {
    try {
      const result = await stripe.subscriptions.search({ query: `metadata['user_id']:'${userId}'`, limit: 20 });
      for (const s of result.data) if (!found.has(s.id)) found.set(s.id, s);
    } catch (err) {
      console.error("Stripe subscription search failed:", err instanceof Error ? err.message : String(err));
    }
  }

  return [...found.values()].filter((s) => !s.metadata?.user_id || s.metadata.user_id === userId);
}

/** The person's time zone saved at checkout (billing dates in emails), if any. */
export function subscriptionTimeZone(subscription: Stripe.Subscription): string | null {
  return subscription.metadata?.tz || null;
}

/** The purchase acknowledgment email for a subscription, with its Stripe billing dates. */
export function acknowledgmentFor(subscription: Stripe.Subscription) {
  const tz = subscriptionTimeZone(subscription);
  return acknowledgmentEmail({
    startDate: formatBillingDate(subscription.start_date, tz),
    nextChargeDate: formatBillingDate(subscriptionPeriodEnd(subscription), tz),
  });
}

/** Sends the purchase acknowledgment once per subscription. Never throws because of email. */
export async function sendAcknowledgment(
  admin: Admin,
  subscription: Stripe.Subscription,
  userId: string,
): Promise<NoticeOutcome> {
  const email = await accountEmail(admin, userId);
  return sendBillingNotice(
    admin,
    { subscriptionId: subscription.id, kind: "acknowledgment", userId, email },
    acknowledgmentFor(subscription),
  );
}

/** Which cancellation email fits this subscription's current state. */
export function cancellationVariantFor(subscription: Stripe.Subscription): CancellationVariant {
  if (subscription.status === "canceled") {
    // refunded, account_deleted (delete-my-data) or plain ended, from the comment we set.
    return endedCancellationVariant(subscription.cancellation_details?.comment);
  }
  if (subscription.cancel_at_period_end && (subscription.status === "active" || subscription.status === "trialing")) {
    return {
      kind: "period_end",
      activeUntil: formatBillingDate(subscriptionPeriodEnd(subscription), subscriptionTimeZone(subscription)),
    };
  }
  return { kind: "ended" };
}

/** True once the person has cancelled (or the plan has ended). */
export function isCancelledOrEnding(subscription: Stripe.Subscription): boolean {
  return subscription.status === "canceled" || Boolean(subscription.cancel_at_period_end);
}

/**
 * Sends the cancellation confirmation once per subscription. Skipped for a duplicate subscription
 * we cancelled ourselves (the person's first plan carries on) and for a subscription that is not
 * cancelled. Never throws because of email.
 */
export async function sendCancellationNotice(
  admin: Admin,
  subscription: Stripe.Subscription,
  userId: string | null,
  email?: string | null,
): Promise<NoticeOutcome | "skipped"> {
  if (!isCancelledOrEnding(subscription)) return "skipped";
  if (subscription.cancellation_details?.comment === CANCEL_COMMENT_DUPLICATE) return "skipped";
  const owner = userId ?? subscription.metadata?.user_id ?? null;
  const to = email ?? (await accountEmail(admin, owner));
  return sendBillingNotice(
    admin,
    { subscriptionId: subscription.id, kind: "cancellation", userId: owner, email: to },
    cancellationEmail(cancellationVariantFor(subscription)),
  );
}
