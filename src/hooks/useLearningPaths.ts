
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useLearningPaths = () => {
  return useQuery({
    queryKey: ['learning-paths'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useLearningPath = (id: string) => {
  return useQuery({
    queryKey: ['learning-path', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useLearningPathProgress = (pathId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['learning-path-progress', pathId, user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('learning_path_progress')
        .select('*')
        .eq('learning_path_id', pathId)
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user && !!pathId,
  });
};

export const useCreateLearningPath = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pathData: any) => {
      const { data, error } = await supabase
        .from('learning_paths')
        .insert([pathData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
    },
  });
};

export const useUpdateLearningPath = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('learning_paths')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
    },
  });
};

export const useUpdateLearningPathProgress = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ pathId, completedCourseIds, progressPercentage }: { 
      pathId: string; 
      completedCourseIds: string[]; 
      progressPercentage: number; 
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('learning_path_progress')
        .upsert({
          user_id: user.id,
          learning_path_id: pathId,
          completed_course_ids: completedCourseIds,
          progress_percentage: progressPercentage,
          completed_at: progressPercentage === 100 ? new Date().toISOString() : null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-path-progress'] });
    },
  });
};
