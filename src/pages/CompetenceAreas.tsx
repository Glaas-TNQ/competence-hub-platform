import React, { useState } from 'react';
import { CourseCard } from "@/components/CourseCard";
import { useCourses, useCompetenceAreas, useUserProgress } from "@/hooks/useSupabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter,
  X,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNavigate } from 'react-router-dom';

export const CompetenceAreas = () => {
  const { data: courses, isLoading, error } = useCourses();
  const { data: competenceAreas } = useCompetenceAreas();
  const { data: userProgress } = useUserProgress();
  const navigate = useNavigate();
  
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [completionFilter, setCompletionFilter] = useState<string>('all');

  const handleResetFilters = () => {
    setSelectedArea('all');
    setSearchTerm('');
  };

  const filteredCourses = courses?.filter((course) => {
    const matchesArea = selectedArea === 'all' || course.competence_area_id === selectedArea;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check completion status
    let matchesCompletion = true;
    if (completionFilter !== 'all') {
      const courseProgress = userProgress?.find(p => p.course_id === course.id);
      const isCompleted = courseProgress?.progress_percentage === 100;
      
      if (completionFilter === 'completed') {
        matchesCompletion = isCompleted;
      } else if (completionFilter === 'not-completed') {
        matchesCompletion = !isCompleted;
      }
    }
    
    return matchesArea && matchesSearch && matchesCompletion;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-card/50 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className="text-3xl font-bold text-destructive mb-6">
            Errore nel caricamento
          </h2>
          <p className="text-lg text-muted-foreground">
            Si è verificato un errore durante il caricamento dei dati.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Filter className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Aree di Competenza
              </h1>
              <p className="text-lg text-muted-foreground">
                Esplora i corsi disponibili per ogni area
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium">
                  Cerca corsi
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Titolo o descrizione..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-full"
                  />
                </div>
              </div>

              {/* Area Filter */}
              <div className="space-y-2">
                <Label htmlFor="area-filter" className="text-sm font-medium">
                  Area di competenza
                </Label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger id="area-filter">
                    <SelectValue placeholder="Seleziona area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte le aree</SelectItem>
                    {competenceAreas?.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Completion Filter */}
              <div className="space-y-2">
                <Label htmlFor="completion-filter" className="text-sm font-medium">
                  Completamento
                </Label>
                <Select value={completionFilter} onValueChange={setCompletionFilter}>
                  <SelectTrigger id="completion-filter">
                    <SelectValue placeholder="Seleziona stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i corsi</SelectItem>
                    <SelectItem value="completed">Completati</SelectItem>
                    <SelectItem value="not-completed">Non completati</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Filters */}
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={handleResetFilters}
                  className="rounded-full w-full"
                  disabled={!selectedArea && !searchTerm}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset Filtri
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Paths Section */}
        <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-primary" />
              Percorsi di Apprendimento
            </CardTitle>
            <p className="text-muted-foreground">
              Segui percorsi strutturati per un apprendimento guidato
            </p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/learning-paths')}
              variant="outline"
              className="w-full rounded-full border-dashed"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Esplora Percorsi di Apprendimento
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'corso trovato' : 'corsi trovati'}
            </h2>
          </div>

          {filteredCourses.length === 0 ? (
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
                <h3 className="text-xl font-medium mb-2">
                  Nessun corso trovato
                </h3>
                <p className="text-muted-foreground">
                  Prova a modificare i filtri di ricerca
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleResetFilters}
                  className="mt-4 rounded-full"
                >
                  Reset Filtri
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
