import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useAdminAccess } from './useAdminAccess';

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  subscription_status?: string;
  customer_id: string | null;
}

export function usePaywallAccess() {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminAccess();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setSubscriptionStatus(null);
      setLoading(false);
      return;
    }

    // Admins get free access - no need to check Stripe
    if (isAdmin) {
      setSubscriptionStatus({
        subscribed: true,
        subscription_tier: 'admin',
        subscription_end: null,
        customer_id: null,
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');

      if (error) {
        console.error('Error checking subscription via edge function:', error);
        // Fallback to database check
        await checkSubscriptionFromDB();
        return;
      }

      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Fallback to database check
      await checkSubscriptionFromDB();
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  // Fallback: Check subscription from database
  const checkSubscriptionFromDB = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .order('end_date', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setSubscriptionStatus({
          subscribed: true,
          subscription_tier: data[0].plan_type,
          subscription_end: data[0].end_date,
          customer_id: null,
        });
      } else {
        setSubscriptionStatus({
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          customer_id: null,
        });
      }
    } catch (error) {
      console.error('Error checking subscription from DB:', error);
      setSubscriptionStatus({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        customer_id: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roleLoading) {
      return;
    }

    checkSubscription();
  }, [user, isAdmin, roleLoading, checkSubscription]);

  // Refresh subscription status periodically (every 60 seconds)
  useEffect(() => {
    if (!user || isAdmin) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 60000);

    return () => clearInterval(interval);
  }, [user, isAdmin, checkSubscription]);

  const hasFormAccess = async (formType: string): Promise<boolean> => {
    // Admins get free access
    if (isAdmin) return true;
    
    // Users with active subscription get access
    if (subscriptionStatus?.subscribed) return true;

    // Check if user has paid for this specific form
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('form_payments')
        .select('*')
        .eq('user_id', user.id)
        .eq('form_type', formType)
        .eq('status', 'completed')
        .limit(1);

      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking form access:', error);
      return false;
    }
  };

  const hasActiveSubscription = subscriptionStatus?.subscribed || false;

  return {
    hasAccess: isAdmin || hasActiveSubscription,
    hasActiveSubscription,
    subscriptionTier: subscriptionStatus?.subscription_tier || null,
    subscriptionEnd: subscriptionStatus?.subscription_end || null,
    isAdmin,
    loading: loading || roleLoading,
    hasFormAccess,
    refreshAccess: checkSubscription,
  };
}
