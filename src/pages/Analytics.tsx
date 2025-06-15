
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { ActivityHeatmap } from '@/components/analytics/ActivityHeatmap';
import { PerformanceCharts } from '@/components/analytics/PerformanceCharts';
import { RecommendationsWidget } from '@/components/analytics/RecommendationsWidget';
import { InsightsWidget } from '@/components/analytics/InsightsWidget';

export const Analytics: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics e Insights</h1>
        <p className="text-gray-600 mt-2">Analizza il tuo progresso e scopri insights personalizzati</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Panoramica</TabsTrigger>
          <TabsTrigger value="activity">Attività</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Riepilogo Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsOverview />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Raccomandazioni</CardTitle>
              </CardHeader>
              <CardContent>
                <RecommendationsWidget />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Insights Personalizzati</CardTitle>
            </CardHeader>
            <CardContent>
              <InsightsWidget />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mappa Attività</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityHeatmap />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceCharts />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6">
            <InsightsWidget detailed />
            <RecommendationsWidget detailed />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
