import { useToolkitAccess } from './useToolkitAccess';
import { useAdminAccess } from './useAdminAccess';

/**
 * Plan status for pages that only need a yes/no (Pricing). It reads the same source as the
 * Toolkit pages and the database's row-level security (rpc('my_toolkit_access') plus the person's
 * own subscriptions row), so every screen agrees. Court forms and guides are free, so nothing here
 * gates them; the database enforces the Toolkit rules (only new calendar dates, new class records
 * and the binder PDF need an active plan).
 */
export function usePaywallAccess() {
  const access = useToolkitAccess();
  const { isAdmin, loading: roleLoading } = useAdminAccess();

  const active = access.status === 'active';
  // A paid plan (an active subscriptions row), as opposed to admin access for testing.
  const hasActiveSubscription = active && Boolean(access.activeUntil);

  return {
    /** Toolkit features are open to this person (paid plan, or admin). */
    hasAccess: active,
    hasActiveSubscription,
    subscriptionTier: hasActiveSubscription ? 'monthly' : active && isAdmin ? 'admin' : null,
    /** ISO timestamp: end of the current paid period. */
    subscriptionEnd: hasActiveSubscription ? access.activeUntil ?? null : null,
    cancelAtPeriodEnd: Boolean(access.cancelAtPeriodEnd),
    /** The person has a subscriptions row of any status (show them how to cancel). */
    hasSubscriptionRow: Boolean(access.hasSubscriptionRow),
    isAdmin,
    loading: access.status === 'loading' || roleLoading,
    refreshAccess: access.refresh,
  };
}
