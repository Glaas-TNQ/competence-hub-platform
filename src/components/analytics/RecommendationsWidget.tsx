
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BookOpen, Star, TrendingUp, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecommendationsWidgetProps {
  detailed?: boolean;
}

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({ detailed = false }) => {
  const { data: analytics } = useAnalytics();
  const navigate = useNavigate();
  
  const recommendations = analytics?.recommendations || [];

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'skill': return <Star className="h-4 w-4" />;
      case 'improvement': return <TrendingUp className="h-4 w-4" />;
      case 'goal': return <Target className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'course': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/30';
      case 'skill': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30';
      case 'improvement': return 'text-green-600 bg-green-50 dark:bg-green-950/30';
      case 'goal': return 'text-purple-600 bg-purple-50 dark:bg-purple-950/30';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const handleRecommendationClick = (recommendation: any) => {
    if (recommendation.action === 'start-course' && recommendation.courseId) {
      navigate(`/course/${recommendation.courseId}`);
    } else if (recommendation.action === 'set-goal') {
      navigate('/goals');
    } else if (recommendation.action === 'explore-area') {
      navigate('/areas');
    }
  };

  const displayedRecommendations = detailed ? recommendations : recommendations.slice(0, 3);

  return (
    <div className="space-y-4">
      {displayedRecommendations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Continua a studiare per ricevere raccomandazioni personalizzate!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedRecommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => handleRecommendationClick(rec)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getRecommendationColor(rec.type)}`}>
                  {getRecommendationIcon(rec.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                  {rec.reason && (
                    <p className="text-xs text-muted-foreground/80 mt-2">
                      Motivo: {rec.reason}
                    </p>
                  )}
                  {rec.priority && (
                    <div className="flex items-center mt-2">
                      <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                        Priorità: {rec.priority}
                      </span>
                    </div>
                  )}
                </div>
                {rec.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRecommendationClick(rec);
                    }}
                  >
                    {rec.actionLabel || 'Inizia'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!detailed && recommendations.length > 3 && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/analytics')}
          >
            Vedi tutte le raccomandazioni
          </Button>
        </div>
      )}
    </div>
  );
};
