// The webhook's event handlers, kept apart from index.ts (which only checks the signature and
// serves) so tests can run them with a fake Stripe client and a fake database.

import Stripe from "https://esm.sh/stripe@18.5.0";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.4";
import { sendOwnerAlert } from "../_shared/email.ts";
import { CANCEL_COMMENT_DUPLICATE, CANCEL_COMMENT_REFUNDED } from "../_shared/billingDisclosure.ts";
import {
  APP_TAG,
  findUserSubscriptions,
  isCancelledOrEnding,
  isToolkitSubscription,
  isUuid,
  LIVE_STATUSES,
  saveSubscriptionRow,
  sendAcknowledgment,
  sendCancellationNotice,
  subscriptionCustomerId,
  syncSubscriptionRow,
} from "./toolkitSubscriptions.ts";
import { isDuplicateRefund, keepPlanAfterRefund, orderByAge, refundDecision } from "./decisions.ts";

type AdminClient = SupabaseClient;

function idOf(ref: string | { id: string } | null | undefined): string | null {
  if (!ref) return null;
  return typeof ref === "string" ? ref : ref.id;
}

/**
 * The subscription an invoice belongs to. API 2025-03-31.basil and later moved it to
 * invoice.parent.subscription_details; payloads sent with an older endpoint version still
 * carry invoice.subscription.
 */
export function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const legacy = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription;
  const ref = invoice.parent?.subscription_details?.subscription ?? legacy;
  return idOf(ref as string | { id: string } | null | undefined);
}

export function createWebhookHandlers(stripe: Stripe) {
  /** Writes the subscription id and customer onto the consent row this checkout recorded. */
  async function linkConsent(admin: AdminClient, session: Stripe.Checkout.Session, subscription: Stripe.Subscription, userId: string) {
    const fields = {
      subscription_id: subscription.id,
      stripe_customer_id: subscriptionCustomerId(subscription),
      checkout_session_id: session.id,
    };
    const consentId = session.metadata?.consent_id;
    const query = admin.from("billing_consents").update(fields).eq("user_id", userId);
    const { error } = isUuid(consentId) ? await query.eq("id", consentId) : await query.eq("checkout_session_id", session.id);
    if (error) throw new Error(`Failed to link the consent row for ${subscription.id}: ${error.message}`);
  }

  /**
   * Paid payments on a subscription's latest invoice that have no refund yet (succeeded, pending or
   * otherwise in progress), as payment intent ids.
   */
  async function unrefundedLatestPayments(subscription: Stripe.Subscription): Promise<string[]> {
    const invoiceId = idOf(subscription.latest_invoice as string | { id: string } | null);
    if (!invoiceId) return [];
    const payments = await stripe.invoicePayments.list({ invoice: invoiceId, status: "paid", limit: 10 });
    const pending: string[] = [];
    for (const payment of payments.data) {
      const paymentIntent = idOf(payment.payment?.payment_intent as string | { id: string } | undefined);
      if (!paymentIntent) continue;
      const refunds = await stripe.refunds.list({ payment_intent: paymentIntent, limit: 10 });
      const refunded = (refunds.data as Stripe.Refund[]).some(
        (r) =>
          idOf(r.payment_intent as string | { id: string } | null) === paymentIntent &&
          r.status !== "failed" &&
          r.status !== "canceled",
      );
      if (!refunded) pending.push(paymentIntent);
    }
    return pending;
  }

  /**
   * Refunds every paid, not yet refunded payment on a duplicate subscription's latest invoice.
   * Returns how many were refunded now. Safe to repeat: each refund has an idempotency key, and a
   * payment that already has a refund is skipped.
   */
  async function refundLatestInvoice(subscription: Stripe.Subscription): Promise<number> {
    let refunded = 0;
    for (const paymentIntent of await unrefundedLatestPayments(subscription)) {
      try {
        await stripe.refunds.create(
          {
            payment_intent: paymentIntent,
            reason: "duplicate",
            metadata: { reason: CANCEL_COMMENT_DUPLICATE, subscription_id: subscription.id },
          },
          { idempotencyKey: `duplicate-refund-${subscription.id}-${paymentIntent}` },
        );
        refunded++;
      } catch (error) {
        if ((error as { code?: string })?.code === "charge_already_refunded") continue;
        throw error;
      }
    }
    return refunded;
  }

  /**
   * Cancels a duplicate subscription now with the duplicate comment (no cancellation email to the
   * person: their first plan carries on). The same idempotency key is used here and in
   * handleChargeRefunded, so whichever runs first cancels it and the other gets the same result.
   */
  async function cancelDuplicate(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await stripe.subscriptions.cancel(
        subscriptionId,
        { cancellation_details: { comment: CANCEL_COMMENT_DUPLICATE } },
        { idempotencyKey: `duplicate-cancel-${subscriptionId}` },
      );
    } catch (error) {
      // Already cancelled by another path (for example the refund's own webhook event).
      const now = await stripe.subscriptions.retrieve(subscriptionId);
      if (now.status === "canceled") return now;
      throw error;
    }
  }

  /**
   * Stops a second Toolkit plan for the same person: keeps the oldest live plan, refunds each newer
   * one's charge and then cancels it now, and tells the owner. Returns the plan that was kept.
   *
   * Refund first, cancel second: a cancelled subscription is no longer "live", so if the refund came
   * second and failed, a retry would never see the duplicate again. The owner is alerted before the
   * refund, so a failure part way leaves a trace. A retry also refunds any duplicate already
   * cancelled with the duplicate comment whose latest payment still has no refund.
   */
  async function resolveDuplicates(admin: AdminClient, userId: string, current: Stripe.Subscription): Promise<Stripe.Subscription> {
    const byId = new Map<string, Stripe.Subscription>();
    for (const s of await findUserSubscriptions(admin, stripe, userId, { alwaysSearch: true })) {
      if (isToolkitSubscription(s)) byId.set(s.id, s);
    }
    byId.set(current.id, current); // the caller's copy is the freshest
    const mine = [...byId.values()];

    const ordered = orderByAge(mine.filter((s) => LIVE_STATUSES.includes(s.status)));
    const keeper = ordered[0] ?? current;
    const duplicates = ordered.slice(1);
    const started = (s: Stripe.Subscription) => new Date(s.created * 1000).toISOString();

    for (const duplicate of duplicates) {
      await sendOwnerAlert("Duplicate Toolkit plan found: refunding and cancelling it", [
        `User ${userId} has more than one live Toolkit subscription.`,
        `Keeping ${keeper.id} (started ${started(keeper)}). Refunding, then cancelling, ${duplicate.id} (started ${started(duplicate)}).`,
        'If a "cancelled and refunded" alert does not follow, the refund or the cancel failed: check both in Stripe. Stripe retries the webhook.',
      ]);
      const refunded = await refundLatestInvoice(duplicate);
      const cancelled = await cancelDuplicate(duplicate.id);
      await syncSubscriptionRow(admin, cancelled);
      await sendOwnerAlert("Duplicate Toolkit plan cancelled and refunded", [
        `User ${userId} had more than one live Toolkit subscription.`,
        `Kept ${keeper.id} (started ${started(keeper)}).`,
        `Cancelled ${duplicate.id} (started ${started(duplicate)}) and refunded ${refunded} payment(s).`,
        refunded === 0 ? "No unrefunded paid charge was found on the cancelled one: check it in Stripe." : "",
      ].filter(Boolean));
    }

    // Duplicates cancelled on an earlier attempt whose refund did not go through.
    const cancelledEarlier = mine.filter(
      (s) => s.status === "canceled" && s.cancellation_details?.comment === CANCEL_COMMENT_DUPLICATE,
    );
    for (const duplicate of cancelledEarlier) {
      if ((await unrefundedLatestPayments(duplicate)).length === 0) continue;
      await sendOwnerAlert("Cancelled duplicate Toolkit plan not refunded yet: refunding it", [
        `User ${userId}: ${duplicate.id} (started ${started(duplicate)}) was cancelled as a duplicate, but its latest charge has no refund.`,
        'If a "refunded" alert does not follow, the refund failed: refund it in Stripe. Stripe retries the webhook.',
      ]);
      const refunded = await refundLatestInvoice(duplicate);
      await sendOwnerAlert("Cancelled duplicate Toolkit plan refunded", [
        `User ${userId}: refunded ${refunded} payment(s) on ${duplicate.id}, which was already cancelled as a duplicate. Kept ${keeper.id}.`,
      ]);
    }
    return keeper;
  }

  async function handleCheckoutCompleted(admin: AdminClient, session: Stripe.Checkout.Session) {
    const userId = session.metadata?.user_id;
    console.log("checkout.session.completed:", {
      sessionId: session.id,
      mode: session.mode,
      paymentStatus: session.payment_status,
    });

    if (session.mode !== "subscription") return;
    if (session.payment_status !== "paid") {
      console.log(`Payment not complete yet for session ${session.id}`);
      return;
    }
    if (!isUuid(userId)) {
      console.error(`No valid user_id in session ${session.id} metadata`);
      return;
    }
    const accessType = session.metadata?.access_type ?? "";
    if (session.metadata?.app !== APP_TAG && accessType !== "monthly" && accessType !== "yearly") {
      console.log(`Session ${session.id} was not started by Justice Bot USA checkout`);
      return;
    }
    const subscriptionId = idOf(session.subscription as string | { id: string } | null);
    if (!subscriptionId) {
      console.error(`No subscription on session ${session.id}`);
      return;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await saveSubscriptionRow(admin, userId, subscription);
    await linkConsent(admin, session, subscription, userId);

    if (!isToolkitSubscription(subscription)) {
      console.log(`Subscription ${subscription.id} is not on the Toolkit price; no Toolkit notices sent`);
      return;
    }

    const keeper = await resolveDuplicates(admin, userId, subscription);
    if (keeper.id !== subscription.id) return; // cancelled and refunded as a duplicate
    if (!LIVE_STATUSES.includes(subscription.status)) return;

    const outcome = await sendAcknowledgment(admin, subscription, userId);
    console.log(`Acknowledgment for ${subscription.id}: ${outcome}`);
  }

  async function handleSubscriptionChanged(admin: AdminClient, eventSubscription: Stripe.Subscription) {
    // Re-read the subscription so an out-of-order event cannot roll the row back.
    const subscription = await stripe.subscriptions.retrieve(eventSubscription.id);
    const matched = await syncSubscriptionRow(admin, subscription);
    const userId = subscription.metadata?.user_id;

    // No row yet (checkout.session.completed not processed): create it for a live subscription our
    // checkout started, since this endpoint sees the whole Stripe account.
    if (matched === 0 && isUuid(userId) && subscription.metadata?.app === APP_TAG &&
        (subscription.status === "active" || subscription.status === "trialing")) {
      await saveSubscriptionRow(admin, userId, subscription);
    }
    console.log(`Subscription ${subscription.id}: ${subscription.status}, cancel_at_period_end ${subscription.cancel_at_period_end}, ${matched} row(s)`);

    if (isToolkitSubscription(subscription) && isCancelledOrEnding(subscription)) {
      const outcome = await sendCancellationNotice(admin, subscription, isUuid(userId) ? userId : null);
      if (outcome !== "already") console.log(`Cancellation notice for ${subscription.id}: ${outcome}`);
    }
  }

  async function handleSubscriptionDeleted(admin: AdminClient, subscription: Stripe.Subscription) {
    const matched = await syncSubscriptionRow(admin, subscription);
    console.log(`Subscription ${subscription.id} ended (${matched} row(s))`);
    if (isToolkitSubscription(subscription)) {
      const userId = subscription.metadata?.user_id;
      const outcome = await sendCancellationNotice(admin, subscription, isUuid(userId) ? userId : null);
      if (outcome !== "already") console.log(`Cancellation notice for ${subscription.id}: ${outcome}`);
    }
  }

  async function handleInvoicePaid(admin: AdminClient, invoice: Stripe.Invoice) {
    const subscriptionId = invoiceSubscriptionId(invoice);
    if (!subscriptionId) return;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const matched = await syncSubscriptionRow(admin, subscription);

    // No row yet: create it, but only for a subscription our checkout started.
    const userId = subscription.metadata?.user_id;
    if (matched === 0 && isUuid(userId) && subscription.metadata?.app === APP_TAG) {
      await saveSubscriptionRow(admin, userId, subscription);
    }
    console.log(`Invoice ${invoice.id} paid for subscription ${subscriptionId}`);
  }

  async function handleChargeRefunded(admin: AdminClient, charge: Stripe.Charge) {
    const paymentIntent = idOf(charge.payment_intent as string | { id: string } | null);
    if (!paymentIntent) return;

    const payments = await stripe.invoicePayments.list({
      payment: { type: "payment_intent", payment_intent: paymentIntent },
      limit: 1,
    });
    const invoiceId = idOf(payments.data[0]?.invoice as string | { id: string } | undefined);
    if (!invoiceId) {
      console.log(`Refunded charge ${charge.id} is not a subscription charge`);
      return;
    }
    const invoice = await stripe.invoices.retrieve(invoiceId);
    const subscriptionId = invoiceSubscriptionId(invoice);
    if (!subscriptionId) return;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (!isToolkitSubscription(subscription)) return;

    const refunds = await stripe.refunds.list({ charge: charge.id, limit: 20 });
    const refundMetadata = (refunds.data as Stripe.Refund[]).map((r) => r.metadata);
    const decision = refundDecision({
      fullyRefunded: Boolean(charge.refunded),
      invoiceId,
      latestInvoiceId: idOf(subscription.latest_invoice as string | { id: string } | null),
      keep: keepPlanAfterRefund(charge.metadata, refundMetadata),
    });
    console.log(`Charge ${charge.id} refunded for ${subscription.id}: ${decision}`);
    if (decision !== "end") return;

    // resolveDuplicates refunds a duplicate plan before cancelling it. If this event arrives in
    // between, cancel it as a duplicate (no email to the person, whose first plan carries on), not
    // as a refunded plan.
    const ended =
      subscription.status === "canceled"
        ? subscription
        : isDuplicateRefund(refundMetadata)
          ? await cancelDuplicate(subscription.id)
          : await stripe.subscriptions.cancel(
              subscription.id,
              { cancellation_details: { comment: CANCEL_COMMENT_REFUNDED } },
              { idempotencyKey: `refund-cancel-${subscription.id}-${invoiceId}` },
            );

    const now = new Date().toISOString();
    const { error } = await admin
      .from("subscriptions")
      .update({ status: "cancelled", end_date: now, cancel_at_period_end: false, updated_at: now })
      .eq("paypal_subscription_id", subscription.id);
    if (error) throw new Error(`Failed to end subscription ${subscription.id} after a refund: ${error.message}`);

    const userId = subscription.metadata?.user_id;
    await sendCancellationNotice(admin, ended, isUuid(userId) ? userId : null);
  }

  async function handleInvoicePaymentFailed(admin: AdminClient, invoice: Stripe.Invoice) {
    const subscriptionId = invoiceSubscriptionId(invoice);
    console.log(`Payment failed for invoice ${invoice.id}`);
    if (subscriptionId) await syncSubscriptionRow(admin, await stripe.subscriptions.retrieve(subscriptionId));
  }

  /** Routes one verified event. Throws on any failure except email, so Stripe retries. */
  async function dispatch(admin: AdminClient, event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(admin, event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChanged(admin, event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(admin, event.data.object as Stripe.Subscription);
        break;
      // A renewal was paid: extend end_date to the subscription's new period end.
      case "invoice.paid":
      case "invoice.payment_succeeded":
        await handleInvoicePaid(admin, event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(admin, event.data.object as Stripe.Invoice);
        break;
      case "charge.refunded":
        await handleChargeRefunded(admin, event.data.object as Stripe.Charge);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  return { dispatch };
}
