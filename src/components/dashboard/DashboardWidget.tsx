
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsOverview } from '@/components/stats/StatsOverview';
import { CertificateWidget } from '@/components/certificates/CertificateWidget';
import { UserStreak } from '@/components/gamification/UserStreak';
import { UserLevel } from '@/components/gamification/UserLevel';
import { UserBadges } from '@/components/gamification/UserBadges';
import { RecentCourses } from '@/components/courses/RecentCourses';
import { NotesWidget } from '@/components/notes/NotesWidget';
import { GoalsWidget } from '@/components/goals/GoalsWidget';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { DashboardWidgetProps } from '@/types/dashboard';

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({ 
  widget, 
  isCustomizing, 
  onToggleVisibility, 
  className, 
  children 
}) => {
  const renderWidgetContent = () => {
    // If children are provided (from Dashboard.tsx), use them instead
    if (children) {
      return children;
    }

    if (!widget || !widget.type) {
      return <div className="p-4 text-gray-500">Widget non valido</div>;
    }

    switch (widget.type) {
      case 'stats':
        return <StatsOverview />;
      case 'certificates':
        return <CertificateWidget />;
      case 'streak':
        return <UserStreak />;
      case 'level':
        return <UserLevel />;
      case 'badges':
        return <UserBadges />;
      case 'recent-courses':
        return <RecentCourses />;
      case 'notes':
        return <NotesWidget />;
      case 'goals':
        return <GoalsWidget />;
      case 'analytics':
        return <AnalyticsOverview />;
      default:
        return <div className="p-4 text-gray-500">Widget non riconosciuto: {widget.type}</div>;
    }
  };

  if (!widget) {
    return <div className="p-4 text-red-500">Widget mancante</div>;
  }

  return (
    <div className={`relative ${className || ''}`}>
      {isCustomizing && (
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={onToggleVisibility}
            className={`p-1 rounded ${
              widget.visible ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {widget.visible ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      )}
      
      <Card className={`h-full ${!widget.visible && isCustomizing ? 'opacity-50' : ''}`}>
        <CardHeader>
          <CardTitle className="text-lg">{widget.title || 'Widget'}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-full">
          {renderWidgetContent()}
        </CardContent>
      </Card>
    </div>
  );
};
