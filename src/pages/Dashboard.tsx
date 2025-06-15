
import React, { useState } from 'react';
import { StatsCard } from "@/components/StatsCard";
import { CourseCard } from "@/components/CourseCard";
import { UserLevel } from "@/components/gamification/UserLevel";
import { UserBadges } from "@/components/gamification/UserBadges";
import { UserStreak } from "@/components/gamification/UserStreak";
import { CertificateWidget } from "@/components/certificates/CertificateWidget";
import { NotesWidget } from "@/components/notes/NotesWidget";
import { GoalsWidget } from "@/components/goals/GoalsWidget";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { DashboardCustomizer } from "@/components/dashboard/DashboardCustomizer";
import { Button } from "@/components/ui/button";
import { useCourses, useUserProgress } from "@/hooks/useSupabase";
import { useUserTotalPoints } from "@/hooks/useGamification";
import { useDashboardCustomization } from "@/hooks/useDashboardCustomization";
import { BookOpen, Award, TrendingUp, Target, Settings } from "lucide-react";

export const Dashboard = () => {
  console.log('Dashboard component rendering');
  
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useCourses();
  const { data: userProgress, isLoading: progressLoading, error: progressError } = useUserProgress();
  const { data: totalPoints } = useUserTotalPoints();
  
  const {
    dashboardLayout,
    isCustomizing,
    setIsCustomizing,
    toggleWidgetVisibility,
  } = useDashboardCustomization();

  const [showCustomizer, setShowCustomizer] = useState(false);

  console.log('Dashboard data:', { courses, userProgress, totalPoints, dashboardLayout });
  console.log('Dashboard loading states:', { coursesLoading, progressLoading });
  console.log('Dashboard errors:', { coursesError, progressError });

  // Safe array access with fallbacks
  const safeUserProgress = Array.isArray(userProgress) ? userProgress : [];
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeDashboardWidgets = Array.isArray(dashboardLayout?.widgets) ? dashboardLayout.widgets : [];

  const completedCourses = safeUserProgress.filter(p => p?.progress_percentage === 100)?.length || 0;
  const inProgressCourses = safeUserProgress.filter(p => p?.progress_percentage > 0 && p?.progress_percentage < 100)?.length || 0;

  console.log('Dashboard calculated values:', { completedCourses, inProgressCourses });

  if (coursesLoading || progressLoading) {
    return (
      <div className="container-educational layout-educational space-educational">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-educational-md">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-educational animate-educational-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (coursesError || progressError) {
    return (
      <div className="container-educational layout-educational space-educational">
        <div className="text-center py-educational-5xl">
          <h2 className="heading-educational-section text-destructive mb-educational-md">
            Errore nel caricamento
          </h2>
          <p className="text-educational-body text-muted-foreground">
            Si è verificato un errore durante il caricamento dei dati.
          </p>
        </div>
      </div>
    );
  }

  const renderWidget = (widget: any) => {
    console.log('Rendering widget:', widget);
    
    if (!widget || !widget.type) {
      console.error('Invalid widget:', widget);
      return <div>Widget non valido</div>;
    }
    
    switch (widget.type) {
      case 'stats':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-educational-md">
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

      case 'goals':
        return <GoalsWidget />;

      case 'recent-courses':
        return (
          <div className="space-y-educational-md">
            <h3 className="heading-educational-section">Corsi Disponibili</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-educational-md">
              {safeCourses.slice(0, 6).map((course) => (
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
                  progress={safeUserProgress.find(p => p.course_id === course.id)?.progress_percentage}
                />
              ))}
            </div>
          </div>
        );

      default:
        console.log('Unknown widget type:', widget.type);
        return <div>Widget non supportato: {widget.type}</div>;
    }
  };

  return (
    <div className="container-educational layout-educational space-educational">
      {/* Header con controlli personalizzazione */}
      <div className="flex justify-between items-center mb-educational-2xl">
        <div className="space-y-educational-xs">
          <h1 className="heading-educational-display text-accent-foreground">
            Dashboard
          </h1>
          <p className="text-educational-body text-muted-foreground">
            Benvenuto nella tua area di apprendimento
          </p>
        </div>
        
        <div className="flex gap-educational-sm">
          <Button
            variant={isCustomizing ? "default" : "outline"}
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="flex items-center gap-2 hover-educational"
          >
            <Settings className="h-4 w-4" />
            {isCustomizing ? 'Fine Personalizzazione' : 'Personalizza'}
          </Button>
          
          {isCustomizing && (
            <Button
              variant="outline"
              onClick={() => setShowCustomizer(true)}
              className="flex items-center gap-2 hover-educational"
            >
              <Settings className="h-4 w-4" />
              Impostazioni
            </Button>
          )}
        </div>
      </div>

      {/* Dashboard Widgets */}
      <div className="space-y-educational-lg">
        {safeDashboardWidgets
          .filter(widget => widget && (widget.visible || isCustomizing))
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
