
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  Shield, 
  Bot, 
  Key,
  Target,
  Star,
  PaintBucket,
  Database,
  MessageCircle,
  Heart,
  Zap,
  ClipboardList
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: BarChart3, 
      path: '/admin',
      badge: null
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: Users, 
      path: '/admin/user-management',
      badge: null
    },
    { 
      id: 'access', 
      label: 'Access Control', 
      icon: Shield, 
      path: '/admin/access-control',
      badge: null
    },
    { 
      id: 'chatbot', 
      label: 'Bot Training', 
      icon: Bot, 
      path: '/admin/chatbot-training',
      badge: null
    },
    { 
      id: 'api-keys', 
      label: 'API Keys', 
      icon: Key, 
      path: '/admin/api-keys',
      badge: null
    },
    { 
      id: 'sla', 
      label: 'SLA Management', 
      icon: Target, 
      path: '/admin/sla',
      badge: null
    },
    { 
      id: 'csat', 
      label: 'CSAT', 
      icon: Star, 
      path: '/admin/csat',
      badge: null
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      path: '/admin/analytics',
      badge: null
    },
    { 
      id: 'widget', 
      label: 'Widgets', 
      icon: MessageSquare, 
      path: '/admin/widgets',
      badge: null
    },
    { 
      id: 'datasources', 
      label: 'Data Sources', 
      icon: Database, 
      path: '/admin/data-sources',
      badge: null
    },
    { 
      id: 'chat-management', 
      label: 'Chat Management', 
      icon: MessageCircle, 
      path: '/admin/chat-management',
      badge: null
    },
    { 
      id: 'customization', 
      label: 'Customization', 
      icon: PaintBucket, 
      path: '/admin/customization',
      badge: 'Pro'
    },
    { 
      id: 'settings', 
      label: 'System Settings', 
      icon: Settings, 
      path: '/admin/system-settings',
      badge: null
    },
    { 
      id: 'audit', 
      label: 'Platform Audit', 
      icon: ClipboardList, 
      path: '/audit',
      badge: 'New'
    }
  ];

  const handleItemClick = (item: any) => {
    if (item.path === '/audit') {
      navigate('/audit');
    } else {
      navigate(item.path);
      onTabChange(item.id);
    }
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/audit' 
            ? location.pathname === '/audit'
            : activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-auto p-3 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleItemClick(item)}
            >
              <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.badge && (
                <Badge 
                  variant={isActive ? "secondary" : "outline"}
                  className={`ml-2 ${
                    isActive 
                      ? 'bg-white/20 text-white border-white/30' 
                      : item.badge === 'New' 
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
