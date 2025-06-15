
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Target, 
  TrendingUp,
  Shield,
  Database,
  Settings,
  BarChart3,
  Bot
} from 'lucide-react';
import { CourseManager } from '@/components/admin/CourseManager';
import { UserManager } from '@/components/admin/UserManager';
import { CompetenceAreaManager } from '@/components/admin/CompetenceAreaManager';
import { LearningPathManager } from '@/components/admin/LearningPathManager';
import { AgenticCourseCreator } from '@/components/admin/AgenticCourseCreator';
import { useCourses, useUsers } from '@/hooks/useSupabase';

type ActiveSection = 'overview' | 'courses' | 'users' | 'competence-areas' | 'learning-paths' | 'agentic-creator' | 'analytics' | 'settings';

export const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const { data: courses } = useCourses();
  const { data: users } = useUsers();

  const stats = [
    {
      title: 'Utenti Totali',
      value: users?.length || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Corsi Pubblicati',
      value: courses?.filter(c => c.is_published)?.length || 0,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Aree di Competenza',
      value: '5',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Engagement',
      value: '78%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-foreground">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Attività Recenti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Nuovo corso pubblicato: "Introduzione al Machine Learning"</span>
                    </div>
                    <Badge variant="secondary">2h fa</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">5 nuovi utenti registrati</span>
                    </div>
                    <Badge variant="secondary">4h fa</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Aggiornata area di competenza "Data Science"</span>
                    </div>
                    <Badge variant="secondary">1d fa</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'courses':
        return <CourseManager />;
      case 'users':
        return <UserManager />;
      case 'competence-areas':
        return <CompetenceAreaManager />;
      case 'learning-paths':
        return <LearningPathManager />;
      case 'agentic-creator':
        return <AgenticCourseCreator />;
      case 'analytics':
        return (
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funzionalità analytics in sviluppo...
              </p>
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Impostazioni Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Pannello impostazioni in sviluppo...
              </p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  const stats = [
    {
      title: 'Utenti Totali',
      value: users?.length || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Corsi Pubblicati',
      value: courses?.filter(c => c.is_published)?.length || 0,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Aree di Competenza',
      value: '5',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Engagement',
      value: '78%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Gestisci la piattaforma educativa
            </p>
          </div>
          
          <Badge variant="destructive" className="px-4 py-2">
            Amministratore
          </Badge>
        </div>

        {/* Navigation */}
        <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as ActiveSection)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 h-auto p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3 rounded-lg">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Panoramica</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2 py-3 rounded-lg">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Corsi</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 py-3 rounded-lg">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Utenti</span>
            </TabsTrigger>
            <TabsTrigger value="competence-areas" className="flex items-center gap-2 py-3 rounded-lg">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Aree</span>
            </TabsTrigger>
            <TabsTrigger value="learning-paths" className="flex items-center gap-2 py-3 rounded-lg">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Percorsi</span>
            </TabsTrigger>
            <TabsTrigger value="agentic-creator" className="flex items-center gap-2 py-3 rounded-lg">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">AI Creator</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 py-3 rounded-lg">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeSection} className="space-y-6">
            {renderActiveSection()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
