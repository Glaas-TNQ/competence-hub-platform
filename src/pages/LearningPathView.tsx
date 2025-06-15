import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Play, 
  CheckCircle,
  Target,
  Users,
  Trophy
} from 'lucide-react';
import { useLearningPath, useLearningPathProgress } from '@/hooks/useLearningPaths';
import { useCourses, useUserProgress } from '@/hooks/useSupabase';
import { CourseCard } from '@/components/CourseCard';

export const LearningPathView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: path, isLoading: pathLoading } = useLearningPath(id!);
  const { data: courses } = useCourses();
  const { data: userProgress } = useUserProgress();
  const { data: pathProgress } = useLearningPathProgress(id!);

  if (pathLoading || !path) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-40 bg-card/50 rounded-3xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const pathCourses = courses?.filter(course => path.course_ids?.includes(course.id)) || [];
  
  const calculateStats = () => {
    const totalMinutes = pathCourses.reduce((sum, course) => {
      const duration = parseInt(course.duration) || 0;
      return sum + duration;
    }, 0);
    
    const types = [...new Set(pathCourses.map(course => course.course_type))];
    const completedCourses = pathCourses.filter(course => 
      userProgress?.some(p => p.course_id === course.id && p.progress_percentage === 100)
    );
    
    return {
      totalHours: Math.round(totalMinutes / 60 * 10) / 10,
      types,
      completedCount: completedCourses.length,
      totalCount: pathCourses.length,
      progressPercentage: pathCourses.length > 0 ? Math.round((completedCourses.length / pathCourses.length) * 100) : 0,
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 rounded-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Indietro
          </Button>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">{path.title}</h1>
            {path.description && (
              <p className="text-lg text-muted-foreground max-w-3xl">
                {path.description}
              </p>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalCount}</div>
              <div className="text-sm text-muted-foreground">Corsi Totali</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalHours}h</div>
              <div className="text-sm text-muted-foreground">Durata Totale</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.progressPercentage}%</div>
              <div className="text-sm text-muted-foreground">Completamento</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.completedCount}</div>
              <div className="text-sm text-muted-foreground">Completati</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {stats.progressPercentage > 0 && (
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Progresso del Percorso</h3>
                  <span className="text-sm font-medium text-primary">
                    {stats.completedCount} di {stats.totalCount} corsi completati
                  </span>
                </div>
                <Progress value={stats.progressPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Types */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>Tipi di Contenuto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.types.map((type, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1 rounded-full">
                  {type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Courses List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Corsi del Percorso</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pathCourses.map((course, index) => {
              const courseProgress = userProgress?.find(p => p.course_id === course.id);
              const isCompleted = courseProgress?.progress_percentage === 100;
              
              return (
                <div key={course.id} className="relative">
                  <div className="absolute -top-2 -left-2 z-10 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <CheckCircle className="h-8 w-8 text-success bg-background rounded-full" />
                    </div>
                  )}
                  <CourseCard courseId={course.id} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
