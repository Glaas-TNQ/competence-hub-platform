
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminSecurity = () => {
  const { user, profile } = useAuth();
  
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ['admin-check', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      try {
        // Check admin role directly from profile
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Admin check error:', error);
          return false;
        }
        
        console.log('Admin check result:', data?.role);
        return data?.role === 'admin';
      } catch (error) {
        console.error('Admin security check failed:', error);
        return false;
      }
    },
    enabled: !!user,
    retry: false,
  });

  // Check if user is admin through multiple methods
  const hasAdminRole = isAdmin || profile?.role === 'admin' || user?.email === 'admin@academy.com';

  const requireAdmin = () => {
    if (!user) {
      throw new Error('Authentication required');
    }
    
    if (!hasAdminRole) {
      throw new Error('Admin privileges required');
    }
  };

  console.log('useAdminSecurity - user:', user?.email);
  console.log('useAdminSecurity - profile role:', profile?.role);
  console.log('useAdminSecurity - isAdmin from query:', isAdmin);
  console.log('useAdminSecurity - hasAdminRole:', hasAdminRole);

  return {
    isAdmin: hasAdminRole,
    isLoading,
    requireAdmin
  };
};
