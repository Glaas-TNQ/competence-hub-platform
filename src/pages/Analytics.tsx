
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { ActivityHeatmap } from '@/components/analytics/ActivityHeatmap';
import { PerformanceCharts } from '@/components/analytics/PerformanceCharts';
import { RecommendationsWidget } from '@/components/analytics/RecommendationsWidget';
import { InsightsWidget } from '@/components/analytics/InsightsWidget';
import { BarChart3, TrendingUp, Target, Lightbulb } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-focus bg-clip-text text-transparent">
            Analytics e Insights
          </h1>
          <p className="text-lg text-muted-foreground">
            Analizza il tuo progresso e scopri insights personalizzati
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm border-0 shadow-educational rounded-2xl p-2">
            <TabsTrigger 
              value="overview" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Panoramica
            </TabsTrigger>
            <TabsTrigger 
              value="activity"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Target className="w-4 h-4 mr-2" />
              Attività
            </TabsTrigger>
            <TabsTrigger 
              value="performance"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="insights"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Riepilogo Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AnalyticsOverview />
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-secondary" />
                    Raccomandazioni
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RecommendationsWidget />
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-focus" />
                  Insights Personalizzati
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InsightsWidget />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Mappa Attività
                </CardTitle>
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
              <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-secondary" />
                    Insights Dettagliati
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InsightsWidget detailed />
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-focus" />
                    Raccomandazioni Avanzate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RecommendationsWidget detailed />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
