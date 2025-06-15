import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useCourses, useUserProgress } from '@/hooks/useSupabase';
import { useUserTotalPoints } from '@/hooks/useGamification';
import { useUserGoals } from '@/hooks/useUserGoals';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const useAnalytics = () => {
  const { user } = useAuth();
  const { data: courses } = useCourses();
  const { data: userProgress } = useUserProgress();
  const { data: totalPoints } = useUserTotalPoints();
  const { data: goals } = useUserGoals();

  return useQuery({
    queryKey: ['analytics', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Recupera dati attività giornaliera
      const { data: dailyStreaks } = await supabase
        .from('daily_streaks')
        .select('*')
        .eq('user_id', user.id)
        .gte('streak_date', format(subDays(new Date(), 365), 'yyyy-MM-dd'));

      // Recupera attività utente
      const { data: userActivities } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', format(subDays(new Date(), 30), 'yyyy-MM-dd'));

      // Get competence areas separately
      const { data: competenceAreas } = await supabase
        .from('competence_areas')
        .select('*');

      // Calcola statistiche base
      const completedCourses = userProgress?.filter(p => p.progress_percentage === 100)?.length || 0;
      const totalProgress = userProgress?.length > 0 
        ? Math.round(userProgress.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / userProgress.length)
        : 0;

      // Calcola serie attuale
      const currentStreak = dailyStreaks?.length || 0;

      // Calcola dati per heatmap
      const dailyActivity: Record<string, number> = {};
      dailyStreaks?.forEach(streak => {
        const date = format(new Date(streak.streak_date), 'yyyy-MM-dd');
        dailyActivity[date] = (dailyActivity[date] || 0) + 1;
      });

      // Calcola progresso settimanale
      const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), i);
        const dayStr = format(date, 'yyyy-MM-dd');
        return {
          day: format(date, 'EEE'),
          progress: dailyActivity[dayStr] || 0,
          date: dayStr
        };
      }).reverse();

      // Distribuzione per competenza
      const competenceDistribution = courses?.reduce((acc: any[], course) => {
        const competenceArea = competenceAreas?.find(area => area.id === course.competence_area_id);
        if (competenceArea) {
          const existing = acc.find(item => item.name === competenceArea.name);
          if (existing) {
            existing.hours += 2; // Stima ore per corso
          } else {
            acc.push({
              name: competenceArea.name,
              hours: 2,
              color: competenceArea.color || '#3b82f6'
            });
          }
        }
        return acc;
      }, []) || [];

      // Performance mensile
      const monthlyPerformance = Array.from({ length: 6 }, (_, i) => {
        const date = subDays(new Date(), i * 30);
        return {
          month: format(date, 'MMM'),
          completed: Math.floor(Math.random() * 5), // Mock data
          points: Math.floor(Math.random() * 100),
        };
      }).reverse();

      // Raccomandazioni intelligenti
      const recommendations = generateRecommendations(courses, userProgress, goals, competenceAreas);

      // Insights automatici
      const insights = generateInsights(userProgress, totalPoints, dailyStreaks);

      // Progresso obiettivi
      const goalProgress = goals?.map(goal => ({
        name: getGoalTypeName(goal.goal_type),
        current: goal.current_value || 0,
        target: goal.target_value,
        type: goal.goal_type
      })) || [];

      return {
        totalProgress,
        studyTimeHours: Math.floor(completedCourses * 2.5), // Stima
        completedCourses,
        currentStreak,
        dailyActivity,
        weeklyProgress,
        competenceDistribution,
        monthlyPerformance,
        recommendations,
        insights,
        goalProgress,
        weeklyStudyTime: Array.from({ length: 8 }, (_, i) => ({
          week: `W${i + 1}`,
          hours: Math.floor(Math.random() * 20) + 5
        })),
        competencePerformance: competenceDistribution.map(comp => ({
          name: comp.name,
          score: Math.floor(Math.random() * 100) + 50
        }))
      };
    },
    enabled: !!user,
  });
};

function generateRecommendations(courses: any[], userProgress: any[], goals: any[], competenceAreas: any[]) {
  const recommendations = [];

  // Raccomanda corsi basati su aree non completate
  const completedAreas = new Set(
    userProgress?.filter(p => p.progress_percentage === 100)
      .map(p => p.course_id)
  );

  const availableAreas = courses?.filter(course => 
    !completedAreas.has(course.id)
  ) || [];

  if (availableAreas.length > 0) {
    const recommendedCourse = availableAreas[0];
    const competenceArea = competenceAreas?.find(area => area.id === recommendedCourse.competence_area_id);
    
    recommendations.push({
      type: 'course',
      title: `Inizia: ${recommendedCourse.title}`,
      description: `Basato sulla tua area di interesse in ${competenceArea?.name || 'sviluppo competenze'}`,
      reason: 'Area non ancora esplorata',
      priority: 'Alta',
      action: 'start-course',
      courseId: recommendedCourse.id,
      actionLabel: 'Inizia Corso'
    });
  }

  // Raccomanda obiettivi se non ne ha
  if (!goals || goals.length === 0) {
    recommendations.push({
      type: 'goal',
      title: 'Imposta i tuoi obiettivi',
      description: 'Definisci obiettivi di apprendimento per rimanere motivato',
      reason: 'Nessun obiettivo attivo',
      priority: 'Media',
      action: 'set-goal',
      actionLabel: 'Vai agli Obiettivi'
    });
  }

  // Raccomandazioni per miglioramento
  recommendations.push({
    type: 'improvement',
    title: 'Studia con costanza',
    description: 'Dedica almeno 30 minuti al giorno per mantenere il momentum',
    reason: 'Miglioramento delle abitudini di studio',
    priority: 'Media'
  });

  return recommendations;
}

function generateInsights(userProgress: any[], totalPoints: any, dailyStreaks: any[]) {
  const insights = [];

  // Insight su progresso
  if (userProgress && userProgress.length > 0) {
    const avgProgress = userProgress.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / userProgress.length;
    
    if (avgProgress > 70) {
      insights.push({
        type: 'achievement',
        title: 'Ottimo Progresso!',
        message: `Hai una media di progresso del ${Math.round(avgProgress)}% sui tuoi corsi`,
        value: `${Math.round(avgProgress)}%`,
        trend: 15
      });
    }
  }

  // Insight su punti
  if (totalPoints?.total_points > 0) {
    insights.push({
      type: 'improvement',
      title: 'Punti Accumulati',
      message: `Hai guadagnato ${totalPoints.total_points} punti finora`,
      value: `${totalPoints.total_points} punti`,
      trend: 8
    });
  }

  // Insight su serie
  if (dailyStreaks && dailyStreaks.length >= 3) {
    insights.push({
      type: 'streak',
      title: 'Serie di Studio',
      message: 'Stai mantenendo una buona costanza nello studio',
      value: `${dailyStreaks.length} giorni`,
      trend: 12
    });
  }

  // Insight generico se non ci sono altri
  if (insights.length === 0) {
    insights.push({
      type: 'goal',
      title: 'Inizia il tuo percorso',
      message: 'Completa il tuo primo corso per sbloccare insights personalizzati',
      value: '0 corsi completati'
    });
  }

  return insights;
}

function getGoalTypeName(goalType: string): string {
  switch (goalType) {
    case 'courses_completed': return 'Corsi Completati';
    case 'study_days': return 'Giorni di Studio';
    case 'points_earned': return 'Punti Guadagnati';
    default: return goalType;
  }
}
