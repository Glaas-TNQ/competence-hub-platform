
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
  PlayCircle
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-educational-lg">
      {/* Attività Recente */}
      <Card className="card-educational">
        <CardHeader className="pb-educational-md">
          <CardTitle className="flex items-center gap-2 text-educational-h3">
            <Clock className="h-5 w-5 text-primary" />
            Attività Recente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-educational-md">
          {recentCourses.length === 0 ? (
            <div className="text-center py-educational-lg text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-educational-small">Nessun corso iniziato</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-educational-sm"
                onClick={() => navigate('/my-learning')}
              >
                Esplora corsi
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-educational-sm">
                {recentCourses.slice(0, 3).map((course, index) => (
                  <div 
                    key={course.id || index}
                    className="flex items-center justify-between p-educational-sm bg-muted/30 rounded-educational-sm hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    <div className="flex items-center gap-educational-sm">
                      <PlayCircle className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-educational-small font-medium line-clamp-1">
                          {course.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-educational-caption">
                            {course.course_type}
                          </Badge>
                          <span className="text-educational-caption text-muted-foreground">
                            {course.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-educational-md"
                onClick={() => navigate('/my-learning')}
              >
                Vedi tutti i corsi
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Obiettivi */}
      <Card className="card-educational">
        <CardHeader className="pb-educational-md">
          <CardTitle className="flex items-center gap-2 text-educational-h3">
            <Target className="h-5 w-5 text-secondary" />
            Obiettivi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-educational-md">
          {goals.length === 0 ? (
            <div className="text-center py-educational-lg text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-educational-small">Nessun obiettivo impostato</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-educational-sm"
                onClick={() => navigate('/goals')}
              >
                Crea obiettivo
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-educational-sm">
                {goals.slice(0, 3).map((goal, index) => (
                  <div 
                    key={goal.id || index}
                    className="flex items-center justify-between p-educational-sm bg-secondary/10 rounded-educational-sm"
                  >
                    <div className="flex items-center gap-educational-sm">
                      <Star className="h-4 w-4 text-secondary" />
                      <div>
                        <p className="text-educational-small font-medium">
                          {goal.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={goal.status === 'completed' ? 'default' : 'secondary'}
                            className="text-educational-caption"
                          >
                            {goal.status === 'completed' ? 'Completato' : 'In corso'}
                          </Badge>
                          <span className="text-educational-caption text-muted-foreground">
                            <Calendar className="h-3 w-3 inline mr-1" />
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
                className="w-full mt-educational-md"
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
