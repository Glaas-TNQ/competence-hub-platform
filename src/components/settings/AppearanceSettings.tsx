
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/contexts/LanguageContext';
import { Palette } from 'lucide-react';

type Language = 'it' | 'en';

interface AppearanceSettingsProps {
  formData: {
    theme: string;
    language: Language;
    animations: boolean;
  };
  setFormData: (data: any) => void;
  onLanguageChange: (language: string) => void;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  formData,
  setFormData,
  onLanguageChange
}) => {
  const { t } = useTranslation();

  return (
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
          <Select value={formData.language} onValueChange={onLanguageChange}>
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
  );
};
