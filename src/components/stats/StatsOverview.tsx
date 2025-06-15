
import React from 'react';
import { StatsCard } from '@/components/StatsCard';
import { useCourses, useUserProgress } from '@/hooks/useSupabase';
import { useUserTotalPoints } from '@/hooks/useGamification';
import { BookOpen, Award, TrendingUp, Target } from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const { data: courses } = useCourses();
  const { data: userProgress } = useUserProgress();
  const { data: totalPoints } = useUserTotalPoints();

  const completedCourses = userProgress?.filter(p => p.progress_percentage === 100)?.length || 0;
  const inProgressCourses = userProgress?.filter(p => p.progress_percentage > 0 && p.progress_percentage < 100)?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Corsi Completati"
        value={completedCourses.toString()}
        icon={<Award className="h-6 w-6" />}
        color="green"
      />
      <StatsCard
        title="In Corso"
        value={inProgressCourses.toString()}
        icon={<BookOpen className="h-6 w-6" />}
        color="blue"
      />
      <StatsCard
        title="Punti Totali"
        value={(totalPoints?.total_points || 0).toString()}
        icon={<TrendingUp className="h-6 w-6" />}
        color="purple"
      />
      <StatsCard
        title="Livello"
        value={(totalPoints?.level || 1).toString()}
        icon={<Target className="h-6 w-6" />}
        color="orange"
      />
    </div>
  );
};
