
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';

export const PerformanceCharts: React.FC = () => {
  const { data: analytics } = useAnalytics();

  const chartConfig = {
    completed: {
      label: "Completati",
      color: "hsl(var(--chart-1))",
    },
    points: {
      label: "Punti",
      color: "hsl(var(--chart-2))",
    },
    time: {
      label: "Tempo (ore)",
      color: "hsl(var(--chart-3))",
    },
  };

  const monthlyData = analytics?.monthlyPerformance || [];
  const competencePerformance = analytics?.competencePerformance || [];
  const goalProgress = analytics?.goalProgress || [];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Performance Mensile */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Mensile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ChartContainer config={chartConfig}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" fill="var(--color-completed)" />
                <Bar dataKey="points" fill="var(--color-points)" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance per Competenza */}
      <Card>
        <CardHeader>
          <CardTitle>Performance per Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ChartContainer config={chartConfig}>
              <BarChart data={competencePerformance} layout="horizontal">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="score" fill="var(--color-completed)" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tempo di Studio */}
      <Card>
        <CardHeader>
          <CardTitle>Tempo di Studio Settimanale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ChartContainer config={chartConfig}>
              <LineChart data={analytics?.weeklyStudyTime || []}>
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="var(--color-time)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Progresso Obiettivi */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso Obiettivi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goalProgress.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{goal.name}</span>
                  <span>{goal.current}/{goal.target}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600">
                  {Math.round((goal.current / goal.target) * 100)}% completato
                </div>
              </div>
            ))}
            {goalProgress.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Nessun obiettivo attivo
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
