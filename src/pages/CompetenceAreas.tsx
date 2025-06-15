
import React, { useState, useMemo } from 'react';
import { useCompetenceAreas, useCourses } from '@/hooks/useSupabase';
import { CourseCard } from '@/components/CourseCard';
import { Target, BookOpen, Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

export const CompetenceAreas = () => {
  const { data: competenceAreas, isLoading: areasLoading } = useCompetenceAreas();
  const { data: courses } = useCourses();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    
    return courses.filter(course => {
      if (!course.is_published) return false;
      
      // Search filter
      if (searchTerm && !course.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !course.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Area filter
      if (selectedAreas.length > 0 && !selectedAreas.includes(course.competence_area_id || '')) {
        return false;
      }
      
      // Payment filter
      if (showPaidOnly && !course.requires_payment) return false;
      if (showFreeOnly && course.requires_payment) return false;
      
      // Level filter
      if (selectedLevels.length > 0 && !selectedLevels.includes(course.level)) {
        return false;
      }
      
      return true;
    });
  }, [courses, searchTerm, selectedAreas, showPaidOnly, showFreeOnly, selectedLevels]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAreas([]);
    setShowPaidOnly(false);
    setShowFreeOnly(false);
    setSelectedLevels([]);
  };

  const hasActiveFilters = searchTerm || selectedAreas.length > 0 || showPaidOnly || showFreeOnly || selectedLevels.length > 0;

  if (areasLoading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getCoursesForArea = (areaId: string) => {
    return filteredCourses.filter(course => course.competence_area_id === areaId);
  };

  const levels = ['Principiante', 'Intermedio', 'Avanzato'];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Aree di Competenza</h1>
        <p className="text-slate-600">Esplora le diverse aree di competenza e i corsi disponibili</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Cerca corsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {/* Area Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter size={16} />
                  Aree {selectedAreas.length > 0 && `(${selectedAreas.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Aree di Competenza</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {competenceAreas?.map((area) => (
                  <DropdownMenuCheckboxItem
                    key={area.id}
                    checked={selectedAreas.includes(area.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedAreas([...selectedAreas, area.id]);
                      } else {
                        setSelectedAreas(selectedAreas.filter(id => id !== area.id));
                      }
                    }}
                  >
                    {area.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Payment Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter size={16} />
                  Costo
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Tipo di Corso</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={showFreeOnly}
                  onCheckedChange={setShowFreeOnly}
                >
                  Solo Gratuiti
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showPaidOnly}
                  onCheckedChange={setShowPaidOnly}
                >
                  Solo a Pagamento
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Level Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter size={16} />
                  Livello {selectedLevels.length > 0 && `(${selectedLevels.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Livello di Difficoltà</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {levels.map((level) => (
                  <DropdownMenuCheckboxItem
                    key={level}
                    checked={selectedLevels.includes(level)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedLevels([...selectedLevels, level]);
                      } else {
                        setSelectedLevels(selectedLevels.filter(l => l !== level));
                      }
                    }}
                  >
                    {level}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-slate-600">Filtri attivi:</span>
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Ricerca: {searchTerm}
                <X size={14} className="cursor-pointer" onClick={() => setSearchTerm('')} />
              </Badge>
            )}
            {selectedAreas.map(areaId => {
              const area = competenceAreas?.find(a => a.id === areaId);
              return area ? (
                <Badge key={areaId} variant="secondary" className="gap-1">
                  {area.name}
                  <X size={14} className="cursor-pointer" onClick={() => setSelectedAreas(selectedAreas.filter(id => id !== areaId))} />
                </Badge>
              ) : null;
            })}
            {showFreeOnly && (
              <Badge variant="secondary" className="gap-1">
                Gratuiti
                <X size={14} className="cursor-pointer" onClick={() => setShowFreeOnly(false)} />
              </Badge>
            )}
            {showPaidOnly && (
              <Badge variant="secondary" className="gap-1">
                A Pagamento
                <X size={14} className="cursor-pointer" onClick={() => setShowPaidOnly(false)} />
              </Badge>
            )}
            {selectedLevels.map(level => (
              <Badge key={level} variant="secondary" className="gap-1">
                {level}
                <X size={14} className="cursor-pointer" onClick={() => setSelectedLevels(selectedLevels.filter(l => l !== level))} />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-600">
              Cancella tutti
            </Button>
          </div>
        )}

        <div className="mt-4 text-sm text-slate-600">
          {filteredCourses.length} {filteredCourses.length === 1 ? 'corso trovato' : 'corsi trovati'}
        </div>
      </div>

      {/* Results */}
      {competenceAreas && competenceAreas.length > 0 ? (
        <div className="space-y-8">
          {/* Show all courses in a grid if there are active filters */}
          {hasActiveFilters ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Risultati della Ricerca</h2>
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      title={course.title}
                      description={course.description}
                      duration={course.duration}
                      participants={0}
                      type={course.course_type as 'text' | 'video' | 'arcade'}
                      image="photo-1516321318423-f06f85e504b3"
                      level={course.level as 'Principiante' | 'Intermedio' | 'Avanzato'}
                      requiresPayment={course.requires_payment}
                      price={course.price}
                      courseId={course.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-slate-500">Nessun corso trovato con i filtri selezionati</p>
                </div>
              )}
            </div>
          ) : (
            /* Show courses grouped by area if no filters */
            competenceAreas.map((area) => {
              const areaCourses = getCoursesForArea(area.id);
              
              return (
                <div key={area.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-4">
                      <Target size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">{area.name}</h2>
                      <p className="text-slate-600">{area.description}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {areaCourses.length} {areaCourses.length === 1 ? 'corso disponibile' : 'corsi disponibili'}
                      </p>
                    </div>
                  </div>

                  {areaCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {areaCourses.map((course) => (
                        <CourseCard
                          key={course.id}
                          title={course.title}
                          description={course.description}
                          duration={course.duration}
                          participants={0}
                          type={course.course_type as 'text' | 'video' | 'arcade'}
                          image="photo-1516321318423-f06f85e504b3"
                          level={course.level as 'Principiante' | 'Intermedio' | 'Avanzato'}
                          requiresPayment={course.requires_payment}
                          price={course.price}
                          courseId={course.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                      <p className="text-slate-500">Nessun corso disponibile in questa area</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <h3 className="text-xl font-medium text-slate-800 mb-2">Nessuna area di competenza</h3>
          <p className="text-slate-600">Le aree di competenza configurate appariranno qui</p>
        </div>
      )}
    </div>
  );
};
