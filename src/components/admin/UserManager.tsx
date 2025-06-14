
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Calendar, Settings } from 'lucide-react';

export const UserManager = () => {
  // TODO: Implementare query per ottenere utenti
  const mockUsers = [
    {
      id: '1',
      email: 'luca.tomasinoj@gmail.com',
      full_name: 'Luca Tomasino',
      role: 'admin',
      company: 'Academy Corp',
      created_at: '2024-01-15',
      accessible_courses: ['all']
    },
    {
      id: '2',
      email: 'mario.rossi@example.com',
      full_name: 'Mario Rossi',
      role: 'user',
      company: 'TechCorp',
      created_at: '2024-02-10',
      accessible_courses: ['cybersecurity', 'data-analytics']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestione Utenti</h2>
          <p className="text-slate-600">Visualizza e gestisci gli utenti della piattaforma</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{user.full_name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Dal {user.created_at}</span>
                      </div>
                    </div>
                    {user.company && (
                      <p className="text-sm text-slate-500 mt-1">Azienda: {user.company}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? 'Amministratore' : 'Utente'}
                    </Badge>
                    <div className="text-sm text-slate-600">
                      {user.accessible_courses[0] === 'all' 
                        ? 'Accesso completo' 
                        : `${user.accessible_courses.length} corsi`}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiche Utenti</CardTitle>
          <CardDescription>Panoramica degli utenti della piattaforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">2</div>
              <div className="text-sm text-slate-600">Utenti Totali</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">1</div>
              <div className="text-sm text-slate-600">Amministratori</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">1</div>
              <div className="text-sm text-slate-600">Utenti Attivi</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
