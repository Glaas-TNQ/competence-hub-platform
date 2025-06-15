
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserPoints {
  id: string;
  user_id: string;
  points: number;
  activity_type: string;
  activity_id: string | null;
  earned_at: string;
}

interface UserTotalPoints {
  id: string;
  user_id: string;
  total_points: number;
  level: number;
  points_to_next_level: number;
  updated_at: string;
}

interface BadgeCriteria {
  type: string;
  count?: number;
  points?: number;
  max_hours?: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  criteria: BadgeCriteria;
  points_reward: number;
  rarity: string;
  is_active: boolean;
}

interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badges: Badge;
}

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
      return data as UserTotalPoints | null;
    },
    enabled: !!user,
  });
};

export const useUserPoints = (limit = 10) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-points', user?.id, limit],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as UserPoints[];
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
      return data as UserBadge[];
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
        .order('created_at');
      
      if (error) throw error;
      return data as Badge[];
    },
  });
};

export const useAwardPoints = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      points, 
      activityType, 
      activityId 
    }: { 
      points: number; 
      activityType: string; 
      activityId?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Insert points record
      const { error: pointsError } = await supabase
        .from('user_points')
        .insert({
          user_id: user.id,
          points,
          activity_type: activityType,
          activity_id: activityId,
        });
      
      if (pointsError) throw pointsError;
      
      // Update total points using the database function
      const { error: totalError } = await supabase.rpc('update_user_total_points', {
        p_user_id: user.id,
        p_points: points,
      });
      
      if (totalError) throw totalError;
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-total-points'] });
      queryClient.invalidateQueries({ queryKey: ['user-points'] });
      queryClient.invalidateQueries({ queryKey: ['user-badges'] });
    },
  });
};

export const useCheckAndAwardBadges = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Get user stats for badge checking
      const [
        { data: totalPoints },
        { data: userProgress },
        { data: chapterProgress },
        { data: userBadges },
        { data: allBadges }
      ] = await Promise.all([
        supabase.from('user_total_points').select('*').eq('user_id', user.id).single(),
        supabase.from('user_progress').select('*').eq('user_id', user.id),
        supabase.from('chapter_progress').select('*').eq('user_id', user.id),
        supabase.from('user_badges').select('badge_id').eq('user_id', user.id),
        supabase.from('badges').select('*').eq('is_active', true)
      ]);
      
      if (!allBadges || !userBadges) return { newBadges: [] };
      
      const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));
      const newBadges: Badge[] = [];
      
      // Check each badge criteria
      for (const badge of allBadges) {
        if (earnedBadgeIds.has(badge.id)) continue;
        
        const criteria = badge.criteria as BadgeCriteria;
        let shouldEarn = false;
        
        switch (criteria.type) {
          case 'chapter_completion':
            shouldEarn = (chapterProgress?.length || 0) >= (criteria.count || 0);
            break;
          case 'course_completion':
            const completedCourses = userProgress?.filter(p => p.progress_percentage === 100).length || 0;
            shouldEarn = completedCourses >= (criteria.count || 0);
            break;
          case 'points_milestone':
            shouldEarn = (totalPoints?.total_points || 0) >= (criteria.points || 0);
            break;
          case 'badge_collection':
            shouldEarn = userBadges.length >= (criteria.count || 0);
            break;
        }
        
        if (shouldEarn) {
          // Award the badge
          const { error } = await supabase
            .from('user_badges')
            .insert({
              user_id: user.id,
              badge_id: badge.id,
            });
          
          if (!error) {
            newBadges.push(badge as Badge);
            
            // Award points for the badge
            if (badge.points_reward > 0) {
              await supabase.rpc('update_user_total_points', {
                p_user_id: user.id,
                p_points: badge.points_reward,
              });
            }
          }
        }
      }
      
      return { newBadges };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-badges'] });
      queryClient.invalidateQueries({ queryKey: ['user-total-points'] });
    },
  });
};
