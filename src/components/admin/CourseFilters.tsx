
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface CourseFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export const CourseFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onResetFilters,
  filteredCount,
  totalCount
}: CourseFiltersProps) => {
  return (
    <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Ricerca */}
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
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtro Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Stato corso</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tutti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti</SelectItem>
                <SelectItem value="published">Pubblicati</SelectItem>
                <SelectItem value="review">In Revisione</SelectItem>
                <SelectItem value="draft">Bozze</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filtri */}
          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={onResetFilters}
              className="w-full"
              disabled={!searchTerm && statusFilter === 'all'}
            >
              <Filter className="h-4 w-4 mr-2" />
              Reset Filtri
            </Button>
          </div>

          {/* Contatore risultati */}
          <div className="flex items-end">
            <div className="text-sm text-muted-foreground">
              {filteredCount} di {totalCount} corsi
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
