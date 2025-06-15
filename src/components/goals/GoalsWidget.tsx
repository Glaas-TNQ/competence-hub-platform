
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUserGoals } from '@/hooks/useUserGoals';
import { Target, ArrowRight, Trophy, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export const GoalsWidget: React.FC = () => {
  const { data: goals, isLoading } = useUserGoals();
  const navigate = useNavigate();
  
  const activeGoals = goals?.filter(goal => 
    !goal.is_completed && 
    new Date(goal.period_end) >= new Date()
  ) || [];
  
  const recentlyCompleted = goals?.filter(goal => 
    goal.is_completed && 
    goal.completed_at &&
    new Date(goal.completed_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
  ) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Obiettivi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">I Miei Obiettivi</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/goals')}
          className="h-8 px-2"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        {/* Obiettivi Completati di Recente */}
        {recentlyCompleted.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-green-700">Obiettivi Raggiunti!</span>
            </div>
            {recentlyCompleted.slice(0, 2).map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg mb-2"
              >
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {getGoalTypeLabel(goal.goal_type)}
                  </p>
                  <p className="text-xs text-green-600">
                    {goal.target_value} raggiunto!
                  </p>
                </div>
                <Badge variant="default" className="bg-green-600 text-xs">
                  Completato
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Obiettivi Attivi */}
        {activeGoals.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Obiettivi Attivi</span>
            </div>
            {activeGoals.slice(0, 3).map((goal) => {
              const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);
              const daysLeft = Math.ceil((new Date(goal.period_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div
                  key={goal.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {getGoalTypeLabel(goal.goal_type)}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {daysLeft > 0 ? `${daysLeft}g` : 'Scaduto'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {goal.current_value} / {goal.target_value}
                      </span>
                      <span className="font-medium">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              );
            })}
            
            {activeGoals.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/goals')}
                className="w-full text-sm"
              >
                Vedi tutti gli obiettivi ({activeGoals.length})
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-3">
              Non hai obiettivi attivi
            </p>
            <Button
              size="sm"
              onClick={() => navigate('/goals')}
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Crea Obiettivo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function getGoalTypeLabel(goalType: string): string {
  const labels: Record<string, string> = {
    'courses_completed': 'Corsi Completati',
    'study_days': 'Giorni di Studio',
    'points_earned': 'Punti Guadagnati',
  };
  return labels[goalType] || goalType;
}
