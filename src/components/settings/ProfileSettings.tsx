
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { User } from 'lucide-react';

interface ProfileSettingsProps {
  formData: {
    firstName: string;
    lastName: string;
    bio: string;
  };
  setFormData: (data: any) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  formData,
  setFormData,
  onSave,
  isSaving
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
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
          onClick={onSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl"
        >
          {isSaving ? t('settings.saving') : t('settings.saveChanges')}
        </Button>
      </CardContent>
    </Card>
  );
};
