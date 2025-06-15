
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Target, 
  Flame, 
  Trophy,
  Clock,
  BarChart3,
  Star
} from 'lucide-react';

interface CompactStatsCardProps {
  completedCourses: number;
  inProgressCourses: number;
  totalPoints: number;
  level: number;
  streak?: number;
  badges?: number;
}

export const CompactStatsCard: React.FC<CompactStatsCardProps> = ({
  completedCourses,
  inProgressCourses,
  totalPoints,
  level,
  streak = 0,
  badges = 0,
}) => {
  const totalCourses = completedCourses + inProgressCourses;
  const completionRate = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

  return (
    <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Progresso Corsi */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Progresso</h3>
                <p className="text-sm text-muted-foreground">Corsi completati</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{completedCourses}</div>
                  <div className="text-sm text-muted-foreground">Completati</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-muted-foreground mb-1">{inProgressCourses}</div>
                  <div className="text-sm text-muted-foreground">In corso</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">Completamento</span>
                  <span className="text-sm font-bold text-primary">
                    {Math.round(completionRate)}%
                  </span>
                </div>
                <Progress value={completionRate} className="h-2" />
                {totalCourses === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    Inizia il tuo primo corso!
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {totalCourses} {totalCourses === 1 ? 'corso totale' : 'corsi totali'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Livello */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/10 rounded-2xl border border-secondary/20">
                <Trophy className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Livello</h3>
                <p className="text-sm text-muted-foreground">Esperienza guadagnata</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold text-secondary">{level}</div>
                <Badge variant="secondary" className="px-3 py-1 rounded-full text-sm font-medium">
                  Livello
                </Badge>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{totalPoints.toLocaleString()}</span> punti esperienza
                </div>
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Streak</h3>
                <p className="text-sm text-muted-foreground">Giorni consecutivi</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-orange-500">{streak}</span>
                <span className="text-sm text-muted-foreground">
                  {streak === 1 ? 'giorno' : 'giorni'}
                </span>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className={`text-sm font-medium ${
                  streak === 0 ? 'text-muted-foreground' : 
                  streak < 7 ? 'text-orange-500' : 
                  streak < 30 ? 'text-purple-500' : 'text-yellow-500'
                }`}>
                  {streak === 0 ? 'Inizia oggi!' : 
                   streak < 7 ? 'Ottimo inizio!' : 
                   streak < 30 ? 'Fantastico!' : 'Incredibile!'}
                </div>
              </div>
            </div>
          </div>

          {/* Risultati */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                <Award className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Risultati</h3>
                <p className="text-sm text-muted-foreground">Badge e certificati</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-4 bg-muted/30 rounded-2xl border border-muted">
                  <div className="text-2xl font-bold text-purple-500 mb-1">{badges}</div>
                  <div className="text-sm text-muted-foreground">Badge</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-2xl border border-muted">
                  <div className="text-2xl font-bold text-success mb-1">{completedCourses}</div>
                  <div className="text-sm text-muted-foreground">Certificati</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
