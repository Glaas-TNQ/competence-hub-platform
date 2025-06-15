
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, User, Shield, Palette, Download, Trash2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Impostazioni</h1>
        <p className="text-gray-600 mt-2">Gestisci le tue preferenze e impostazioni account</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profilo</TabsTrigger>
          <TabsTrigger value="notifications">Notifiche</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Aspetto</TabsTrigger>
          <TabsTrigger value="data">Dati</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} />
                Informazioni Profilo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nome</Label>
                  <Input id="firstName" placeholder="Inserisci il tuo nome" />
                </div>
                <div>
                  <Label htmlFor="lastName">Cognome</Label>
                  <Input id="lastName" placeholder="Inserisci il tuo cognome" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email || ''} disabled />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Racconta qualcosa di te..." />
              </div>
              
              <Button>Salva Modifiche</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} />
                Preferenze Notifiche
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifiche Email</h4>
                  <p className="text-sm text-gray-500">Ricevi aggiornamenti via email</p>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Promemoria Corsi</h4>
                  <p className="text-sm text-gray-500">Ricorda i corsi da completare</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Aggiornamenti Badge</h4>
                  <p className="text-sm text-gray-500">Notifica quando ottieni nuovi badge</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Newsletter</h4>
                  <p className="text-sm text-gray-500">Ricevi la newsletter mensile</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} />
                Privacy e Sicurezza
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Profilo Pubblico</h4>
                  <p className="text-sm text-gray-500">Rendi il tuo profilo visibile ad altri utenti</p>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Condividi Progressi</h4>
                  <p className="text-sm text-gray-500">Permetti ad altri di vedere i tuoi progressi</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div>
                <Label>Visibilità Badge</Label>
                <Select defaultValue="public">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Pubblico</SelectItem>
                    <SelectItem value="friends">Solo Amici</SelectItem>
                    <SelectItem value="private">Privato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline">Cambia Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette size={20} />
                Aspetto e Tema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Tema</Label>
                <Select defaultValue="light">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Chiaro</SelectItem>
                    <SelectItem value="dark">Scuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Lingua</Label>
                <Select defaultValue="it">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">Italiano</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Animazioni</h4>
                  <p className="text-sm text-gray-500">Abilita animazioni nell'interfaccia</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download size={20} />
                Gestione Dati
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Esporta i tuoi dati</h4>
                <p className="text-sm text-gray-500 mb-4">Scarica una copia completa dei tuoi dati di apprendimento</p>
                <Button variant="outline">Esporta Dati</Button>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2 text-red-600">Zona Pericolosa</h4>
                <p className="text-sm text-gray-500 mb-4">Elimina permanentemente il tuo account e tutti i dati associati</p>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 size={16} />
                  Elimina Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
