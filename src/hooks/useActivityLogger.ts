import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export function useActivityLogger() {
  const { user } = useAuth();

  const logActivity = async (
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: user.id,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details: details || {},
          ip_address: null, // Would need server-side implementation
          user_agent: navigator.userAgent
        });
    } catch (error) {
      // Silently fail - don't block user actions if logging fails
      console.error('Error logging activity:', error);
    }
  };

  return { logActivity };
}