
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserNote {
  id: string;
  user_id: string;
  course_id?: string;
  chapter_index?: number;
  content: string;
  note_type: string;
  position_data?: any;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserNotes = (courseId?: string, chapterIndex?: number) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-notes', user?.id, courseId, chapterIndex],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      let query = supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', user.id);
      
      if (courseId) {
        query = query.eq('course_id', courseId);
      }
      
      if (chapterIndex !== undefined) {
        query = query.eq('chapter_index', chapterIndex);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserNote[];
    },
    enabled: !!user,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (noteData: {
      course_id?: string;
      chapter_index?: number;
      content: string;
      note_type?: string;
      position_data?: any;
      is_shared?: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_notes')
        .insert({
          user_id: user.id,
          ...noteData,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-notes'] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UserNote> }) => {
      const { data, error } = await supabase
        .from('user_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-notes'] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-notes'] });
    },
  });
};
