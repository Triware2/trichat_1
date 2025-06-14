
import { AdminStats } from './AdminStats';
import { RecentActivities } from './RecentActivities';
import { QuickActions } from './QuickActions';

export const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <AdminStats />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentActivities />
        <QuickActions />
      </div>
    </div>
  );
};
