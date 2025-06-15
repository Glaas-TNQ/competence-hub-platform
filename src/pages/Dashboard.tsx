import React, { useState } from 'react';
import { StatsCard } from "@/components/StatsCard";
import { CourseCard } from "@/components/CourseCard";
import { UserLevel } from "@/components/gamification/UserLevel";
import { UserBadges } from "@/components/gamification/UserBadges";
import { UserStreak } from "@/components/gamification/UserStreak";
import { CertificateWidget } from "@/components/certificates/CertificateWidget";
import { NotesWidget } from "@/components/notes/NotesWidget";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { DashboardCustomizer } from "@/components/dashboard/DashboardCustomizer";
import { Button } from "@/components/ui/button";
import { useCourses, useUserProgress } from "@/hooks/useSupabase";
import { useUserTotalPoints } from "@/hooks/useGamification";
import { useDashboardCustomization } from "@/hooks/useDashboardCustomization";
import { BookOpen, Award, TrendingUp, Target, Settings } from "lucide-react";

export const Dashboard = () => {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: userProgress, isLoading: progressLoading } = useUserProgress();
  const { data: totalPoints } = useUserTotalPoints();
  
  const {
    dashboardLayout,
    isCustomizing,
    setIsCustomizing,
    toggleWidgetVisibility,
  } = useDashboardCustomization();

  const [showCustomizer, setShowCustomizer] = useState(false);

  const completedCourses = userProgress?.filter(p => p.progress_percentage === 100)?.length || 0;
  const inProgressCourses = userProgress?.filter(p => p.progress_percentage > 0 && p.progress_percentage < 100)?.length || 0;

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

  const renderWidget = (widget: any) => {
    switch (widget.type) {
      case 'stats':
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

      case 'level':
        return <UserLevel />;

      case 'streak':
        return <UserStreak />;

      case 'certificates':
        return <CertificateWidget />;

      case 'notes':
        return <NotesWidget />;

      case 'badges':
        return <UserBadges />;

      case 'recent-courses':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Corsi Disponibili</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        );

      default:
        return <div>Widget non supportato: {widget.type}</div>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header con controlli personalizzazione */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Benvenuto nella tua area di apprendimento</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={isCustomizing ? "default" : "outline"}
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {isCustomizing ? 'Fine Personalizzazione' : 'Personalizza'}
          </Button>
          
          {isCustomizing && (
            <Button
              variant="outline"
              onClick={() => setShowCustomizer(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Impostazioni
            </Button>
          )}
        </div>
      </div>

      {/* Dashboard Widgets */}
      <div className={`grid gap-6 ${dashboardLayout.compactMode ? 'gap-4' : 'gap-6'}`}>
        {dashboardLayout.widgets
          .filter(widget => widget.visible || isCustomizing)
          .map((widget) => (
            <DashboardWidget
              key={widget.id}
              widget={widget}
              isCustomizing={isCustomizing}
              onToggleVisibility={() => toggleWidgetVisibility(widget.id)}
              className="w-full"
            >
              {renderWidget(widget)}
            </DashboardWidget>
          ))}
      </div>

      {/* Customizer Modal */}
      {showCustomizer && (
        <DashboardCustomizer onClose={() => setShowCustomizer(false)} />
      )}
    </div>
  );
};
