
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Bell, Search, Plus, Download } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <div className="bg-white border-b border-neutral-200/60 sticky top-16 z-30">
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                className="pl-10 h-9 border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-sm"
              />
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative h-9 w-9 hover:bg-neutral-100">
              <Bell className="w-4 h-4 text-neutral-600" />
              <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500 border-white border-2" />
            </Button>
            
            <div className="hidden sm:flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-neutral-700 border-neutral-200 hover:bg-neutral-50 h-9 px-4 font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 font-medium shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>

            {/* Mobile action button */}
            <Button 
              size="sm" 
              className="sm:hidden bg-blue-600 hover:bg-blue-700 text-white h-9 w-9"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-10 h-9 border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
