import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCompetenceAreas = () => {
  return useQuery({
    queryKey: ['competence-areas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('competence_areas')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            competence_areas (name, color)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching courses:', error);
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error('Error in useCourses:', error);
        return [];
      }
    },
    retry: 1,
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        console.log('useUsers: Starting query...');
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        console.log('useUsers: Query result:', { data, error });
        
        if (error) {
          console.error('useUsers: Error fetching users:', error);
          throw error;
        }
        
        console.log('useUsers: Successfully fetched', data?.length, 'users');
        return data || [];
      } catch (error) {
        console.error('useUsers: Exception in query:', error);
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });
};

export const useUserProgress = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select(`
            *,
            courses (*)
          `)
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching progress:', error);
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error('Error in useUserProgress:', error);
        return [];
      }
    },
    enabled: !!user,
    retry: 1,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (courseData: any) => {
      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ courseId, progressPercentage }: { courseId: string; progressPercentage: number }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          progress_percentage: progressPercentage,
          completed_at: progressPercentage === 100 ? new Date().toISOString() : null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
    },
  });
};

export const useUpdateUserAccess = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, accessibleCourses }: { userId: string; accessibleCourses: string[] }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ accessible_courses: accessibleCourses })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
