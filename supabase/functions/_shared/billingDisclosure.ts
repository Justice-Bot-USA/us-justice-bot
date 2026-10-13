// Server copy of the Toolkit plan's billing terms, for the billing edge functions.
//
// The block between BEGIN and END below is an identical copy of the constants in
// src/lib/billingDisclosure.ts (the single source the Pricing page, Terms, FAQ and payment page
// show). stripe-checkout refuses a purchase unless the SHA-256 of disclosureText() that the
// browser sends equals the hash of this copy, so the consent record proves what was on screen.
// Change both files together, bump DISCLOSURE_VERSION, and get counsel review first (Cal. Bus. &
// Prof. Code 17600-17606, N.Y. Gen. Bus. Law 527-a). A node check compares the two copies.
//
// Below END are server-only texts: the approved Stripe product description, the Checkout submit
// message and the billing emails. This file uses no Deno APIs (crypto.subtle only), so it also
// runs under Node for that check.

// ---- BEGIN SHARED BILLING TEXT (identical to src/lib/billingDisclosure.ts) ----
export const DISCLOSURE_VERSION = "toolkit-2026-10-v1";

export const TOOLKIT_PRICE_LABEL = "$25.00";

export const DISCLOSURE_HEADING = "Toolkit plan: $25.00 a month. Renews automatically until you cancel.";

export const DISCLOSURE_BULLETS: string[] = [
  "You pay $25.00 today. After that you are charged $25.00 every month, on the same day of the month as today (or the last day of a shorter month), until you cancel. There is no minimum term.",
  "What you get: the case binder PDF, hearing calendar and class tracker listed above. Court forms and guides stay free.",
  "To avoid the next charge, cancel before your next renewal date. Cancel any time online: sign in, open your account menu and choose Cancel subscription (or go to justicebot-usa.com/pricing). If you can't sign in, email billing@justicebot-usa.com from the address on your account.",
  "After you cancel you won't be charged again, and the plan stays active until the end of the monthly period you already paid for. Your files, calendar entries and class records are not deleted.",
  "Refunds: ask within 30 days of any charge, for any reason, at billing@justicebot-usa.com. We refund to the card you paid with. You can ask us for a written copy of this policy.",
  "$25.00 is the current price. If it ever changes, we will email you 10 to 30 days before, and we won't charge you a higher price unless you agree to it.",
];

export const CONSENT_AUTO_RENEW =
  "I agree that my Toolkit plan renews automatically and that Justice Bot USA will charge my payment method $25.00 every month until I cancel.";

export const CONSENT_TERMS = "I agree to the Terms of Service and have read the Privacy Policy.";

/** The exact text whose hash the client sends with a checkout request. */
export function disclosureText(): string {
  return [DISCLOSURE_HEADING, ...DISCLOSURE_BULLETS, CONSENT_AUTO_RENEW, CONSENT_TERMS].join("\n");
}

/** Shown next to the disclosure when the Spanish toggle is on, while billing terms are English-only. */
export const BILLING_TERMS_LANGUAGE_NOTE = "Los términos de facturación están en inglés. (Billing terms are in English.)";

export const CANCEL_DIALOG = {
  title: "Cancel your Toolkit plan?",
  body: (activeUntil: string) =>
    `You won't be charged again. Your plan stays active until ${activeUntil}, the end of the period you already paid for. After that you can still open, download and delete all your files, see your calendar dates and class records, and download your calendar file. You won't be able to add new calendar dates or class records, or make a new binder PDF, unless you subscribe again.`,
  confirm: "Yes, cancel my plan",
  keep: "Keep my plan",
};

export const AFTER_CANCEL_FAQ =
  "If you cancel, nothing is deleted. You can still open, download and delete your files, see and correct your calendar dates and class records, and download your calendar file. Making a binder PDF and adding new dates or class records need an active plan.";

export const DATES_ARE_YOURS =
  "Calendar dates and class details are only what you type in. Justice Bot USA does not calculate, check or suggest court dates or requirements, and calendar alerts depend on your calendar app.";

export const PRICE_CHANGE_TERMS =
  "If we change the Toolkit price or make another material change to the plan, we will email you at the address on your account no fewer than 10 and no more than 30 days before the change takes effect, with instructions for cancelling. We will not charge you a higher price unless you first agree to it. If you do not agree, your plan will end at the end of the period you already paid for and you will not be charged again. Continued use of the Service is never treated as agreement to a higher price or to changed Toolkit terms.";

export const GENERIC_PAYMENT_SUCCESS =
  "Thanks. If you just bought the Toolkit, sign in to see your plan details. Court forms and guides are always free.";

/** What the Toolkit includes, as stated on Pricing and in the FAQ. Every line must match the code. */
export const TOOLKIT_FEATURES: string[] = [
  "Case binder: one PDF of your PDF, JPG and PNG files, in the order you choose.",
  "Hearing calendar: keep the court dates you type in, and add them to your phone's calendar. Alerts come from your calendar app; some apps don't keep them, so check after adding.",
  "Class tracker: hours, dates and proof for classes you were ordered to take, as you type them in.",
];
// ---- END SHARED BILLING TEXT ----

// ---------------------------------------------------------------------------------------------
// Server-only text and helpers
// ---------------------------------------------------------------------------------------------

/** Lowercase hex SHA-256 of a UTF-8 string (Web Crypto, so it runs in Deno, Node 18+ and browsers). */
export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** SHA-256 of the disclosure text for DISCLOSURE_VERSION. */
export function disclosureSha256(): Promise<string> {
  return sha256Hex(disclosureText());
}

/**
 * True when the browser showed the current disclosure: the version is DISCLOSURE_VERSION and the
 * hash matches this copy's text. Only the current version is accepted.
 */
export async function isCurrentDisclosure(version: unknown, sha256: unknown): Promise<boolean> {
  if (version !== DISCLOSURE_VERSION || typeof sha256 !== "string") return false;
  return sha256.toLowerCase() === (await disclosureSha256());
}

export const SITE_URL = "https://justicebot-usa.com";
export const BILLING_EMAIL = "billing@justicebot-usa.com";

/** The plan as sold. stripe-checkout opens sales only if the Stripe price matches all of these. */
export const TOOLKIT_PRICE_CENTS = 2500;
export const TOOLKIT_CURRENCY = "usd";
export const TOOLKIT_INTERVAL = "month";

/** Stripe product name and description shown on Checkout and receipts (approved by counsel). */
export const TOOLKIT_PRODUCT_NAME = "Justice Bot USA Toolkit";
export const TOOLKIT_PRODUCT_DESCRIPTION =
  "Toolkit plan for Justice Bot USA: a case binder that puts your own PDF, JPG and PNG files into one PDF, a hearing calendar for dates you type in (you can add them to your phone's calendar), and a class tracker. $25.00 a month until you cancel. Legal information, not legal advice. Justice Bot USA is a service of Quorex Solutions, a trade name of Justice Bot Technologies Inc.";

/** Stripe account public business name required before sales open. */
export const STRIPE_BUSINESS_NAME = "Justice Bot USA";

/** Shown above the pay button on Stripe Checkout (custom_text.submit.message; Stripe markdown). */
export const CHECKOUT_SUBMIT_MESSAGE =
  "**$25.00 today, then $25.00 every month until you cancel.** No minimum term. Cancel any time at justicebot-usa.com/pricing (sign in, Cancel subscription) or email billing@justicebot-usa.com. To avoid the next charge, cancel before your next monthly renewal date. Refunds within 30 days of any charge: billing@justicebot-usa.com.";

/** Stored on the consent row so the record shows which Checkout text was on screen. */
export const CHECKOUT_CUSTOM_TEXT_VERSION = "toolkit-checkout-2026-10-v1";

const COMPANY_LINE =
  "Justice Bot USA is a service of Quorex Solutions, a trade name of Justice Bot Technologies Inc. Contact: billing@justicebot-usa.com.";

export interface BillingEmail {
  subject: string;
  text: string;
}

/**
 * Purchase acknowledgment (Cal. Bus. & Prof. Code 17602(a)(3), N.Y. Gen. Bus. Law 527-a(1)(c)).
 * Counsel's wording; dates are billing dates from Stripe, written out like "November 13, 2026".
 */
export function acknowledgmentEmail(dates: { startDate: string; nextChargeDate: string }): BillingEmail {
  return {
    subject: "Your Justice Bot USA Toolkit plan: $25.00 a month until you cancel",
    text: [
      `Your Toolkit plan started on ${dates.startDate}.`,
      `Price: $25.00 a month. Next charge: ${dates.nextChargeDate}, then the same day each month, until you cancel. No minimum term.`,
      `To stop the next charge, cancel before ${dates.nextChargeDate}.`,
      "Cancel online any time: sign in at https://justicebot-usa.com/pricing and choose Cancel subscription, or email billing@justicebot-usa.com from this address.",
      "When you cancel: no more charges; the plan stays active until the end of the period you paid for; your files, calendar entries and class records are not deleted.",
      "Refunds: ask within 30 days of any charge at billing@justicebot-usa.com.",
      "If the price ever changes we will email you 10 to 30 days before and won't charge a higher price unless you agree.",
      "Terms: https://justicebot-usa.com/terms.",
      COMPANY_LINE,
      "Legal information, not legal advice.",
    ].join("\n\n"),
  };
}

/** Annual reminder (Cal. Bus. & Prof. Code 17602(h)). Counsel's wording. */
export function annualReminderEmail(): BillingEmail {
  return {
    subject: "Reminder about your Justice Bot USA Toolkit plan",
    text: [
      "Reminder: your Justice Bot USA Toolkit plan costs $25.00 and renews every month until you cancel. Cancel any time at https://justicebot-usa.com/pricing or by emailing billing@justicebot-usa.com.",
      COMPANY_LINE,
    ].join("\n\n"),
  };
}

/** What a person keeps after the plan ends (same words as CANCEL_DIALOG, without "After that"). */
export const AFTER_PLAN_ENDS =
  "You can still open, download and delete all your files, see your calendar dates and class records, and download your calendar file. You won't be able to add new calendar dates or class records, or make a new binder PDF, unless you subscribe again.";

export type CancellationVariant =
  /** Cancelled with paid time left: active until the end of the period. */
  | { kind: "period_end"; activeUntil: string }
  /** Ended now (for example a failed renewal, or cancelled for the person by email). */
  | { kind: "ended" }
  /** Ended because we refunded the most recent charge. */
  | { kind: "refunded" }
  /**
   * Cancelled by delete-my-data because the person asked us to delete their account. Their files,
   * calendar entries and class records are deleted right after, so this text never says they are
   * kept (no AFTER_PLAN_ENDS, no "not deleted").
   */
  | { kind: "account_deleted" };

/**
 * Cancellation email when the plan was cancelled because the person asked us to delete their
 * account. Wording needs counsel sign-off (it states what happens to the person's data).
 */
function accountDeletedCancellationEmail(): BillingEmail {
  return {
    subject: "Your Justice Bot USA Toolkit plan is cancelled",
    text: [
      "Your Toolkit plan has been cancelled because you asked us to delete your account. You won't be charged again.",
      "We are deleting your account, your files, your calendar entries and your class records. We keep a record of your billing agreement as the law requires.",
      "Questions: billing@justicebot-usa.com.",
      "Justice Bot USA is a service of Quorex Solutions, a trade name of Justice Bot Technologies Inc.",
    ].join("\n\n"),
  };
}

/** Cancellation confirmation. Built from the approved cancel-dialog and disclosure sentences. */
export function cancellationEmail(variant: CancellationVariant): BillingEmail {
  if (variant.kind === "account_deleted") return accountDeletedCancellationEmail();
  const first =
    variant.kind === "period_end"
      ? `Your Justice Bot USA Toolkit plan is cancelled. ${CANCEL_DIALOG.body(variant.activeUntil)}`
      : variant.kind === "refunded"
        ? `Your Justice Bot USA Toolkit plan has ended because we refunded your most recent charge. You won't be charged again. ${AFTER_PLAN_ENDS}`
        : `Your Justice Bot USA Toolkit plan is cancelled and has ended. You won't be charged again. ${AFTER_PLAN_ENDS}`;
  return {
    subject: "Your Justice Bot USA Toolkit plan is cancelled",
    text: [
      first,
      "Your files, calendar entries and class records are not deleted.",
      "Refunds: ask within 30 days of any charge at billing@justicebot-usa.com.",
      COMPANY_LINE,
      "Legal information, not legal advice.",
    ].join("\n\n"),
  };
}

/** Stripe cancellation_details.comment values this app sets, so notices can tell them apart. */
export const CANCEL_COMMENT_DUPLICATE = "duplicate_subscription";
export const CANCEL_COMMENT_REFUNDED = "refunded_most_recent_charge";
/** Set by delete-my-data: the person asked us to delete their account. */
export const CANCEL_COMMENT_ACCOUNT_DELETED = "account_deleted";

/**
 * Which cancellation email fits a subscription that has already ended (Stripe status "canceled"),
 * from the cancellation_details.comment this app set when it cancelled it.
 */
export function endedCancellationVariant(comment: string | null | undefined): CancellationVariant {
  if (comment === CANCEL_COMMENT_REFUNDED) return { kind: "refunded" };
  if (comment === CANCEL_COMMENT_ACCOUNT_DELETED) return { kind: "account_deleted" };
  return { kind: "ended" };
}
