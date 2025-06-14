
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Target, BarChart3, Shield } from 'lucide-react';
import { useCompetenceAreas, useCourses } from '@/hooks/useSupabase';
import { CourseManager } from '@/components/admin/CourseManager';
import { CompetenceAreaManager } from '@/components/admin/CompetenceAreaManager';
import { UserManager } from '@/components/admin/UserManager';

type ActiveSection = 'overview' | 'courses' | 'areas' | 'users';

export const AdminDashboard = () => {
  const { user, profile, loading } = useAuth();
  const { data: competenceAreas } = useCompetenceAreas();
  const { data: courses } = useCourses();
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');

  console.log('AdminDashboard - User:', user?.email);
  console.log('AdminDashboard - Profile:', profile);
  console.log('AdminDashboard - Loading:', loading);
  console.log('AdminDashboard - Is Admin:', profile?.role === 'admin');

  // Show loading state while profile is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Verifica Permessi Admin</span>
            </CardTitle>
            <CardDescription>
              Caricamento del profilo utente in corso...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is admin (either by role or by email as fallback)
  const isAdmin = profile?.role === 'admin' || user?.email === 'admin@academy.com';

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Accesso Negato</CardTitle>
            <CardDescription>
              Non hai i permessi per accedere a questa area amministrativa.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-slate-600">
              <p><strong>Email corrente:</strong> {user?.email}</p>
              <p><strong>Ruolo profilo:</strong> {profile?.role || 'Non assegnato'}</p>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Torna alla Dashboard
            </Button>
          </CardContent>
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

  const navigationItems = [
    { id: 'overview', label: 'Panoramica', icon: BarChart3 },
    { id: 'areas', label: 'Aree di Competenza', icon: Target },
    { id: 'courses', label: 'Gestione Corsi', icon: BookOpen },
    { id: 'users', label: 'Gestione Utenti', icon: Users }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'courses':
        return <CourseManager />;
      case 'areas':
        return <CompetenceAreaManager />;
      case 'users':
        return <UserManager />;
      default:
        return (
          <div className="space-y-4 md:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                          <p className="text-xl md:text-2xl font-bold text-slate-800">{stat.value}</p>
                        </div>
                        <div className={`p-2 md:p-3 rounded-full ${stat.color}`}>
                          <Icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Azioni Rapide</CardTitle>
                <CardDescription>Accedi velocemente alle funzioni principali</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveSection('areas')} 
                    variant="outline" 
                    className="h-20 flex-col space-y-2"
                  >
                    <Target className="h-6 w-6" />
                    <span>Gestisci Aree</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveSection('courses')} 
                    variant="outline" 
                    className="h-20 flex-col space-y-2"
                  >
                    <BookOpen className="h-6 w-6" />
                    <span>Gestisci Corsi</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveSection('users')} 
                    variant="outline" 
                    className="h-20 flex-col space-y-2"
                  >
                    <Users className="h-6 w-6" />
                    <span>Gestisci Utenti</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600">Gestisci la piattaforma di formazione</p>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full w-fit">
              ✓ Accesso Amministratore Confermato
            </span>
            <span className="text-xs text-slate-500">
              {user?.email}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-1 overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as ActiveSection)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};
