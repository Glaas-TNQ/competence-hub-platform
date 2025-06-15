
import React from 'react';
import { Target, Plus, Trophy, Calendar, CheckCircle } from 'lucide-react';
import { useUserGoals } from '@/hooks/useUserGoals';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format, isValid } from 'date-fns';

interface Goal {
  id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  period_start: string;
  period_end: string;
  is_completed: boolean;
  completed_at: string | null;
}

export const GoalsWidget = () => {
  const { data: goals = [], isLoading } = useUserGoals();

  const getGoalTypeLabel = (type: string) => {
    switch (type) {
      case 'courses_completed':
        return 'Courses Completed';
      case 'study_days':
        return 'Study Days';
      case 'points_earned':
        return 'Points Earned';
      case 'chapters_completed':
        return 'Chapters Completed';
      default:
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'courses_completed':
        return <Trophy className="h-5 w-5 text-blue-500" />;
      case 'study_days':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'points_earned':
        return <Target className="h-5 w-5 text-purple-500" />;
      default:
        return <Target className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isValid(date)) {
        return format(date, 'MMM dd, yyyy');
      }
      return 'No end date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">My Goals</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  const activeGoals = goals.filter(goal => !goal.is_completed && new Date(goal.period_end) >= new Date());
  const completedGoals = goals.filter(goal => goal.is_completed);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          My Goals
        </h3>
        <Button size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <div className="space-y-4">
        {activeGoals.length === 0 && completedGoals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No goals set yet</p>
            <p className="text-sm">Create your first goal to track progress</p>
          </div>
        ) : (
          <>
            {activeGoals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getGoalIcon(goal.goal_type)}
                    <div>
                      <h4 className="font-medium">{getGoalTypeLabel(goal.goal_type)}</h4>
                      <p className="text-sm text-muted-foreground">
                        {goal.current_value} / {goal.target_value}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Math.round((goal.current_value / goal.target_value) * 100)}%
                    </p>
                  </div>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((goal.current_value / goal.target_value) * 100, 100)}%` }}
                  />
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Ends: {formatDate(goal.period_end)}
                </div>
              </div>
            ))}

            {completedGoals.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Completed Goals
                </h4>
                <div className="space-y-2">
                  {completedGoals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="flex items-center gap-3 text-sm">
                      {getGoalIcon(goal.goal_type)}
                      <span className="text-muted-foreground line-through">
                        {getGoalTypeLabel(goal.goal_type)}
                      </span>
                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
