
import React from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { TrendingUp, TrendingDown, Clock, Award, Target, Zap } from 'lucide-react';

interface InsightsWidgetProps {
  detailed?: boolean;
}

export const InsightsWidget: React.FC<InsightsWidgetProps> = ({ detailed = false }) => {
  const { data: analytics } = useAnalytics();
  
  const insights = analytics?.insights || [];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement': return <TrendingUp className="h-4 w-4" />;
      case 'decline': return <TrendingDown className="h-4 w-4" />;
      case 'achievement': return <Award className="h-4 w-4" />;
      case 'goal': return <Target className="h-4 w-4" />;
      case 'streak': return <Zap className="h-4 w-4" />;
      case 'time': return <Clock className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'improvement': return 'text-green-600 bg-green-50 border-green-200';
      case 'decline': return 'text-red-600 bg-red-50 border-red-200';
      case 'achievement': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'goal': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'streak': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'time': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const displayedInsights = detailed ? insights : insights.slice(0, 4);

  return (
    <div className="space-y-4">
      {displayedInsights.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Continua a studiare per generare insights personalizzati!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {displayedInsights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
                  {insight.value && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-50">
                        {insight.value}
                      </span>
                    </div>
                  )}
                  {insight.trend && (
                    <div className="flex items-center mt-2 text-xs">
                      {insight.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                      )}
                      <span className={insight.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                        {Math.abs(insight.trend)}% rispetto al periodo precedente
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!detailed && insights.length > 4 && (
        <div className="text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Vedi tutti gli insights
          </button>
        </div>
      )}
    </div>
  );
};
