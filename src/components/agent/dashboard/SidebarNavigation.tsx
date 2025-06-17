
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  Settings,
  Eye,
  Lock
} from 'lucide-react';

interface SidebarNavigationProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

export const SidebarNavigation = ({ activeTab, onTabChange }: SidebarNavigationProps) => {
  const { hasFeatureAccess, isPlatformCreator } = useFeatureAccess();

  const handleTabClick = (tabValue: string, hasAccess: boolean) => {
    if (hasAccess && onTabChange) {
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
      shadowColor: 'shadow-blue-500/25',
      feature: 'agent_chat_dashboard'
    },
    {
      id: 'chat',
      label: 'Active Chat',
      icon: MessageSquare,
      gradient: 'from-emerald-500 to-emerald-600',
      shadowColor: 'shadow-emerald-500/25',
      feature: 'agent_chat_dashboard'
    },
    {
      id: 'all-chats',
      label: 'All Chats',
      icon: MessageSquare,
      gradient: 'from-purple-500 to-purple-600',
      shadowColor: 'shadow-purple-500/25',
      feature: 'agent_chat_dashboard'
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: Users,
      gradient: 'from-orange-500 to-orange-600',
      shadowColor: 'shadow-orange-500/25',
      feature: 'customer_contacts'
    },
    {
      id: 'customer-insights',
      label: 'Customer 360°',
      icon: Eye,
      gradient: 'from-cyan-500 to-cyan-600',
      shadowColor: 'shadow-cyan-500/25',
      feature: 'customer_360'
    }
  ];

  return (
    <SidebarMenu className="space-y-1">
      {navigationItems.map((item) => {
        const hasAccess = isPlatformCreator || hasFeatureAccess(item.feature);
        
        return (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton 
              asChild
              isActive={isActive(item.id)}
              tooltip={item.label}
            >
              <Button 
                variant={getButtonVariant(item.id)}
                disabled={!hasAccess}
                className={`w-full justify-start h-12 rounded-xl transition-all duration-200 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center relative ${
                  isActive(item.id) && hasAccess
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg ${item.shadowColor} scale-[1.02]` 
                    : hasAccess
                      ? 'hover:bg-slate-100 hover:scale-[1.01] text-slate-600 hover:text-slate-800'
                      : 'text-slate-400 cursor-not-allowed hover:bg-slate-50'
                }`}
                onClick={() => handleTabClick(item.id, hasAccess)}
              >
                <item.icon className={`w-5 h-5 group-data-[collapsible=icon]:mr-0 mr-3 ${
                  isActive(item.id) && hasAccess ? 'text-white' : hasAccess ? 'text-slate-500' : 'text-slate-400'
                }`} />
                <span className="font-medium group-data-[collapsible=icon]:hidden">{item.label}</span>
                {!hasAccess && !isPlatformCreator && (
                  <Lock className="w-3 h-3 ml-auto group-data-[collapsible=icon]:hidden text-slate-400" />
                )}
                {!hasAccess && !isPlatformCreator && item.id === 'customer-insights' && (
                  <Badge variant="outline" className="ml-2 text-xs bg-gray-100 text-gray-500 group-data-[collapsible=icon]:hidden">
                    Growth+
                  </Badge>
                )}
                {isActive(item.id) && hasAccess && <div className="ml-auto w-2 h-2 bg-white rounded-full group-data-[collapsible=icon]:hidden"></div>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}

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
            onClick={() => handleTabClick('settings', true)}
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
