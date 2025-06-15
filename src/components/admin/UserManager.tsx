
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Calendar, Settings } from 'lucide-react';
import { useUsers } from '@/hooks/useSupabase';
import { UserFilter } from './UserFilter';
import { UserAccessModal } from './UserAccessModal';

export const UserManager = () => {
  const { data: users, isLoading } = useUsers();
  const [emailFilter, setEmailFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    if (!emailFilter) return users;
    
    return users.filter(user => 
      user.email.toLowerCase().includes(emailFilter.toLowerCase())
    );
  }, [users, emailFilter]);

  const handleManageAccess = (user: any) => {
    setSelectedUser(user);
    setIsAccessModalOpen(true);
  };

  const handleCloseAccessModal = () => {
    setIsAccessModalOpen(false);
    setSelectedUser(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Gestione Utenti</h2>
          <p className="text-slate-600 dark:text-slate-400">Visualizza e gestisci gli utenti della piattaforma</p>
        </div>
      </div>

      <UserFilter
        onFilterChange={setEmailFilter}
        currentFilter={emailFilter}
      />

      {emailFilter && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredUsers.length} di {users?.length || 0} utenti
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{user.full_name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Dal {new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {user.company && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Azienda: {user.company}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? 'Amministratore' : 'Utente'}
                    </Badge>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {user.accessible_courses?.[0] === 'all' 
                        ? 'Accesso completo' 
                        : `${user.accessible_courses?.length || 0} corsi`}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleManageAccess(user)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && emailFilter && (
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Nessun utente trovato con l'email "{emailFilter}"
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Statistiche Utenti</CardTitle>
          <CardDescription>Panoramica degli utenti della piattaforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{users?.length || 0}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Utenti Totali</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {users?.filter(u => u.role === 'admin').length || 0}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Amministratori</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {users?.filter(u => u.role === 'user').length || 0}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Utenti Standard</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <UserAccessModal
          isOpen={isAccessModalOpen}
          onClose={handleCloseAccessModal}
          user={selectedUser}
        />
      )}
    </div>
  );
};
