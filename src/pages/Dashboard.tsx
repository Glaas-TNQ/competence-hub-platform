
import React, { useState } from 'react';
import { CompactStatsCard } from "@/components/dashboard/CompactStatsCard";
import { CompactActivityCard } from "@/components/dashboard/CompactActivityCard";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { DashboardCustomizer } from "@/components/dashboard/DashboardCustomizer";
import { Button } from "@/components/ui/button";
import { useCourses, useUserProgress } from "@/hooks/useSupabase";
import { useUserTotalPoints, useUserStreak, useUserBadges } from "@/hooks/useGamification";
import { useUserGoals } from "@/hooks/useUserGoals";
import { useDashboardCustomization } from "@/hooks/useDashboardCustomization";
import { Settings, Sparkles } from "lucide-react";

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
    saveLayout,
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

  const handleFinishCustomization = async () => {
    if (dashboardLayout) {
      await saveLayout(dashboardLayout);
    }
    setIsCustomizing(false);
  };

  if (coursesLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-card/50 rounded-3xl animate-pulse border shadow-educational-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (coursesError || progressError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className="text-3xl font-bold text-destructive mb-6">
            Loading Error
          </h2>
          <p className="text-lg text-muted-foreground">
            An error occurred while loading data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome to your learning area
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant={isCustomizing ? "default" : "outline"}
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="flex items-center gap-2 rounded-full px-6"
            >
              {isCustomizing ? <Sparkles className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
              {isCustomizing ? 'Finish Customization' : 'Customize'}
            </Button>
            
            {isCustomizing && (
              <Button
                variant="outline"
                onClick={() => setShowCustomizer(true)}
                className="flex items-center gap-2 rounded-full px-6"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            )}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          {/* Compact Stats */}
          <CompactStatsCard
            completedCourses={completedCourses}
            inProgressCourses={inProgressCourses}
            totalPoints={totalPoints?.total_points || 0}
            level={totalPoints?.level || 1}
            streak={streak || 0}
            badges={userBadges?.length || 0}
          />

          {/* Activity and Goals */}
          <CompactActivityCard
            recentCourses={safeCourses.slice(0, 6)}
            goals={safeGoals}
          />

          {/* Custom Widgets (only if customizing) */}
          {isCustomizing && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground">Custom Widgets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </div>
          )}
        </div>

        {/* Customizer Modal */}
        {showCustomizer && (
          <DashboardCustomizer onClose={() => setShowCustomizer(false)} />
        )}
      </div>
    </div>
  );
};
