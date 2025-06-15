
import React, { useState } from 'react';
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
      <div className="min-h-screen bg-gradient-to-br from-fairmind-light via-white to-fairmind-light/30 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-white/70 rounded-xl animate-pulse shadow-fairmind"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fairmind-light via-white to-fairmind-light/30 p-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className="text-3xl font-bold text-fairmind-primary mb-6">
            Errore nel caricamento
          </h2>
          <p className="text-lg text-fairmind-secondary">
            Si è verificato un errore durante il caricamento dei dati.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fairmind-light via-white to-fairmind-light/30">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-fairmind-primary/10 rounded-xl">
              <Filter className="h-8 w-8 text-fairmind-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-fairmind-primary">
                Aree di Competenza
              </h1>
              <p className="text-lg text-fairmind-secondary">
                Esplora i corsi disponibili per ogni area
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-fairmind bg-white/70 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium text-fairmind-primary">
                  Cerca corsi
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fairmind-secondary" />
                  <Input
                    id="search"
                    placeholder="Titolo o descrizione..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-lg border-fairmind-light focus:border-fairmind-primary"
                  />
                </div>
              </div>

              {/* Area Filter */}
              <div className="space-y-2">
                <Label htmlFor="area-filter" className="text-sm font-medium text-fairmind-primary">
                  Area di competenza
                </Label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger id="area-filter" className="rounded-lg border-fairmind-light">
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
                <Label htmlFor="completion-filter" className="text-sm font-medium text-fairmind-primary">
                  Completamento
                </Label>
                <Select value={completionFilter} onValueChange={setCompletionFilter}>
                  <SelectTrigger id="completion-filter" className="rounded-lg border-fairmind-light">
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
                  className="rounded-lg w-full border-fairmind-light hover:bg-fairmind-light"
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
        <Card className="border-0 shadow-fairmind bg-white/70 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-fairmind-primary">
              <GraduationCap className="h-6 w-6" />
              Percorsi di Apprendimento
            </CardTitle>
            <p className="text-fairmind-secondary">
              Segui percorsi strutturati per un apprendimento guidato
            </p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/learning-paths')}
              className="w-full rounded-lg bg-fairmind-accent hover:bg-fairmind-accent/90 text-white font-semibold"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Esplora Percorsi di Apprendimento
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-fairmind-primary">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'corso trovato' : 'corsi trovati'}
            </h2>
          </div>

          {filteredCourses.length === 0 ? (
            <Card className="border-0 shadow-fairmind bg-white/70 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-fairmind-secondary/40" />
                <h3 className="text-xl font-medium mb-2 text-fairmind-primary">
                  Nessun corso trovato
                </h3>
                <p className="text-fairmind-secondary">
                  Prova a modificare i filtri di ricerca
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleResetFilters}
                  className="mt-4 rounded-lg border-fairmind-light hover:bg-fairmind-light"
                >
                  Reset Filtri
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="group hover:shadow-fairmind-lg transition-all duration-300 border-0 shadow-fairmind bg-white/70 backdrop-blur-sm hover:scale-[1.02]">
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
                      Inizia Corso
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
