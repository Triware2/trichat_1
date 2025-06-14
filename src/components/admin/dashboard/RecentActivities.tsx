
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserPlus, 
  Settings, 
  AlertCircle,
  BarChart3,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityItem {
  type: string;
  message: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
  severity: 'info' | 'warning' | 'success';
}

export const RecentActivities = () => {
  const recentActivities: ActivityItem[] = [
    {
      type: "User created",
      message: "Sarah Johnson was added as an agent",
      time: "2 minutes ago",
      icon: UserPlus,
      severity: "success"
    },
    {
      type: "Configuration updated",
      message: "Chat widget settings were modified",
      time: "1 hour ago",
      icon: Settings,
      severity: "info"
    },
    {
      type: "Alert triggered",
      message: "High chat volume detected",
      time: "2 hours ago",
      icon: AlertCircle,
      severity: "warning"
    },
    {
      type: "Report generated",
      message: "Weekly performance report completed",
      time: "4 hours ago",
      icon: BarChart3,
      severity: "info"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Activity feed
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Recent system events and changes
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityColor(activity.severity)}`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
