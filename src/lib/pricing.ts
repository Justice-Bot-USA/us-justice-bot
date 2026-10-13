import { supabase } from '@/integrations/supabase/client';
import { invokeAuthed } from '@/lib/supabaseInvoke';
import { trackBeginCheckout } from '@/hooks/useAnalytics';
import { DISCLOSURE_VERSION, TOOLKIT_PRICE_LABEL, disclosureText } from '@/lib/billingDisclosure';

/**
 * The Toolkit plan: $25.00 a month until you cancel. Its terms live in src/lib/billingDisclosure.ts
 * (the only source of billing wording). Sales are closed until the owner turns them on; ask
 * fetchCheckoutAvailable() before offering the checkboxes and Subscribe button.
 */
export const PLAN = {
  name: 'Toolkit',
  price: 25,
  priceLabel: `${TOOLKIT_PRICE_LABEL} a month`,
  cta: `Subscribe — ${TOOLKIT_PRICE_LABEL} a month`,
} as const;

/** Shown next to forms and guides: they are free, but courts and agencies set their own fees. */
export const THIRD_PARTY_FEES_NOTE =
  'Our court forms and guides are free. Courts and government agencies may charge their own fees, ' +
  'such as filing fees, service fees, or copy fees for public records. We tell you about those fees ' +
  "wherever we know them. If you can't afford court fees, you may qualify for a fee waiver, and our fee waiver forms are free too.";

export const BILLING_EMAIL = 'billing@justicebot-usa.com';

/** A prefilled email that cancels the plan for someone who can't sign in (the offline route). */
export const CANCEL_BY_EMAIL_HREF =
  `mailto:${BILLING_EMAIL}?subject=${encodeURIComponent('Cancel my Toolkit plan')}` +
  `&body=${encodeURIComponent('Please cancel my Justice Bot USA Toolkit plan. I am writing from the email address on my account.')}`;

/** Lowercase hex SHA-256 of a UTF-8 string (Web Crypto; the server checks the same hash). */
export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** SHA-256 of exactly the disclosure text the Pricing page shows. */
export function disclosureSha256(): Promise<string> {
  return sha256Hex(disclosureText());
}

/** Error codes stripe-checkout and the other billing functions send back. */
export type BillingErrorCode =
  | 'PLAN_PAUSED'
  | 'ALREADY_SUBSCRIBED'
  | 'CONSENT_REQUIRED'
  | 'DISCLOSURE_OUTDATED'
  | 'EMAIL_REQUIRED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'UNKNOWN';

export class BillingError extends Error {
  readonly code: BillingErrorCode;
  constructor(code: BillingErrorCode, message: string) {
    super(message);
    this.name = 'BillingError';
    this.code = code;
  }
}

const KNOWN_CODES: BillingErrorCode[] = [
  'PLAN_PAUSED',
  'ALREADY_SUBSCRIBED',
  'CONSENT_REQUIRED',
  'DISCLOSURE_OUTDATED',
  'EMAIL_REQUIRED',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
];

/** Turns a functions.invoke error into a BillingError with the server's code and message. */
async function toBillingError(error: unknown): Promise<BillingError> {
  const context = (error as { context?: unknown } | null)?.context;
  if (context instanceof Response) {
    try {
      const body = (await context.clone().json()) as { code?: string; error?: string };
      const code = KNOWN_CODES.find((c) => c === body.code) ?? 'UNKNOWN';
      return new BillingError(code, typeof body.error === 'string' ? body.error : '');
    } catch {
      // fall through
    }
  }
  if (error instanceof Error && /not authenticated/i.test(error.message)) return new BillingError('UNAUTHORIZED', '');
  return new BillingError('UNKNOWN', '');
}

/** React Query key for fetchCheckoutAvailable(); shared by Pricing and every Toolkit call to action. */
export const CHECKOUT_STATUS_KEY = ['checkout-status'] as const;

/**
 * Whether the Toolkit can be bought right now (stripe-checkout checkout_status). Never throws:
 * any problem counts as not available, so the page shows "Coming soon" and no checkboxes.
 */
export async function fetchCheckoutAvailable(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke<{ available?: boolean }>('stripe-checkout', {
      body: { action: 'checkout_status' },
    });
    return !error && data?.available === true;
  } catch {
    return false;
  }
}

/**
 * Records the person's consent and sends them to Stripe Checkout. Sends both checkbox values, the
 * disclosure version and the SHA-256 of the disclosure text shown. Throws BillingError.
 */
export async function startSubscriptionCheckout(consent: { autoRenewConsent: boolean; tosConsent: boolean }): Promise<void> {
  let timeZone: string | undefined;
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    timeZone = undefined;
  }
  const body = {
    action: 'create_subscription',
    autoRenewConsent: consent.autoRenewConsent,
    tosConsent: consent.tosConsent,
    disclosureVersion: DISCLOSURE_VERSION,
    disclosureSha256: await disclosureSha256(),
    timeZone,
    locale: typeof navigator !== 'undefined' ? navigator.language : undefined,
  };

  let url: string | undefined;
  try {
    const result = await invokeAuthed<{ url?: string }>('stripe-checkout', { body });
    if (result.error) throw result.error;
    url = result.data?.url;
  } catch (error) {
    throw await toBillingError(error);
  }
  if (!url || !url.startsWith('https://')) throw new BillingError('UNKNOWN', '');
  trackBeginCheckout(PLAN.price, 'US');
  window.location.assign(url);
}

export type AckStatus = 'queued' | 'sending' | 'sent' | 'failed' | null;

export interface VerifiedPlan {
  name: string;
  amountCents: number | null;
  currency: string | null;
  interval: string | null;
  status: 'active' | 'cancelled' | 'expired';
  /** ISO timestamps from Stripe. */
  startedAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export type VerifyResult =
  | { kind: 'verified'; plan: VerifiedPlan; email: string | null; ackStatus: AckStatus; duplicate: boolean }
  | { kind: 'processing' }
  | { kind: 'error'; code: BillingErrorCode };

/** Checks a finished Checkout session for /payment-success. Never throws. */
export async function verifyCheckoutSession(sessionId: string): Promise<VerifyResult> {
  try {
    const { data, error } = await invokeAuthed<{
      success?: boolean;
      status?: string;
      plan?: VerifiedPlan;
      email?: string | null;
      ackStatus?: AckStatus;
      duplicate?: boolean;
    }>('stripe-checkout', { body: { action: 'verify_session', sessionId } });
    if (error) return { kind: 'error', code: (await toBillingError(error)).code };
    if (data?.success && data.plan) {
      return {
        kind: 'verified',
        plan: data.plan,
        email: data.email ?? null,
        ackStatus: data.ackStatus ?? null,
        duplicate: data.duplicate === true,
      };
    }
    if (data?.status === 'processing') return { kind: 'processing' };
    return { kind: 'error', code: 'UNKNOWN' };
  } catch (error) {
    return { kind: 'error', code: (await toBillingError(error)).code };
  }
}

export interface CancelResult {
  /** ISO timestamp when the plan stops, or null if it ended now (for example a failed renewal). */
  accessUntil: string | null;
  confirmationEmail: 'sent' | 'not_sent';
}

/** Cancels the signed-in person's plan (cancel-subscription). Throws BillingError. */
export async function cancelToolkitPlan(): Promise<CancelResult> {
  let data: { access_until?: string | null; confirmation_email?: string } | null;
  try {
    const result = await invokeAuthed<{ access_until?: string | null; confirmation_email?: string }>('cancel-subscription', {
      body: {},
    });
    if (result.error) throw result.error;
    data = result.data;
  } catch (error) {
    throw await toBillingError(error);
  }
  return {
    accessUntil: data?.access_until ?? null,
    confirmationEmail: data?.confirmation_email === 'sent' ? 'sent' : 'not_sent',
  };
}

export interface LiveBillingStatus {
  subscribed: boolean;
  subscriptionEnd: string | null;
  cancelAtPeriodEnd: boolean;
  /** A renewal payment failed: no access, but Stripe may retry the charge until it is cancelled. */
  cancellable: boolean;
}

/** The plan's live Stripe status (check-subscription). Throws if the check fails. */
export async function fetchLiveBillingStatus(): Promise<LiveBillingStatus> {
  const { data, error } = await invokeAuthed<{
    subscribed?: boolean;
    subscription_end?: string | null;
    cancel_at_period_end?: boolean;
    cancellable?: boolean;
  }>('check-subscription');
  if (error) throw error;
  return {
    subscribed: Boolean(data?.subscribed),
    subscriptionEnd: data?.subscription_end ?? null,
    cancelAtPeriodEnd: Boolean(data?.cancel_at_period_end),
    cancellable: Boolean(data?.cancellable),
  };
}

/** "$25.00 a month" from a subscriptions row amount (dollars), or the plan price. */
export function monthlyPriceLabel(amount: number | null | undefined): string {
  if (typeof amount === 'number' && Number.isFinite(amount) && amount > 0) return `$${amount.toFixed(2)} a month`;
  return PLAN.priceLabel;
}
