
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Globe,
  Activity,
  Lock
} from 'lucide-react';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-7 bg-white border shadow-sm rounded-xl p-1 h-auto">
      <TabsTrigger 
        value="overview" 
        className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium py-2 px-1 sm:px-3"
      >
        <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Overview</span>
      </TabsTrigger>
      <TabsTrigger 
        value="users" 
        className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium py-2 px-1 sm:px-3"
      >
        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Users</span>
      </TabsTrigger>
      <TabsTrigger 
        value="access" 
        className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium py-2 px-1 sm:px-3"
      >
        <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Access</span>
      </TabsTrigger>
      <TabsTrigger 
        value="chatbot" 
        className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium py-2 px-1 sm:px-3"
      >
        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Chatbot</span>
      </TabsTrigger>
      <TabsTrigger 
        value="analytics" 
        className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium py-2 px-1 sm:px-3"
      >
        <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Analytics</span>
      </TabsTrigger>
      <TabsTrigger 
        value="widget" 
        className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium py-2 px-1 sm:px-3"
      >
        <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Widget</span>
      </TabsTrigger>
      <TabsTrigger 
        value="settings" 
        className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md font-lexend font-medium py-2 px-1 sm:px-3"
      >
        <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Settings</span>
      </TabsTrigger>
    </TabsList>
  );
};
