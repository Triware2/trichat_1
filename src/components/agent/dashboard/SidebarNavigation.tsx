
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  Settings,
  Eye
} from 'lucide-react';

interface SidebarNavigationProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

export const SidebarNavigation = ({ activeTab, onTabChange }: SidebarNavigationProps) => {
  const handleTabClick = (tabValue: string) => {
    if (onTabChange) {
      onTabChange(tabValue);
    }
  };

  const getButtonVariant = (tabValue: string) => {
    return activeTab === tabValue ? 'default' : 'ghost';
  };

  const isActive = (tabValue: string) => activeTab === tabValue;

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      gradient: 'from-blue-500 to-blue-600',
      shadowColor: 'shadow-blue-500/25'
    },
    {
      id: 'chat',
      label: 'Active Chat',
      icon: MessageSquare,
      gradient: 'from-emerald-500 to-emerald-600',
      shadowColor: 'shadow-emerald-500/25'
    },
    {
      id: 'all-chats',
      label: 'All Chats',
      icon: MessageSquare,
      gradient: 'from-purple-500 to-purple-600',
      shadowColor: 'shadow-purple-500/25'
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: Users,
      gradient: 'from-orange-500 to-orange-600',
      shadowColor: 'shadow-orange-500/25'
    },
    {
      id: 'customer-insights',
      label: 'Customer 360°',
      icon: Eye,
      gradient: 'from-cyan-500 to-cyan-600',
      shadowColor: 'shadow-cyan-500/25'
    }
  ];

  return (
    <SidebarMenu className="space-y-1">
      {navigationItems.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton 
            asChild
            isActive={isActive(item.id)}
            tooltip={item.label}
          >
            <Button 
              variant={getButtonVariant(item.id)}
              className={`w-full justify-start h-12 rounded-xl transition-all duration-200 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center ${
                isActive(item.id) 
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg ${item.shadowColor} scale-[1.02]` 
                  : 'hover:bg-slate-100 hover:scale-[1.01] text-slate-600 hover:text-slate-800'
              }`}
              onClick={() => handleTabClick(item.id)}
            >
              <item.icon className={`w-5 h-5 group-data-[collapsible=icon]:mr-0 mr-3 ${isActive(item.id) ? 'text-white' : 'text-slate-500'}`} />
              <span className="font-medium group-data-[collapsible=icon]:hidden">{item.label}</span>
              {isActive(item.id) && <div className="ml-auto w-2 h-2 bg-white rounded-full group-data-[collapsible=icon]:hidden"></div>}
            </Button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

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
  );
};
