export interface DashboardWidget {
  id: string;
  type: 'stats' | 'certificates' | 'streak' | 'level' | 'badges' | 'recent-courses' | 'goals' | 'notes' | 'analytics';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: {
    x: number;
    y: number;
  };
  visible: boolean;
  settings?: Record<string, any>;
}

export interface DashboardWidgetProps {
  widget: DashboardWidget;
  isCustomizing?: boolean;
  onToggleVisibility?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
}

export const DEFAULT_WIDGETS: DashboardWidget[] = [
  {
    id: 'stats-overview',
    type: 'stats',
    title: 'Panoramica Statistiche',
    size: 'large',
    position: { x: 0, y: 0 },
    visible: true,
  },
  {
    id: 'level-progress',
    type: 'level',
    title: 'Livello e Progresso',
    size: 'medium',
    position: { x: 0, y: 1 },
    visible: true,
  },
  {
    id: 'streak-counter',
    type: 'streak',
    title: 'Serie di Studio',
    size: 'medium',
    position: { x: 1, y: 1 },
    visible: true,
  },
  {
    id: 'goals-widget',
    type: 'goals',
    title: 'I Miei Obiettivi',
    size: 'medium',
    position: { x: 2, y: 1 },
    visible: true,
  },
  {
    id: 'certificates-widget',
    type: 'certificates',
    title: 'Certificati',
    size: 'medium',
    position: { x: 0, y: 2 },
    visible: true,
  },
  {
    id: 'notes-widget',
    type: 'notes',
    title: 'Note Recenti',
    size: 'medium',
    position: { x: 1, y: 2 },
    visible: true,
  },
  {
    id: 'badges-widget',
    type: 'badges',
    title: 'Badge Ottenuti',
    size: 'large',
    position: { x: 2, y: 2 },
    visible: true,
  },
  {
    id: 'recent-courses-widget',
    type: 'recent-courses',
    title: 'Corsi Disponibili',
    size: 'large',
    position: { x: 0, y: 3 },
    visible: true,
  },
  {
    id: 'analytics-widget',
    type: 'analytics',
    title: 'Analytics e Insights',
    size: 'large',
    position: { x: 0, y: 4 },
    visible: true,
  },
];
