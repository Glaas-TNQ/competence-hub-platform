
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAwardPoints, useCheckAndAwardBadges, useRecordActivity } from './useGamification';

interface ChapterProgress {
  id: string;
  user_id: string;
  course_id: string;
  chapter_index: number;
  completed_at: string;
  created_at: string;
}

export const useChapterProgress = (courseId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['chapter-progress', courseId, user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('chapter_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId);
      
      if (error) throw error;
      return data as ChapterProgress[];
    },
    enabled: !!user && !!courseId,
  });
};

export const useMarkChapterComplete = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const awardPoints = useAwardPoints();
  const checkBadges = useCheckAndAwardBadges();
  const recordActivity = useRecordActivity();
  
  return useMutation({
    mutationFn: async ({ courseId, chapterIndex }: { courseId: string; chapterIndex: number }) => {
      if (!user) throw new Error('User not authenticated');
      
      const startTime = Date.now();
      
      const { data, error } = await supabase
        .from('chapter_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          chapter_index: chapterIndex,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const completionTime = Date.now() - startTime;
      
      // Record activity with completion time
      await recordActivity.mutateAsync({
        activityType: 'chapter_complete',
        metadata: { 
          completion_time_ms: completionTime,
          chapter_index: chapterIndex,
          course_id: courseId
        },
      });
      
      // Award points for chapter completion (10 points)
      await awardPoints.mutateAsync({
        points: 10,
        activityType: 'chapter_completion',
        activityId: `${courseId}-${chapterIndex}`,
      });
      
      // Check for new badges
      await checkBadges.mutateAsync();
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapter-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
    },
  });
};

export const useCalculateProgress = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const awardPoints = useAwardPoints();
  const checkBadges = useCheckAndAwardBadges();
  const recordActivity = useRecordActivity();
  
  return useMutation({
    mutationFn: async ({ courseId, totalChapters }: { courseId: string; totalChapters: number }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Get completed chapters
      const { data: completedChapters, error: chaptersError } = await supabase
        .from('chapter_progress')
        .select('chapter_index')
        .eq('user_id', user.id)
        .eq('course_id', courseId);
      
      if (chaptersError) throw chaptersError;
      
      const progressPercentage = Math.round((completedChapters.length / totalChapters) * 100);
      const wasCompleted = progressPercentage === 100;
      
      // Check if course was already completed
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('progress_percentage')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
      
      const wasAlreadyCompleted = existingProgress?.progress_percentage === 100;
      
      // Update overall course progress
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
      
      // Award points for course completion (50 points) - only if just completed
      if (wasCompleted && !wasAlreadyCompleted) {
        // Record course completion activity
        await recordActivity.mutateAsync({
          activityType: 'course_complete',
          metadata: { 
            total_chapters: totalChapters,
            completion_percentage: 100,
            course_id: courseId
          },
        });
        
        await awardPoints.mutateAsync({
          points: 50,
          activityType: 'course_completion',
          activityId: courseId,
        });
        
        // Check for new badges
        await checkBadges.mutateAsync();
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
    },
  });
};
