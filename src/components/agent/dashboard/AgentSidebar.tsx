
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  Settings,
  Star,
  Target,
  Clock
} from 'lucide-react';

interface TodayPerformance {
  chatsHandled: number;
  avgResponse: string;
  satisfaction: number;
}

interface AgentSidebarProps {
  todayPerformance: TodayPerformance;
}

export const AgentSidebar = ({ todayPerformance }: AgentSidebarProps) => {
  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Chats Today</span>
              <span className="font-medium">{todayPerformance.chatsHandled}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Response</span>
              <span className="font-medium">{todayPerformance.avgResponse}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Satisfaction</span>
              <span className="font-medium">{todayPerformance.satisfaction}</span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <TabsTrigger value="dashboard" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <TabsTrigger value="chat" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Active Chat
              </TabsTrigger>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <TabsTrigger value="all-chats" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                All Chats
              </TabsTrigger>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <TabsTrigger value="contacts" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Contacts
              </TabsTrigger>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <TabsTrigger value="analytics" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <TabsTrigger value="settings" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
