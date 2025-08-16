import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
  Users, Settings, BarChart3, MessageSquare, Shield, Bot, Key, Target, Star, PaintBucket, Database, MessageCircle, 
  ClipboardList, Lock, CreditCard, User, ChevronDown, ChevronRight, Home, Zap, Building2, Headphones, 
  Menu, X, ChevronLeft
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AdminSidebar = ({ activeTab, onTabChange, isCollapsed = false, onToggleCollapse }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { hasFeatureAccess, functionalityPercent } = useFeatureAccess();
  const isPlatformCreator = user?.email === 'Admin@trichat.com' || user?.email === 'admin@trichat.com';
  
  const [expandedSections, setExpandedSections] = useState({
    core: true,
    automation: true,
    configuration: true,
    support: true,
    platform: isPlatformCreator
  });

  // Organized menu groups for better UX
  const menuGroups = [
    {
      id: 'core',
      label: 'Core',
      expanded: expandedSections.core,
      items: [
        { id: 'overview', label: 'Dashboard', icon: Home, path: '/admin', badge: null, feature: 'admin_dashboard_basic', description: 'Overview & metrics' },
        { id: 'users', label: 'Team', icon: Users, path: '/admin/user-management', badge: null, feature: 'user_management_basic', description: 'Manage users & roles' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics', badge: 'Growth+', feature: 'analytics_overview', description: 'Performance insights' }
      ]
    },
    {
      id: 'automation',
      label: 'Automation & AI',
      expanded: expandedSections.automation,
      items: [
        { id: 'chatbot', label: 'AI Training', icon: Bot, path: '/admin/chatbot-training', badge: 'Growth+', feature: 'bot_training_studio', description: 'Train your AI assistant' },
        { id: 'chat-management', label: 'Live Chat', icon: MessageCircle, path: '/admin/chat-management', badge: 'Growth+', feature: 'chat_management', description: 'Chat workflows' },
        { id: 'widget', label: 'Chat Widget', icon: MessageSquare, path: '/admin/widgets', badge: null, feature: 'web_widget_basic', description: 'Embed chat on website' },
        { id: 'csat', label: 'Satisfaction', icon: Star, path: '/admin/csat', badge: 'Pro+', feature: 'csat_dashboard', description: 'Customer feedback' }
      ]
    },
    {
      id: 'configuration',
      label: 'Configuration',
      expanded: expandedSections.configuration,
      items: [
        { id: 'access', label: 'Permissions', icon: Shield, path: '/admin/access-control', badge: null, feature: 'access_control_basic', description: 'Access control' },
        { id: 'sla', label: 'SLA Rules', icon: Target, path: '/admin/sla', badge: 'Growth+', feature: 'sla_create', description: 'Service agreements' },
        { id: 'api-keys', label: 'API Keys', icon: Key, path: '/admin/api-keys', badge: 'Growth+', feature: 'api_access', description: 'Integration keys' },
        { id: 'datasources', label: 'Data Sources', icon: Database, path: '/admin/data-sources', badge: 'Growth+', feature: 'data_sources_basic', description: 'External data' },
        { id: 'customization', label: 'Branding', icon: PaintBucket, path: '/admin/customization', badge: 'Growth+', feature: 'customization_themes', description: 'Themes & styling' },
        { id: 'settings', label: 'System', icon: Settings, path: '/admin/system-settings', badge: null, feature: 'system_settings_basic', description: 'Global settings' }
      ]
    },
    {
      id: 'support',
      label: 'Support & Billing',
      expanded: expandedSections.support,
      items: [
        { id: 'billing', label: 'Billing & Plans', icon: CreditCard, path: '/billing', badge: null, feature: 'billing_access', description: 'Manage subscriptions' },
        { id: 'support', label: 'Get Support', icon: Headphones, path: null, badge: null, feature: 'support_access', description: 'Contact support team' }
      ]
    }
  ];

  // Add platform section if user is platform creator
  if (isPlatformCreator) {
    menuGroups.push({
      id: 'platform',
      label: 'Platform',
      expanded: expandedSections.platform,
      items: [
        { id: 'audit', label: 'Audit Center', icon: ClipboardList, path: '/audit', badge: 'Creator', feature: 'platform_audit', description: 'Platform monitoring' },
        { id: 'support-management', label: 'Support Management', icon: Headphones, path: null, badge: 'Creator', feature: 'support_management', description: 'Manage user support requests' }
      ]
    });
  }

  const toggleSection = (sectionId: string) => {
    if (isCollapsed) return; // Don't allow section toggle when collapsed
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleItemClick = (item: any) => {
    if (isPlatformCreator || hasFeatureAccess(item.feature)) {
      if (item.path === '/audit') {
        navigate('/audit');
      } else if (item.path === '/billing') {
        navigate('/billing');
      } else if (item.path && item.path.startsWith('mailto:')) {
        window.open(item.path, '_blank');
      } else {
        // For internal tabs (like support pages), use onTabChange
        onTabChange(item.id);
      }
    }
  };

  const isItemActive = (item: any) => {
    if (item.path === '/audit') return location.pathname === '/audit';
    if (item.path === '/billing') return location.pathname === '/billing';
    // For internal tabs (like support pages), check activeTab
    return activeTab === item.id;
  };

  // Get all items for collapsed sidebar
  const allItems = menuGroups.flatMap(group => group.items);

  if (isCollapsed) {
    return (
      <aside className="h-full w-16 flex flex-col bg-white border-r border-slate-200/60 overflow-hidden">
        {/* Collapsed Header */}
        <div className="flex items-center justify-center h-16 border-b border-slate-100/80">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="w-10 h-10 p-0 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group"
                >
                  <Menu className="w-4 h-4 text-slate-600 group-hover:text-orange-600 transition-colors" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-slate-900 text-white border-0 shadow-xl">
                <p className="font-medium">Expand sidebar</p>
                <p className="text-xs opacity-80">View all options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Collapsed Navigation */}
        <div className="flex-1 py-4 overflow-y-auto scrollbar-hide">
          <nav className="space-y-1 px-2">
            <TooltipProvider delayDuration={100}>
              {allItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = isItemActive(item);
                const hasAccess = isPlatformCreator || hasFeatureAccess(item.feature);
                const isLocked = !hasAccess && !isPlatformCreator;

                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <button
                        className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 group ${
                          isActive 
                            ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-105' 
                            : hasAccess 
                              ? 'text-slate-600 hover:bg-slate-50 hover:text-orange-600 hover:scale-105 hover:shadow-sm' 
                              : 'text-slate-300 cursor-not-allowed opacity-60'
                        }`}
                        onClick={() => handleItemClick(item)}
                        disabled={!hasAccess}
                        style={{ 
                          animationDelay: `${index * 50}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        <Icon className={`w-5 h-5 transition-all duration-200 ${
                          isActive 
                            ? 'text-white' 
                            : hasAccess 
                              ? 'group-hover:scale-110' 
                              : ''
                        }`} />
                        
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-orange-600 rounded-full"></div>
                        )}
                        
                        {/* Lock indicator */}
                        {isLocked && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-100 rounded-full flex items-center justify-center shadow-sm">
                            <Lock className="w-2.5 h-2.5 text-slate-400" />
                          </div>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right" 
                      className="bg-slate-900 text-white border-0 shadow-xl max-w-xs"
                      sideOffset={8}
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">{item.label}</p>
                        <p className="text-xs opacity-90 leading-relaxed">{item.description}</p>
                        {item.badge && (
                          <div className="pt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                              item.badge === 'Creator' 
                                ? 'bg-purple-100 text-purple-800' :
                                item.badge === 'Pro+' 
                                ? 'bg-blue-100 text-blue-800' :
                                'bg-orange-100 text-orange-800'
                            }`}>
                              {item.badge}
                            </span>
                          </div>
                        )}
                        {isLocked && (
                          <div className="pt-1 border-t border-slate-700">
                            <p className="text-xs text-orange-400 font-medium">⚡ Upgrade required</p>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </nav>
        </div>

        {/* Floating divider */}
        <div className="px-4 py-2">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        </div>

        {/* Collapsed User Profile */}
        <div className="p-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 hover:from-orange-50 hover:to-orange-100 border border-slate-200/60 hover:border-orange-200 transition-all duration-200 flex items-center justify-center group hover:scale-105 hover:shadow-sm"
                  onClick={() => navigate('/admin/system-settings')}
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm group-hover:shadow-md transition-shadow">
                    {user?.email?.[0]?.toUpperCase() || 'A'}
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                className="bg-slate-900 text-white border-0 shadow-xl"
                sideOffset={8}
              >
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{user?.email?.split('@')[0] || 'Admin'}</p>
                  <p className="text-xs opacity-90">System Administrator</p>
                  <div className="flex items-center gap-1 pt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                    <span className="text-xs text-emerald-400">Online</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full w-72 flex flex-col bg-white border-r border-slate-200/60 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Admin Center</h2>
              <p className="text-xs text-slate-500">Platform management</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-2 h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
        
        {/* Plan Status */}
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">{functionalityPercent}% Unlocked</span>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
              Active
            </Badge>
          </div>
          <div className="mt-2 w-full bg-orange-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${functionalityPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 pb-3 overflow-y-auto">
        <nav className="space-y-1">
          <TooltipProvider delayDuration={300}>
            {menuGroups.map((group) => (
              <div key={group.id} className="py-2">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(group.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
                >
                  <span>{group.label}</span>
                  {group.expanded ? 
                    <ChevronDown className="w-3 h-3" /> : 
                    <ChevronRight className="w-3 h-3" />
                  }
                </button>

                {/* Section Items */}
                {group.expanded && (
                  <div className="space-y-1 mt-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = isItemActive(item);
                      const hasAccess = isPlatformCreator || hasFeatureAccess(item.feature);
                      const isLocked = !hasAccess && !isPlatformCreator;
                      
                      return (
                        <Tooltip key={item.id}>
                          <TooltipTrigger asChild>
                            <button
                              className={`group relative w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1
                                ${isActive 
                                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/25' 
                                  : hasAccess 
                                    ? 'text-slate-700 hover:bg-slate-50 hover:text-slate-900' 
                                    : 'text-slate-400 cursor-not-allowed'
                                }
                                `}
                              onClick={() => handleItemClick(item)}
                              disabled={!hasAccess}
                              tabIndex={hasAccess ? 0 : -1}
                            >
                              {/* Left side */}
                              <div className="flex items-center flex-1 min-w-0">
                                <Icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors
                                  ${isActive 
                                    ? 'text-white' 
                                    : hasAccess 
                                      ? 'text-slate-500 group-hover:text-orange-600' 
                                      : 'text-slate-300'
                                  }`} 
                                />
                                <div className="flex-1 min-w-0 text-left">
                                  <div className="truncate">{item.label}</div>
                                  {!isActive && (
                                    <div className="text-xs text-slate-500 truncate mt-0.5">
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Right side indicators */}
                              <div className="flex items-center gap-2 ml-2">
                                {isLocked && (
                                  <Lock className="w-4 h-4 text-slate-400" />
                                )}
                                {item.badge && (
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs font-medium border-0 px-2 py-0.5
                                      ${item.badge === 'Creator' 
                                        ? 'bg-purple-100 text-purple-700' :
                                        item.badge === 'Pro+' 
                                          ? 'bg-blue-100 text-blue-700' :
                                        'bg-orange-100 text-orange-700'}
                                      `}
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                            </button>
                          </TooltipTrigger>
                          {isLocked && (
                            <TooltipContent side="right" className="max-w-xs">
                              <div className="text-center">
                                <p className="font-medium">Upgrade Required</p>
                                <p className="text-xs text-slate-600 mt-1">
                                  Unlock {item.label} with a higher plan
                                </p>
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </TooltipProvider>
        </nav>
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-t border-slate-200/60">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => navigate('/admin/system-settings')}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">
              {user?.email?.split('@')[0] || 'Admin'}
            </div>
            <div className="text-xs text-slate-500 truncate flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              System Administrator
            </div>
          </div>
          <Settings className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
};
