
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
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateGoalData {
  goal_type: string;
  target_value: number;
  current_value: number;
  period_start: string;
  period_end: string;
}

export const useUserGoals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const goalsQuery = useQuery({
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

  const createGoal = useMutation({
    mutationFn: async (goalData: CreateGoalData) => {
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
    },
  });

  const updateGoal = useMutation({
    mutationFn: async ({ goalId, updates }: { goalId: string; updates: Partial<UserGoal> }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_goals')
        .update(updates)
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-goals'] });
    },
  });

  const deleteGoal = useMutation({
    mutationFn: async (goalId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-goals'] });
    },
  });

  return {
    data: goalsQuery.data,
    isLoading: goalsQuery.isLoading,
    error: goalsQuery.error,
    createGoal,
    updateGoal,
    deleteGoal,
  };
};

// Hook separato per le statistiche degli obiettivi
export const useGoalStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['goal-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data: goals, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const total = goals.length;
      const completed = goals.filter(g => g.is_completed).length;
      const active = goals.filter(g => !g.is_completed && new Date(g.period_end) >= new Date()).length;
      const expired = goals.filter(g => !g.is_completed && new Date(g.period_end) < new Date()).length;
      
      return {
        total,
        completed,
        active,
        expired,
        completionRate: total > 0 ? (completed / total) * 100 : 0,
      };
    },
    enabled: !!user,
  });
};
