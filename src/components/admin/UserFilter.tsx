
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface UserFilterProps {
  onFilterChange: (filter: string) => void;
  currentFilter: string;
}

export const UserFilter: React.FC<UserFilterProps> = ({ onFilterChange, currentFilter }) => {
  const [localFilter, setLocalFilter] = useState(currentFilter);

  const handleApplyFilter = () => {
    onFilterChange(localFilter);
  };

  const handleClearFilter = () => {
    setLocalFilter('');
    onFilterChange('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyFilter();
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm p-4 rounded-lg border">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filtra per email utente..."
          value={localFilter}
          onChange={(e) => setLocalFilter(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-10"
        />
        {localFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocalFilter('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Button onClick={handleApplyFilter} size="sm">
        Applica Filtro
      </Button>
      {currentFilter && (
        <Button onClick={handleClearFilter} variant="outline" size="sm">
          Cancella
        </Button>
      )}
    </div>
  );
};
