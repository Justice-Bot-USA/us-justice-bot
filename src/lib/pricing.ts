import { invokeAuthed } from '@/lib/supabaseInvoke';
import { trackBeginCheckout } from '@/hooks/useAnalytics';

/** The one public plan: unlimited access for a monthly fee (same model as Canada). */
export const PLAN = {
  name: 'Justice Bot USA Access',
  price: 25,
  priceLabel: '$25/month',
  cta: 'Subscribe — $25/month',
} as const;

/** Starts Stripe Checkout for the monthly plan and redirects the browser to it. */
export async function startSubscriptionCheckout(): Promise<void> {
  trackBeginCheckout(PLAN.price, 'US');
  const { data, error } = await invokeAuthed('stripe-checkout', {
    body: { action: 'create_subscription', planType: 'monthly' },
  });
  if (error) throw error;
  if (!data?.url) throw new Error('No checkout URL received');
  window.location.href = data.url;
}
