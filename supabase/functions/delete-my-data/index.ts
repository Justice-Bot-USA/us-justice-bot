// Deletes one person's data and account. Owner/admin-run for now (a person asks by email at
// privacy@justicebot-usa.com); a self-serve version can call the same steps later.
//
// POST { userId, confirm: "DELETE <userId>", dryRun?: boolean } with an admin's sign-in token.
// dryRun reports what would be removed and changes nothing.
//
// Order (engineering review important #9; spec v3 addendum item 14):
//   1. Cancel the person's Stripe subscriptions now, so nothing charges them after deletion, and send
//      the cancellation confirmation while the address is still known. Stop if any cancel fails.
//   2. List every stored object under {userId}/ in evidence-files, user-uploads and case-documents
//      (service-role RPC list_user_storage_objects).
//   3. Remove them through the Storage API in batches of up to 1,000, check each batch's count, then
//      list again. Stop before touching any row if anything is left.
//   4. Delete every row that holds the person's content, children before parents (ROW_TABLES):
//      calendar entries, class records, file rows, course records, case journeys and their tasks,
//      timelines, related cases, saved court results, case sweeps, attorney referrals, court export
//      logs, cases, chat messages and chat sessions, support messages and tickets, preferences,
//      activity logs (and their archive), funnel analytics, roles and the profile. Most of these
//      tables have no foreign key to auth.users, so deleting the sign-in account alone would leave
//      them behind.
//   5. Delete the sign-in account (auth.admin.deleteUser).
//
// Kept on purpose (KEPT_TABLES; financial and legal records, never deleted here):
//   - billing_consents and billing_notices: kept (their user_id becomes null; email and Stripe ids
//     stay) for at least max(created_at + 3 years, plan end + 1 year), as Cal. Bus. & Prof. Code
//     17602(a)(6) requires.
//   - subscriptions, payments and form_payments: the payment history (amounts, dates and payment
//     ids), kept for accounting, tax and refund records. These tables have no foreign key to
//     auth.users, so their user_id stays as it is.
// Not touched: attorneys (an attorney's own directory listing) and legal_sweeps (keyed by
// created_by; staff-run). Both are outside a person's own content.
//
// Logs and responses hold counts only, never file names, case titles or email addresses.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { corsHeaders, handleCors, hasRole, requireAdmin } from "../_shared/auth.ts";
import { createAdminClient } from "../_shared/db.ts";
import { getStripe } from "../_shared/stripe.ts";
import { scrubError } from "../_shared/email.ts";
import { CANCEL_COMMENT_ACCOUNT_DELETED } from "../_shared/billingDisclosure.ts";
import { findUserSubscriptions, isUuid, sendCancellationNotice } from "../stripe-webhook/toolkitSubscriptions.ts";

const BUCKETS = ["evidence-files", "user-uploads", "case-documents"] as const;
const BATCH_SIZE = 1000;

/** chat_messages has no user_id: its rows are found through the person's chat_sessions. */
const CHAT_MESSAGES = "chat_messages";

// Children before parents. Every table except chat_messages has a user_id column.
//  - class_trackers points at case_files (proof file), so it goes first.
//  - course_certificates points at course_enrollments.
//  - journey_tasks belong to journey_steps, which cascade from legal_journeys.
//  - case_files, calendar entries, class trackers, course enrollments, journeys, timelines,
//    related cases and saved court results point at case_merit_scores.
//  - case_files and case_merit_scores point at chat_sessions; chat_messages belong to them.
//  - support_messages belong to support_tickets.
const ROW_TABLES = [
  "case_calendar_events",
  "class_sessions",
  "class_trackers",
  "case_files",
  "course_certificates",
  "course_enrollments",
  "journey_tasks",
  "legal_journeys",
  "case_timeline_events",
  "related_case_references",
  "saved_court_results",
  "case_sweeps",
  "attorney_referrals",
  "court_export_logs",
  "case_merit_scores",
  CHAT_MESSAGES,
  "chat_sessions",
  "support_messages",
  "support_tickets",
  "user_preferences",
  "user_activity_logs",
  "user_activity_logs_archive",
  "funnel_analytics",
  "user_roles",
  "profiles",
] as const;

/** Financial and legal records this function never deletes (see the header). Keyed by user_id. */
const KEPT_TABLES = ["subscriptions", "payments", "form_payments", "billing_consents", "billing_notices"] as const;
const KEPT_NOTE =
  "Kept: subscriptions, payments and form_payments (payment history) and billing_consents and billing_notices (automatic renewal records, Cal. Bus. & Prof. Code 17602(a)(6)).";

/** Session ids per `in` filter, so the request URL stays short. */
const ID_CHUNK = 100;

const ENDED: Stripe.Subscription.Status[] = ["canceled", "incomplete_expired"];

type Admin = ReturnType<typeof createAdminClient>;

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function listObjects(admin: Admin, userId: string): Promise<Array<{ bucket_id: string; name: string }>> {
  const { data, error } = await admin.rpc("list_user_storage_objects", { _uid: userId });
  if (error) throw new Error(`list_user_storage_objects failed: ${error.message}`);
  return (data ?? []) as Array<{ bucket_id: string; name: string }>;
}

/** Every chat_sessions id the person owns, a page at a time. */
async function chatSessionIds(admin: Admin, userId: string): Promise<string[]> {
  const ids: string[] = [];
  const page = 1000;
  for (let from = 0; ; from += page) {
    const { data, error } = await admin
      .from("chat_sessions")
      .select("id")
      .eq("user_id", userId)
      .order("id", { ascending: true })
      .range(from, from + page - 1);
    if (error) throw new Error(`list chat_sessions failed: ${error.message}`);
    ids.push(...(data ?? []).map((row: { id: string }) => row.id));
    if ((data ?? []).length < page) return ids;
  }
}

function chunks<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function countByUser(admin: Admin, tables: readonly string[], userId: string): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const table of tables) {
    if (table === CHAT_MESSAGES) {
      let total = 0;
      for (const ids of chunks(await chatSessionIds(admin, userId), ID_CHUNK)) {
        const { count, error } = await admin.from(CHAT_MESSAGES).select("id", { count: "exact", head: true }).in("session_id", ids);
        if (error) throw new Error(`count ${CHAT_MESSAGES} failed: ${error.message}`);
        total += count ?? 0;
      }
      counts[table] = total;
      continue;
    }
    const { count, error } = await admin.from(table).select("id", { count: "exact", head: true }).eq("user_id", userId);
    if (error) throw new Error(`count ${table} failed: ${error.message}`);
    counts[table] = count ?? 0;
  }
  return counts;
}

/** Deletes one table's rows for the person. Returns how many were deleted. */
async function deleteRows(admin: Admin, table: string, userId: string): Promise<number> {
  if (table === CHAT_MESSAGES) {
    let total = 0;
    for (const ids of chunks(await chatSessionIds(admin, userId), ID_CHUNK)) {
      const { count, error } = await admin.from(CHAT_MESSAGES).delete({ count: "exact" }).in("session_id", ids);
      if (error) throw new Error(error.message);
      total += count ?? 0;
    }
    return total;
  }
  const { count, error } = await admin.from(table).delete({ count: "exact" }).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  if (req.method !== "POST") return json(405, { error: "Use POST." });

  try {
    await requireAdmin(req);
  } catch {
    return json(403, { error: "Admin access required." });
  }

  let body: { userId?: unknown; confirm?: unknown; dryRun?: unknown };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }
  const userId = body.userId;
  if (!isUuid(userId)) return json(400, { error: "userId must be the account's id." });
  const dryRun = body.dryRun === true;
  if (!dryRun && body.confirm !== `DELETE ${userId}`) {
    return json(400, { error: `Type the confirmation exactly: "DELETE ${userId}".` });
  }

  const admin = createAdminClient();
  const report: Record<string, unknown> = { userId, dryRun };

  try {
    if (await hasRole(userId, "admin")) {
      return json(409, { error: "This account has the admin role. Remove the role first.", ...report });
    }

    const { data: userData } = await admin.auth.admin.getUserById(userId);
    const email = userData?.user?.email ?? null;
    report.accountFound = Boolean(userData?.user);

    // 1. Stripe subscriptions
    const stripe = getStripe();
    const live = (await findUserSubscriptions(admin, stripe, userId, { alwaysSearch: true })).filter(
      (s) => !ENDED.includes(s.status),
    );
    report.subscriptionsToCancel = live.length;

    const objects = await listObjects(admin, userId);
    report.objectsFound = objects.length;
    report.objectsByBucket = Object.fromEntries(BUCKETS.map((b) => [b, objects.filter((o) => o.bucket_id === b).length]));

    if (dryRun) {
      report.rows = await countByUser(admin, ROW_TABLES, userId);
      report.keptRows = await countByUser(admin, KEPT_TABLES, userId);
      report.kept = KEPT_NOTE;
      return json(200, { ok: true, ...report });
    }

    for (const subscription of live) {
      try {
        const cancelled = await stripe.subscriptions.cancel(subscription.id, {
          // cancellationVariantFor picks the account_deleted email for this comment (it never says
          // the person's files are kept).
          cancellation_details: { comment: CANCEL_COMMENT_ACCOUNT_DELETED },
        });
        await admin
          .from("subscriptions")
          .update({ status: "cancelled", cancel_at_period_end: false, updated_at: new Date().toISOString() })
          .eq("paypal_subscription_id", subscription.id);
        await sendCancellationNotice(admin, cancelled, userId, email);
      } catch (error) {
        console.error(`delete-my-data: cancel failed for ${subscription.id}: ${scrubError(String(error))}`);
        return json(502, { ok: false, stoppedAt: "cancel_subscriptions", error: "Could not cancel a subscription. Nothing was deleted.", ...report });
      }
    }
    report.subscriptionsCancelled = live.length;

    // 2-3. Stored objects
    let removed = 0;
    const mismatches: string[] = [];
    for (const bucket of BUCKETS) {
      const names = objects.filter((o) => o.bucket_id === bucket).map((o) => o.name);
      for (let i = 0; i < names.length; i += BATCH_SIZE) {
        const chunk = names.slice(i, i + BATCH_SIZE);
        const { data, error } = await admin.storage.from(bucket).remove(chunk);
        if (error) {
          mismatches.push(`${bucket}: batch ${i / BATCH_SIZE + 1} failed`);
          continue;
        }
        removed += data?.length ?? 0;
        if ((data?.length ?? 0) !== chunk.length) {
          mismatches.push(`${bucket}: batch ${i / BATCH_SIZE + 1} removed ${data?.length ?? 0} of ${chunk.length}`);
        }
      }
    }
    report.objectsRemoved = removed;
    const remaining = await listObjects(admin, userId);
    if (remaining.length > 0) {
      console.error(`delete-my-data: ${remaining.length} stored object(s) remain for ${userId}`);
      return json(500, {
        ok: false,
        stoppedAt: "storage",
        error: "Some stored files could not be removed. No rows or account were deleted; run it again.",
        objectsRemaining: remaining.length,
        problems: mismatches,
        ...report,
      });
    }

    // 4. Rows
    const rowsDeleted: Record<string, number> = {};
    for (const table of ROW_TABLES) {
      try {
        rowsDeleted[table] = await deleteRows(admin, table, userId);
      } catch (error) {
        console.error(`delete-my-data: deleting ${table} failed: ${scrubError(error instanceof Error ? error.message : String(error))}`);
        return json(500, { ok: false, stoppedAt: `rows:${table}`, error: "Could not delete every row. The account was not deleted; run it again.", rowsDeleted, ...report });
      }
    }
    report.rowsDeleted = rowsDeleted;
    report.kept = KEPT_NOTE;

    // 5. The sign-in account (billing records keep their snapshots; user_id becomes null).
    if (report.accountFound) {
      const { error } = await admin.auth.admin.deleteUser(userId);
      if (error) {
        console.error(`delete-my-data: deleteUser failed: ${error.message}`);
        return json(500, { ok: false, stoppedAt: "auth_user", error: "Files and rows were deleted, but the account could not be. Check the logs.", ...report });
      }
    }
    report.accountDeleted = Boolean(report.accountFound);

    console.log("delete-my-data done:", JSON.stringify({ ...report, userId }));
    return json(200, { ok: true, ...report });
  } catch (error) {
    console.error("delete-my-data failed:", scrubError(error instanceof Error ? error.message : String(error)));
    return json(500, { ok: false, error: "Something went wrong. Check the function logs.", ...report });
  }
});
