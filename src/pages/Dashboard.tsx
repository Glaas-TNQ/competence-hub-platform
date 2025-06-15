
import { StatsCard } from "@/components/StatsCard";
import { CourseCard } from "@/components/CourseCard";
import { UserLevel } from "@/components/gamification/UserLevel";
import { UserBadges } from "@/components/gamification/UserBadges";
import { UserStreak } from "@/components/gamification/UserStreak";
import { CertificateWidget } from "@/components/certificates/CertificateWidget";
import { useCourses, useUserProgress } from "@/hooks/useSupabase";
import { useUserTotalPoints } from "@/hooks/useGamification";
import { BookOpen, Award, TrendingUp, Target } from "lucide-react";

export const Dashboard = () => {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: userProgress, isLoading: progressLoading } = useUserProgress();
  const { data: totalPoints } = useUserTotalPoints();

  const completedCourses = userProgress?.filter(p => p.progress_percentage === 100)?.length || 0;
  const inProgressCourses = userProgress?.filter(p => p.progress_percentage > 0 && p.progress_percentage < 100)?.length || 0;
  const totalCourses = courses?.length || 0;

  if (coursesLoading || progressLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Benvenuto nella tua area di apprendimento</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Corsi Completati"
          value={completedCourses}
          icon={Award}
          color="green"
        />
        <StatsCard
          title="In Corso"
          value={inProgressCourses}
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Punti Totali"
          value={totalPoints?.total_points || 0}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Livello"
          value={totalPoints?.level || 1}
          icon={Target}
          color="orange"
        />
      </div>

      {/* Gamification Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserLevel />
        <UserStreak />
        <CertificateWidget />
      </div>

      {/* Badges */}
      <UserBadges />

      {/* Recent Courses */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Corsi Disponibili</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.slice(0, 6).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};
