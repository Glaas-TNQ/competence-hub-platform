
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { useUpdateUserPreferences, useUserPreferences } from '@/hooks/useUserPreferences';
import { useToast } from '@/hooks/use-toast';
import { User, Palette } from 'lucide-react';

type Language = 'it' | 'en';

export const Settings: React.FC = () => {
  const { user, profile } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const { data: preferences } = useUserPreferences();
  const updatePreferences = useUpdateUserPreferences();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: profile?.full_name?.split(' ')[0] || '',
    lastName: profile?.full_name?.split(' ')[1] || '',
    theme: 'light',
    language: language,
  });

  useEffect(() => {
    if (preferences) {
      setFormData(prev => ({
        ...prev,
        theme: preferences.theme_settings?.theme || 'light',
        language: preferences.theme_settings?.language || language,
      }));
    }
  }, [preferences, language]);

  const handleSaveChanges = async () => {
    try {
      await updatePreferences.mutateAsync({
        theme_settings: {
          theme: formData.theme,
          language: formData.language
        },
        personal_goals: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: `${formData.firstName} ${formData.lastName}`.trim()
        }
      });
      
      setLanguage(formData.language as Language);
      
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
    setFormData({...formData, language: validLanguage});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('settings.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('settings.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
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
            </CardContent>
          </Card>

          {/* Appearance Settings */}
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
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button 
            onClick={handleSaveChanges}
            disabled={updatePreferences.isPending}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl py-3"
            size="lg"
          >
            {updatePreferences.isPending ? t('settings.saving') : t('settings.saveChanges')}
          </Button>
        </div>
      </div>
    </div>
  );
};
