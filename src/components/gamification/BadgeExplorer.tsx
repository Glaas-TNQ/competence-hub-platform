
import React, { useState } from 'react';
import { useUserBadges, useAllBadges } from '@/hooks/useGamification';
import { Badge } from '@/components/ui/badge';
import * as Icons from 'lucide-react';

const rarityColors = {
  common: 'bg-gray-100 border-gray-300 text-gray-700',
  rare: 'bg-blue-100 border-blue-300 text-blue-700',
  epic: 'bg-purple-100 border-purple-300 text-purple-700',
  legendary: 'bg-yellow-100 border-yellow-300 text-yellow-700',
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

export const BadgeExplorer = () => {
  const { data: userBadges } = useUserBadges();
  const { data: allBadges } = useAllBadges();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);
  
  const filteredBadges = allBadges?.filter(badge => {
    const categoryMatch = selectedCategory === 'all' || badge.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || 
      (selectedStatus === 'earned' && earnedBadgeIds.has(badge.id)) ||
      (selectedStatus === 'available' && !earnedBadgeIds.has(badge.id));
    
    return categoryMatch && statusMatch;
  }) || [];

  const categories = ['all', ...new Set(allBadges?.map(b => b.category) || [])];

  const getBadgeDescription = (badge: any) => {
    const criteria = badge.criteria;
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Esplora Badge</h2>
        <p className="text-slate-600">Scopri tutti i badge disponibili e i tuoi progressi</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm"
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Stato</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm"
          >
            <option value="all">Tutti</option>
            <option value="earned">Guadagnati</option>
            <option value="available">Disponibili</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{userBadges?.length || 0}</div>
          <div className="text-sm text-green-600">Badge Guadagnati</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{allBadges?.length || 0}</div>
          <div className="text-sm text-blue-600">Badge Totali</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-700">
            {allBadges ? Math.round(((userBadges?.length || 0) / allBadges.length) * 100) : 0}%
          </div>
          <div className="text-sm text-orange-600">Completamento</div>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const isEarned = earnedBadgeIds.has(badge.id);
          const IconComponent = (Icons as any)[badge.icon] || Icons.Award;
          const rarityClass = rarityColors[badge.rarity as keyof typeof rarityColors] || rarityColors.common;
          
          return (
            <div
              key={badge.id}
              className={`relative rounded-lg p-4 border-2 transition-all hover:scale-105 ${
                isEarned 
                  ? rarityClass 
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              {/* Earned indicator */}
              {isEarned && (
                <div className="absolute top-2 right-2">
                  <Icons.Check className="h-5 w-5 text-green-600" />
                </div>
              )}
              
              {/* Badge icon */}
              <div className="flex items-center justify-center mb-3">
                <IconComponent className={`h-12 w-12 ${isEarned ? '' : 'opacity-50'}`} />
              </div>
              
              {/* Badge info */}
              <h4 className="font-semibold text-center mb-2">{badge.name}</h4>
              <p className="text-sm text-center mb-3 opacity-75">
                {getBadgeDescription(badge)}
              </p>
              
              {/* Rarity and points */}
              <div className="flex items-center justify-between text-xs">
                <Badge variant="outline" className="text-xs">
                  {rarityLabels[badge.rarity as keyof typeof rarityLabels]}
                </Badge>
                <span className="font-medium">
                  {badge.points_reward} punti
                </span>
              </div>
              
              {/* Category */}
              <div className="mt-2 text-center">
                <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                  {categoryLabels[badge.category as keyof typeof categoryLabels] || badge.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <Icons.Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nessun badge trovato con i filtri selezionati.</p>
        </div>
      )}
    </div>
  );
};
