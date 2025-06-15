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
import { useTranslation } from '@/contexts/LanguageContext';
import { useUpdateUserPreferences, useUserPreferences } from '@/hooks/useUserPreferences';
import { useToast } from '@/hooks/use-toast';
import { User, Shield, Palette, Download, Trash2 } from 'lucide-react';

type Language = 'it' | 'en';

export const Settings: React.FC = () => {
  const { user, profile } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const { data: preferences } = useUserPreferences();
  const updatePreferences = useUpdateUserPreferences();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    theme: 'light',
    language: language,
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
        title: t('common.success'),
        description: "Le tue impostazioni sono state aggiornate con successo.",
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: "Si è verificato un errore durante il salvataggio.",
        variant: "destructive",
      });
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    const validLanguage = newLanguage as Language;
    setLanguage(validLanguage);
    setFormData({...formData, language: newLanguage});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('settings.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('settings.subtitle')}
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm border-0 shadow-educational rounded-2xl p-2">
            <TabsTrigger 
              value="profile" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <User className="w-4 h-4 mr-2" />
              {t('settings.profile')}
            </TabsTrigger>
            <TabsTrigger 
              value="privacy"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Shield className="w-4 h-4 mr-2" />
              {t('settings.privacy')}
            </TabsTrigger>
            <TabsTrigger 
              value="appearance"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Palette className="w-4 h-4 mr-2" />
              {t('settings.appearance')}
            </TabsTrigger>
            <TabsTrigger 
              value="data"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('settings.data')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  {t('settings.profileInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground">{t('settings.firstName')}</Label>
                    <Input 
                      id="firstName" 
                      placeholder={t('settings.firstNamePlaceholder')}
                      className="mt-2 border-0 bg-background/50 rounded-xl"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-foreground">{t('settings.lastName')}</Label>
                    <Input 
                      id="lastName" 
                      placeholder={t('settings.lastNamePlaceholder')}
                      className="mt-2 border-0 bg-background/50 rounded-xl"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">{t('auth.email')}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="mt-2 border-0 bg-muted/30 rounded-xl"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio" className="text-sm font-medium text-foreground">{t('settings.bio')}</Label>
                  <Input 
                    id="bio" 
                    placeholder={t('settings.bioPlaceholder')}
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
                  {updatePreferences.isPending ? t('settings.saving') : t('settings.saveChanges')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-focus" />
                  {t('settings.privacySecurity')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium text-foreground">{t('settings.publicProfile')}</h4>
                    <p className="text-sm text-muted-foreground">{t('settings.publicProfileDesc')}</p>
                  </div>
                  <Switch 
                    checked={formData.publicProfile}
                    onCheckedChange={(checked) => setFormData({...formData, publicProfile: checked})}
                  />
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium text-foreground">{t('settings.shareProgress')}</h4>
                    <p className="text-sm text-muted-foreground">{t('settings.shareProgressDesc')}</p>
                  </div>
                  <Switch 
                    checked={formData.shareProgress}
                    onCheckedChange={(checked) => setFormData({...formData, shareProgress: checked})}
                  />
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="py-4">
                  <Label className="text-sm font-medium text-foreground">{t('settings.badgeVisibility')}</Label>
                  <Select value={formData.badgeVisibility} onValueChange={(value) => setFormData({...formData, badgeVisibility: value})}>
                    <SelectTrigger className="mt-2 border-0 bg-background/50 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">{t('settings.badgePublic')}</SelectItem>
                      <SelectItem value="friends">{t('settings.badgeFriends')}</SelectItem>
                      <SelectItem value="private">{t('settings.badgePrivate')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  className="border-border/50 bg-background/50 hover:bg-background/80 rounded-xl"
                >
                  {t('settings.changePassword')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-secondary" />
                  {t('settings.appearanceTheme')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-foreground">{t('settings.theme')}</Label>
                  <Select value={formData.theme} onValueChange={(value) => setFormData({...formData, theme: value})}>
                    <SelectTrigger className="mt-2 border-0 bg-background/50 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t('settings.themeLight')}</SelectItem>
                      <SelectItem value="dark">{t('settings.themeDark')}</SelectItem>
                      <SelectItem value="system">{t('settings.themeSystem')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground">{t('settings.language')}</Label>
                  <Select value={formData.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="mt-2 border-0 bg-background/50 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">{t('settings.languageItalian')}</SelectItem>
                      <SelectItem value="en">{t('settings.languageEnglish')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium text-foreground">{t('settings.animations')}</h4>
                    <p className="text-sm text-muted-foreground">{t('settings.animationsDesc')}</p>
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
                  {t('settings.dataManagement')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="py-4">
                  <h4 className="font-medium mb-2 text-foreground">{t('settings.exportData')}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{t('settings.exportDataDesc')}</p>
                  <Button 
                    variant="outline" 
                    className="border-border/50 bg-background/50 hover:bg-background/80 rounded-xl"
                  >
                    {t('settings.exportButton')}
                  </Button>
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="py-4">
                  <h4 className="font-medium mb-2 text-destructive">{t('settings.dangerZone')}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{t('settings.deleteAccountDesc')}</p>
                  <Button variant="destructive" className="flex items-center gap-2 rounded-xl">
                    <Trash2 className="w-4 h-4" />
                    {t('settings.deleteAccount')}
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
