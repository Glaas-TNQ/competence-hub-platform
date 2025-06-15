
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff,
  Palette,
  Monitor,
  Sun,
  Moon
} from 'lucide-react';
import { useDashboardCustomization } from '@/hooks/useDashboardCustomization';
import { DashboardWidget as DashboardWidgetType } from '@/types/dashboard';

interface DashboardCustomizerProps {
  onClose: () => void;
}

export const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({ onClose }) => {
  const {
    dashboardLayout,
    saveLayout,
    toggleWidgetVisibility,
    resetToDefault,
    isSaving,
  } = useDashboardCustomization();

  const handleSave = async () => {
    await saveLayout(dashboardLayout);
    onClose();
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    const newLayout = {
      ...dashboardLayout,
      theme,
    };
    saveLayout(newLayout);
  };

  const getWidgetTypeLabel = (type: DashboardWidgetType['type']) => {
    const labels = {
      stats: 'Statistiche',
      certificates: 'Certificati',
      streak: 'Serie di Studio',
      level: 'Livello',
      badges: 'Badge',
      'recent-courses': 'Corsi Recenti',
      goals: 'Obiettivi',
    };
    return labels[type] || type;
  };

  const getWidgetTypeColor = (type: DashboardWidgetType['type']) => {
    const colors = {
      stats: 'bg-blue-100 text-blue-800',
      certificates: 'bg-yellow-100 text-yellow-800',
      streak: 'bg-green-100 text-green-800',
      level: 'bg-purple-100 text-purple-800',
      badges: 'bg-orange-100 text-orange-800',
      'recent-courses': 'bg-gray-100 text-gray-800',
      goals: 'bg-pink-100 text-pink-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Personalizza Dashboard
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Configura i widget e l'aspetto della tua dashboard
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Tema
            </Label>
            <div className="flex gap-2">
              <Button
                variant={dashboardLayout.theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('light')}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Chiaro
              </Button>
              <Button
                variant={dashboardLayout.theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('dark')}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                Scuro
              </Button>
              <Button
                variant={dashboardLayout.theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('system')}
                className="flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                Sistema
              </Button>
            </div>
          </div>

          {/* Compact Mode */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Modalità Compatta</Label>
            <Switch
              checked={dashboardLayout.compactMode}
              onCheckedChange={(checked) => {
                const newLayout = {
                  ...dashboardLayout,
                  compactMode: checked,
                };
                saveLayout(newLayout);
              }}
            />
          </div>

          {/* Widget Visibility */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Widget Visibili</Label>
            <div className="space-y-2">
              {dashboardLayout.widgets.map((widget) => (
                <div
                  key={widget.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleWidgetVisibility(widget.id)}
                      className="h-8 w-8 p-0"
                    >
                      {widget.visible ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <div>
                      <p className="font-medium text-sm">{widget.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getWidgetTypeColor(widget.type)}`}
                        >
                          {getWidgetTypeLabel(widget.type)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {widget.size}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={resetToDefault}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Ripristina Default
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Salvataggio...' : 'Salva'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
