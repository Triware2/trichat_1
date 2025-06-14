
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  Settings,
  Star,
  Target
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar';

interface TodayPerformance {
  chatsHandled: number;
  avgResponse: string;
  satisfaction: number;
}

interface AgentSidebarProps {
  todayPerformance: TodayPerformance;
}

export const AgentSidebar = ({ todayPerformance }: AgentSidebarProps) => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, tabValue: 'dashboard' },
    { id: 'chats', label: 'Active Chats', icon: MessageSquare, tabValue: 'chats' },
    { id: 'all-chats', label: 'All Chats', icon: MessageSquare, tabValue: 'all-chats' },
    { id: 'contacts', label: 'Contacts', icon: Users, tabValue: 'contacts' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, tabValue: 'analytics' },
    { id: 'csat', label: 'Customer Satisfaction', icon: Star, tabValue: 'csat' },
    { id: 'settings', label: 'Settings', icon: Settings, tabValue: 'settings' }
  ];

  const handleTabClick = (tabValue: string) => {
    const tabsElement = document.querySelector('[role="tablist"]');
    if (tabsElement) {
      const targetTab = tabsElement.querySelector(`[value="${tabValue}"]`) as HTMLElement;
      if (targetTab) {
        targetTab.click();
      }
    }
  };

  return (
    <Sidebar className="w-64 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Agent Portal</h3>
          <SidebarTrigger />
        </div>
        
        {/* Today's Performance Summary */}
        <div className="bg-blue-50 rounded-lg p-3 mt-3">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Today's Performance</h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700">Chats</span>
              <span className="text-xs font-medium text-blue-900">{todayPerformance.chatsHandled}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700">Avg Response</span>
              <span className="text-xs font-medium text-blue-900">{todayPerformance.avgResponse}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700">Satisfaction</span>
              <span className="text-xs font-medium text-blue-900">{todayPerformance.satisfaction}/5</span>
            </div>
          </div>
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => handleTabClick(item.tabValue)}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
