
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserTotalPoints = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-total-points', user?.id],
    queryFn: async () => {
      if (!user) return { total_points: 0, level: 1, points_to_next_level: 100 };
      
      try {
        const { data, error } = await supabase
          .from('user_total_points')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching total points:', error);
          return { total_points: 0, level: 1, points_to_next_level: 100 };
        }
        
        if (!data) {
          return { total_points: 0, level: 1, points_to_next_level: 100 };
        }
        
        return data;
      } catch (error) {
        console.error('Error in useUserTotalPoints:', error);
        return { total_points: 0, level: 1, points_to_next_level: 100 };
      }
    },
    enabled: !!user,
    retry: false,
  });
};

export const useUserStreak = (activityType: string = 'study') => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-streak', user?.id, activityType],
    queryFn: async () => {
      if (!user) return 0;
      
      try {
        const { data, error } = await supabase
          .rpc('get_user_current_streak', {
            p_user_id: user.id,
            p_activity_type: activityType
          });
        
        if (error) {
          console.error('Error fetching streak:', error);
          return 0;
        }
        
        return data || 0;
      } catch (error) {
        console.error('Error in useUserStreak:', error);
        return 0;
      }
    },
    enabled: !!user,
    retry: false,
  });
};

export const useUserBadges = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-badges', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('user_badges')
          .select(`
            *,
            badges (*)
          `)
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching user badges:', error);
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error('Error in useUserBadges:', error);
        return [];
      }
    },
    enabled: !!user,
    retry: false,
  });
};

export const useAllBadges = () => {
  return useQuery({
    queryKey: ['all-badges'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('badges')
          .select('*')
          .eq('is_active', true)
          .order('name');
        
        if (error) {
          console.error('Error fetching all badges:', error);
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error('Error in useAllBadges:', error);
        return [];
      }
    },
    retry: false,
  });
};

export const useUserPoints = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-points', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('user_points')
          .select('*')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching user points:', error);
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error('Error in useUserPoints:', error);
        return [];
      }
    },
    enabled: !!user,
    retry: false,
  });
};

export const useAwardPoints = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ points, activityType, activityId }: { 
      points: number; 
      activityType: string; 
      activityId?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      try {
        // Insert points record
        const { data: pointsData, error: pointsError } = await supabase
          .from('user_points')
          .insert({
            user_id: user.id,
            points,
            activity_type: activityType,
            activity_id: activityId,
          })
          .select()
          .single();
        
        if (pointsError) throw pointsError;
        
        // Update total points using RPC function
        const { error: totalError } = await supabase
          .rpc('update_user_total_points', {
            p_user_id: user.id,
            p_points: points
          });
        
        if (totalError) console.error('Error updating total points:', totalError);
        
        return pointsData;
      } catch (error) {
        console.error('Error awarding points:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-points'] });
      queryClient.invalidateQueries({ queryKey: ['user-total-points'] });
    },
  });
};

export const useCheckAndAwardBadges = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      try {
        // Manual badge checking since RPC function may not be available
        const { data: badges, error: badgesError } = await supabase
          .from('badges')
          .select('*')
          .eq('is_active', true);
        
        if (badgesError) throw badgesError;
        
        const { data: userBadges, error: userBadgesError } = await supabase
          .from('user_badges')
          .select('badge_id')
          .eq('user_id', user.id);
        
        if (userBadgesError) throw userBadgesError;
        
        const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);
        
        // Get user stats
        const { data: totalPoints } = await supabase
          .from('user_total_points')
          .select('total_points')
          .eq('user_id', user.id)
          .single();
        
        const { data: completedCourses } = await supabase
          .from('user_progress')
          .select('id')
          .eq('user_id', user.id)
          .eq('progress_percentage', 100);
        
        const userPointsTotal = totalPoints?.total_points || 0;
        const coursesCompleted = completedCourses?.length || 0;
        
        // Check each badge
        for (const badge of badges || []) {
          if (earnedBadgeIds.has(badge.id)) continue;
          
          let shouldAward = false;
          
          // Type guard and check for criteria
          if (badge.criteria && typeof badge.criteria === 'object' && badge.criteria !== null) {
            const criteria = badge.criteria as Record<string, any>;
            
            if (criteria.min_points && typeof criteria.min_points === 'number' && userPointsTotal >= criteria.min_points) {
              shouldAward = true;
            }
            
            if (criteria.min_courses_completed && typeof criteria.min_courses_completed === 'number' && coursesCompleted >= criteria.min_courses_completed) {
              shouldAward = true;
            }
          }
          
          if (shouldAward) {
            await supabase
              .from('user_badges')
              .insert({
                user_id: user.id,
                badge_id: badge.id
              });
          }
        }
        
        return true;
      } catch (error) {
        console.error('Error checking badges:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-badges'] });
    },
  });
};

export const useRecordActivity = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ activityType, activityId, metadata }: { 
      activityType: string; 
      activityId?: string;
      metadata?: any;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      try {
        const { data, error } = await supabase
          .from('user_activities')
          .insert({
            user_id: user.id,
            activity_type: activityType,
            activity_id: activityId,
            activity_data: metadata || {},
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error recording activity:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-activities'] });
      queryClient.invalidateQueries({ queryKey: ['user-streak'] });
      queryClient.invalidateQueries({ queryKey: ['user-badges'] });
    },
  });
};
