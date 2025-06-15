
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
      setDashboardLayout(preferences.dashboard_layout as DashboardLayout);
    }
  }, [preferences]);

  const saveLayout = async (layout: DashboardLayout) => {
    try {
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
  };

  const resetToDefault = () => {
    const defaultLayout = {
      widgets: DEFAULT_WIDGETS,
      theme: 'light' as const,
      compactMode: false,
    };
    setDashboardLayout(defaultLayout);
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
