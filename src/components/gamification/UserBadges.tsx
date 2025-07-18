
import React from 'react';
import { useUserBadges } from '@/hooks/useGamification';
import { useTranslation } from '@/contexts/LanguageContext';
import * as Icons from 'lucide-react';

const rarityColors = {
  common: 'bg-gray-100 border-gray-300 text-gray-700',
  rare: 'bg-blue-100 border-blue-300 text-blue-700',
  epic: 'bg-purple-100 border-purple-300 text-purple-700',
  legendary: 'bg-yellow-100 border-yellow-300 text-yellow-700',
};

export const UserBadges = ({ limit = 6 }: { limit?: number }) => {
  const { t } = useTranslation();
  const { data: userBadges, isLoading } = useUserBadges();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-3 animate-pulse">
            <div className="h-8 w-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-1"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const displayBadges = userBadges?.slice(0, limit) || [];

  if (displayBadges.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500">
        <div className="text-4xl mb-2">🏆</div>
        <p className="text-sm">{t('badges.noBadgesEarned')}</p>
        <p className="text-xs">{t('badges.noBadgesEarnedDesc')}</p>
      </div>
    );
  }

  const getBadgeName = (badgeName: string) => {
    const nameKey = `badges.names.${badgeName}`;
    const translatedName = t(nameKey);
    // If translation key doesn't exist, return original name
    return translatedName === nameKey ? badgeName : translatedName;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {displayBadges.map((userBadge) => {
        const badge = userBadge.badges;
        const IconComponent = (Icons as any)[badge.icon] || Icons.Award;
        const rarityClass = rarityColors[badge.rarity as keyof typeof rarityColors] || rarityColors.common;
        
        return (
          <div
            key={userBadge.id}
            className={`rounded-lg p-3 border-2 ${rarityClass} transition-transform hover:scale-105`}
            title={`${badge.description} - ${t(`badges.rarity.${badge.rarity}`)}`}
          >
            <div className="flex items-center justify-center mb-2">
              <IconComponent className="h-8 w-8" />
            </div>
            <h4 className="font-semibold text-sm text-center mb-1">{getBadgeName(badge.name)}</h4>
            <p className="text-xs text-center opacity-75">{badge.description}</p>
            <div className="mt-2 text-center">
              <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                {t(`badges.rarity.${badge.rarity}`)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
