
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
    <div className="w-full h-full bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4 lg:p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-600 mt-1">System Management</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <div className="p-2 lg:p-3 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`
                  w-full justify-start h-auto p-3 lg:p-4 text-left transition-all duration-200 rounded-lg
                  ${isActive 
                    ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }
                `}
                onClick={() => onTabChange(item.id)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`
                    p-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                    }
                  `}>
                    <IconComponent className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm lg:text-base truncate">{item.label}</div>
                  </div>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-2 py-0.5 ${
                        item.badge === 'New' 
                          ? 'bg-green-100 text-green-700 border-green-200' 
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
