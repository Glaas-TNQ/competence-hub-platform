
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
            <CourseCard 
              key={course.id} 
              title={course.title}
              description={course.description}
              duration={course.duration}
              type={course.course_type as 'text' | 'video' | 'arcade'}
              image={course.image_url || 'photo-1546410531-bb4caa6b424d'}
              level={course.level as 'Principiante' | 'Intermedio' | 'Avanzato'}
              requiresPayment={course.requires_payment || false}
              price={Number(course.price) || 0}
              courseId={course.id}
              progress={userProgress?.find(p => p.course_id === course.id)?.progress_percentage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
