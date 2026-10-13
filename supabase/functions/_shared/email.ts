// Sends transactional email through Resend (https://resend.com/docs/api-reference/emails/send-email).
// Used only for the Toolkit plan's billing notices: the purchase acknowledgment and annual reminder
// the automatic renewal laws require, the cancellation confirmation, and alerts to the owner when a
// notice fails. Nothing else in the app sends email.
//
// Secrets: RESEND_API_KEY, and BILLING_FROM_EMAIL (e.g. "Justice Bot USA <billing@justicebot-usa.com>",
// a sender on a domain verified in Resend). BILLING_REPLY_TO is optional. OWNER_ALERT_EMAIL (optional)
// receives failure alerts; without it they only go to the function logs.
//
// Every notice is recorded in public.billing_notices (one row per subscription, kind and
// reminder_year), so each one is sent at most once and failures can be retried by billing-notices.

import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.4";

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
  /** Resend de-duplicates sends with the same key for 24 hours. */
  idempotencyKey?: string;
}

/** A failed send. status is the HTTP status from Resend (0 when the request itself failed). */
export class EmailSendError extends Error {
  readonly status: number;
  readonly code: string | null;
  constructor(status: number, code: string | null, message: string) {
    super(message);
    this.name = "EmailSendError";
    this.status = status;
    this.code = code;
  }
}

export function emailConfigured(): boolean {
  return Boolean(Deno.env.get("RESEND_API_KEY") && Deno.env.get("BILLING_FROM_EMAIL"));
}

export async function sendEmail(message: EmailMessage): Promise<{ id: string }> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("BILLING_FROM_EMAIL");
  if (!apiKey || !from) {
    throw new EmailSendError(0, "not_configured", "Email is not configured (RESEND_API_KEY / BILLING_FROM_EMAIL)");
  }

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(message.idempotencyKey ? { "Idempotency-Key": message.idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html ?? textToHtml(message.text),
        ...(Deno.env.get("BILLING_REPLY_TO") ? { reply_to: Deno.env.get("BILLING_REPLY_TO") } : {}),
      }),
    });
  } catch (error) {
    throw new EmailSendError(0, "network", `Resend request failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  const body = (await response.json().catch(() => ({}))) as { id?: string; name?: string; message?: string };
  if (!response.ok) {
    throw new EmailSendError(
      response.status,
      body.name ?? null,
      `Resend error ${response.status}: ${body.name ?? ""} ${body.message ?? ""}`.trim(),
    );
  }
  return { id: String(body.id ?? "") };
}

/** Escapes text for the simple HTML version of an email. */
export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Turns a plain-text email into minimal HTML (paragraphs and links), so both versions match.
 * A full stop or comma right after a link stays outside the link.
 */
export function textToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map(
      (para) =>
        `<p>${escapeHtml(para)
          .replace(/\n/g, "<br>")
          .replace(/(https:\/\/[^\s<]*[^\s<.,;:!?)])/g, '<a href="$1">$1</a>')}</p>`,
    )
    .join("\n");
}

// ---------------------------------------------------------------------------------------------
// Billing notices (public.billing_notices)
// ---------------------------------------------------------------------------------------------

export type NoticeKind = "acknowledgment" | "annual_reminder" | "price_change" | "cancellation";
export type NoticeStatus = "queued" | "sending" | "sent" | "failed";

/** A notice that keeps failing is retried until it has this many attempts, then left for the owner. */
export const MAX_NOTICE_ATTEMPTS = 8;

export interface NoticeRecipient {
  subscriptionId: string;
  kind: NoticeKind;
  /** Required for annual_reminder; null otherwise. */
  reminderYear?: number | null;
  userId?: string | null;
  /** Where to send. A missing address is recorded as a failure for the owner to follow up. */
  email: string | null | undefined;
}

export type NoticeOutcome =
  /** Sent now. */
  | "sent"
  /** Another call already claimed or sent this notice; nothing was sent. */
  | "already"
  /** Could not send; the row is marked failed and billing-notices will retry it. */
  | "failed";

type Admin = SupabaseClient;

/** Removes email addresses from error text before it is stored or logged, and caps its length. */
export function scrubError(message: string): string {
  return message.replace(/[^\s@<>"'(),;:]+@[^\s@<>"'(),;:]+/g, "[email]").slice(0, 500);
}

function idempotencyKey(n: Pick<NoticeRecipient, "subscriptionId" | "kind" | "reminderYear">): string {
  return `${n.kind}-${n.subscriptionId}${n.reminderYear ? `-${n.reminderYear}` : ""}`;
}

/**
 * Claims a new notice row (status 'sending') so only one caller sends it. Returns the row id, or
 * null if a row for this subscription, kind and year already exists (sent, sending or failed).
 */
async function claimNewNotice(admin: Admin, n: NoticeRecipient): Promise<string | null> {
  const { data, error } = await admin
    .from("billing_notices")
    .upsert(
      {
        subscription_id: n.subscriptionId,
        kind: n.kind,
        reminder_year: n.reminderYear ?? null,
        user_id: n.userId ?? null,
        email: n.email ?? null,
        status: "sending",
        attempts: 1,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "subscription_id,kind,reminder_year", ignoreDuplicates: true },
    )
    .select("id");
  if (error) throw new Error(`billing_notices claim failed: ${error.message}`);
  return data && data.length > 0 ? String(data[0].id) : null;
}

/** Sends a claimed notice and records the result. Never throws. */
async function deliverClaimed(
  admin: Admin,
  noticeId: string,
  n: NoticeRecipient,
  message: { subject: string; text: string },
): Promise<NoticeOutcome> {
  // updated_at is also set by the billing_notices_updated_at trigger; billing-notices reads it to
  // report a notice only on the run where it changed.
  const finish = async (fields: Record<string, unknown>) => {
    const { error } = await admin.from("billing_notices").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", noticeId);
    if (error) console.error(`[billing-notice] could not record the result for notice ${noticeId}: ${error.message}`);
  };

  if (!n.email) {
    await finish({ status: "failed", last_error: "no_email_address" });
    console.error(`[billing-notice] ${n.kind} for ${n.subscriptionId}: no email address`);
    return "failed";
  }

  try {
    const { id } = await sendEmail({
      to: n.email,
      subject: message.subject,
      text: message.text,
      idempotencyKey: idempotencyKey(n),
    });
    await finish({
      status: "sent",
      sent_at: new Date().toISOString(),
      provider_message_id: id || null,
      last_error: null,
      email: n.email,
    });
    console.log(`[billing-notice] ${n.kind} sent for ${n.subscriptionId}`);
    return "sent";
  } catch (error) {
    // Same key with a different payload within 24 hours: Resend already accepted this notice.
    if (error instanceof EmailSendError && error.status === 409 && error.code === "invalid_idempotent_request") {
      await finish({ status: "sent", sent_at: new Date().toISOString(), last_error: "idempotency_conflict_already_sent" });
      return "sent";
    }
    const text = scrubError(error instanceof Error ? error.message : String(error));
    await finish({ status: "failed", last_error: text });
    console.error(`[billing-notice] ${n.kind} failed for ${n.subscriptionId}: ${text}`);
    return "failed";
  }
}

/**
 * Sends a billing notice once per (subscription, kind, reminder year). Safe to call again for the
 * same notice (webhook retries, a cancellation followed by the webhook's own event): only the first
 * call sends. Never throws because of email; a failure is recorded for billing-notices to retry.
 */
export async function sendBillingNotice(
  admin: Admin,
  n: NoticeRecipient,
  message: { subject: string; text: string },
): Promise<NoticeOutcome> {
  let noticeId: string | null;
  try {
    noticeId = await claimNewNotice(admin, n);
  } catch (error) {
    console.error(`[billing-notice] ${n.kind} for ${n.subscriptionId}: ${scrubError(String(error))}`);
    return "failed";
  }
  if (!noticeId) return "already";
  return deliverClaimed(admin, noticeId, n, message);
}

export interface RetryableNotice {
  id: string;
  subscription_id: string;
  kind: NoticeKind;
  reminder_year: number | null;
  user_id: string | null;
  email: string | null;
  status: NoticeStatus;
  attempts: number;
  updated_at: string;
}

/**
 * Re-sends an existing failed (or stuck 'sending') notice. Takes the row over only if nobody else
 * changed it since it was read. Never throws.
 */
export async function retryBillingNotice(
  admin: Admin,
  row: RetryableNotice,
  email: string | null,
  message: { subject: string; text: string },
): Promise<NoticeOutcome> {
  const { data, error } = await admin
    .from("billing_notices")
    .update({ status: "sending", attempts: row.attempts + 1, email: email ?? row.email, updated_at: new Date().toISOString() })
    .eq("id", row.id)
    .eq("status", row.status)
    .eq("updated_at", row.updated_at)
    .select("id");
  if (error) {
    console.error(`[billing-notice] retry claim failed for notice ${row.id}: ${error.message}`);
    return "failed";
  }
  if (!data || data.length === 0) return "already";
  return deliverClaimed(
    admin,
    row.id,
    {
      subscriptionId: row.subscription_id,
      kind: row.kind,
      reminderYear: row.reminder_year,
      userId: row.user_id,
      email: email ?? row.email,
    },
    message,
  );
}

/** Stops retrying a notice (for example, the plan ended before a retry). Never throws. */
export async function abandonBillingNotice(admin: Admin, noticeId: string, reason: string): Promise<void> {
  const { error } = await admin
    .from("billing_notices")
    .update({ status: "failed", attempts: MAX_NOTICE_ATTEMPTS, last_error: scrubError(reason), updated_at: new Date().toISOString() })
    .eq("id", noticeId);
  if (error) console.error(`[billing-notice] could not stop retries for notice ${noticeId}: ${error.message}`);
}

/**
 * Emails the owner (OWNER_ALERT_EMAIL) about a billing problem, and always logs it. Lines should
 * hold ids and counts only, never case details or file names; email addresses are removed. Never
 * throws.
 */
export async function sendOwnerAlert(subject: string, lines: string[]): Promise<void> {
  const to = Deno.env.get("OWNER_ALERT_EMAIL");
  const text = lines.map(scrubError).join("\n");
  console.error(`[owner-alert] ${subject}\n${text}`);
  if (!to || !emailConfigured()) return;
  try {
    await sendEmail({ to, subject: `[Justice Bot USA billing] ${subject}`, text });
  } catch (error) {
    console.error(`[owner-alert] could not email the owner: ${scrubError(String(error))}`);
  }
}

/** A person's sign-in email address, looked up with the service role. Null if unknown. */
export async function accountEmail(admin: Admin, userId: string | null | undefined): Promise<string | null> {
  if (!userId) return null;
  try {
    const { data, error } = await admin.auth.admin.getUserById(userId);
    if (error) return null;
    return data?.user?.email ?? null;
  } catch {
    return null;
  }
}

/**
 * A billing date written out ("November 13, 2026") in the person's time zone when we know it
 * (saved from their browser at checkout), otherwise US Eastern time. Billing dates only.
 */
export function formatBillingDate(unixSeconds: number, timeZone?: string | null): string {
  const date = new Date(unixSeconds * 1000);
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  try {
    return new Intl.DateTimeFormat("en-US", { ...options, timeZone: timeZone || "America/New_York" }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "America/New_York" }).format(date);
  }
}

/** Checks a browser-supplied IANA time zone name. Returns it, or null if it is not a valid one. */
export function cleanTimeZone(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 64 || !/^[A-Za-z][A-Za-z0-9_+\-/]*$/.test(value)) return null;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return value;
  } catch {
    return null;
  }
}
