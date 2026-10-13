// Pure decisions the webhook makes, kept apart so tests can run them without Stripe.

import { CANCEL_COMMENT_DUPLICATE } from "../_shared/billingDisclosure.ts";

/** Oldest first (Stripe `created`, then id), so every caller keeps the same subscription. */
export function orderByAge<T extends { id: string; created: number }>(subscriptions: T[]): T[] {
  const unique = new Map<string, T>();
  for (const s of subscriptions) unique.set(s.id, s);
  return [...unique.values()].sort((a, b) => a.created - b.created || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/**
 * The owner can refund a charge without ending the plan by setting metadata keep_plan = "true" on
 * the charge, or on the refund when creating it through the API.
 */
export function keepPlanAfterRefund(
  chargeMetadata: Record<string, string> | null | undefined,
  refundMetadata: Array<Record<string, string> | null | undefined>,
): boolean {
  const yes = (m: Record<string, string> | null | undefined) => (m?.keep_plan ?? "").toLowerCase() === "true";
  return yes(chargeMetadata) || refundMetadata.some(yes);
}

/** True when one of the charge's refunds is a duplicate-plan refund made by resolveDuplicates. */
export function isDuplicateRefund(refundMetadata: Array<Record<string, string> | null | undefined>): boolean {
  return refundMetadata.some((m) => m?.reason === CANCEL_COMMENT_DUPLICATE);
}

export type RefundDecision =
  /** End the plan now: the most recent charge was fully refunded. */
  | "end"
  /** Part of the charge was refunded: the plan carries on. */
  | "partial"
  /** An earlier month's charge was refunded: the plan carries on. */
  | "older_charge"
  /** The owner asked to keep the plan (metadata keep_plan). */
  | "keep";

/**
 * Terms §7: "If we refund your most recent charge, your plan ends when we issue the refund unless
 * you ask us to keep it."
 */
export function refundDecision(input: {
  fullyRefunded: boolean;
  invoiceId: string;
  latestInvoiceId: string | null;
  keep: boolean;
}): RefundDecision {
  if (!input.fullyRefunded) return "partial";
  if (!input.latestInvoiceId || input.latestInvoiceId !== input.invoiceId) return "older_charge";
  if (input.keep) return "keep";
  return "end";
}
