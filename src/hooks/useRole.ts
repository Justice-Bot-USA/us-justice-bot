import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'moderator' | 'user' | 'attorney';

export function useRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching role:', error);
          setRole('user'); // Default to user role
        } else {
          setRole(data?.role || 'user');
        }
      } catch (err) {
        console.error('Error fetching role:', err);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  const isAdmin = role === 'admin';
  const isModerator = role === 'moderator';
  const hasAdminAccess = isAdmin || isModerator;
  const isAttorney = role === 'attorney';

  return {
    role,
    loading,
    isAdmin,
    isModerator,
    hasAdminAccess,
    isAttorney,
  };
}