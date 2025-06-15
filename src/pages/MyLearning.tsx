
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, TrendingUp, Target, Trophy } from 'lucide-react';
import { CourseCardById } from '../components/CourseCardById';
import { useUserProgress, useCourses } from '../hooks/useSupabase';

export const MyLearning = () => {
  const navigate = useNavigate();
  const { data: userProgress = [], isLoading: progressLoading } = useUserProgress();
  const { data: allCourses = [], isLoading: coursesLoading } = useCourses();

  if (progressLoading || coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto p-8">
          <div className="space-y-6">
            <div className="h-12 bg-card/50 rounded-2xl animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-card/50 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get courses with progress
  const myCourses = userProgress.map(progress => {
    const course = allCourses.find(c => c.id === progress.course_id);
    return course ? { ...course, progress: progress.progress_percentage } : null;
  }).filter(Boolean);

  const completedCourses = myCourses.filter(course => course.progress === 100);
  const inProgressCourses = myCourses.filter(course => course.progress > 0 && course.progress < 100);
  
  const totalProgress = myCourses.length > 0 
    ? Math.round(myCourses.reduce((sum, course) => sum + course.progress, 0) / myCourses.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            I Miei Corsi
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitora i tuoi progressi e continua l'apprendimento
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-10 w-10 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-2">{inProgressCourses.length}</div>
              <div className="text-sm text-muted-foreground">In Corso</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Trophy className="h-10 w-10 text-success mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-2">{completedCourses.length}</div>
              <div className="text-sm text-muted-foreground">Completati</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Target className="h-10 w-10 text-secondary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-2">{myCourses.length}</div>
              <div className="text-sm text-muted-foreground">Totali</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-10 w-10 text-focus mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-2">{totalProgress}%</div>
              <div className="text-sm text-muted-foreground">Progresso Medio</div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        {myCourses.length > 0 && (
          <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Progresso Complessivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={totalProgress} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{completedCourses.length} di {myCourses.length} corsi completati</span>
                  <span>{totalProgress}% completato</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* In Progress Courses */}
        {inProgressCourses.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Corsi in Corso</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.map((course) => (
                <CourseCardById key={course.id} courseId={course.id} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Courses */}
        {completedCourses.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Corsi Completati</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map((course) => (
                <CourseCardById key={course.id} courseId={course.id} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {myCourses.length === 0 && (
          <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Nessun corso iniziato</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Inizia il tuo percorso di apprendimento esplorando le nostre aree di competenza
              </p>
              <Button 
                onClick={() => navigate('/areas')}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105"
              >
                Esplora Corsi
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
