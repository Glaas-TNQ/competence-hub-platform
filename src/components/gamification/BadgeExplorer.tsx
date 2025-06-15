
import React, { useState } from 'react';
import { useUserBadges, useAllBadges } from '@/hooks/useGamification';
import { Badge } from '@/components/ui/badge';
import * as Icons from 'lucide-react';

const rarityColors = {
  common: 'bg-muted/50 border-muted text-foreground',
  rare: 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-300',
  epic: 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/30 dark:border-purple-600 dark:text-purple-300',
  legendary: 'bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-600 dark:text-yellow-300',
};

const rarityLabels = {
  common: 'Comune',
  rare: 'Raro',
  epic: 'Epico',
  legendary: 'Leggendario',
};

const categoryLabels = {
  completion: 'Completamento',
  competency: 'Competenza',
  temporal: 'Temporale',
  special: 'Speciale',
};

interface BadgeType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  criteria: any;
  points_reward: number;
  rarity: string;
}

interface UserBadgeType {
  badge_id: string;
  badges: BadgeType;
}

export const BadgeExplorer = () => {
  const { data: userBadges } = useUserBadges();
  const { data: allBadges } = useAllBadges();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const earnedBadgeIds = new Set((userBadges as UserBadgeType[])?.map(ub => ub.badge_id) || []);
  
  const filteredBadges = (allBadges as BadgeType[])?.filter(badge => {
    const categoryMatch = selectedCategory === 'all' || badge.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || 
      (selectedStatus === 'earned' && earnedBadgeIds.has(badge.id)) ||
      (selectedStatus === 'available' && !earnedBadgeIds.has(badge.id));
    
    return categoryMatch && statusMatch;
  }) || [];

  const categories = ['all', ...new Set((allBadges as BadgeType[])?.map(b => b.category) || [])];

  const getBadgeDescription = (badge: BadgeType) => {
    const criteria = badge.criteria;
    if (!criteria || typeof criteria !== 'object') return badge.description;
    
    switch (criteria.type) {
      case 'chapter_completion':
        return `Completa ${criteria.count} capitoli`;
      case 'course_completion':
        return `Completa ${criteria.count} corsi`;
      case 'daily_streak':
        return `Studia per ${criteria.days} giorni consecutivi`;
      case 'level_milestone':
        return `Raggiungi il livello ${criteria.level}`;
      case 'total_chapters':
        return `Completa ${criteria.count} capitoli in totale`;
      case 'competence_area_mastery':
        return `Completa tutti i corsi di ${criteria.competence_area}`;
      default:
        return badge.description;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Esplora Badge
        </h1>
        <p className="text-lg text-muted-foreground">
          Scopri tutti i badge disponibili e i tuoi progressi
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Categoria</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border-0 bg-background/50 rounded-xl text-sm text-foreground"
          >
            <option value="all">Tutte</option>
            {categories.slice(1).map(category => (
              <option key={category} value={category}>
                {categoryLabels[category as keyof typeof categoryLabels] || category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Stato</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border-0 bg-background/50 rounded-xl text-sm text-foreground"
          >
            <option value="all">Tutti</option>
            <option value="earned">Guadagnati</option>
            <option value="available">Disponibili</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-success/10 to-success/20 border border-success/20 rounded-2xl p-6 text-center shadow-educational">
          <div className="text-3xl font-bold text-success">{userBadges?.length || 0}</div>
          <div className="text-sm text-success/80 font-medium">Badge Guadagnati</div>
        </div>
        <div className="bg-gradient-to-r from-primary/10 to-primary/20 border border-primary/20 rounded-2xl p-6 text-center shadow-educational">
          <div className="text-3xl font-bold text-primary">{allBadges?.length || 0}</div>
          <div className="text-sm text-primary/80 font-medium">Badge Totali</div>
        </div>
        <div className="bg-gradient-to-r from-secondary/10 to-secondary/20 border border-secondary/20 rounded-2xl p-6 text-center shadow-educational">
          <div className="text-3xl font-bold text-secondary">
            {allBadges ? Math.round(((userBadges?.length || 0) / allBadges.length) * 100) : 0}%
          </div>
          <div className="text-sm text-secondary/80 font-medium">Completamento</div>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map((badge) => {
          const isEarned = earnedBadgeIds.has(badge.id);
          const IconComponent = (Icons as any)[badge.icon] || Icons.Award;
          const rarityClass = rarityColors[badge.rarity as keyof typeof rarityColors] || rarityColors.common;
          
          return (
            <div
              key={badge.id}
              className={`relative rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 shadow-educational ${
                isEarned 
                  ? rarityClass 
                  : 'bg-card/50 backdrop-blur-sm border-border text-muted-foreground'
              }`}
            >
              {/* Earned indicator */}
              {isEarned && (
                <div className="absolute top-3 right-3">
                  <Icons.Check className="h-5 w-5 text-success" />
                </div>
              )}
              
              {/* Badge icon */}
              <div className="flex items-center justify-center mb-4">
                <IconComponent className={`h-16 w-16 ${isEarned ? '' : 'opacity-50'}`} />
              </div>
              
              {/* Badge info */}
              <h4 className="font-semibold text-center mb-3 text-lg">{badge.name}</h4>
              <p className="text-sm text-center mb-4 opacity-80">
                {getBadgeDescription(badge)}
              </p>
              
              {/* Rarity and points */}
              <div className="flex items-center justify-between text-sm">
                <Badge variant="outline" className="text-xs border-current">
                  {rarityLabels[badge.rarity as keyof typeof rarityLabels] || badge.rarity}
                </Badge>
                <span className="font-medium">
                  {badge.points_reward} punti
                </span>
              </div>
              
              {/* Category */}
              <div className="mt-3 text-center">
                <span className="text-xs px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm border border-border">
                  {categoryLabels[badge.category as keyof typeof categoryLabels] || badge.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icons.Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Nessun badge trovato
          </h3>
          <p className="text-muted-foreground">
            Nessun badge trovato con i filtri selezionati.
          </p>
        </div>
      )}
    </div>
  );
};
