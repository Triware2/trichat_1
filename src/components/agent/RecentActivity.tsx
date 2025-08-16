import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface RecentActivityProps {
  activities: Array<{
    customer: string;
    action: string;
    time: string;
    type: string;
  }>;
  small?: boolean;
}

export const RecentActivity = ({ activities, small = false }: RecentActivityProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-[#11b890]" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-[#11b890] bg-gradient-to-r from-[#11b890]/10 to-slate-50/50';
      case 'warning':
        return 'border-l-amber-500 bg-gradient-to-r from-amber-50/50 to-slate-50/50';
      default:
        return 'border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-slate-50/50';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className={`bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60 ${small ? 'p-4' : 'p-6'}`}>
        <CardTitle className={`flex items-center space-x-3 ${small ? 'text-lg' : 'text-xl'} font-semibold text-slate-900`}>
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span>Recent Activity</span>
        </CardTitle>
        <CardDescription className={`${small ? 'text-sm' : 'text-base'} text-slate-600 mt-1`}>
          Your latest actions and updates
        </CardDescription>
      </CardHeader>
      <CardContent className={small ? 'p-4' : 'p-6'}>
        {activities.length > 0 ? (
          <div className={small ? 'space-y-3' : 'space-y-4'}>
            {activities.map((activity, index) => (
              <div key={index} className={`flex items-start space-x-3 ${small ? 'p-3' : 'p-4'} ${getActivityColor(activity.type)} rounded-xl border-l-4 border border-slate-200`}>
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`${small ? 'text-sm' : 'text-base'} text-slate-900 font-medium`}>
                    <span className="font-semibold">{activity.customer}</span> - {activity.action}
                  </p>
                  <p className={`${small ? 'text-xs' : 'text-sm'} text-slate-500 mt-1`}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No recent activity</h3>
            <p className="text-slate-600">Your recent actions will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
