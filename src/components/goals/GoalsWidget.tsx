
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
    new Date(goal.completed_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ) || [];

  if (isLoading) {
    return (
      <Card className="hover-educational">
        <CardHeader>
          <CardTitle className="text-educational-h3">Obiettivi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-educational-sm">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-educational animate-educational-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-educational">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-educational-sm">
        <CardTitle className="text-educational-h3">I Miei Obiettivi</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/goals')}
          className="h-8 w-8 p-0 hover-educational"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-educational-md">
        {/* Obiettivi Completati di Recente */}
        {recentlyCompleted.length > 0 && (
          <div>
            <div className="flex items-center gap-educational-xs mb-educational-sm">
              <div className="w-5 h-5 bg-success/10 rounded-educational flex items-center justify-center">
                <Trophy className="h-3 w-3 text-success" />
              </div>
              <span className="text-educational-small font-medium text-success">
                Obiettivi Raggiunti!
              </span>
            </div>
            {recentlyCompleted.slice(0, 2).map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between p-educational-sm bg-success/5 border border-success/20 rounded-educational mb-educational-xs hover-educational"
              >
                <div>
                  <p className="text-educational-small font-medium text-success">
                    {getGoalTypeLabel(goal.goal_type)}
                  </p>
                  <p className="text-educational-caption text-success/80">
                    {goal.target_value} raggiunto!
                  </p>
                </div>
                <Badge className="text-educational-caption bg-success hover:bg-success/90">
                  Completato
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Obiettivi Attivi */}
        {activeGoals.length > 0 ? (
          <div>
            <div className="flex items-center gap-educational-xs mb-educational-sm">
              <div className="w-5 h-5 bg-primary/10 rounded-educational flex items-center justify-center">
                <Target className="h-3 w-3 text-primary" />
              </div>
              <span className="text-educational-small font-medium text-accent-foreground">
                Obiettivi Attivi
              </span>
            </div>
            <div className="space-y-educational-sm">
              {activeGoals.slice(0, 3).map((goal) => {
                const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);
                const daysLeft = Math.ceil((new Date(goal.period_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div
                    key={goal.id}
                    className="p-educational-sm border border-border rounded-educational hover:bg-accent/50 transition-all duration-200 hover-educational"
                  >
                    <div className="flex items-center justify-between mb-educational-xs">
                      <span className="text-educational-small font-medium text-accent-foreground">
                        {getGoalTypeLabel(goal.goal_type)}
                      </span>
                      <div className="flex items-center gap-1 text-educational-caption text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {daysLeft > 0 ? `${daysLeft}g` : 'Scaduto'}
                      </div>
                    </div>
                    
                    <div className="space-y-educational-xs">
                      <div className="flex items-center justify-between text-educational-small">
                        <span className="text-muted-foreground">
                          {goal.current_value} / {goal.target_value}
                        </span>
                        <span className="font-medium text-accent-foreground">
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
                  className="w-full text-educational-small hover-educational"
                >
                  Vedi tutti gli obiettivi ({activeGoals.length})
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-educational-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-educational-sm">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <p className="text-educational-small text-muted-foreground mb-educational-sm">
              Non hai obiettivi attivi
            </p>
            <Button
              size="sm"
              onClick={() => navigate('/goals')}
              className="flex items-center gap-2 hover-educational"
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
