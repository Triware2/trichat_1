
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Bot, 
  Key, 
  Target, 
  Star, 
  BarChart3, 
  MessageSquare, 
  Database, 
  MessageCircle, 
  Palette, 
  Settings 
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'users', label: 'User Management', icon: Users, badge: null },
    { id: 'access', label: 'Access Control', icon: Shield, badge: 'New' },
    { id: 'chatbot', label: 'Chatbot Training', icon: Bot, badge: null },
    { id: 'api-keys', label: 'API Keys', icon: Key, badge: null },
    { id: 'sla', label: 'SLA Management', icon: Target, badge: null },
    { id: 'csat', label: 'CSAT Management', icon: Star, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'widget', label: 'Widget Generator', icon: MessageSquare, badge: null },
    { id: 'datasources', label: 'Data Sources', icon: Database, badge: null },
    { id: 'chat-management', label: 'Chat Management', icon: MessageCircle, badge: null },
    { id: 'customization', label: 'Customization', icon: Palette, badge: 'Beta' },
    { id: 'settings', label: 'System Settings', icon: Settings, badge: null }
  ];

  return (
    <div className="w-full h-full bg-white border-r border-neutral-200/60">
      <div className="px-6 py-6 border-b border-neutral-100">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-neutral-900 tracking-tight">Admin Panel</h2>
          <p className="text-sm text-neutral-500 font-normal">System Management</p>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`
                  w-full justify-start h-10 px-3 text-left transition-all duration-200 rounded-lg font-normal
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-50' 
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                  }
                `}
                onClick={() => onTabChange(item.id)}
              >
                <div className="flex items-center space-x-3 w-full min-w-0">
                  <IconComponent className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-neutral-500'}`} />
                  <span className="text-sm font-medium truncate">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className={`ml-auto text-xs px-2 py-0.5 font-medium ${
                        item.badge === 'New' 
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
