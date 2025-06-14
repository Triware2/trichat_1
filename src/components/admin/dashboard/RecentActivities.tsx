
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  UserPlus, 
  Settings, 
  AlertCircle,
  BarChart3,
  Bell
} from 'lucide-react';

interface ActivityItem {
  type: string;
  message: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

export const RecentActivities = () => {
  const recentActivities: ActivityItem[] = [
    {
      type: "user_added",
      message: "New agent Sarah Johnson added to team",
      time: "2 minutes ago",
      icon: UserPlus,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      type: "system_update",
      message: "Chat widget updated for client portal",
      time: "1 hour ago",
      icon: Settings,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      type: "alert",
      message: "High volume of chats detected",
      time: "2 hours ago",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      type: "performance",
      message: "Weekly performance report generated",
      time: "4 hours ago",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-lexend font-medium">
              <Activity className="w-4 h-4 text-orange-600" />
              Recent Activity
            </CardTitle>
            <CardDescription className="mt-1 text-sm font-lexend">
              Latest system events and user actions
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="font-lexend font-medium">
            <Bell className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className={`w-8 h-8 rounded-xl ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-lexend font-medium text-slate-900 mb-1">{activity.message}</p>
                <p className="text-xs font-lexend text-slate-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
