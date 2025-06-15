
import { AdminStats } from './AdminStats';
import { RecentActivities } from './RecentActivities';
import { QuickActions } from './QuickActions';

export const DashboardOverview = () => {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-gray-900 font-segoe">Dashboard Overview</h1>
            <p className="text-base text-gray-600 leading-relaxed">
              Monitor system performance, user activities, and quick administrative actions
            </p>
          </div>
        </div>

        <AdminStats />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
          <RecentActivities />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};
