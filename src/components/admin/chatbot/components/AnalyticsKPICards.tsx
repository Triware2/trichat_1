
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Target
} from 'lucide-react';

interface KPICard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const AnalyticsKPICards = () => {
  const kpiCards: KPICard[] = [
    {
      title: 'Total Conversations',
      value: '12,456',
      change: '+18.2%',
      trend: 'up',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      title: 'Resolution Rate',
      value: '94.2%',
      change: '+5.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Avg Response Time',
      value: '1.2s',
      change: '-23.4%',
      trend: 'down',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.5/5',
      change: '+8.3%',
      trend: 'up',
      icon: Target,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiCards.map((kpi, index) => (
        <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{kpi.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mb-2">{kpi.value}</p>
                <div className="flex items-center mt-1">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : kpi.change.startsWith('-') ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <kpi.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
