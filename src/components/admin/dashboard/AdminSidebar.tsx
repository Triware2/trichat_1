
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
    <div className="w-full h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-600">System Management</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`
                  w-full justify-start h-auto p-3 text-left transition-all duration-200
                  ${isActive 
                    ? 'bg-red-50 text-red-600 border border-red-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={() => onTabChange(item.id)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <IconComponent className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-red-600' : 'text-gray-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{item.label}</div>
                  </div>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-2 py-0.5 ${
                        item.badge === 'New' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
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
