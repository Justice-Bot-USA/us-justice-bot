// stripe-checkout's create_subscription and verify_session handlers, kept apart from index.ts (which
// parses the request, checks sign-in and serves) so tests can run them with fakes.

import Stripe from "https://esm.sh/stripe@18.5.0";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.4";
import { corsHeaders } from "../_shared/auth.ts";
import { PRICE_IDS, subscriptionPeriodEnd } from "../_shared/stripe.ts";
import { cleanTimeZone, scrubError } from "../_shared/email.ts";
import {
  BILLING_EMAIL,
  CANCEL_COMMENT_DUPLICATE,
  CHECKOUT_CUSTOM_TEXT_VERSION,
  CHECKOUT_SUBMIT_MESSAGE,
  SITE_URL,
  TOOLKIT_INTERVAL,
  TOOLKIT_PRICE_CENTS,
} from "../_shared/billingDisclosure.ts";
import {
  APP_TAG,
  findUserSubscriptions,
  isToolkitSubscription,
  isUuid,
  LIVE_STATUSES,
  rowStatus,
  saveSubscriptionRow,
  sendAcknowledgment,
  subscriptionCustomerId,
} from "../stripe-webhook/toolkitSubscriptions.ts";
import type { SalesStatus } from "./sales.ts";
import { checkConsent } from "./consent.ts";

type Admin = SupabaseClient;

export const GENERIC_ERROR = `Something went wrong, and you haven't been charged. Please try again, or email ${BILLING_EMAIL}.`;

/** Checkout returns only to our own site, never to an address taken from the request. */
function siteBase(req: Request): string {
  const allowed = new Set([
    SITE_URL,
    "https://www.justicebot-usa.com",
    ...(Deno.env.get("CHECKOUT_ALLOWED_ORIGINS") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => /^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(s)),
  ]);
  const origin = req.headers.get("origin") ?? "";
  return allowed.has(origin) ? origin : SITE_URL;
}

export function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function fail(status: number, code: string, message: string): Response {
  return json(status, { error: message, code });
}

function iso(unixSeconds: number | null | undefined): string | null {
  return unixSeconds ? new Date(unixSeconds * 1000).toISOString() : null;
}

function cleanLocale(value: unknown): string | null {
  return typeof value === "string" && value.length <= 35 && /^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(value) ? value : null;
}

export interface CheckoutDeps {
  /** The Stripe client (created on first use). */
  stripe: () => Stripe;
  /** The service-role database client. */
  admin: () => Admin;
  /** The sales gate (sales.ts). */
  salesStatus: () => Promise<SalesStatus>;
}

export function createCheckoutHandlers(deps: CheckoutDeps) {
  const stripe = deps.stripe;

  /**
   * The person's Stripe customer: one we stored for them, one stamped with their user id, or one
   * with their email address that no other account has claimed. Otherwise a new one.
   */
  async function getOrCreateCustomer(admin: Admin, userId: string, email: string): Promise<string> {
    const stored = new Set<string>();
    const [subRows, consentRows] = await Promise.all([
      admin.from("subscriptions").select("stripe_customer_id").eq("user_id", userId).not("stripe_customer_id", "is", null),
      admin
        .from("billing_consents")
        .select("stripe_customer_id")
        .eq("user_id", userId)
        .not("stripe_customer_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);
    for (const row of [...(subRows.data ?? []), ...(consentRows.data ?? [])]) {
      if (typeof row.stripe_customer_id === "string") stored.add(row.stripe_customer_id);
    }
    for (const id of stored) {
      try {
        const customer = await stripe().customers.retrieve(id);
        if ("deleted" in customer && customer.deleted) continue;
        const owner = (customer as Stripe.Customer).metadata?.user_id;
        if (!owner || owner === userId) return customer.id;
      } catch (error) {
        if ((error as { code?: string })?.code !== "resource_missing") throw error;
      }
    }

    try {
      const found = await stripe().customers.search({ query: `metadata['user_id']:'${userId}'`, limit: 1 });
      if (found.data[0]) return found.data[0].id;
    } catch (error) {
      console.error("Stripe customer search failed:", scrubError(String(error)));
    }

    const byEmail = await stripe().customers.list({ email, limit: 10 });
    const match = (byEmail.data as Stripe.Customer[]).find((c) => !c.metadata?.user_id || c.metadata.user_id === userId);
    if (match) return match.id;

    const created = await stripe().customers.create({ email, metadata: { user_id: userId }, preferred_locales: ["en"] });
    return created.id;
  }

  async function handleCreateSubscription(
    req: Request,
    body: Record<string, unknown>,
    auth: { userId: string; email?: string },
  ): Promise<Response> {
    // 1. Closed: refuse before recording anything.
    const status = await deps.salesStatus();
    if (!status.open) {
      console.log(`create_subscription refused, sales closed: ${status.reason}`);
      return fail(409, "PLAN_PAUSED", "The Toolkit plan isn't available to buy right now. You haven't been charged.");
    }

    // 2. Consent: both boxes, current terms, matching hash.
    const consent = await checkConsent(body);
    if (!consent.ok) {
      return consent.problem === "consent_missing"
        ? fail(400, "CONSENT_REQUIRED", "Please tick both boxes to agree to the plan terms.")
        : fail(400, "DISCLOSURE_OUTDATED", "This page is out of date. Reload it to see the current terms, then try again.");
    }
    if (!auth.email) {
      return fail(400, "EMAIL_REQUIRED", `Your account needs an email address for billing notices. Email ${BILLING_EMAIL} for help.`);
    }

    // 3. One plan per person.
    const admin = deps.admin();
    const existing = await findUserSubscriptions(admin, stripe(), auth.userId, { alwaysSearch: true });
    if (existing.some((s) => LIVE_STATUSES.includes(s.status))) {
      return fail(409, "ALREADY_SUBSCRIBED", "You already have the Toolkit plan, so you haven't been charged again.");
    }

    // 4. Record consent (kept at least 3 years; see the migration).
    const timeZone = cleanTimeZone(body.timeZone);
    const { data: consentRow, error: consentError } = await admin
      .from("billing_consents")
      .insert({
        user_id: auth.userId,
        email: auth.email,
        disclosure_version: consent.version,
        disclosure_sha256: consent.sha256,
        checkout_custom_text_version: CHECKOUT_CUSTOM_TEXT_VERSION,
        price_id: PRICE_IDS.monthly,
        amount_cents: TOOLKIT_PRICE_CENTS,
        interval: TOOLKIT_INTERVAL,
        auto_renew_consent: true,
        tos_consent: true,
        notice_channel: "email",
        locale: cleanLocale(body.locale),
        user_agent: (req.headers.get("user-agent") ?? "").slice(0, 500) || null,
      })
      .select("id")
      .single();
    if (consentError || !consentRow) throw new Error(`Could not record consent: ${consentError?.message ?? "no row"}`);
    const consentId = String(consentRow.id);

    // 5. Checkout session.
    const customerId = await getOrCreateCustomer(admin, auth.userId, auth.email);
    const base = siteBase(req);
    const metadata: Record<string, string> = {
      user_id: auth.userId,
      app: APP_TAG,
      plan: "toolkit",
      access_type: "monthly",
      consent_id: consentId,
      disclosure_version: consent.version,
      ...(timeZone ? { tz: timeZone } : {}),
    };
    const session = await stripe().checkout.sessions.create(
      {
        mode: "subscription",
        customer: customerId,
        client_reference_id: auth.userId,
        line_items: [{ price: PRICE_IDS.monthly, quantity: 1 }],
        // Card only: other methods can finish later, and the plan terms promise a charge today.
        payment_method_types: ["card"],
        // The submit message and the plan terms are in English.
        locale: "en",
        custom_text: { submit: { message: CHECKOUT_SUBMIT_MESSAGE } },
        success_url: `${base}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/pricing?checkout=cancelled`,
        metadata,
        // Session metadata is not copied to the subscription; the webhook, cancel-subscription and
        // billing-notices read these from the subscription itself.
        subscription_data: { metadata },
      },
      { idempotencyKey: `toolkit-checkout-${consentId}` },
    );

    // 6. Link the consent row to the session.
    const { error: linkError } = await admin
      .from("billing_consents")
      .update({ checkout_session_id: session.id, stripe_customer_id: customerId })
      .eq("id", consentId);
    if (linkError) console.error(`Could not store the session on consent ${consentId}: ${linkError.message}`);

    console.log(`Toolkit checkout session created: ${session.id} (consent ${consentId})`);
    return json(200, { url: session.url, sessionId: session.id });
  }

  async function handleVerifySession(body: Record<string, unknown>, auth: { userId: string; email?: string }): Promise<Response> {
    const sessionId = typeof body.sessionId === "string" && /^cs_[A-Za-z0-9_]{8,250}$/.test(body.sessionId) ? body.sessionId : null;
    if (!sessionId) return fail(400, "BAD_REQUEST", "Invalid request.");

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe().checkout.sessions.retrieve(sessionId);
    } catch (error) {
      if ((error as { code?: string })?.code === "resource_missing") return fail(404, "NOT_FOUND", "We couldn't find that payment.");
      throw error;
    }

    // The session must have been created for this account.
    if (!session.metadata?.user_id || session.metadata.user_id !== auth.userId) {
      return fail(403, "FORBIDDEN", "This payment isn't linked to the account you're signed in with.");
    }
    if (session.mode !== "subscription") return fail(400, "BAD_REQUEST", "Invalid request.");
    if (session.payment_status !== "paid" || !session.subscription) return json(200, { success: false, status: "processing" });

    const admin = deps.admin();
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
    const subscription = await stripe().subscriptions.retrieve(subscriptionId);
    await saveSubscriptionRow(admin, auth.userId, subscription);

    const consentId = session.metadata?.consent_id;
    if (isUuid(consentId)) {
      const { error } = await admin
        .from("billing_consents")
        .update({
          subscription_id: subscription.id,
          stripe_customer_id: subscriptionCustomerId(subscription),
          checkout_session_id: session.id,
        })
        .eq("id", consentId)
        .eq("user_id", auth.userId);
      if (error) console.error(`Could not link consent ${consentId}: ${error.message}`);
    }

    const readAck = async (): Promise<string | null> => {
      const { data } = await admin
        .from("billing_notices")
        .select("status")
        .eq("subscription_id", subscription.id)
        .eq("kind", "acknowledgment")
        .is("reminder_year", null)
        .maybeSingle();
      return (data?.status as string | undefined) ?? null;
    };

    // The webhook normally sends the acknowledgment. If it has not yet, send it now, unless an older
    // live plan exists (then the webhook cancels and refunds this duplicate instead).
    let ackStatus = await readAck();
    let duplicate = subscription.cancellation_details?.comment === CANCEL_COMMENT_DUPLICATE;
    if (!ackStatus && !duplicate && LIVE_STATUSES.includes(subscription.status)) {
      const others = (await findUserSubscriptions(admin, stripe(), auth.userId)).filter(
        (s) => s.id !== subscription.id && LIVE_STATUSES.includes(s.status) && isToolkitSubscription(s) && s.created <= subscription.created,
      );
      if (others.length === 0) {
        await sendAcknowledgment(admin, subscription, auth.userId);
        ackStatus = await readAck();
      } else {
        duplicate = true;
      }
    }

    const price = subscription.items?.data?.[0]?.price;
    return json(200, {
      success: true,
      type: "subscription",
      plan: {
        name: "Toolkit",
        amountCents: price?.unit_amount ?? null,
        currency: price?.currency ?? null,
        interval: price?.recurring?.interval ?? null,
        status: rowStatus(subscription),
        startedAt: iso(subscription.start_date),
        currentPeriodEnd: iso(subscriptionPeriodEnd(subscription)),
        cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
      },
      // Where billing notices go: the account's sign-in email.
      email: auth.email ?? null,
      ackStatus,
      // An older Toolkit plan is running: stripe-webhook cancels and refunds this one (or already has).
      duplicate,
    });
  }

  return { handleCreateSubscription, handleVerifySession };
}
