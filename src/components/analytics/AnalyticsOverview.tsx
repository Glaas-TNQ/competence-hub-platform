
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { TrendingUp, Clock, Award, Target } from 'lucide-react';

export const AnalyticsOverview: React.FC = () => {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  const weeklyData = analytics?.weeklyProgress || [];
  const competenceData = analytics?.competenceDistribution || [];

  const chartConfig = {
    progress: {
      label: "Progresso",
      color: "hsl(var(--chart-1))",
    },
    points: {
      label: "Punti",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="space-y-4">
      {/* Statistiche Rapide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold">{analytics?.totalProgress || 0}%</div>
          <div className="text-sm text-gray-600">Progresso Totale</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{analytics?.studyTimeHours || 0}h</div>
          <div className="text-sm text-gray-600">Tempo Studio</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Award className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold">{analytics?.completedCourses || 0}</div>
          <div className="text-sm text-gray-600">Corsi Completati</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold">{analytics?.currentStreak || 0}</div>
          <div className="text-sm text-gray-600">Serie Attuale</div>
        </div>
      </div>

      {/* Grafico Progresso Settimanale */}
      {weeklyData.length > 0 && (
        <div className="h-64">
          <h4 className="text-sm font-medium mb-2">Progresso Ultimi 7 Giorni</h4>
          <ChartContainer config={chartConfig}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="var(--color-progress)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      )}

      {/* Distribuzione per Competenza */}
      {competenceData.length > 0 && (
        <div className="h-48">
          <h4 className="text-sm font-medium mb-2">Distribuzione per Area di Competenza</h4>
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie
                data={competenceData}
                dataKey="hours"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
              >
                {competenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </div>
      )}
    </div>
  );
};
