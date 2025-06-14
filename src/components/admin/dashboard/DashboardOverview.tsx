
import { AdminStats } from './AdminStats';
import { RecentActivities } from './RecentActivities';
import { QuickActions } from './QuickActions';

export const DashboardOverview = () => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Stats Grid */}
      <AdminStats />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Activity */}
        <RecentActivities />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
};
