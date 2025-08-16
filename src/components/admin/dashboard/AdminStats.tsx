
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, MessageSquare, Clock, CheckCircle, AlertTriangle, Activity, RefreshCw, Loader2 } from 'lucide-react';
import { adminDashboardService, AdminDashboardStats } from '@/services/adminDashboardService';
import { useToast } from '@/hooks/use-toast';

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const dashboardStats = await adminDashboardService.getDashboardStats();
      
      const statsData: StatData[] = [
        {
          title: 'Total Users',
          value: dashboardStats.totalUsers.toLocaleString(),
          change: `${dashboardStats.trends.totalUsers.change > 0 ? '+' : ''}${dashboardStats.trends.totalUsers.change}%`,
          trend: dashboardStats.trends.totalUsers.trend,
          icon: Users,
          description: 'Active users in the last 30 days'
        },
        {
          title: 'Active Chats',
          value: dashboardStats.activeChats.toString(),
          change: `${dashboardStats.trends.activeChats.change > 0 ? '+' : ''}${dashboardStats.trends.activeChats.change}%`,
          trend: dashboardStats.trends.activeChats.trend,
          icon: MessageSquare,
          description: 'Currently ongoing conversations'
        },
        {
          title: 'Avg Response Time',
          value: `${dashboardStats.avgResponseTime.toFixed(1)}m`,
          change: `${dashboardStats.trends.avgResponseTime.change > 0 ? '+' : ''}${dashboardStats.trends.avgResponseTime.change}%`,
          trend: dashboardStats.trends.avgResponseTime.trend,
          icon: Clock,
          description: 'Average first response time'
        },
        {
          title: 'Resolution Rate',
          value: `${dashboardStats.resolutionRate.toFixed(1)}%`,
          change: `${dashboardStats.trends.resolutionRate.change > 0 ? '+' : ''}${dashboardStats.trends.resolutionRate.change}%`,
          trend: dashboardStats.trends.resolutionRate.trend,
          icon: CheckCircle,
          description: 'Successfully resolved tickets'
        },
        {
          title: 'Pending Issues',
          value: dashboardStats.pendingIssues.toString(),
          change: `${dashboardStats.trends.pendingIssues.change > 0 ? '+' : ''}${dashboardStats.trends.pendingIssues.change}%`,
          trend: dashboardStats.trends.pendingIssues.trend,
          icon: AlertTriangle,
          description: 'Unresolved support tickets'
        },
        {
          title: 'System Uptime',
          value: `${dashboardStats.systemUptime.toFixed(1)}%`,
          change: `${dashboardStats.trends.systemUptime.change > 0 ? '+' : ''}${dashboardStats.trends.systemUptime.change}%`,
          trend: dashboardStats.trends.systemUptime.trend,
          icon: Activity,
          description: 'Server availability this month'
        }
      ];
      
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleStatClick = (statTitle: string) => {
    console.log(`Navigating to detailed view for: ${statTitle}`);
    // In a real implementation, you'd navigate to detailed analytics
    toast({
      title: "Analytics",
      description: `Opening detailed view for ${statTitle}`,
    });
  };

  const refreshStats = async () => {
    setIsRefreshing(true);
    await fetchStats();
    setIsRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Dashboard statistics have been updated.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">System Metrics</h2>
            <p className="text-sm text-slate-600 mt-1">Real-time performance indicators</p>
          </div>
          <Button disabled variant="outline" size="sm" className="border-slate-300 text-slate-700">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border border-slate-200/60 shadow-sm animate-pulse bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-slate-100/80">
                      <div className="w-5 h-5 bg-slate-200 rounded"></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">System Metrics</h2>
          <p className="text-sm text-slate-600 mt-1">Real-time performance indicators</p>
        </div>
        <Button 
          onClick={refreshStats} 
          variant="outline" 
          size="sm" 
          disabled={isRefreshing}
          className="border-slate-300 text-slate-700 hover:bg-slate-50/80 backdrop-blur-sm transition-all duration-200"
        >
          {isRefreshing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="group cursor-pointer border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-orange-300/60 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white/90"
              onClick={() => handleStatClick(stat.title)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100/60 group-hover:from-orange-100 group-hover:to-amber-100 transition-all duration-300">
                      <Icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-600 mb-2">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-900 mb-2">{stat.value}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">{stat.description}</p>
                  <Badge 
                    variant={stat.trend === 'up' ? 'default' : stat.trend === 'down' ? 'destructive' : 'secondary'}
                    className={`flex items-center gap-1 transition-all duration-200 ${
                      stat.trend === 'up' 
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                        : stat.trend === 'down' 
                        ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
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
