
import { AdminStats } from './AdminStats';
import { RecentActivities } from './RecentActivities';
import { QuickActions } from './QuickActions';

export const DashboardOverview = () => {
  return (
    <div className="min-h-screen bg-gray-50/30 w-full">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 font-segoe">
              Dashboard Overview
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
              Monitor system performance, user activities, and quick administrative actions
            </p>
          </div>
        </div>

        <AdminStats />

        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 mt-8">
          <div className="xl:col-span-1 2xl:col-span-2">
            <RecentActivities />
          </div>
          <div className="xl:col-span-1 2xl:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};
