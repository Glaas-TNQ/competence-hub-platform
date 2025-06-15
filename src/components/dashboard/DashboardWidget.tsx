
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Eye, EyeOff, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardWidget as DashboardWidgetType } from '@/types/dashboard';

interface DashboardWidgetProps {
  widget: DashboardWidgetType;
  isCustomizing: boolean;
  onToggleVisibility: () => void;
  onSettings?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  widget,
  isCustomizing,
  onToggleVisibility,
  onSettings,
  children,
  className,
}) => {
  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-1 lg:col-span-1',
    large: 'col-span-1 md:col-span-2 lg:col-span-3',
  };

  if (!widget.visible && !isCustomizing) {
    return null;
  }

  return (
    <Card
      className={cn(
        'relative transition-all duration-200',
        sizeClasses[widget.size],
        !widget.visible && isCustomizing && 'opacity-50 border-dashed',
        isCustomizing && 'cursor-move hover:shadow-lg',
        className
      )}
    >
      {isCustomizing && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
            className="h-8 w-8 p-0"
          >
            {widget.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          {onSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettings}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          <div className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      )}
      
      <CardHeader className={cn('pb-3', isCustomizing && 'pr-24')}>
        <CardTitle className="text-lg">{widget.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {widget.visible ? children : (
          <div className="flex items-center justify-center h-20 text-gray-400">
            Widget nascosto
          </div>
        )}
      </CardContent>
    </Card>
  );
};
