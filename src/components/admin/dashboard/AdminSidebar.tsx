import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useFeatureAccess } from '@/hooks/use-feature-access';
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
  ClipboardList,
  Lock,
  CreditCard
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { hasFeatureAccess, functionalityPercent } = useFeatureAccess();
  
  // Check if this is the platform creator
  const isPlatformCreator = user?.email === 'Admin@trichat.com' || user?.email === 'admin@trichat.com';
  
  const menuItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: BarChart3, 
      path: '/admin',
      badge: null,
      feature: 'admin_dashboard_basic'
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: Users, 
      path: '/admin/user-management',
      badge: null,
      feature: 'user_management_basic'
    },
    { 
      id: 'access', 
      label: 'Access Control', 
      icon: Shield, 
      path: '/admin/access-control',
      badge: null,
      feature: 'access_control_basic'
    },
    { 
      id: 'chatbot', 
      label: 'Bot Training', 
      icon: Bot, 
      path: '/admin/chatbot-training',
      badge: 'Growth+',
      feature: 'bot_training_studio'
    },
    { 
      id: 'api-keys', 
      label: 'API Keys', 
      icon: Key, 
      path: '/admin/api-keys',
      badge: 'Growth+',
      feature: 'api_access'
    },
    { 
      id: 'sla', 
      label: 'SLA Management', 
      icon: Target, 
      path: '/admin/sla',
      badge: 'Growth+',
      feature: 'sla_create'
    },
    { 
      id: 'csat', 
      label: 'CSAT', 
      icon: Star, 
      path: '/admin/csat',
      badge: 'Pro+',
      feature: 'csat_dashboard'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      path: '/admin/analytics',
      badge: 'Growth+',
      feature: 'analytics_overview'
    },
    { 
      id: 'widget', 
      label: 'Widgets', 
      icon: MessageSquare, 
      path: '/admin/widgets',
      badge: null,
      feature: 'web_widget_basic'
    },
    { 
      id: 'datasources', 
      label: 'Data Sources', 
      icon: Database, 
      path: '/admin/data-sources',
      badge: 'Growth+',
      feature: 'data_sources_basic'
    },
    { 
      id: 'chat-management', 
      label: 'Chat Management', 
      icon: MessageCircle, 
      path: '/admin/chat-management',
      badge: 'Growth+',
      feature: 'chat_management'
    },
    { 
      id: 'customization', 
      label: 'Customization', 
      icon: PaintBucket, 
      path: '/admin/customization',
      badge: 'Growth+',
      feature: 'customization_themes'
    },
    { 
      id: 'billing', 
      label: 'Billing', 
      icon: CreditCard, 
      path: '/billing',
      badge: null,
      feature: 'admin_dashboard_basic'
    },
    { 
      id: 'settings', 
      label: 'System Settings', 
      icon: Settings, 
      path: '/admin/system-settings',
      badge: null,
      feature: 'system_settings_basic'
    }
  ];

  // Only add audit link for platform creator
  if (isPlatformCreator) {
    menuItems.push({ 
      id: 'audit', 
      label: 'Platform Audit', 
      icon: ClipboardList, 
      path: '/audit',
      badge: 'Creator',
      feature: 'platform_audit'
    });
  }

  const handleItemClick = (item: any) => {
    // For platform creator or if user has access to the feature
    if (isPlatformCreator || hasFeatureAccess(item.feature)) {
      if (item.path === '/audit') {
        navigate('/audit');
      } else if (item.path === '/billing') {
        navigate('/billing');
      } else {
        navigate(item.path);
        onTabChange(item.id);
      }
    }
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-2">
        {/* Plan Status Badge */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="text-xs font-medium text-blue-800 mb-1">Platform Access</div>
          <div className="text-lg font-bold text-blue-900">{functionalityPercent}%</div>
          <div className="text-xs text-blue-600">of features unlocked</div>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/audit' 
            ? location.pathname === '/audit'
            : item.path === '/billing'
            ? location.pathname === '/billing'
            : activeTab === item.id;
          
          const hasAccess = isPlatformCreator || hasFeatureAccess(item.feature);
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-auto p-3 relative ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                  : hasAccess
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-gray-400 cursor-not-allowed hover:bg-gray-50'
              }`}
              onClick={() => handleItemClick(item)}
              disabled={!hasAccess}
            >
              <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              
              {/* Feature Lock Icon */}
              {!hasAccess && !isPlatformCreator && (
                <Lock className="w-4 h-4 ml-2 text-gray-400" />
              )}
              
              {/* Plan Badge */}
              {item.badge && (
                <Badge 
                  variant={isActive ? "secondary" : "outline"}
                  className={`ml-2 text-xs ${
                    isActive 
                      ? 'bg-white/20 text-white border-white/30' 
                      : item.badge === 'Creator' 
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : item.badge === 'Enterprise'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : item.badge === 'Pro+'
                            ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
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
