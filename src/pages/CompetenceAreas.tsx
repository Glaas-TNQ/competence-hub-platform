import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  BookOpen, 
  Clock, 
  Users, 
  TrendingUp,
  Award,
  Filter,
  Search,
  ChevronRight
} from 'lucide-react';
import { useCompetenceAreas, useCourses, useUserProgress } from '@/hooks/useSupabase';
import { CourseCard } from '@/components/CourseCard';
import { useNavigate } from 'react-router-dom';

export const CompetenceAreas = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'completed' | 'in-progress'>('all');
  const navigate = useNavigate();
  
  const { data: competenceAreas, isLoading: areasLoading } = useCompetenceAreas();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: userProgress } = useUserProgress();

  if (areasLoading || coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-card/50 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Safe array access
  const safeCompetenceAreas = Array.isArray(competenceAreas) ? competenceAreas : [];
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeUserProgress = Array.isArray(userProgress) ? userProgress : [];

  // Calculate stats for each competence area
  const areasWithStats = safeCompetenceAreas.map(area => {
    const areaCourses = safeCourses.filter(course => course.competence_area_id === area.id);
    const completedCourses = areaCourses.filter(course => 
      safeUserProgress.some(p => p.course_id === course.id && p.progress_percentage === 100)
    );
    const inProgressCourses = areaCourses.filter(course => 
      safeUserProgress.some(p => p.course_id === course.id && p.progress_percentage > 0 && p.progress_percentage < 100)
    );
    
    const progressPercentage = areaCourses.length > 0 
      ? Math.round((completedCourses.length / areaCourses.length) * 100)
      : 0;

    return {
      ...area,
      coursesCount: areaCourses.length,
      completedCount: completedCourses.length,
      inProgressCount: inProgressCourses.length,
      progressPercentage,
      courses: areaCourses
    };
  });

  const selectedAreaData = selectedArea 
    ? areasWithStats.find(area => area.id === selectedArea)
    : null;

  const filteredCourses = selectedAreaData?.courses.filter(course => {
    const courseProgress = safeUserProgress.find(p => p.course_id === course.id);
    const progressPercentage = courseProgress?.progress_percentage || 0;
    
    switch (filterCompleted) {
      case 'completed':
        return progressPercentage === 100;
      case 'in-progress':
        return progressPercentage > 0 && progressPercentage < 100;
      default:
        return true;
    }
  }) || [];

  if (selectedArea && selectedAreaData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto p-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => setSelectedArea(null)}
            className="mb-6 rounded-full hover:bg-muted/50"
          >
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Torna alle Aree di Competenza
          </Button>

          {/* Area Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-foreground">{selectedAreaData.name}</h1>
                <p className="text-lg text-muted-foreground max-w-3xl">
                  {selectedAreaData.description}
                </p>
              </div>
              <Badge 
                variant="secondary" 
                className="bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-full"
              >
                {selectedAreaData.coursesCount} corsi
              </Badge>
            </div>

            {/* Progress Overview */}
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {selectedAreaData.progressPercentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">Completamento</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-2">
                      {selectedAreaData.completedCount}
                    </div>
                    <div className="text-sm text-muted-foreground">Completati</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning mb-2">
                      {selectedAreaData.inProgressCount}
                    </div>
                    <div className="text-sm text-muted-foreground">In Corso</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-muted-foreground mb-2">
                      {selectedAreaData.coursesCount - selectedAreaData.completedCount - selectedAreaData.inProgressCount}
                    </div>
                    <div className="text-sm text-muted-foreground">Da Iniziare</div>
                  </div>
                </div>
                <div className="mt-6">
                  <Progress value={selectedAreaData.progressPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-8">
            <Button
              variant={filterCompleted === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterCompleted('all')}
              className="rounded-full"
            >
              Tutti i Corsi
            </Button>
            <Button
              variant={filterCompleted === 'in-progress' ? 'default' : 'outline'}
              onClick={() => setFilterCompleted('in-progress')}
              className="rounded-full"
            >
              In Corso
            </Button>
            <Button
              variant={filterCompleted === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilterCompleted('completed')}
              className="rounded-full"
            >
              Completati
            </Button>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} courseId={course.id} />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nessun corso trovato
              </h3>
              <p className="text-muted-foreground">
                Non ci sono corsi che corrispondono ai filtri selezionati.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Aree di Competenza
          </h1>
          <p className="text-lg text-muted-foreground">
            Esplora le diverse aree di competenza e sviluppa le tue skills
          </p>
        </div>

        {/* Competence Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areasWithStats.map((area) => (
            <Card 
              key={area.id}
              className="border-0 shadow-sm bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedArea(area.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {area.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {area.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{area.coursesCount} corsi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">{area.completedCount} completati</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Progresso</span>
                    <span className="text-sm font-medium">{area.progressPercentage}%</span>
                  </div>
                  <Progress value={area.progressPercentage} className="h-2" />
                </div>

                {/* Status Badge */}
                {area.progressPercentage === 100 ? (
                  <Badge variant="default" className="bg-success/10 text-success border-success/20">
                    Completato
                  </Badge>
                ) : area.progressPercentage > 0 ? (
                  <Badge variant="default" className="bg-warning/10 text-warning border-warning/20">
                    In Corso
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Da Iniziare
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {areasWithStats.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nessuna area di competenza disponibile
            </h3>
            <p className="text-muted-foreground">
              Le aree di competenza verranno caricate a breve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
