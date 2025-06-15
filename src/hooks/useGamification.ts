
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckCertificates } from './useCertificates';

export const useUserTotalPoints = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-total-points', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_total_points')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || { total_points: 0, level: 1, points_to_next_level: 100 };
    },
    enabled: !!user,
  });
};

export const useUserBadges = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-badges', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badges (*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useAllBadges = () => {
  return useQuery({
    queryKey: ['all-badges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .eq('is_active', true)
        .order('category');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUserStreak = (activityType: string = 'study') => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-streak', user?.id, activityType],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.rpc('get_user_current_streak', {
        p_user_id: user.id,
        p_activity_type: activityType
      });
      
      if (error) throw error;
      return data || 0;
    },
    enabled: !!user,
  });
};

export const useAwardPoints = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const checkCertificates = useCheckCertificates();
  
  return useMutation({
    mutationFn: async ({ points, activityType, activityId }: { 
      points: number; 
      activityType: string; 
      activityId?: string; 
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Award points
      const { error: pointsError } = await supabase
        .from('user_points')
        .insert({
          user_id: user.id,
          points,
          activity_type: activityType,
          activity_id: activityId,
        });
      
      if (pointsError) throw pointsError;
      
      // Update total points
      const { error: totalError } = await supabase.rpc('update_user_total_points', {
        p_user_id: user.id,
        p_points: points
      });
      
      if (totalError) throw totalError;
      
      // Check for new certificates
      await checkCertificates.mutateAsync();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-total-points'] });
      queryClient.invalidateQueries({ queryKey: ['user-certificates'] });
    },
  });
};

export const useCheckAndAwardBadges = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Get all available badges
      const { data: badges, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .eq('is_active', true);
      
      if (badgesError) throw badgesError;
      
      // Get user's current badges
      const { data: userBadges, error: userBadgesError } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.id);
      
      if (userBadgesError) throw userBadgesError;
      
      const earnedBadgeIds = userBadges.map(ub => ub.badge_id);
      
      // Check each badge criteria
      for (const badge of badges) {
        if (earnedBadgeIds.includes(badge.id)) continue;
        
        let shouldAward = false;
        
        // Simple badge criteria checking based on badge category
        switch (badge.category) {
          case 'progress':
            if (badge.criteria.courses_completed) {
              const { data: completedCourses } = await supabase
                .from('user_progress')
                .select('id')
                .eq('user_id', user.id)
                .eq('progress_percentage', 100);
              
              shouldAward = (completedCourses?.length || 0) >= badge.criteria.courses_completed;
            }
            break;
            
          case 'points':
            if (badge.criteria.points_minimum) {
              const { data: totalPoints } = await supabase
                .from('user_total_points')
                .select('total_points')
                .eq('user_id', user.id)
                .single();
              
              shouldAward = (totalPoints?.total_points || 0) >= badge.criteria.points_minimum;
            }
            break;
            
          case 'streak':
            if (badge.criteria.streak_days) {
              const { data: streak } = await supabase.rpc('get_user_current_streak', {
                p_user_id: user.id,
                p_activity_type: 'study'
              });
              
              shouldAward = (streak || 0) >= badge.criteria.streak_days;
            }
            break;
        }
        
        if (shouldAward) {
          await supabase
            .from('user_badges')
            .insert({
              user_id: user.id,
              badge_id: badge.id,
            });
          
          // Award points for earning badge
          if (badge.points_reward > 0) {
            await supabase
              .from('user_points')
              .insert({
                user_id: user.id,
                points: badge.points_reward,
                activity_type: 'badge_earned',
                activity_id: badge.id,
              });
            
            await supabase.rpc('update_user_total_points', {
              p_user_id: user.id,
              p_points: badge.points_reward
            });
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-badges'] });
      queryClient.invalidateQueries({ queryKey: ['user-total-points'] });
    },
  });
};

export const useRecordActivity = () => {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      activityType, 
      activityData, 
      courseId, 
      chapterIndex, 
      competenceAreaId 
    }: {
      activityType: string;
      activityData?: any;
      courseId?: string;
      chapterIndex?: number;
      competenceAreaId?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Record the activity
      const { error: activityError } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          activity_data: activityData,
          course_id: courseId,
          chapter_index: chapterIndex,
          competence_area_id: competenceAreaId,
        });
      
      if (activityError) throw activityError;
      
      // Record daily streak
      const { error: streakError } = await supabase.rpc('record_daily_activity', {
        p_user_id: user.id,
        p_activity_type: 'study'
      });
      
      if (streakError) throw streakError;
    },
  });
};
