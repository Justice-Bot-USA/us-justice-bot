import Stripe from "https://esm.sh/stripe@18.5.0";

// USA Live Price IDs (source of truth for server-side checkout creation)
// The single public plan is the monthly subscription: $25/month ("Justice Bot USA
// Access", lookup key justicebot_usa_monthly_25). STRIPE_PRICE_MONTHLY can override it.
// The legacy $19.99/month price (price_1T10c4Pr9cYwQq3CJqfwzpqo) stays active in Stripe
// but is no longer offered.
// Legacy one-time prices (kept so older links and pending checkouts still work):
// Single Form $9.99, Bundle $49.99, FOIA Single $9.99, FOIA Bundle $29.99.
export const PRICE_IDS = {
  per_form: "price_1SspQoPr9cYwQq3CUtFuCkxA",
  monthly: Deno.env.get("STRIPE_PRICE_MONTHLY") || "price_1UOYQSPr9cYwQq3CbOAjTe6i",
  bundle: "price_1T10cbPr9cYwQq3CeyUUzrEM",
  foia_single: "price_1T14rWPr9cYwQq3C9Fak2Tbl",
  foia_bundle: "price_1T14rrPr9cYwQq3ChvtEOyuz",
} as const;

export function getStripe(): Stripe {
  const secretKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY not configured");

  return new Stripe(secretKey, {
    apiVersion: "2025-08-27.basil",
  });
}

/**
 * End of the current billing period, in Unix seconds. API 2025-03-31.basil and later moved
 * current_period_end from the subscription to its items; older payloads (e.g. webhooks sent
 * with an older endpoint version) still carry it on the subscription.
 */
export function subscriptionPeriodEnd(subscription: Stripe.Subscription): number {
  const legacy = (subscription as unknown as { current_period_end?: number }).current_period_end;
  return subscription.items?.data?.[0]?.current_period_end ?? legacy ?? Math.floor(Date.now() / 1000);
}

let validationPromise: Promise<void> | null = null;

/**
 * Hard “no more breakage” rule: fail fast if any configured price_... does not exist.
 * Memoized per cold start.
 */
export function validateStripePricesOnce(stripe: Stripe): Promise<void> {
  if (validationPromise) return validationPromise;

  validationPromise = (async () => {
    const ids = Object.values(PRICE_IDS);
    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          await stripe.prices.retrieve(id);
          return { id, ok: true as const };
        } catch (e) {
          return { id, ok: false as const, error: e };
        }
      })
    );

    const missing = results.filter((r) => !r.ok);
    if (missing.length > 0) {
      const missingIds = missing.map((m) => m.id).join(", ");
      console.error("❌ Stripe price validation failed. Missing prices:", missingIds);
      throw new Error(`Stripe price validation failed (missing): ${missingIds}`);
    }

    console.log("✅ Stripe price validation passed", { ids });
  })();

  return validationPromise;
}
