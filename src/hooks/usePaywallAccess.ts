import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useAdminAccess } from './useAdminAccess';

export function usePaywallAccess() {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminAccess();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || roleLoading) {
      setLoading(roleLoading);
      return;
    }

    // Admins get free access
    if (isAdmin) {
      setHasActiveSubscription(true);
      setLoading(false);
      return;
    }

    checkSubscription();
  }, [user, isAdmin, roleLoading]);

  const checkSubscription = async () => {
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

      setHasActiveSubscription((data && data.length > 0) || false);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setHasActiveSubscription(false);
    } finally {
      setLoading(false);
    }
  };

  const hasFormAccess = async (formType: string): Promise<boolean> => {
    // Admins get free access
    if (isAdmin) return true;
    
    // Users with active subscription get access
    if (hasActiveSubscription) return true;

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

  return {
    hasAccess: isAdmin || hasActiveSubscription,
    hasActiveSubscription,
    isAdmin,
    loading,
    hasFormAccess,
    refreshAccess: checkSubscription,
  };
}
