// The single source of the Toolkit plan's billing terms. The Pricing disclosure box, Terms §7,
// the FAQ, the payment confirmation page and the billing emails all use this text word for word,
// so what a person agrees to is exactly what every other page says.
//
// supabase/functions/_shared/billingDisclosure.ts must hold an identical copy (the checkout
// function checks a hash of the text the person saw against it). Change both together, bump
// DISCLOSURE_VERSION, and get counsel review first: California Bus. & Prof. Code 17600-17606 and
// New York GBL 527-a govern this wording. No trials, promo codes, discounts or annual prices
// without a new review.

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
