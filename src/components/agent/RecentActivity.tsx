import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Activity {
  customer: string;
  action: string;
  time: string;
  type: string;
}

interface RecentActivityProps {
  activities: Activity[];
  small?: boolean;
}

export const RecentActivity = ({ activities, small = false }: RecentActivityProps) => {
  return (
    <Card className={small ? 'p-2' : ''}>
      <CardHeader className={small ? 'pb-2' : ''}>
        <CardTitle className={small ? 'text-base font-bold text-slate-900 font-roboto' : 'font-bold text-slate-900 font-roboto'}>Recent Activity</CardTitle>
        <CardDescription className={small ? 'text-xs font-medium text-slate-600' : 'font-medium text-slate-600'}>Your latest actions and updates</CardDescription>
      </CardHeader>
      <CardContent className={small ? 'p-2' : ''}>
        <div className={small ? 'space-y-2' : 'space-y-3'}>
          {activities.map((activity, index) => (
            <div key={index} className={`flex items-center gap-2 ${small ? 'p-2' : 'p-3'} bg-gray-50 rounded-lg`}>
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className={small ? 'text-xs text-slate-900' : 'text-sm text-slate-900'}>
                  <span className="font-bold">{activity.customer}</span> - {activity.action}
                </p>
                <p className={small ? 'text-[10px] text-slate-500' : 'text-xs text-slate-500'}>{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
