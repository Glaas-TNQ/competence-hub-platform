
import React from 'react';
import { Trophy, Star, Zap } from 'lucide-react';
import { useUserTotalPoints } from '@/hooks/useGamification';

export const UserLevel = () => {
  const { data: userPoints, isLoading } = useUserTotalPoints();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white animate-pulse">
        <div className="h-4 bg-white/20 rounded mb-2"></div>
        <div className="h-2 bg-white/20 rounded"></div>
      </div>
    );
  }

  if (!userPoints) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-5 w-5" />
          <span className="font-semibold">Livello 1</span>
        </div>
        <div className="text-sm opacity-90 mb-2">0 punti totali</div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div className="bg-white h-2 rounded-full" style={{ width: '0%' }}></div>
        </div>
        <div className="text-xs opacity-75 mt-1">100 punti al prossimo livello</div>
      </div>
    );
  }

  const progressPercentage = userPoints.points_to_next_level > 0 
    ? ((100 - userPoints.points_to_next_level) / 100) * 100
    : 100;

  const getLevelIcon = (level: number) => {
    if (level >= 25) return <Trophy className="h-5 w-5 text-yellow-300" />;
    if (level >= 10) return <Zap className="h-5 w-5 text-blue-300" />;
    return <Star className="h-5 w-5 text-white" />;
  };

  const getLevelColor = (level: number) => {
    if (level >= 25) return 'from-yellow-500 to-orange-600';
    if (level >= 10) return 'from-purple-500 to-pink-600';
    return 'from-blue-500 to-purple-600';
  };

  return (
    <div className={`bg-gradient-to-r ${getLevelColor(userPoints.level)} rounded-lg p-4 text-white shadow-lg`}>
      <div className="flex items-center gap-2 mb-2">
        {getLevelIcon(userPoints.level)}
        <span className="font-semibold">Livello {userPoints.level}</span>
        {userPoints.level >= 50 && <span className="text-xs bg-white/20 px-2 py-1 rounded">MAX</span>}
      </div>
      
      <div className="text-sm opacity-90 mb-2">
        {userPoints.total_points.toLocaleString()} punti totali
      </div>
      
      {userPoints.points_to_next_level > 0 ? (
        <>
          <div className="w-full bg-white/20 rounded-full h-2 mb-1">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs opacity-75">
            {userPoints.points_to_next_level} punti al prossimo livello
          </div>
        </>
      ) : (
        <div className="text-xs bg-white/20 px-2 py-1 rounded text-center">
          Livello Massimo Raggiunto!
        </div>
      )}
    </div>
  );
};
