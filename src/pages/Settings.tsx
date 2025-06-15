
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateUserPreferences, useUserPreferences } from '@/hooks/useUserPreferences';
import { useToast } from '@/hooks/use-toast';
import { User, Shield, Palette, Download, Trash2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, profile } = useAuth();
  const { data: preferences } = useUserPreferences();
  const updatePreferences = useUpdateUserPreferences();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    theme: 'light',
    language: 'it',
    animations: true,
    publicProfile: false,
    shareProgress: true,
    badgeVisibility: 'public'
  });

  const handleSaveChanges = async () => {
    try {
      await updatePreferences.mutateAsync({
        theme_settings: {
          theme: formData.theme,
          animations: formData.animations
        },
        personal_goals: {
          publicProfile: formData.publicProfile,
          shareProgress: formData.shareProgress,
          badgeVisibility: formData.badgeVisibility
        }
      });
      
      toast({
        title: "Modifiche salvate",
        description: "Le tue impostazioni sono state aggiornate con successo.",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Impostazioni
          </h1>
          <p className="text-lg text-muted-foreground">
            Gestisci le tue preferenze e impostazioni account
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm border-0 shadow-educational rounded-2xl p-2">
            <TabsTrigger 
              value="profile" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <User className="w-4 h-4 mr-2" />
              Profilo
            </TabsTrigger>
            <TabsTrigger 
              value="privacy"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger 
              value="appearance"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Palette className="w-4 h-4 mr-2" />
              Aspetto
            </TabsTrigger>
            <TabsTrigger 
              value="data"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Dati
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Informazioni Profilo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground">Nome</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Inserisci il tuo nome" 
                      className="mt-2 border-0 bg-background/50 rounded-xl"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Cognome</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Inserisci il tuo cognome" 
                      className="mt-2 border-0 bg-background/50 rounded-xl"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="mt-2 border-0 bg-muted/30 rounded-xl"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio" className="text-sm font-medium text-foreground">Bio</Label>
                  <Input 
                    id="bio" 
                    placeholder="Racconta qualcosa di te..." 
                    className="mt-2 border-0 bg-background/50 rounded-xl"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
                
                <Button 
                  onClick={handleSaveChanges}
                  disabled={updatePreferences.isPending}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl"
                >
                  {updatePreferences.isPending ? 'Salvando...' : 'Salva Modifiche'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-focus" />
                  Privacy e Sicurezza
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium text-foreground">Profilo Pubblico</h4>
                    <p className="text-sm text-muted-foreground">Rendi il tuo profilo visibile ad altri utenti</p>
                  </div>
                  <Switch 
                    checked={formData.publicProfile}
                    onCheckedChange={(checked) => setFormData({...formData, publicProfile: checked})}
                  />
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium text-foreground">Condividi Progressi</h4>
                    <p className="text-sm text-muted-foreground">Permetti ad altri di vedere i tuoi progressi</p>
                  </div>
                  <Switch 
                    checked={formData.shareProgress}
                    onCheckedChange={(checked) => setFormData({...formData, shareProgress: checked})}
                  />
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="py-4">
                  <Label className="text-sm font-medium text-foreground">Visibilità Badge</Label>
                  <Select value={formData.badgeVisibility} onValueChange={(value) => setFormData({...formData, badgeVisibility: value})}>
                    <SelectTrigger className="mt-2 border-0 bg-background/50 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Pubblico</SelectItem>
                      <SelectItem value="friends">Solo Amici</SelectItem>
                      <SelectItem value="private">Privato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  className="border-border/50 bg-background/50 hover:bg-background/80 rounded-xl"
                >
                  Cambia Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-secondary" />
                  Aspetto e Tema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-foreground">Tema</Label>
                  <Select value={formData.theme} onValueChange={(value) => setFormData({...formData, theme: value})}>
                    <SelectTrigger className="mt-2 border-0 bg-background/50 rounded-xl">
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
                  <Label className="text-sm font-medium text-foreground">Lingua</Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                    <SelectTrigger className="mt-2 border-0 bg-background/50 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">Italiano</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium text-foreground">Animazioni</h4>
                    <p className="text-sm text-muted-foreground">Abilita animazioni nell'interfaccia</p>
                  </div>
                  <Switch 
                    checked={formData.animations}
                    onCheckedChange={(checked) => setFormData({...formData, animations: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-focus" />
                  Gestione Dati
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="py-4">
                  <h4 className="font-medium mb-2 text-foreground">Esporta i tuoi dati</h4>
                  <p className="text-sm text-muted-foreground mb-4">Scarica una copia completa dei tuoi dati di apprendimento</p>
                  <Button 
                    variant="outline" 
                    className="border-border/50 bg-background/50 hover:bg-background/80 rounded-xl"
                  >
                    Esporta Dati
                  </Button>
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="py-4">
                  <h4 className="font-medium mb-2 text-destructive">Zona Pericolosa</h4>
                  <p className="text-sm text-muted-foreground mb-4">Elimina permanentemente il tuo account e tutti i dati associati</p>
                  <Button variant="destructive" className="flex items-center gap-2 rounded-xl">
                    <Trash2 className="w-4 h-4" />
                    Elimina Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
