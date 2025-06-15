
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, Target, Star, TrendingUp, CheckCircle, Plus } from 'lucide-react';
import { GoalsWidget } from '@/components/goals/GoalsWidget';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  course_type: string;
}

interface Goal {
  id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  period_end: string;
  is_completed: boolean;
}

interface CompactActivityCardProps {
  recentCourses: Course[];
  goals: Goal[];
}

export const CompactActivityCard: React.FC<CompactActivityCardProps> = ({
  recentCourses,
  goals
}) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return '🎥';
      case 'interactive':
        return '🎮';
      case 'reading':
        return '📖';
      default:
        return '📚';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Activity */}
      <Card className="shadow-educational-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-xl">Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {recentCourses.length > 0 ? (
            <>
              <div className="grid gap-4">
                {recentCourses.slice(0, 3).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-background/80 border border-border/50 hover:shadow-educational-md transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center text-xl">
                      {getTypeIcon(course.course_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">
                        {course.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className={`text-xs ${getLevelColor(course.level)}`}>
                          {course.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Explore Courses
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No courses started yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start your learning journey!
              </p>
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <Plus className="h-4 w-4 mr-2" />
                Explore Courses
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals Widget */}
      <GoalsWidget />
    </div>
  );
};
