import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsOverview } from '@/components/stats/StatsOverview';
import { CertificateWidget } from '@/components/certificates/CertificateWidget';
import { UserStreak } from '@/components/gamification/UserStreak';
import { UserLevel } from '@/components/gamification/UserLevel';
import { UserBadges } from '@/components/gamification/UserBadges';
import { RecentCourses } from '@/components/courses/RecentCourses';
import { NotesWidget } from '@/components/notes/NotesWidget';
import { DashboardWidgetProps } from '@/types/dashboard';
import { GoalsWidget } from '@/components/goals/GoalsWidget';

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({ widget }) => {
  const renderWidgetContent = () => {
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
      default:
        return <div className="p-4 text-gray-500">Widget non riconosciuto</div>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{widget.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-full">
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
};
