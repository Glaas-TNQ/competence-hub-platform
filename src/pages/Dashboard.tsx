
import React, { useState } from 'react';
import { CompactStatsCard } from "@/components/dashboard/CompactStatsCard";
import { CompactActivityCard } from "@/components/dashboard/CompactActivityCard";
import { UserLevel } from "@/components/gamification/UserLevel";
import { UserBadges } from "@/components/gamification/UserBadges";
import { UserStreak } from "@/components/gamification/UserStreak";
import { CertificateWidget } from "@/components/certificates/CertificateWidget";
import { NotesWidget } from "@/components/notes/NotesWidget";
import { GoalsWidget } from "@/components/goals/GoalsWidget";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { DashboardCustomizer } from "@/components/dashboard/DashboardCustomizer";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCourses, useUserProgress } from "@/hooks/useSupabase";
import { useUserTotalPoints, useUserStreak, useUserBadges } from "@/hooks/useGamification";
import { useUserGoals } from "@/hooks/useUserGoals";
import { useDashboardCustomization } from "@/hooks/useDashboardCustomization";
import { BookOpen, Award, TrendingUp, Target, Settings } from "lucide-react";

export const Dashboard = () => {
  console.log('Dashboard component rendering');
  
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useCourses();
  const { data: userProgress, isLoading: progressLoading, error: progressError } = useUserProgress();
  const { data: totalPoints } = useUserTotalPoints();
  const { data: streak } = useUserStreak('study');
  const { data: userBadges } = useUserBadges();
  const { data: goals } = useUserGoals();
  
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
  const safeGoals = Array.isArray(goals) ? goals : [];

  const completedCourses = safeUserProgress.filter(p => p?.progress_percentage === 100)?.length || 0;
  const inProgressCourses = safeUserProgress.filter(p => p?.progress_percentage > 0 && p?.progress_percentage < 100)?.length || 0;

  console.log('Dashboard calculated values:', { completedCourses, inProgressCourses });

  if (coursesLoading || progressLoading) {
    return (
      <div className="container-educational layout-educational space-educational">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-educational-md">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-educational animate-educational-pulse"></div>
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

  return (
    <div className="container-educational layout-educational space-educational">
      {/* Header con controlli personalizzazione e tema */}
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
          <ThemeToggle />
          
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

      {/* Dashboard Compatta */}
      <div className="space-y-educational-lg">
        {/* Stats Compatte */}
        <CompactStatsCard
          completedCourses={completedCourses}
          inProgressCourses={inProgressCourses}
          totalPoints={totalPoints?.total_points || 0}
          level={totalPoints?.level || 1}
          streak={streak || 0}
          badges={userBadges?.length || 0}
        />

        {/* Attività e Obiettivi */}
        <CompactActivityCard
          recentCourses={safeCourses.slice(0, 6)}
          goals={safeGoals}
        />

        {/* Widget Personalizzati (solo se customizing) */}
        {isCustomizing && (
          <div className="space-y-educational-md">
            <h3 className="heading-educational-section">Widget Personalizzati</h3>
            {safeDashboardWidgets
              .filter(widget => widget && widget.visible && !['stats', 'recent-courses', 'goals'].includes(widget.type))
              .map((widget) => (
                <DashboardWidget
                  key={widget.id}
                  widget={widget}
                  isCustomizing={isCustomizing}
                  onToggleVisibility={() => toggleWidgetVisibility(widget.id)}
                  className="w-full"
                />
              ))}
          </div>
        )}
      </div>

      {/* Customizer Modal */}
      {showCustomizer && (
        <DashboardCustomizer onClose={() => setShowCustomizer(false)} />
      )}
    </div>
  );
};
