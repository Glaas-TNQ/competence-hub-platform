
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Play, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useLearningPathProgress } from '@/hooks/useLearningPaths';
import { useCourses } from '@/hooks/useSupabase';
import { useNavigate } from 'react-router-dom';

interface LearningPathCardProps {
  path: any;
}

export const LearningPathCard: React.FC<LearningPathCardProps> = ({ path }) => {
  const navigate = useNavigate();
  const { data: courses } = useCourses();
  const { data: progress } = useLearningPathProgress(path.id);

  const calculatePathStats = () => {
    if (!courses) return { totalHours: 0, types: [], pathCourses: [] };
    
    const pathCourses = courses.filter(course => path.course_ids?.includes(course.id));
    const totalMinutes = pathCourses.reduce((sum, course) => {
      const duration = parseInt(course.duration) || 0;
      return sum + duration;
    }, 0);
    
    const types = [...new Set(pathCourses.map(course => course.course_type))];
    
    return {
      totalHours: Math.round(totalMinutes / 60 * 10) / 10,
      types,
      pathCourses,
    };
  };

  const stats = calculatePathStats();
  const progressPercentage = progress?.progress_percentage || 0;
  const isStarted = progressPercentage > 0;
  const isCompleted = progressPercentage === 100;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-educational-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {path.title}
          </CardTitle>
          {isCompleted && (
            <CheckCircle className="h-6 w-6 text-success flex-shrink-0" />
          )}
        </div>
        {path.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {path.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-medium">{path.course_ids?.length || 0}</span>
            <span className="text-muted-foreground">corsi</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-secondary" />
            <span className="font-medium">{stats.totalHours}h</span>
            <span className="text-muted-foreground">totali</span>
          </div>
        </div>

        {/* Content Types */}
        <div className="flex flex-wrap gap-2">
          {stats.types.map((type, index) => (
            <Badge key={index} variant="outline" className="text-xs px-2 py-1 rounded-full">
              {type}
            </Badge>
          ))}
        </div>

        {/* Progress */}
        {isStarted && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Progresso</span>
              <span className="text-primary font-semibold">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {progress?.completed_course_ids?.length || 0} di {path.course_ids?.length || 0} corsi completati
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button 
          className="w-full rounded-full"
          variant={isStarted ? "default" : "outline"}
          onClick={() => navigate(`/learning-path/${path.id}`)}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Rivedi Percorso
            </>
          ) : isStarted ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Continua
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Inizia Percorso
            </>
          )}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
