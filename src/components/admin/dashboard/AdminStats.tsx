
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleStatClick = (statTitle: string) => {
    console.log(`Navigating to detailed view for: ${statTitle}`);
    // Add navigation logic here
  };

  const refreshStats = () => {
    setIsLoading(true);
    // Trigger a manual refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
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
          <h2 className="text-2xl font-semibold text-gray-900">System Overview</h2>
          <p className="text-sm text-gray-600">Real-time performance metrics and statistics</p>
        </div>
        <Button onClick={refreshStats} variant="outline" size="sm">
          Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border hover:border-blue-200"
              onClick={() => handleStatClick(stat.title)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <Badge 
                    variant={stat.trend === 'up' ? 'default' : stat.trend === 'down' ? 'destructive' : 'secondary'}
                    className="flex items-center gap-1"
                  >
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : stat.trend === 'down' ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : null}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
