
import { useState, useEffect } from 'react';
import { useUserPreferences, useUpdateUserPreferences } from './useUserPreferences';
import { DashboardLayout, DEFAULT_WIDGETS, DashboardWidget } from '@/types/dashboard';

export const useDashboardCustomization = () => {
  const { data: preferences } = useUserPreferences();
  const updatePreferences = useUpdateUserPreferences();
  
  const [dashboardLayout, setDashboardLayout] = useState<DashboardLayout>({
    widgets: DEFAULT_WIDGETS,
    theme: 'light',
    compactMode: false,
  });

  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    if (preferences?.dashboard_layout) {
      try {
        const layout = typeof preferences.dashboard_layout === 'string' 
          ? JSON.parse(preferences.dashboard_layout) 
          : preferences.dashboard_layout;
        setDashboardLayout(layout as DashboardLayout);
      } catch (error) {
        console.error('Error parsing dashboard layout:', error);
        setDashboardLayout({
          widgets: DEFAULT_WIDGETS,
          theme: 'light',
          compactMode: false,
        });
      }
    }
  }, [preferences]);

  const saveLayout = async (layout: DashboardLayout) => {
    try {
      console.log('Saving dashboard layout:', layout);
      await updatePreferences.mutateAsync({
        dashboard_layout: layout,
      });
      setDashboardLayout(layout);
    } catch (error) {
      console.error('Error saving dashboard layout:', error);
    }
  };

  const updateWidget = (widgetId: string, updates: Partial<DashboardWidget>) => {
    const newLayout = {
      ...dashboardLayout,
      widgets: dashboardLayout.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, ...updates } : widget
      ),
    };
    setDashboardLayout(newLayout);
    // Auto-save quando si aggiorna un widget
    saveLayout(newLayout);
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    const widget = dashboardLayout.widgets.find(w => w.id === widgetId);
    if (widget) {
      updateWidget(widgetId, { visible: !widget.visible });
    }
  };

  const reorderWidgets = (widgets: DashboardWidget[]) => {
    const newLayout = {
      ...dashboardLayout,
      widgets,
    };
    setDashboardLayout(newLayout);
    saveLayout(newLayout);
  };

  const resetToDefault = () => {
    const defaultLayout = {
      widgets: DEFAULT_WIDGETS,
      theme: 'light' as const,
      compactMode: false,
    };
    setDashboardLayout(defaultLayout);
    saveLayout(defaultLayout);
  };

  return {
    dashboardLayout,
    isCustomizing,
    setIsCustomizing,
    saveLayout,
    updateWidget,
    toggleWidgetVisibility,
    reorderWidgets,
    resetToDefault,
    isSaving: updatePreferences.isPending,
  };
};
