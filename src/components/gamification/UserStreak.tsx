
import React from 'react';
import { Flame, Calendar } from 'lucide-react';
import { useUserStreak } from '@/hooks/useGamification';

export const UserStreak = () => {
  const { data: streak, isLoading } = useUserStreak('study');

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-4 text-white animate-pulse">
        <div className="h-4 bg-white/20 rounded mb-2"></div>
        <div className="h-6 bg-white/20 rounded"></div>
      </div>
    );
  }

  const getStreakMessage = (days: number) => {
    if (days === 0) return "Inizia oggi la tua streak di studio!";
    if (days === 1) return "Ottimo inizio! Continua così!";
    if (days < 7) return "Stai andando bene! Continua!";
    if (days < 30) return "Fantastico! Sei davvero costante!";
    return "Incredibile! Sei una leggenda dello studio!";
  };

  const getStreakColor = (days: number) => {
    if (days === 0) return 'from-gray-500 to-gray-600';
    if (days < 7) return 'from-orange-500 to-red-600';
    if (days < 30) return 'from-purple-500 to-pink-600';
    return 'from-yellow-500 to-orange-600';
  };

  return (
    <div className={`bg-gradient-to-r ${getStreakColor(streak || 0)} rounded-lg p-4 text-white shadow-lg`}>
      <div className="flex items-center gap-2 mb-2">
        <Flame className="h-5 w-5" />
        <span className="font-semibold">Streak di Studio</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-3xl font-bold">{streak || 0}</div>
        <div className="flex items-center gap-1 text-sm opacity-90">
          <Calendar className="h-4 w-4" />
          <span>{(streak || 0) === 1 ? 'giorno' : 'giorni'}</span>
        </div>
      </div>
      
      <div className="text-xs opacity-75 mt-2">
        {getStreakMessage(streak || 0)}
      </div>
    </div>
  );
};
