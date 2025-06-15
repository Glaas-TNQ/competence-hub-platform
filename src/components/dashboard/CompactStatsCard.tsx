
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
  BarChart3
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
    <Card className="card-educational">
      <CardContent className="p-educational-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-educational-lg">
          
          {/* Progresso Corsi - Design Migliorato */}
          <div className="space-y-educational-md">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-educational-h4 font-semibold">Progresso</h3>
            </div>
            
            <div className="space-y-educational-md">
              {/* Statistiche principali */}
              <div className="flex items-baseline justify-between">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{completedCourses}</div>
                  <div className="text-educational-caption text-muted-foreground">Completati</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-muted-foreground">{inProgressCourses}</div>
                  <div className="text-educational-caption text-muted-foreground">In corso</div>
                </div>
              </div>
              
              {/* Barra di progresso */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-educational-small font-medium">Completamento</span>
                  <span className="text-educational-small font-semibold text-primary">
                    {Math.round(completionRate)}%
                  </span>
                </div>
                <Progress value={completionRate} className="h-3" />
                {totalCourses === 0 ? (
                  <p className="text-educational-caption text-muted-foreground italic">
                    Inizia il tuo primo corso!
                  </p>
                ) : (
                  <p className="text-educational-caption text-muted-foreground">
                    {totalCourses} {totalCourses === 1 ? 'corso totale' : 'corsi totali'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Gamificazione */}
          <div className="space-y-educational-md">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <h3 className="text-educational-h4 font-semibold">Livello</h3>
            </div>
            
            <div className="space-y-educational-sm">
              <div className="flex items-center gap-educational-sm">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">{level}</span>
                  <Badge variant="secondary" className="text-educational-caption px-2 py-1">
                    Livello
                  </Badge>
                </div>
              </div>
              
              <div className="pt-2 border-t border-muted">
                <div className="text-educational-small text-muted-foreground">
                  <span className="font-medium">{totalPoints.toLocaleString()}</span> punti totali
                </div>
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="space-y-educational-md">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <h3 className="text-educational-h4 font-semibold">Streak</h3>
            </div>
            
            <div className="space-y-educational-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-orange-600">{streak}</span>
                <span className="text-educational-small text-muted-foreground">
                  {streak === 1 ? 'giorno' : 'giorni'}
                </span>
              </div>
              
              <div className="pt-2 border-t border-muted">
                <div className={`text-educational-small font-medium ${
                  streak === 0 ? 'text-muted-foreground' : 
                  streak < 7 ? 'text-orange-600' : 
                  streak < 30 ? 'text-purple-600' : 'text-yellow-600'
                }`}>
                  {streak === 0 ? 'Inizia oggi!' : 
                   streak < 7 ? 'Ottimo inizio!' : 
                   streak < 30 ? 'Fantastico!' : 'Incredibile!'}
                </div>
              </div>
            </div>
          </div>

          {/* Badge e Achievement */}
          <div className="space-y-educational-md">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="text-educational-h4 font-semibold">Risultati</h3>
            </div>
            
            <div className="space-y-educational-sm">
              <div className="grid grid-cols-2 gap-educational-sm">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">{badges}</div>
                  <div className="text-educational-caption text-muted-foreground">Badge</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">{completedCourses}</div>
                  <div className="text-educational-caption text-muted-foreground">Certificati</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
