// Toolkit plan checkout ($25.00 a month, price PRICE_IDS.monthly).
//
// Actions (POST JSON { action, ... }):
//   checkout_status      No sign-in needed. { available } says whether the plan can be bought now
//                        (see sales.ts). The Pricing page asks first and shows "Coming soon" with no
//                        checkboxes while it is closed.
//   create_subscription  Signed in. Body: { autoRenewConsent: true, tosConsent: true,
//                        disclosureVersion, disclosureSha256, timeZone?, locale? }. In this order:
//                        closed -> 409 PLAN_PAUSED (no consent row written); consent checks -> 400;
//                        already subscribed -> 409 ALREADY_SUBSCRIBED; record consent; create the
//                        Checkout session; store the session id on the consent row.
//   verify_session       Signed in. Body: { sessionId }. Records the subscription, links the consent
//                        row, sends the acknowledgment if the webhook has not yet, and returns the
//                        plan details and acknowledgment email status for /payment-success.
//
// Errors returned to the browser are short and generic; details go to the function log (never a
// customer's email address, case details or file names).

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { handleCors, requireUser } from "../_shared/auth.ts";
import { createAdminClient } from "../_shared/db.ts";
import { getStripe, PRICE_IDS } from "../_shared/stripe.ts";
import { emailConfigured, scrubError } from "../_shared/email.ts";
import { type AccountLike, createSalesGate, type PriceLike } from "./sales.ts";
import { createCheckoutHandlers, fail, GENERIC_ERROR, json } from "./handlers.ts";

// Created on first use, so checkout_status still answers (closed) if the key is missing.
let stripeClient: Stripe | null = null;
function stripe(): Stripe {
  if (!stripeClient) stripeClient = getStripe();
  return stripeClient;
}

const sales = createSalesGate({
  env: (name) => Deno.env.get(name),
  emailConfigured,
  retrievePrice: () => stripe().prices.retrieve(PRICE_IDS.monthly, { expand: ["product"] }) as unknown as Promise<PriceLike>,
  retrieveAccount: () => stripe().accounts.retrieve() as unknown as Promise<AccountLike>,
});

const handlers = createCheckoutHandlers({ stripe, admin: createAdminClient, salesStatus: sales.status });

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  if (req.method !== "POST") return fail(405, "BAD_REQUEST", "Invalid request.");

  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "BAD_REQUEST", "Invalid request.");
  }
  const action = typeof body.action === "string" ? body.action : "";

  try {
    if (action === "checkout_status") {
      const status = await sales.status();
      if (!status.open) console.log(`checkout_status: closed (${status.reason})`);
      return json(200, { available: status.open });
    }

    let auth: { userId: string; email?: string };
    try {
      auth = await requireUser(req);
    } catch {
      return fail(401, "UNAUTHORIZED", "Please sign in and try again.");
    }

    switch (action) {
      case "create_subscription":
        return await handlers.handleCreateSubscription(req, body, auth);
      case "verify_session":
        return await handlers.handleVerifySession(body, auth);
      // Older one-time prices are no longer sold.
      case "create_one_time_payment":
      case "create_bundle_payment":
        return fail(400, "BAD_REQUEST", "One-time purchases are no longer offered. All court forms and filling instructions are free.");
      default:
        return fail(400, "BAD_REQUEST", "Invalid request.");
    }
  } catch (error) {
    console.error(
      `stripe-checkout ${action || "(no action)"} failed:`,
      scrubError(error instanceof Error ? error.message : String(error)),
    );
    return fail(500, "INTERNAL_ERROR", GENERIC_ERROR);
  }
});
