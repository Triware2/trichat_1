
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Bell, Search, Plus, Settings, Download } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left side - Title and search */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
                  Administrative Control Center
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your platform, users, and system settings
                </p>
              </div>
              
              {/* Search - hidden on mobile, shown on larger screens */}
              <div className="hidden md:flex flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users, settings, logs..."
                    className="pl-10 border-gray-200 focus:border-red-300 focus:ring-red-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile search button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Search className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500" />
            </Button>
            
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-gray-700 border-gray-300">
                <Download className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Quick Action</span>
              </Button>
            </div>

            {/* Mobile action button */}
            <Button size="sm" className="sm:hidden bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users, settings, logs..."
              className="pl-10 border-gray-200 focus:border-red-300 focus:ring-red-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
