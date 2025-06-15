
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserGoal {
  id: string;
  user_id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  period_start: string;
  period_end: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export const useUserGoals = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-goals', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserGoal[];
    },
    enabled: !!user,
  });
};

export const useActiveGoals = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['active-goals', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .lte('period_start', today)
        .gte('period_end', today);
      
      if (error) throw error;
      return data as UserGoal[];
    },
    enabled: !!user,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (goalData: {
      goal_type: string;
      target_value: number;
      period_start: string;
      period_end: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_goals')
        .insert({
          user_id: user.id,
          ...goalData,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-goals'] });
      queryClient.invalidateQueries({ queryKey: ['active-goals'] });
    },
  });
};

export const useUpdateGoalProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ goalId, currentValue }: { goalId: string; currentValue: number }) => {
      const { data, error } = await supabase
        .from('user_goals')
        .update({ 
          current_value: currentValue,
          is_completed: currentValue >= (await supabase
            .from('user_goals')
            .select('target_value')
            .eq('id', goalId)
            .single()
          ).data?.target_value,
          completed_at: currentValue >= (await supabase
            .from('user_goals')
            .select('target_value')
            .eq('id', goalId)
            .single()
          ).data?.target_value ? new Date().toISOString() : null
        })
        .eq('id', goalId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-goals'] });
      queryClient.invalidateQueries({ queryKey: ['active-goals'] });
    },
  });
};
