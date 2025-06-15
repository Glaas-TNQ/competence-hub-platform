
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/contexts/LanguageContext';
import { Download, Trash2 } from 'lucide-react';

export const DataSettings: React.FC = () => {
  const { t } = useTranslation();

  return (
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
  );
};
