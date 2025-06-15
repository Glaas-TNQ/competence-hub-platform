
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  BookOpen, 
  Target, 
  Calendar,
  ArrowRight,
  Star,
  PlayCircle,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompactActivityCardProps {
  recentCourses?: any[];
  goals?: any[];
}

export const CompactActivityCard: React.FC<CompactActivityCardProps> = ({
  recentCourses = [],
  goals = [],
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Attività Recente */}
      <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            Attività Recente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {recentCourses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium mb-2">Nessun corso iniziato</p>
              <p className="text-sm mb-6">Inizia il tuo percorso di apprendimento</p>
              <Button 
                variant="default" 
                className="rounded-full px-6"
                onClick={() => navigate('/my-learning')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Esplora corsi
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {recentCourses.slice(0, 3).map((course, index) => (
                  <div 
                    key={course.id || index}
                    className="flex items-center justify-between p-5 bg-muted/20 rounded-2xl border border-muted hover:bg-muted/30 transition-all duration-200 cursor-pointer group"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-xl">
                        <PlayCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1 mb-1">
                          {course.title}
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs px-2 py-1 rounded-full">
                            {course.course_type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {course.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full rounded-full border-dashed"
                onClick={() => navigate('/my-learning')}
              >
                Vedi tutti i corsi
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Obiettivi */}
      <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 bg-secondary/10 rounded-xl border border-secondary/20">
              <Target className="h-5 w-5 text-secondary" />
            </div>
            Obiettivi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {goals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium mb-2">Nessun obiettivo impostato</p>
              <p className="text-sm mb-6">Crea un obiettivo per guidare il tuo apprendimento</p>
              <Button 
                variant="default" 
                className="rounded-full px-6"
                onClick={() => navigate('/goals')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Crea obiettivo
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {goals.slice(0, 3).map((goal, index) => (
                  <div 
                    key={goal.id || index}
                    className="flex items-center justify-between p-5 bg-secondary/5 rounded-2xl border border-secondary/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-secondary/10 rounded-xl">
                        <Star className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">
                          {goal.title}
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={goal.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs px-2 py-1 rounded-full"
                          >
                            {goal.status === 'completed' ? 'Completato' : 'In corso'}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(goal.target_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full rounded-full border-dashed"
                onClick={() => navigate('/goals')}
              >
                Gestisci obiettivi
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
