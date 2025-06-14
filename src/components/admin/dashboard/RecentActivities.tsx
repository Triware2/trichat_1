
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  User, 
  Settings, 
  Shield, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target?: string;
  timestamp: string;
  type: 'user' | 'system' | 'security' | 'chat' | 'admin';
  status: 'success' | 'warning' | 'error' | 'info';
  avatar?: string;
}

export const RecentActivities = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          user: 'Admin',
          action: 'Created new user account',
          target: 'john.doe@company.com',
          timestamp: '2 minutes ago',
          type: 'user',
          status: 'success'
        },
        {
          id: '2',
          user: 'System',
          action: 'Security scan completed',
          timestamp: '5 minutes ago',
          type: 'security',
          status: 'success'
        },
        {
          id: '3',
          user: 'Alice Johnson',
          action: 'Updated system settings',
          target: 'Email notifications',
          timestamp: '8 minutes ago',
          type: 'admin',
          status: 'info'
        },
        {
          id: '4',
          user: 'Bob Wilson',
          action: 'Resolved critical chat issue',
          target: 'Ticket #CH-2847',
          timestamp: '12 minutes ago',
          type: 'chat',
          status: 'success'
        },
        {
          id: '5',
          user: 'System',
          action: 'Failed login attempt detected',
          target: '192.168.1.100',
          timestamp: '15 minutes ago',
          type: 'security',
          status: 'warning'
        },
        {
          id: '6',
          user: 'Sarah Davis',
          action: 'Generated monthly report',
          target: 'Analytics Dashboard',
          timestamp: '18 minutes ago',
          type: 'admin',
          status: 'success'
        },
        {
          id: '7',
          user: 'System',
          action: 'Database backup completed',
          timestamp: '25 minutes ago',
          type: 'system',
          status: 'success'
        },
        {
          id: '8',
          user: 'Mike Chen',
          action: 'Deleted user account',
          target: 'inactive.user@company.com',
          timestamp: '32 minutes ago',
          type: 'user',
          status: 'warning'
        }
      ];
      
      setActivities(mockActivities);
      setIsLoading(false);
    };

    fetchActivities();
    
    // Set up real-time updates
    const interval = setInterval(fetchActivities, 60000); // Update every minute
    
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

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const handleViewDetails = (activityId: string) => {
    toast({
      title: "Activity Details",
      description: `Viewing details for activity ${activityId}`,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Recent Activities
        </CardTitle>
        <CardDescription>
          Latest system and user activities
        </CardDescription>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'user' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('user')}
          >
            Users
          </Button>
          <Button
            variant={filter === 'security' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('security')}
          >
            Security
          </Button>
          <Button
            variant={filter === 'system' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('system')}
          >
            System
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              const StatusIcon = getStatusIcon(activity.status);
              
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleViewDetails(activity.id)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback>
                      <ActivityIcon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.user}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.action}
                      {activity.target && (
                        <span className="font-medium"> {activity.target}</span>
                      )}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <StatusIcon className={`h-3 w-3 ${getStatusColor(activity.status)}`} />
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full" size="sm">
            View All Activities
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
