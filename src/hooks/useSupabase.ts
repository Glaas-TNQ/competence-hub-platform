
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
        // First try to get courses with competence areas
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            competence_areas (name, color)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching courses with areas:', error);
          // Fallback: get courses without competence areas
          const { data: coursesOnly, error: coursesError } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (coursesError) throw coursesError;
          return coursesOnly;
        }
        
        return data;
      } catch (error) {
        console.error('Error in useCourses:', error);
        // Return empty array as fallback
        return [];
      }
    },
    retry: false,
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching users:', error);
          return [];
        }
        return data;
      } catch (error) {
        console.error('Error in useUsers:', error);
        return [];
      }
    },
    retry: false,
  });
};

export const useUserProgress = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        // Try to get progress with courses
        const { data, error } = await supabase
          .from('user_progress')
          .select(`
            *,
            courses (*)
          `)
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching progress with courses:', error);
          // Fallback: get progress without courses
          const { data: progressOnly, error: progressError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id);
          
          if (progressError) {
            console.error('Error fetching progress:', progressError);
            return [];
          }
          return progressOnly;
        }
        
        return data;
      } catch (error) {
        console.error('Error in useUserProgress:', error);
        return [];
      }
    },
    enabled: !!user,
    retry: false,
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
