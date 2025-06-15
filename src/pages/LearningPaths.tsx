
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  GraduationCap, 
  BookOpen,
  Filter,
  X
} from 'lucide-react';
import { useLearningPaths } from '@/hooks/useLearningPaths';
import { LearningPathCard } from '@/components/learning-paths/LearningPathCard';

export const LearningPaths = () => {
  const { data: learningPaths, isLoading } = useLearningPaths();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPaths = learningPaths?.filter((path) =>
    path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    path.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleResetFilters = () => {
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-card/50 rounded-3xl animate-pulse"></div>
            ))}
          </div>
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
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Percorsi di Apprendimento</h1>
              <p className="text-lg text-muted-foreground">
                Segui percorsi strutturati per un apprendimento guidato e completo
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium">
                  Cerca percorsi
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

              {/* Reset Filters */}
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={handleResetFilters}
                  className="rounded-full w-full"
                  disabled={!searchTerm}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset Filtri
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              {filteredPaths.length} {filteredPaths.length === 1 ? 'percorso trovato' : 'percorsi trovati'}
            </h2>
          </div>

          {filteredPaths.length === 0 ? (
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
                <h3 className="text-xl font-medium mb-2">
                  {searchTerm ? 'Nessun percorso trovato' : 'Nessun percorso disponibile'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? 'Prova a modificare i filtri di ricerca' 
                    : 'I percorsi di apprendimento saranno presto disponibili'
                  }
                </p>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    onClick={handleResetFilters}
                    className="mt-4 rounded-full"
                  >
                    Reset Filtri
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPaths.map((path) => (
                <LearningPathCard key={path.id} path={path} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
