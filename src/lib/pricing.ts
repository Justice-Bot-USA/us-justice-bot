import { invokeAuthed } from '@/lib/supabaseInvoke';
import { trackBeginCheckout } from '@/hooks/useAnalytics';

/** The monthly plan. PAUSED for new purchases: every court form, form guide and the public records
 *  letter PDF are free, so the plan gates nothing. It returns as the "Toolkit" plan once the case
 *  binder, hearing calendar with reminders and course tracker exist. No form or case flow sells it. */
export const PLAN = {
  name: 'Justice Bot USA Access',
  price: 25,
  priceLabel: '$25/month',
  cta: 'Subscribe — $25/month',
} as const;

/** Shown next to forms and guides: they are free, but courts and agencies set their own fees. */
export const THIRD_PARTY_FEES_NOTE =
  'Our court forms and guides are free. Courts and government agencies may charge their own fees, ' +
  'such as filing fees, service fees, or copy fees for public records. We tell you about those fees ' +
  "wherever we know them. If you can't afford court fees, you may qualify for a fee waiver, and our fee waiver forms are free too.";

/** Starts Stripe Checkout for the monthly plan and redirects the browser to it.
 *  Not called anywhere while the plan is paused; kept for the Toolkit plan. */
export async function startSubscriptionCheckout(): Promise<void> {
  trackBeginCheckout(PLAN.price, 'US');
  const { data, error } = await invokeAuthed('stripe-checkout', {
    body: { action: 'create_subscription', planType: 'monthly' },
  });
  if (error) throw error;
  if (!data?.url) throw new Error('No checkout URL received');
  window.location.href = data.url;
}
