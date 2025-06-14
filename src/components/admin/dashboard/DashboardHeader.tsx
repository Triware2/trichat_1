
import { Button } from '@/components/ui/button';
import { Search, Bell, Settings, Plus } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your organization's resources and settings
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              className="pl-10 pr-4 py-2 w-80 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2">
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-4">
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};
