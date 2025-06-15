
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserPreferences {
  id: string;
  user_id: string;
  dashboard_layout: any;
  learning_preferences: any;
  notification_settings: any;
  theme_settings: any;
  personal_goals: any;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as UserPreferences | null;
    },
    enabled: !!user,
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (preferences: Partial<Omit<UserPreferences, 'id' | 'user_id'>>) => {
      if (!user) throw new Error('User not authenticated');
      
      // Se stiamo aggiornando informazioni del profilo, aggiorniamo anche la tabella profiles
      if (preferences.personal_goals?.firstName || preferences.personal_goals?.lastName || preferences.personal_goals?.fullName) {
        const fullName = preferences.personal_goals?.fullName || 
          `${preferences.personal_goals?.firstName || ''} ${preferences.personal_goals?.lastName || ''}`.trim();
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email || '',
            full_name: fullName,
            updated_at: new Date().toISOString(),
          });
        
        if (profileError) console.error('Error updating profile:', profileError);
      }
      
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};
