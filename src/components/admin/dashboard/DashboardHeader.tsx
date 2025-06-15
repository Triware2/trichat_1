
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Bell, Search, Plus, Download } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-2">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-3">
          {/* Left side - Search only */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
              {/* Search - responsive sizing */}
              <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 h-8 border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-gray-50/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Mobile search button */}
            <Button variant="ghost" size="sm" className="md:hidden h-8 w-8">
              <Search className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="relative h-8 w-8">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500" />
            </Button>
            
            <div className="hidden sm:flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-700 border-gray-300 h-8 px-3"
              >
                <Download className="w-4 h-4 mr-1" />
                <span>Export</span>
              </Button>
              
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>New</span>
              </Button>
            </div>

            {/* Mobile action button */}
            <Button 
              size="sm" 
              className="sm:hidden bg-blue-600 hover:bg-blue-700 text-white h-8 w-8"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-10 h-8 border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-gray-50/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
