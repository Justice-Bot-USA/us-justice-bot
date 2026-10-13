// Daily billing-notices job (called by pg_cron through pg_net; verify_jwt = false).
//
// Auth: header x-cron-secret must equal the CRON_SECRET secret. It is compared in constant time
// before any database work; anything else gets a bare 401.
//
// Each run:
//   1. Retries billing notices that failed, or that have been stuck in 'sending' for 15 minutes
//      (acknowledgments, cancellation confirmations, annual reminders), up to MAX_NOTICE_ATTEMPTS.
//      A notice that no longer fits the plan's state (for example the acknowledgment for a plan
//      that has since been cancelled) is stopped and reported to the owner instead.
//   2. Sends any missing acknowledgment for an active plan started in the last 14 days.
//   3. Sends the annual reminder (Cal. Bus. & Prof. Code 17602(h)) for active, not-cancelled plans
//      whose yearly anniversary is within the next 7 days and that had no reminder in the last 300
//      days (public.billing_due_annual_reminders).
//   4. Emails the owner (OWNER_ALERT_EMAIL) about notices that keep failing: each one once when it
//      reaches 3 failed attempts and once when its retries stop (not again on later runs).
//
// Sends are spaced out to stay under Resend's 10 requests per second. The job itself is in jobs.ts.
//
// Schedule after merge (SQL in the engineering review, important #6), with the project URL and the
// secret stored in Vault:
//   select cron.schedule('billing-notices-daily', '17 15 * * *', $$ select net.http_post(
//     url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/billing-notices',
//     headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret',
//       (select decrypted_secret from vault.decrypted_secrets where name = 'billing_cron_secret')),
//     body := '{}'::jsonb, timeout_milliseconds := 30000) $$);

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createAdminClient } from "../_shared/db.ts";
import { getStripe } from "../_shared/stripe.ts";
import { scrubError, sendOwnerAlert } from "../_shared/email.ts";
import { runBillingNotices, secretMatches } from "./jobs.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });
  if (!(await secretMatches(req.headers.get("x-cron-secret")))) return new Response(null, { status: 401 });

  try {
    const summary = await runBillingNotices(createAdminClient(), getStripe);
    console.log("billing-notices run:", JSON.stringify(summary));
    return new Response(JSON.stringify({ ok: true, ...summary }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = scrubError(error instanceof Error ? error.message : String(error));
    await sendOwnerAlert("billing-notices run failed", [message]);
    return new Response(JSON.stringify({ ok: false }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
