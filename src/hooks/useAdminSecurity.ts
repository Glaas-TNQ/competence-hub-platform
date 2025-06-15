
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
        
        return data?.role === 'admin';
      } catch (error) {
        console.error('Admin security check failed:', error);
        return false;
      }
    },
    enabled: !!user,
    retry: false,
  });

  const requireAdmin = () => {
    if (!user) {
      throw new Error('Authentication required');
    }
    
    if (!isAdmin && profile?.role !== 'admin') {
      throw new Error('Admin privileges required');
    }
  };

  return {
    isAdmin: isAdmin || profile?.role === 'admin',
    isLoading,
    requireAdmin
  };
};
