
import React from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { format, startOfYear, endOfYear, eachDayOfInterval, getDay } from 'date-fns';
import { it } from 'date-fns/locale';

export const ActivityHeatmap: React.FC = () => {
  const { data: analytics } = useAnalytics();
  const currentYear = new Date().getFullYear();
  
  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const yearEnd = endOfYear(new Date(currentYear, 11, 31));
  const allDays = eachDayOfInterval({ start: yearStart, end: yearEnd });

  const activityData = analytics?.dailyActivity || {};

  const getActivityLevel = (date: Date): number => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const activity = activityData[dateStr];
    if (!activity) return 0;
    if (activity >= 4) return 4; // Molto attivo
    if (activity >= 3) return 3; // Attivo
    if (activity >= 2) return 2; // Moderato
    if (activity >= 1) return 1; // Basso
    return 0; // Nessuna attività
  };

  const getColorClass = (level: number): string => {
    switch (level) {
      case 0: return 'bg-gray-100';
      case 1: return 'bg-green-100';
      case 2: return 'bg-green-200';
      case 3: return 'bg-green-400';
      case 4: return 'bg-green-600';
      default: return 'bg-gray-100';
    }
  };

  // Organizza i giorni in settimane
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  allDays.forEach((day, index) => {
    if (index === 0) {
      // Riempi l'inizio della prima settimana se necessario
      const dayOfWeek = getDay(day);
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push(new Date(0)); // Giorno vuoto
      }
    }
    
    currentWeek.push(day);
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  // Aggiungi l'ultima settimana se non è completa
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(new Date(0)); // Giorno vuoto
    }
    weeks.push(currentWeek);
  }

  const monthLabels = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  const dayLabels = ['D', 'L', 'M', 'M', 'G', 'V', 'S'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Attività {currentYear}</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Meno</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
              />
            ))}
          </div>
          <span>Più</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Etichette mesi */}
          <div className="flex mb-2">
            <div className="w-6"></div>
            {monthLabels.map((month, index) => (
              <div key={month} className="text-xs text-gray-500 w-16 text-center">
                {index % 2 === 0 ? month : ''}
              </div>
            ))}
          </div>

          {/* Griglia attività */}
          <div className="flex">
            {/* Etichette giorni della settimana */}
            <div className="flex flex-col space-y-1 mr-2">
              {dayLabels.map((day, index) => (
                <div key={day} className="text-xs text-gray-500 h-3 flex items-center">
                  {index % 2 === 1 ? day : ''}
                </div>
              ))}
            </div>

            {/* Celle attività */}
            <div className="flex space-x-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col space-y-1">
                  {week.map((day, dayIndex) => {
                    const isEmpty = day.getTime() === 0;
                    const level = isEmpty ? 0 : getActivityLevel(day);
                    const dateStr = isEmpty ? '' : format(day, 'dd MMM yyyy', { locale: it });
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm ${isEmpty ? 'bg-transparent' : getColorClass(level)} cursor-pointer hover:ring-2 hover:ring-gray-300`}
                        title={isEmpty ? '' : `${dateStr}: ${level} attività`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>Ogni quadratino rappresenta un giorno. Il colore indica il livello di attività di studio.</p>
      </div>
    </div>
  );
};
