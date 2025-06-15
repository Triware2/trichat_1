import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  Settings,
  Star,
  Target,
  Clock,
  Eye,
  TrendingUp,
  Activity,
  Menu
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

  const isActive = (tabValue: string) => activeTab === tabValue;

  return (
    <Sidebar className="border-r-0 bg-gradient-to-b from-slate-50 to-white shadow-xl" collapsible="icon">
      {/* Header Section with Stats */}
      <SidebarHeader className="p-6 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm group-data-[collapsible=icon]:p-2">
        <div className="space-y-4 group-data-[collapsible=icon]:space-y-2">
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

          {/* Performance Stats - Hidden when collapsed */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100/50 group-data-[collapsible=icon]:hidden">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
              Today's Performance
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 flex items-center">
                  <MessageSquare className="w-3 h-3 mr-2 text-slate-400" />
                  Chats Handled
                </span>
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-slate-800 text-lg">{todayPerformance.chatsHandled}</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 flex items-center">
                  <Clock className="w-3 h-3 mr-2 text-slate-400" />
                  Avg Response
                </span>
                <span className="font-bold text-slate-800">{todayPerformance.avgResponse}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 flex items-center">
                  <Star className="w-3 h-3 mr-2 text-yellow-500" />
                  Satisfaction
                </span>
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-slate-800">{todayPerformance.satisfaction}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Collapsed state performance indicator with hamburger - Moved down */}
          <div className="hidden group-data-[collapsible=icon]:block">
            <div className="flex flex-col items-center space-y-4 mt-16">
              <SidebarTrigger className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <Menu className="w-5 h-5 text-white" />
              </SidebarTrigger>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      {/* Navigation Content */}
      <SidebarContent className="p-4 space-y-2 group-data-[collapsible=icon]:p-2">
        <SidebarMenu className="space-y-1">
          {/* Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              isActive={isActive('dashboard')}
              tooltip="Dashboard"
            >
              <Button 
                variant={getButtonVariant('dashboard')}
                className={`w-full justify-start h-12 rounded-xl transition-all duration-200 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center ${
                  isActive('dashboard') 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
                    : 'hover:bg-slate-100 hover:scale-[1.01] text-slate-600 hover:text-slate-800'
                }`}
                onClick={() => handleTabClick('dashboard')}
              >
                <BarChart3 className={`w-5 h-5 group-data-[collapsible=icon]:mr-0 mr-3 ${isActive('dashboard') ? 'text-white' : 'text-slate-500'}`} />
                <span className="font-medium group-data-[collapsible=icon]:hidden">Dashboard</span>
                {isActive('dashboard') && <div className="ml-auto w-2 h-2 bg-white rounded-full group-data-[collapsible=icon]:hidden"></div>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Active Chat */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              isActive={isActive('chat')}
              tooltip="Active Chat"
            >
              <Button 
                variant={getButtonVariant('chat')}
                className={`w-full justify-start h-12 rounded-xl transition-all duration-200 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center ${
                  isActive('chat') 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]' 
                    : 'hover:bg-slate-100 hover:scale-[1.01] text-slate-600 hover:text-slate-800'
                }`}
                onClick={() => handleTabClick('chat')}
              >
                <MessageSquare className={`w-5 h-5 group-data-[collapsible=icon]:mr-0 mr-3 ${isActive('chat') ? 'text-white' : 'text-slate-500'}`} />
                <span className="font-medium group-data-[collapsible=icon]:hidden">Active Chat</span>
                {isActive('chat') && <div className="ml-auto w-2 h-2 bg-white rounded-full group-data-[collapsible=icon]:hidden"></div>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* All Chats */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              isActive={isActive('all-chats')}
              tooltip="All Chats"
            >
              <Button 
                variant={getButtonVariant('all-chats')}
                className={`w-full justify-start h-12 rounded-xl transition-all duration-200 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center ${
                  isActive('all-chats') 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 scale-[1.02]' 
                    : 'hover:bg-slate-100 hover:scale-[1.01] text-slate-600 hover:text-slate-800'
                }`}
                onClick={() => handleTabClick('all-chats')}
              >
                <MessageSquare className={`w-5 h-5 group-data-[collapsible=icon]:mr-0 mr-3 ${isActive('all-chats') ? 'text-white' : 'text-slate-500'}`} />
                <span className="font-medium group-data-[collapsible=icon]:hidden">All Chats</span>
                {isActive('all-chats') && <div className="ml-auto w-2 h-2 bg-white rounded-full group-data-[collapsible=icon]:hidden"></div>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Contacts */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              isActive={isActive('contacts')}
              tooltip="Contacts"
            >
              <Button 
                variant={getButtonVariant('contacts')}
                className={`w-full justify-start h-12 rounded-xl transition-all duration-200 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center ${
                  isActive('contacts') 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 scale-[1.02]' 
                    : 'hover:bg-slate-100 hover:scale-[1.01] text-slate-600 hover:text-slate-800'
                }`}
                onClick={() => handleTabClick('contacts')}
              >
                <Users className={`w-5 h-5 group-data-[collapsible=icon]:mr-0 mr-3 ${isActive('contacts') ? 'text-white' : 'text-slate-500'}`} />
                <span className="font-medium group-data-[collapsible=icon]:hidden">Contacts</span>
                {isActive('contacts') && <div className="ml-auto w-2 h-2 bg-white rounded-full group-data-[collapsible=icon]:hidden"></div>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Customer Insights */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              isActive={isActive('customer-insights')}
              tooltip="Customer 360°"
            >
              <Button 
                variant={getButtonVariant('customer-insights')}
                className={`w-full justify-start h-12 rounded-xl transition-all duration-200 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center ${
                  isActive('customer-insights') 
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 scale-[1.02]' 
                    : 'hover:bg-slate-100 hover:scale-[1.01] text-slate-600 hover:text-slate-800'
                }`}
                onClick={() => handleTabClick('customer-insights')}
              >
                <Eye className={`w-5 h-5 group-data-[collapsible=icon]:mr-0 mr-3 ${isActive('customer-insights') ? 'text-white' : 'text-slate-500'}`} />
                <span className="font-medium group-data-[collapsible=icon]:hidden">Customer 360°</span>
                {isActive('customer-insights') && <div className="ml-auto w-2 h-2 bg-white rounded-full group-data-[collapsible=icon]:hidden"></div>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Divider */}
          <div className="my-4 group-data-[collapsible=icon]:my-2">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          </div>
          
          {/* Settings */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              isActive={isActive('settings')}
              tooltip="Settings"
            >
              <Button 
                variant={getButtonVariant('settings')}
                className={`w-full justify-start h-12 rounded-xl transition-all duration-200 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center ${
                  isActive('settings') 
                    ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/25 scale-[1.02]' 
                    : 'hover:bg-slate-100 hover:scale-[1.01] text-slate-600 hover:text-slate-800'
                }`}
                onClick={() => handleTabClick('settings')}
              >
                <Settings className={`w-5 h-5 group-data-[collapsible=icon]:mr-0 mr-3 ${isActive('settings') ? 'text-white' : 'text-slate-500'}`} />
                <span className="font-medium group-data-[collapsible=icon]:hidden">Settings</span>
                {isActive('settings') && <div className="ml-auto w-2 h-2 bg-white rounded-full group-data-[collapsible=icon]:hidden"></div>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Bottom Status - Hidden when collapsed */}
        <div className="mt-8 pt-4 border-t border-slate-200/60 group-data-[collapsible=icon]:hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100/50">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Online & Ready</span>
            </div>
            <p className="text-xs text-green-600 mt-1">All systems operational</p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
