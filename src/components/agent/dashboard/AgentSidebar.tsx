
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  Settings,
  Star,
  Target,
  Clock
} from 'lucide-react';
import { useState } from 'react';

interface TodayPerformance {
  chatsHandled: number;
  avgResponse: string;
  satisfaction: number;
}

interface AgentSidebarProps {
  todayPerformance: TodayPerformance;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const AgentSidebar = ({ todayPerformance, activeTab = 'dashboard', onTabChange }: AgentSidebarProps) => {
  const handleTabClick = (tabValue: string) => {
    if (onTabChange) {
      onTabChange(tabValue);
    }
  };

  const getButtonVariant = (tabValue: string) => {
    return activeTab === tabValue ? 'default' : 'ghost';
  };

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
              <Button 
                variant={getButtonVariant('dashboard')}
                className="w-full justify-start"
                onClick={() => handleTabClick('dashboard')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button 
                variant={getButtonVariant('chat')}
                className="w-full justify-start"
                onClick={() => handleTabClick('chat')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Active Chat
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button 
                variant={getButtonVariant('all-chats')}
                className="w-full justify-start"
                onClick={() => handleTabClick('all-chats')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                All Chats
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button 
                variant={getButtonVariant('contacts')}
                className="w-full justify-start"
                onClick={() => handleTabClick('contacts')}
              >
                <Users className="w-4 h-4 mr-2" />
                Contacts
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button 
                variant={getButtonVariant('analytics')}
                className="w-full justify-start"
                onClick={() => handleTabClick('analytics')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button 
                variant={getButtonVariant('settings')}
                className="w-full justify-start"
                onClick={() => handleTabClick('settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
