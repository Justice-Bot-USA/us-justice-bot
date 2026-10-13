// The billing-notices job (see index.ts for what each run does and how it is scheduled). Kept apart
// from index.ts so tests can run it with a fake Stripe client and a fake database.

import { timingSafeEqual } from "node:crypto";
import Stripe from "https://esm.sh/stripe@18.5.0";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.4";
import {
  abandonBillingNotice,
  accountEmail,
  emailConfigured,
  MAX_NOTICE_ATTEMPTS,
  type NoticeOutcome,
  retryBillingNotice,
  type RetryableNotice,
  sendBillingNotice,
  sendOwnerAlert,
} from "../_shared/email.ts";
import { annualReminderEmail, cancellationEmail } from "../_shared/billingDisclosure.ts";
import {
  acknowledgmentFor,
  cancellationVariantFor,
  findUserSubscriptions,
  isCancelledOrEnding,
  isToolkitSubscription,
  isUuid,
  LIVE_STATUSES,
  sendAcknowledgment,
} from "../stripe-webhook/toolkitSubscriptions.ts";

type Admin = SupabaseClient;

const SEND_GAP_MS = 150;
const STUCK_AFTER_MS = 15 * 60 * 1000;
/** Failed attempts at which a notice is first reported to the owner (it is still retried daily). */
const REPORT_AT_ATTEMPTS = 3;
/** Allowance for the gap between this function's clock and the database's now(). */
const CLOCK_SLACK_MS = 5 * 60 * 1000;
const NOTICE_COLUMNS = "id,subscription_id,kind,reminder_year,user_id,email,status,attempts,updated_at";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function sha256(text: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}

/** Constant-time check of the cron secret (both sides hashed to equal length first). */
export async function secretMatches(provided: string | null, expected = Deno.env.get("CRON_SECRET") ?? ""): Promise<boolean> {
  if (expected.length < 16 || !provided) return false;
  const [a, b] = await Promise.all([sha256(provided), sha256(expected)]);
  return timingSafeEqual(a, b);
}

async function retrieveSubscription(stripe: Stripe, id: string): Promise<Stripe.Subscription | null> {
  if (!id.startsWith("sub_")) return null;
  try {
    return await stripe.subscriptions.retrieve(id);
  } catch (error) {
    if ((error as { code?: string })?.code === "resource_missing") return null;
    throw error;
  }
}

function isActivePlan(sub: Stripe.Subscription | null): sub is Stripe.Subscription {
  return !!sub && LIVE_STATUSES.includes(sub.status) && !sub.cancel_at_period_end;
}

export interface Summary {
  emailConfigured: boolean;
  retried: number;
  retriesSent: number;
  retriesFailed: number;
  stopped: number;
  missingAcknowledgments: number;
  remindersDue: number;
  remindersSent: number;
  remindersFailed: number;
  remindersSkipped: number;
  ownerAlerted: boolean;
}

async function retryNotices(admin: Admin, stripe: Stripe, summary: Summary, problems: string[], stopped: Set<string>) {
  const stuckBefore = new Date(Date.now() - STUCK_AFTER_MS).toISOString();
  const [failed, stuck] = await Promise.all([
    admin.from("billing_notices").select(NOTICE_COLUMNS).eq("status", "failed").lt("attempts", MAX_NOTICE_ATTEMPTS)
      .order("created_at", { ascending: true }).limit(100),
    admin.from("billing_notices").select(NOTICE_COLUMNS).in("status", ["sending", "queued"]).lt("updated_at", stuckBefore)
      .lt("attempts", MAX_NOTICE_ATTEMPTS).order("created_at", { ascending: true }).limit(100),
  ]);
  if (failed.error) throw new Error(`Could not read failed notices: ${failed.error.message}`);
  if (stuck.error) throw new Error(`Could not read stuck notices: ${stuck.error.message}`);

  for (const row of [...(failed.data ?? []), ...(stuck.data ?? [])] as RetryableNotice[]) {
    const sub = await retrieveSubscription(stripe, row.subscription_id);
    const email = (await accountEmail(admin, row.user_id)) ?? row.email;
    let outcome: NoticeOutcome | null = null;

    if (row.kind === "acknowledgment" || row.kind === "annual_reminder") {
      if (!isActivePlan(sub)) {
        await abandonBillingNotice(admin, row.id, "plan no longer active or cancelled; not resent");
        stopped.add(String(row.id));
        problems.push(`${row.kind} for ${row.subscription_id} was never sent and the plan is no longer active.`);
        summary.stopped++;
        continue;
      }
      outcome = await retryBillingNotice(admin, row, email, row.kind === "acknowledgment" ? acknowledgmentFor(sub) : annualReminderEmail());
    } else if (row.kind === "cancellation") {
      if (!sub || !isCancelledOrEnding(sub)) {
        await abandonBillingNotice(admin, row.id, "plan not cancelled any more; not resent");
        stopped.add(String(row.id));
        problems.push(`cancellation confirmation for ${row.subscription_id} was never sent and the plan is not cancelled now.`);
        summary.stopped++;
        continue;
      }
      outcome = await retryBillingNotice(admin, row, email, cancellationEmail(cancellationVariantFor(sub)));
    } else {
      continue; // price_change notices have no sender yet
    }

    summary.retried++;
    if (outcome === "sent") summary.retriesSent++;
    if (outcome === "failed") summary.retriesFailed++;
    await sleep(SEND_GAP_MS);
  }
}

async function sendMissingAcknowledgments(admin: Admin, stripe: Stripe, summary: Summary, problems: string[]) {
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recent, error } = await admin
    .from("subscriptions")
    .select("paypal_subscription_id,user_id")
    .eq("status", "active")
    .gte("created_at", since)
    .not("paypal_subscription_id", "is", null)
    .limit(200);
  if (error) throw new Error(`Could not read recent subscriptions: ${error.message}`);

  const rows = (recent ?? []).filter((r: { paypal_subscription_id: string }) => r.paypal_subscription_id.startsWith("sub_"));
  if (rows.length === 0) return;
  const { data: acks, error: ackError } = await admin
    .from("billing_notices")
    .select("subscription_id")
    .eq("kind", "acknowledgment")
    .in("subscription_id", rows.map((r: { paypal_subscription_id: string }) => r.paypal_subscription_id));
  if (ackError) throw new Error(`Could not read acknowledgments: ${ackError.message}`);
  const done = new Set((acks ?? []).map((a: { subscription_id: string }) => a.subscription_id));

  for (const row of rows as Array<{ paypal_subscription_id: string; user_id: string }>) {
    if (done.has(row.paypal_subscription_id) || !isUuid(row.user_id)) continue;
    const sub = await retrieveSubscription(stripe, row.paypal_subscription_id);
    if (!isActivePlan(sub) || !isToolkitSubscription(sub)) continue;

    // Never acknowledge a second plan: the webhook cancels and refunds duplicates.
    const older = (await findUserSubscriptions(admin, stripe, row.user_id)).filter(
      (s) => s.id !== sub.id && LIVE_STATUSES.includes(s.status) && isToolkitSubscription(s) && s.created <= sub.created,
    );
    if (older.length > 0) {
      problems.push(`User ${row.user_id} has more than one live Toolkit plan (${sub.id} and ${older.map((s) => s.id).join(", ")}).`);
      continue;
    }

    summary.missingAcknowledgments++;
    const outcome = await sendAcknowledgment(admin, sub, row.user_id);
    if (outcome === "failed") problems.push(`acknowledgment for ${sub.id} failed to send.`);
    await sleep(SEND_GAP_MS);
  }
}

interface DueReminder {
  subscription_id: string;
  user_id: string | null;
  reminder_year: number;
}

async function sendAnnualReminders(admin: Admin, stripe: Stripe, summary: Summary) {
  const { data, error } = await admin.rpc("billing_due_annual_reminders", { _window_days: 7 });
  if (error) throw new Error(`billing_due_annual_reminders failed: ${error.message}`);

  for (const due of (data ?? []) as DueReminder[]) {
    summary.remindersDue++;
    const sub = await retrieveSubscription(stripe, due.subscription_id);
    // Stripe is the source of truth: skip a plan that has ended or been cancelled since.
    if (!isActivePlan(sub) || !isToolkitSubscription(sub)) {
      summary.remindersSkipped++;
      continue;
    }
    const outcome = await sendBillingNotice(
      admin,
      {
        subscriptionId: due.subscription_id,
        kind: "annual_reminder",
        reminderYear: due.reminder_year,
        userId: due.user_id,
        email: await accountEmail(admin, due.user_id),
      },
      annualReminderEmail(),
    );
    if (outcome === "sent") summary.remindersSent++;
    if (outcome === "failed") summary.remindersFailed++;
    await sleep(SEND_GAP_MS);
  }
}

/**
 * Failed notices to report to the owner on this run, so each one is reported only when its state
 * changes, never every day: once on the run where it reaches REPORT_AT_ATTEMPTS failed attempts,
 * and once on the run where it runs out of retries (MAX_NOTICE_ATTEMPTS). Every write to
 * billing_notices moves updated_at (the billing_notices_updated_at trigger, and the helpers in
 * _shared/email.ts set it too), so "changed on this run" is updated_at at or after the run began.
 * Notices this run stopped because the plan changed are left out: they are already in `problems`.
 */
async function newlyStuckNoticeLines(admin: Admin, runStartedAt: number, stopped: Set<string>): Promise<string[]> {
  const since = new Date(runStartedAt - CLOCK_SLACK_MS).toISOString();
  const { data, error } = await admin
    .from("billing_notices")
    .select("id,subscription_id,kind,attempts,last_error")
    .eq("status", "failed")
    .gte("updated_at", since)
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) return [`Could not read failed notices: ${error.message}`];
  return (data ?? [])
    .filter(
      (n: { id: string; attempts: number }) =>
        !stopped.has(String(n.id)) && (n.attempts === REPORT_AT_ATTEMPTS || n.attempts >= MAX_NOTICE_ATTEMPTS),
    )
    .map(
      (n: { id: string; subscription_id: string; kind: string; attempts: number; last_error: string | null }) =>
        `${n.kind} for ${n.subscription_id} (notice ${n.id}): ${n.attempts} failed attempt(s)${
          n.attempts >= MAX_NOTICE_ATTEMPTS ? ", no more retries" : `; tried again once a day, up to ${MAX_NOTICE_ATTEMPTS} attempts`
        }; last error: ${n.last_error ?? "none"}`,
    );
}

/** One daily run. Throws only on database or Stripe errors (email failures are recorded). */
export async function runBillingNotices(admin: Admin, getStripeClient: () => Stripe): Promise<Summary> {
  const summary: Summary = {
    emailConfigured: emailConfigured(),
    retried: 0,
    retriesSent: 0,
    retriesFailed: 0,
    stopped: 0,
    missingAcknowledgments: 0,
    remindersDue: 0,
    remindersSent: 0,
    remindersFailed: 0,
    remindersSkipped: 0,
    ownerAlerted: false,
  };
  if (!summary.emailConfigured) {
    await sendOwnerAlert("Billing email is not configured", [
      "RESEND_API_KEY or BILLING_FROM_EMAIL is missing, so no billing notices can be sent.",
      "Checkout stays closed until both are set.",
    ]);
    summary.ownerAlerted = true;
    return summary;
  }

  const runStartedAt = Date.now();
  const stripe = getStripeClient();
  const problems: string[] = [];
  const stopped = new Set<string>();
  // A notice is reported only on the run that changed it, so report what this run changed even if
  // a later step throws; then rethrow (index.ts alerts the owner that the run failed).
  let failure: unknown = null;
  try {
    await retryNotices(admin, stripe, summary, problems, stopped);
    await sendMissingAcknowledgments(admin, stripe, summary, problems);
    await sendAnnualReminders(admin, stripe, summary);
  } catch (error) {
    failure = error;
  }

  const stuck = await newlyStuckNoticeLines(admin, runStartedAt, stopped);
  if (problems.length > 0 || stuck.length > 0) {
    await sendOwnerAlert("Billing notices need attention", [
      ...problems,
      ...(stuck.length > 0
        ? [`Notices that keep failing (each is listed once at ${REPORT_AT_ATTEMPTS} failed attempts and once when retries stop):`, ...stuck]
        : []),
      "Check RESEND_API_KEY, the sending domain in Resend, and each address. Notices with retries left are tried again tomorrow.",
    ]);
    summary.ownerAlerted = true;
  }
  if (failure) throw failure;
  return summary;
}

