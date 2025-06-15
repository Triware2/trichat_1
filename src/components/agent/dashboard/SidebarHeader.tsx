
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';

export const SidebarHeader = () => {
  return (
    <>
      {/* Agent Badge with Hamburger Menu beside it - Moved down for better visibility */}
      <div className="flex items-center justify-between space-x-3 mt-16 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="font-semibold text-slate-800 text-lg">Agent Hub</h3>
            <p className="text-xs text-slate-500 font-medium">Performance Dashboard</p>
          </div>
        </div>
        {/* Hamburger Menu Button beside Agent Hub - Made more prominent */}
        <SidebarTrigger className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
          <Menu className="w-6 h-6 text-white" />
        </SidebarTrigger>
      </div>

      {/* Collapsed state performance indicator with hamburger - Moved down */}
      <div className="hidden group-data-[collapsible=icon]:block">
        <div className="flex flex-col items-center space-y-4 mt-16">
          <SidebarTrigger className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            <Menu className="w-5 h-5 text-white" />
          </SidebarTrigger>
        </div>
      </div>
    </>
  );
};
