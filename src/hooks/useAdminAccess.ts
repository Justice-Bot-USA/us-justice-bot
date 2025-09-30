import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'moderator' | 'user';

export function useAdminAccess() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    fetchUserRole();
  }, [user]);

  const fetchUserRole = async () => {
    try {
      console.log('Fetching user role for user:', user?.id);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      console.log('User roles query result:', { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role:', error);
        setUserRole('user');
      } else {
        // If user has multiple roles, prioritize admin > moderator > user
        const roles = data || [];
        console.log('Processing roles:', roles);
        if (roles.some(r => r.role === 'admin')) {
          console.log('Setting user as admin');
          setUserRole('admin');
        } else if (roles.some(r => r.role === 'moderator')) {
          console.log('Setting user as moderator');
          setUserRole('moderator');
        } else {
          console.log('Setting user as regular user');
          setUserRole('user');
        }
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      setUserRole('user');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || userRole === 'admin';

  return {
    userRole,
    isAdmin,
    isModerator,
    loading,
    refreshRole: fetchUserRole,
  };
}