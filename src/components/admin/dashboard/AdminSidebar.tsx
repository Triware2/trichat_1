import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  Users, Settings, BarChart3, MessageSquare, Shield, Bot, Key, Target, Star, PaintBucket, Database, MessageCircle, ClipboardList, Lock, CreditCard, User
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
  const isPlatformCreator = user?.email === 'Admin@trichat.com' || user?.email === 'admin@trichat.com';

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3, path: '/admin', badge: null, feature: 'admin_dashboard_basic' },
    { id: 'users', label: 'User Management', icon: Users, path: '/admin/user-management', badge: null, feature: 'user_management_basic' },
    { id: 'access', label: 'Access Control', icon: Shield, path: '/admin/access-control', badge: null, feature: 'access_control_basic' },
    { id: 'chatbot', label: 'Bot Training', icon: Bot, path: '/admin/chatbot-training', badge: 'Growth+', feature: 'bot_training_studio' },
    { id: 'api-keys', label: 'API Keys', icon: Key, path: '/admin/api-keys', badge: 'Growth+', feature: 'api_access' },
    { id: 'sla', label: 'SLA Management', icon: Target, path: '/admin/sla', badge: 'Growth+', feature: 'sla_create' },
    { id: 'csat', label: 'CSAT', icon: Star, path: '/admin/csat', badge: 'Pro+', feature: 'csat_dashboard' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics', badge: 'Growth+', feature: 'analytics_overview' },
    { id: 'widget', label: 'Widgets', icon: MessageSquare, path: '/admin/widgets', badge: null, feature: 'web_widget_basic' },
    { id: 'datasources', label: 'Data Sources', icon: Database, path: '/admin/data-sources', badge: 'Growth+', feature: 'data_sources_basic' },
    { id: 'chat-management', label: 'Chat Management', icon: MessageCircle, path: '/admin/chat-management', badge: 'Growth+', feature: 'chat_management' },
    { id: 'customization', label: 'Customization', icon: PaintBucket, path: '/admin/customization', badge: 'Growth+', feature: 'customization_themes' },
    { id: 'billing', label: 'Billing', icon: CreditCard, path: '/billing', badge: null, feature: 'admin_dashboard_basic' },
    { id: 'settings', label: 'System Settings', icon: Settings, path: '/admin/system-settings', badge: null, feature: 'system_settings_basic' }
  ];
  if (isPlatformCreator) {
    menuItems.push({ id: 'audit', label: 'Platform Audit', icon: ClipboardList, path: '/audit', badge: 'Creator', feature: 'platform_audit' });
  }

  const handleItemClick = (item: any) => {
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
    <aside className="h-full w-64 flex flex-col justify-between bg-white/80 backdrop-blur-xl border-r border-gray-100 shadow-xl overflow-x-hidden transition-all duration-300">
      {/* Top: Plan badge and menu */}
      <div className="flex flex-col gap-2 pt-6 px-3">
        {/* Elegant Plan Badge */}
        <div className="mb-6 flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-semibold shadow-sm border border-blue-200 truncate">
            <BarChart3 className="w-4 h-4 mr-1 text-blue-500" />
            {functionalityPercent}% Unlocked
          </span>
        </div>
        {/* Menu Items */}
        <nav className="flex flex-col gap-1">
          <TooltipProvider delayDuration={0}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === '/audit' 
                ? location.pathname === '/audit'
                : item.path === '/billing'
                ? location.pathname === '/billing'
                : activeTab === item.id;
              const hasAccess = isPlatformCreator || hasFeatureAccess(item.feature);
              const isLocked = !hasAccess && !isPlatformCreator;
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      className={`group flex items-center w-full px-3 py-2 rounded-full transition-all duration-200 font-medium text-sm focus:outline-none truncate
                        ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : hasAccess ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed hover:bg-gray-50'}
                      `}
                      onClick={() => handleItemClick(item)}
                      disabled={!hasAccess}
                      tabIndex={hasAccess ? 0 : -1}
                      style={{ maxWidth: '100%' }}
                    >
                      <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : hasAccess ? 'text-blue-500 group-hover:text-blue-700' : 'text-gray-300'}`} />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {/* Lock Icon for restricted */}
                      {isLocked && (
                        <Lock className="w-4 h-4 ml-2 text-gray-400" />
                      )}
                      {/* Plan Badge */}
                      {item.badge && (
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold border truncate
                          ${item.badge === 'Creator' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            item.badge === 'Enterprise' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                            item.badge === 'Pro+' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                            'bg-blue-100 text-blue-800 border-blue-200'}
                        `} style={{ maxWidth: '80px' }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  {isLocked && (
                    <TooltipContent side="right">
                      Upgrade your plan to unlock this feature
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>
      </div>
      {/* Bottom: User profile */}
      <div className="px-3 pb-6 mt-6">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-100 shadow-sm truncate">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center text-blue-700 font-bold text-lg">
            {user?.email?.[0]?.toUpperCase() || <User className="w-6 h-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{user?.email || 'Admin'}</div>
            <div className="text-xs text-gray-500 truncate">Admin</div>
          </div>
          <Button size="icon" variant="ghost" className="ml-auto" onClick={() => navigate('/admin/system-settings')}>
            <Settings className="w-5 h-5 text-gray-400" />
          </Button>
        </div>
      </div>
    </aside>
  );
};
