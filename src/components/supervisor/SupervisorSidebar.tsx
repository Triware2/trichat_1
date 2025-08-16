import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  Activity, Eye, Users, Settings, MessageSquare, BarChart3, Lock, User, Cog
} from 'lucide-react';

interface SupervisorSidebarProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

export const SupervisorSidebar = ({ activeTab, onTabChange }: SupervisorSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { hasFeatureAccess, functionalityPercent } = useFeatureAccess();
  const isPlatformCreator = user?.email === 'Admin@trichat.com' || user?.email === 'admin@trichat.com';

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Activity, path: '/supervisor', badge: null, feature: 'supervisor_overview' },
    { id: 'chats', label: 'Chat Supervision', icon: Eye, path: '/supervisor/chat-supervision', badge: null, feature: 'supervisor_chat_supervision' },
    { id: 'team', label: 'Team Monitor', icon: Users, path: '/supervisor/team-monitor', badge: null, feature: 'supervisor_team_monitor' },
    { id: 'team-settings', label: 'Team Settings', icon: Settings, path: '/supervisor/team-settings', badge: 'Growth+', feature: 'supervisor_team_settings' },
    { id: 'queue', label: 'Queue Management', icon: MessageSquare, path: '/supervisor/queue-management', badge: null, feature: 'supervisor_queue_management' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/supervisor/reports', badge: 'Growth+', feature: 'supervisor_reports' },
    { id: 'profile', label: 'Profile', icon: User, path: '/supervisor/profile', badge: null, feature: 'supervisor_overview' },
    { id: 'settings', label: 'Settings', icon: Cog, path: '/supervisor/settings', badge: null, feature: 'supervisor_overview' }
  ];

  const handleItemClick = (item: any) => {
    if (isPlatformCreator || hasFeatureAccess(item.feature)) {
      navigate(item.path);
      if (onTabChange) {
        onTabChange(item.id);
      }
    }
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/supervisor' || path === '/supervisor/') return 'overview';
    if (path.includes('/chat-supervision')) return 'chats';
    if (path.includes('/team-monitor')) return 'team';
    if (path.includes('/team-settings')) return 'team-settings';
    if (path.includes('/queue-management')) return 'queue';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/settings')) return 'settings';
    return 'overview';
  };

  const currentActiveTab = getActiveTab();

  return (
    <aside className="h-full w-64 flex flex-col justify-between bg-white/80 backdrop-blur-xl border-r border-gray-100 shadow-xl overflow-x-hidden transition-all duration-300">
      {/* Top: Plan badge and menu */}
      <div className="flex flex-col gap-2 pt-6 px-3">
        {/* Elegant Plan Badge */}
        <div className="mb-6 flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-semibold shadow-sm border border-blue-200 truncate">
            <Activity className="w-4 h-4 mr-1 text-blue-500" />
            {functionalityPercent}% Unlocked
          </span>
        </div>
        {/* Menu Items */}
        <nav className="flex flex-col gap-1">
          <TooltipProvider>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentActiveTab === item.id;
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
                      {item.badge && hasAccess && (
                        <Badge 
                          variant="secondary" 
                          className="ml-2 px-1.5 py-0 text-xs bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-green-200"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    <p>{item.label}</p>
                    {isLocked && <p className="text-xs text-muted-foreground">Upgrade to unlock</p>}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>
      </div>

      {/* Bottom: User info */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user?.email?.[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.user_metadata?.name || 'Supervisor'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}; 