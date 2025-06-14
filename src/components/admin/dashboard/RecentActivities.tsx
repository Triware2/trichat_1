
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
      <CardHeader className="pb-3 lg:pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-heading-3 font-lexend font-medium">
              <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
              Recent Activity
            </CardTitle>
            <CardDescription className="mt-1 text-caption font-lexend">
              Latest system events and user actions
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="font-lexend font-medium">
            <Bell className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 lg:space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                <activity.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-caption font-lexend font-medium text-slate-900 mb-1">{activity.message}</p>
                <p className="text-caption font-lexend text-slate-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
