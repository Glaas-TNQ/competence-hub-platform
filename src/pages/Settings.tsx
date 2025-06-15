
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { useUpdateUserPreferences, useUserPreferences } from '@/hooks/useUserPreferences';
import { useToast } from '@/hooks/use-toast';
import { User, Shield, Palette, Download } from 'lucide-react';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { PrivacySettings } from '@/components/settings/PrivacySettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { DataSettings } from '@/components/settings/DataSettings';

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
    setFormData({...formData, language: validLanguage});
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
            <ProfileSettings
              formData={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                bio: formData.bio
              }}
              setFormData={setFormData}
              onSave={handleSaveChanges}
              isSaving={updatePreferences.isPending}
            />
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <PrivacySettings
              formData={{
                publicProfile: formData.publicProfile,
                shareProgress: formData.shareProgress,
                badgeVisibility: formData.badgeVisibility
              }}
              setFormData={setFormData}
            />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <AppearanceSettings
              formData={{
                theme: formData.theme,
                language: formData.language,
                animations: formData.animations
              }}
              setFormData={setFormData}
              onLanguageChange={handleLanguageChange}
            />
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <DataSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
