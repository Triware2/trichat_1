
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, MessageSquare, Clock, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

interface StatData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  description: string;
}

export const AdminStats = () => {
  const [stats, setStats] = useState<StatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch real-time stats
    const fetchStats = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats: StatData[] = [
        {
          title: 'Total Users',
          value: '2,847',
          change: '+12.5%',
          trend: 'up',
          icon: Users,
          description: 'Active users in the last 30 days'
        },
        {
          title: 'Active Chats',
          value: '186',
          change: '+8.2%',
          trend: 'up',
          icon: MessageSquare,
          description: 'Currently ongoing conversations'
        },
        {
          title: 'Avg Response Time',
          value: '2.3m',
          change: '-15.3%',
          trend: 'up',
          icon: Clock,
          description: 'Average first response time'
        },
        {
          title: 'Resolution Rate',
          value: '94.2%',
          change: '+2.1%',
          trend: 'up',
          icon: CheckCircle,
          description: 'Successfully resolved tickets'
        },
        {
          title: 'Pending Issues',
          value: '23',
          change: '-18.7%',
          trend: 'up',
          icon: AlertTriangle,
          description: 'Unresolved support tickets'
        },
        {
          title: 'System Uptime',
          value: '99.9%',
          change: '0.0%',
          trend: 'stable',
          icon: Activity,
          description: 'Server availability this month'
        }
      ];
      
      setStats(mockStats);
      setIsLoading(false);
    };

    fetchStats();
    
    // Set up real-time updates
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleStatClick = (statTitle: string) => {
    console.log(`Navigating to detailed view for: ${statTitle}`);
  };

  const refreshStats = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border border-gray-200 shadow-sm animate-pulse">
            <CardContent className="p-8">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">System Metrics</h2>
          <p className="text-sm text-gray-600 mt-1">Real-time performance indicators</p>
        </div>
        <Button onClick={refreshStats} variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
          Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="cursor-pointer border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
              onClick={() => handleStatClick(stat.title)}
            >
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                      <p className="text-2xl font-semibold text-gray-900 mb-2">{stat.value}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{stat.description}</p>
                  <Badge 
                    variant={stat.trend === 'up' ? 'default' : stat.trend === 'down' ? 'destructive' : 'secondary'}
                    className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
                  >
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : stat.trend === 'down' ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : null}
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
