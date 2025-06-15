
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Trophy, Zap, Star, TrendingUp, Target } from 'lucide-react';

interface CompactStatsCardProps {
  completedCourses: number;
  inProgressCourses: number;
  totalPoints: number;
  level: number;
  streak: number;
  badges: number;
}

export const CompactStatsCard: React.FC<CompactStatsCardProps> = ({
  completedCourses,
  inProgressCourses,
  totalPoints,
  level,
  streak,
  badges
}) => {
  const stats = [
    {
      title: 'Progress',
      subtitle: 'Courses completed',
      value: completedCourses,
      secondaryValue: inProgressCourses,
      secondaryLabel: 'In progress',
      icon: BookOpen,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      badge: {
        text: `${Math.round((completedCourses / Math.max(completedCourses + inProgressCourses, 1)) * 100)}%`,
        variant: 'default' as const
      },
      footer: completedCourses === 0 ? 'Start your first course!' : undefined
    },
    {
      title: 'Level',
      subtitle: 'Experience gained',
      value: level,
      secondaryValue: totalPoints,
      secondaryLabel: 'experience points',
      icon: Trophy,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      badge: {
        text: `Level ${level}`,
        variant: 'default' as const
      },
      footer: streak === 0 ? 'Start today!' : undefined
    },
    {
      title: 'Streak',
      subtitle: 'Consecutive days',
      value: streak,
      secondaryValue: 0,
      secondaryLabel: 'days',
      icon: Zap,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      badge: {
        text: `${streak} days`,
        variant: 'default' as const
      },
      footer: streak === 0 ? 'Start today!' : undefined
    },
    {
      title: 'Results',
      subtitle: 'Badges and certificates',
      value: badges,
      secondaryValue: 0,
      secondaryLabel: 'Certificates',
      icon: Star,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      badge: {
        text: 'Badges',
        variant: 'secondary' as const
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="shadow-educational-lg border-0 bg-card/50 backdrop-blur-sm hover:shadow-educational-xl transition-all duration-300 group"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <Badge variant={stat.badge.variant} className="text-xs">
                {stat.badge.text}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-foreground">
                  {stat.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.subtitle}
                </p>
              </div>
              
              {stat.secondaryValue > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{stat.secondaryLabel}</span>
                  <span className="font-medium text-foreground">{stat.secondaryValue}</span>
                </div>
              )}
              
              {stat.footer && (
                <p className="text-xs text-muted-foreground italic border-t pt-2">
                  {stat.footer}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
