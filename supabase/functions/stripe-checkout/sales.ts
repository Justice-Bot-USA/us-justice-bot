// Whether the Toolkit plan is open for new purchases. Sales stay closed unless every check passes:
//   1. TOOLKIT_SALES_ENABLED is exactly "true" (an owner step after the launch checklist),
//   2. billing email is configured (RESEND_API_KEY and BILLING_FROM_EMAIL), so the acknowledgment
//      and annual reminder can be sent,
//   3. the Stripe price is the $25.00 monthly price, and its product has the approved name and
//      description (what Checkout and receipts show),
//   4. the Stripe account's public business name is "Justice Bot USA".
//
// The answer never throws. Stripe results are cached for 10 minutes; a failed Stripe check (network,
// or a restricted key without permission) counts as closed and is re-checked after a minute. A
// rejected promise is never kept, so one bad moment cannot close checkout_status or verify_session
// for the life of the instance.
//
// No remote imports here, so tests can run it with a fake Stripe.

import {
  STRIPE_BUSINESS_NAME,
  TOOLKIT_CURRENCY,
  TOOLKIT_INTERVAL,
  TOOLKIT_PRICE_CENTS,
  TOOLKIT_PRODUCT_DESCRIPTION,
  TOOLKIT_PRODUCT_NAME,
} from "../_shared/billingDisclosure.ts";

export type SalesReason =
  | "open"
  | "flag_off"
  | "email_not_configured"
  | "price_mismatch"
  | "product_name"
  | "product_description"
  | "business_name"
  | "stripe_error";

export interface SalesStatus {
  open: boolean;
  reason: SalesReason;
}

/** The parts of a Stripe price (with its product expanded) the check reads. */
export interface PriceLike {
  active?: boolean;
  currency?: string;
  unit_amount?: number | null;
  recurring?: { interval?: string; interval_count?: number } | null;
  product?: string | { deleted?: boolean; active?: boolean; name?: string; description?: string | null } | null;
}

export interface AccountLike {
  business_profile?: { name?: string | null } | null;
}

export interface SalesGateDeps {
  env: (name: string) => string | undefined;
  emailConfigured: () => boolean;
  /** stripe.prices.retrieve(priceId, { expand: ['product'] }) */
  retrievePrice: () => Promise<PriceLike>;
  /** stripe.accounts.retrieve() */
  retrieveAccount: () => Promise<AccountLike>;
  now?: () => number;
  /** How long a Stripe answer is kept. Default 10 minutes. */
  ttlMs?: number;
  /** How long a failed Stripe check is kept before trying again. Default 1 minute. */
  failureTtlMs?: number;
}

/** Checks the Stripe price, product and account. Never throws. */
export async function checkStripeSetup(deps: Pick<SalesGateDeps, "retrievePrice" | "retrieveAccount">): Promise<SalesStatus> {
  try {
    const price = await deps.retrievePrice();
    if (
      price.active === false ||
      price.currency !== TOOLKIT_CURRENCY ||
      price.unit_amount !== TOOLKIT_PRICE_CENTS ||
      price.recurring?.interval !== TOOLKIT_INTERVAL ||
      (price.recurring?.interval_count ?? 1) !== 1
    ) {
      return { open: false, reason: "price_mismatch" };
    }
    const product = price.product;
    if (!product || typeof product === "string" || product.deleted || product.active === false) {
      return { open: false, reason: "price_mismatch" };
    }
    if (product.name !== TOOLKIT_PRODUCT_NAME) return { open: false, reason: "product_name" };
    if ((product.description ?? "").trim() !== TOOLKIT_PRODUCT_DESCRIPTION) {
      return { open: false, reason: "product_description" };
    }
    const account = await deps.retrieveAccount();
    if ((account.business_profile?.name ?? "").trim() !== STRIPE_BUSINESS_NAME) {
      return { open: false, reason: "business_name" };
    }
    return { open: true, reason: "open" };
  } catch (error) {
    console.error("Toolkit sales check could not reach Stripe:", error instanceof Error ? error.message : String(error));
    return { open: false, reason: "stripe_error" };
  }
}

/** A cached sales gate. status() never throws. */
export function createSalesGate(deps: SalesGateDeps) {
  const ttl = deps.ttlMs ?? 10 * 60 * 1000;
  const failureTtl = deps.failureTtlMs ?? 60 * 1000;
  const now = deps.now ?? (() => Date.now());
  let cached: { value: SalesStatus; expires: number } | null = null;
  let inflight: Promise<SalesStatus> | null = null;

  function status(): Promise<SalesStatus> {
    try {
      if (deps.env("TOOLKIT_SALES_ENABLED") !== "true") return Promise.resolve({ open: false, reason: "flag_off" });
      if (!deps.emailConfigured()) return Promise.resolve({ open: false, reason: "email_not_configured" });
    } catch {
      return Promise.resolve({ open: false, reason: "flag_off" });
    }

    if (cached && cached.expires > now()) return Promise.resolve(cached.value);
    if (!inflight) {
      inflight = checkStripeSetup(deps)
        .then((value) => {
          cached = { value, expires: now() + (value.reason === "stripe_error" ? failureTtl : ttl) };
          return value;
        })
        .finally(() => {
          inflight = null;
        });
    }
    return inflight;
  }

  return {
    status,
    /** Forgets the cached Stripe answer (tests). */
    reset() {
      cached = null;
      inflight = null;
    },
  };
}
