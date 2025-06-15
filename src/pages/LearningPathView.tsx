
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

export const LearningPathView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: path, isLoading: pathLoading } = useLearningPath(id!);
  const { data: courses } = useCourses();
  const { data: userProgress } = useUserProgress();
  const { data: pathProgress } = useLearningPathProgress(id!);

  if (pathLoading || !path) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fairmind-light via-white to-fairmind-light/30 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-40 bg-white/70 rounded-xl animate-pulse shadow-fairmind"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-fairmind-light via-white to-fairmind-light/30">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 rounded-lg hover:bg-fairmind-light"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Indietro
          </Button>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-fairmind-primary">{path.title}</h1>
            {path.description && (
              <p className="text-lg text-fairmind-secondary max-w-3xl">
                {path.description}
              </p>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-fairmind bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-fairmind-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-fairmind-primary">{stats.totalCount}</div>
              <div className="text-sm text-fairmind-secondary">Corsi Totali</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-fairmind bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-fairmind-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-fairmind-primary">{stats.totalHours}h</div>
              <div className="text-sm text-fairmind-secondary">Durata Totale</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-fairmind bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-fairmind-yellow mx-auto mb-2" />
              <div className="text-2xl font-bold text-fairmind-primary">{stats.progressPercentage}%</div>
              <div className="text-sm text-fairmind-secondary">Completamento</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-fairmind bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-fairmind-yellow mx-auto mb-2" />
              <div className="text-2xl font-bold text-fairmind-primary">{stats.completedCount}</div>
              <div className="text-sm text-fairmind-secondary">Completati</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {stats.progressPercentage > 0 && (
          <Card className="border-0 shadow-fairmind bg-white/70 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-fairmind-primary">Progresso del Percorso</h3>
                  <span className="text-sm font-medium text-fairmind-primary">
                    {stats.completedCount} di {stats.totalCount} corsi completati
                  </span>
                </div>
                <Progress value={stats.progressPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Types */}
        <Card className="border-0 shadow-fairmind bg-white/70 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-fairmind-primary">Tipi di Contenuto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.types.map((type, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1 rounded-full border-fairmind-light text-fairmind-primary">
                  {type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Courses List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-fairmind-primary">Corsi del Percorso</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pathCourses.map((course, index) => {
              const courseProgress = userProgress?.find(p => p.course_id === course.id);
              const isCompleted = courseProgress?.progress_percentage === 100;
              
              return (
                <div key={course.id} className="relative">
                  <div className="absolute -top-2 -left-2 z-10 bg-fairmind-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <CheckCircle className="h-8 w-8 text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                  <Card className="group hover:shadow-fairmind-lg transition-all duration-300 border-0 shadow-fairmind bg-white/70 backdrop-blur-sm hover:scale-[1.02]">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-fairmind-primary transition-colors">
                        {course.title}
                      </CardTitle>
                      <p className="text-sm text-fairmind-secondary line-clamp-3">
                        {course.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs bg-fairmind-light text-fairmind-primary px-2 py-1 rounded-full">
                          {course.course_type}
                        </span>
                        <span className="text-xs text-fairmind-secondary">
                          {course.duration}
                        </span>
                      </div>
                      <Button 
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="w-full rounded-lg bg-fairmind-accent hover:bg-fairmind-accent/90 text-white font-medium"
                      >
                        {isCompleted ? 'Rivedi Corso' : 'Inizia Corso'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
