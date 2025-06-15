
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Bell, Search, Plus, Settings, Download } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          {/* Left side - Title and search */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 truncate">
                  Administrative Control Center
                </h1>
                <p className="text-sm lg:text-base text-gray-600 mt-1">
                  Manage your platform, users, and system settings
                </p>
              </div>
              
              {/* Search - responsive sizing */}
              <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users, settings, logs..."
                    className="pl-10 h-10 lg:h-12 border-gray-200 focus:border-red-300 focus:ring-red-200 bg-gray-50/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Mobile search button */}
            <Button variant="ghost" size="sm" className="md:hidden h-10 w-10">
              <Search className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="relative h-10 w-10 lg:h-12 lg:w-12">
              <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
              <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500" />
            </Button>
            
            <div className="hidden sm:flex items-center gap-2 lg:gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-700 border-gray-300 h-10 lg:h-12 px-4 lg:px-6"
              >
                <Download className="w-4 h-4 mr-2" />
                <span>Export</span>
              </Button>
              
              <Button 
                size="sm" 
                className="bg-red-600 hover:bg-red-700 text-white h-10 lg:h-12 px-4 lg:px-6 shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span>Quick Action</span>
              </Button>
            </div>

            {/* Mobile action button */}
            <Button 
              size="sm" 
              className="sm:hidden bg-red-600 hover:bg-red-700 text-white h-10 w-10"
            >
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
              className="pl-10 h-10 border-gray-200 focus:border-red-300 focus:ring-red-200 bg-gray-50/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
