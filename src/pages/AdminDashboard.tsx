
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, BookOpen, Target, BarChart3 } from 'lucide-react';
import { useCompetenceAreas, useCourses } from '@/hooks/useSupabase';
import { CourseManager } from '@/components/admin/CourseManager';
import { CompetenceAreaManager } from '@/components/admin/CompetenceAreaManager';
import { UserManager } from '@/components/admin/UserManager';

export const AdminDashboard = () => {
  const { profile } = useAuth();
  const { data: competenceAreas } = useCompetenceAreas();
  const { data: courses } = useCourses();

  // Redirect non-admin users
  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Accesso Negato</CardTitle>
            <CardDescription>
              Non hai i permessi per accedere a questa area.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: 'Aree di Competenza',
      value: competenceAreas?.length || 0,
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'Corsi Totali',
      value: courses?.length || 0,
      icon: BookOpen,
      color: 'bg-green-500'
    },
    {
      title: 'Corsi Pubblicati',
      value: courses?.filter(c => c.is_published)?.length || 0,
      icon: BarChart3,
      color: 'bg-purple-500'
    },
    {
      title: 'Utenti Attivi',
      value: '12', // TODO: Implementare query per contare utenti
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600">Gestisci la piattaforma di formazione</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Gestione Corsi</TabsTrigger>
          <TabsTrigger value="areas">Aree di Competenza</TabsTrigger>
          <TabsTrigger value="users">Gestione Utenti</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <CourseManager />
        </TabsContent>

        <TabsContent value="areas">
          <CompetenceAreaManager />
        </TabsContent>

        <TabsContent value="users">
          <UserManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
