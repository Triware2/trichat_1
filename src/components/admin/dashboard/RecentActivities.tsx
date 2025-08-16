import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { adminDashboardService, ActivityItem } from '@/services/adminDashboardService';
import { 
  Activity, 
  User, 
  Settings, 
  Shield, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Loader2,
  Eye
} from 'lucide-react';

export const RecentActivities = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const activitiesData = await adminDashboardService.getRecentActivities(20);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Error",
        description: "Failed to load recent activities. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    
    // Set up real-time updates every minute
    const interval = setInterval(fetchActivities, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return User;
      case 'system': return Settings;
      case 'security': return Shield;
      case 'chat': return MessageSquare;
      case 'admin': return Activity;
      default: return Activity;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      case 'info': return Clock;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const handleViewDetails = (activityId: string) => {
    toast({
      title: "Activity Details",
      description: `Viewing details for activity ${activityId}`,
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchActivities();
    setIsRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Recent activities have been updated.",
    });
  };

  if (isLoading) {
    return (
      <Card className="border border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm h-full">
        <CardHeader className="border-b border-slate-100/60 bg-slate-50/30 p-4 lg:p-6">
          <CardTitle className="text-lg font-bold text-slate-900">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-slate-200/80 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200/80 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200/80 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200/60 shadow-sm bg-white/80 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="border-b border-slate-100/60 bg-slate-50/30 p-4 lg:p-6 flex-shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-900">
              <Activity className="h-5 w-5 text-orange-600" />
              Recent Activities
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 mt-1">
              Latest system and user activities
            </CardDescription>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="border-slate-300 text-slate-700 hover:bg-slate-50/80 backdrop-blur-sm transition-all duration-200 w-full lg:w-auto"
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Filter className="w-4 h-4 mr-2" />
            )}
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap mt-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50/80 backdrop-blur-sm'}
          >
            All
          </Button>
          <Button
            variant={filter === 'user' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('user')}
            className={filter === 'user' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50/80 backdrop-blur-sm'}
          >
            Users
          </Button>
          <Button
            variant={filter === 'security' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('security')}
            className={filter === 'security' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50/80 backdrop-blur-sm'}
          >
            Security
          </Button>
          <Button
            variant={filter === 'system' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('system')}
            className={filter === 'system' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50/80 backdrop-blur-sm'}
          >
            System
          </Button>
          <Button
            variant={filter === 'chat' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('chat')}
            className={filter === 'chat' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50/80 backdrop-blur-sm'}
          >
            Chat
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col">
        <ScrollArea className="h-[400px]">
          <div className="divide-y divide-slate-100/60">
            {filteredActivities.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-500">
                <div className="text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No activities found</p>
                </div>
              </div>
            ) : (
              filteredActivities.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                const StatusIcon = getStatusIcon(activity.status);
                
                return (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 lg:space-x-4 px-4 lg:px-6 py-3 lg:py-4 hover:bg-slate-50/50 cursor-pointer transition-all duration-200 group"
                    onClick={() => handleViewDetails(activity.id)}
                  >
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100/60 flex items-center justify-center group-hover:from-orange-100 group-hover:to-amber-100 transition-all duration-300 flex-shrink-0">
                      <ActivityIcon className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {activity.user}
                        </p>
                        <Badge variant="outline" className={`text-xs ${getStatusBgColor(activity.status)}`}>
                          {activity.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-2">
                        {activity.action}
                        {activity.target && (
                          <span className="font-medium"> {activity.target}</span>
                        )}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-3 w-3 ${getStatusColor(activity.status)}`} />
                        <span className="text-xs text-slate-500">{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
