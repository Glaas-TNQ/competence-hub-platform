
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/contexts/LanguageContext';
import { Shield } from 'lucide-react';

interface PrivacySettingsProps {
  formData: {
    publicProfile: boolean;
    shareProgress: boolean;
    badgeVisibility: string;
  };
  setFormData: (data: any) => void;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  formData,
  setFormData
}) => {
  const { t } = useTranslation();

  return (
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
  );
};
