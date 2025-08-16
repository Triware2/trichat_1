
import { AdminStats } from './AdminStats';
import { RecentActivities } from './RecentActivities';
import { QuickActions } from './QuickActions';
import { BarChart3, Activity, TrendingUp } from 'lucide-react';

export const DashboardOverview = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-amber-50/10">
      {/* Header Section with Glass Morphism */}
      <div className="relative mb-8">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-300/10 to-yellow-300/10 rounded-full blur-2xl"></div>
        
        {/* Content */}
        <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-3xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
              <BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Dashboard Overview</h1>
              <p className="text-slate-600 mt-1 flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-500" />
                Monitor your customer support performance and key metrics
              </p>
            </div>
          </div>
          
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-green-100">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">System Status</p>
                  <p className="text-lg font-bold text-green-900">All Systems Operational</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Last Updated</p>
                  <p className="text-lg font-bold text-blue-900">Just Now</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200/60 rounded-2xl p-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Data Sources</p>
                  <p className="text-lg font-bold text-purple-900">Real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* System Metrics */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-3xl p-6 lg:p-8">
            <AdminStats />
          </div>
        </div>

        {/* Activities and Actions Grid - Fixed responsive layout with proper height */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Recent Activities - Takes more space (2/3 width) */}
          <div className="xl:col-span-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-3xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-3xl h-full">
              <RecentActivities />
            </div>
          </div>
          
          {/* Quick Actions - Takes less space (1/3 width) but same height */}
          <div className="xl:col-span-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-3xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-3xl h-full">
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
