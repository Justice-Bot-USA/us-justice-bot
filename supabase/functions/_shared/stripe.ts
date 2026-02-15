import Stripe from "https://esm.sh/stripe@18.5.0";

// USA Live Price IDs (source of truth for server-side checkout creation)
// Single Form: $9.99 one-time, Monthly: $19.99/month, Bundle: $49.99 one-time
// FOIA Single: $9.99 one-time, FOIA Bundle: $29.99 one-time
export const PRICE_IDS = {
  per_form: "price_1SspQoPr9cYwQq3CUtFuCkxA",
  monthly: "price_1T10c4Pr9cYwQq3CJqfwzpqo",
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
