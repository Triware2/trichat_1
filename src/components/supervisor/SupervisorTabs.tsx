
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown } from 'lucide-react';
import { 
  Activity, 
  Eye, 
  Users, 
  MessageSquare, 
  BarChart3,
  Settings
} from 'lucide-react';

interface SupervisorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SupervisorTabs = ({ activeTab, onTabChange }: SupervisorTabsProps) => {
  const { hasFeatureAccess, isPlatformCreator } = useFeatureAccess();

  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: Activity, 
      feature: 'supervisor_overview'
    },
    { 
      id: 'chats', 
      label: 'Chat Supervision', 
      icon: Eye, 
      feature: 'supervisor_chat_supervision'
    },
    { 
      id: 'team', 
      label: 'Team Monitor', 
      icon: Users, 
      feature: 'supervisor_team_monitor'
    },
    { 
      id: 'team-settings', 
      label: 'Team Settings', 
      icon: Settings, 
      feature: 'supervisor_team_settings'
    },
    { 
      id: 'queue', 
      label: 'Queue Management', 
      icon: MessageSquare, 
      feature: 'supervisor_queue_management'
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: BarChart3, 
      feature: 'supervisor_reports'
    },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/40 sticky top-16 z-40 shadow-sm">
      <div className="max-w-full px-6">
        <nav className="flex items-center h-14" role="tablist">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const hasAccess = isPlatformCreator || hasFeatureAccess(tab.feature);
            const isActive = activeTab === tab.id && hasAccess;
            
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                disabled={!hasAccess}
                onClick={() => hasAccess && onTabChange(tab.id)}
                className={`
                  group relative inline-flex items-center gap-2 px-4 py-3 mr-1 
                  text-sm font-medium transition-all duration-200 ease-out
                  rounded-lg border border-transparent
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-200
                  ${isActive && hasAccess
                    ? 'text-blue-700 bg-blue-50/70 border-blue-200/60 shadow-sm' 
                    : hasAccess
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/70 hover:border-slate-200/50'
                      : 'text-slate-400 cursor-not-allowed opacity-60'
                  }
                `}
              >
                {/* Icon with subtle animation */}
                <Icon className={`
                  w-4 h-4 transition-all duration-200
                  ${isActive && hasAccess
                    ? 'text-blue-600' 
                    : hasAccess
                      ? 'text-slate-500 group-hover:text-slate-700'
                      : 'text-slate-400'
                  }
                `} />
                
                {/* Label */}
                <span className="font-medium tracking-tight whitespace-nowrap">
                  {tab.label}
                </span>
                
                {/* Active indicator - subtle bottom accent */}
                {isActive && hasAccess && (
                  <div className="absolute inset-x-2 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                )}
                
                {/* Premium indicator for locked features */}
                {!hasAccess && !isPlatformCreator && (
                  <div className="flex items-center ml-1">
                    <Lock className="w-3 h-3 text-slate-400 mr-1.5" />
                    <Badge 
                      variant="outline" 
                      className="
                        text-xs px-1.5 py-0.5 font-medium
                        bg-amber-50/80 text-amber-700 border-amber-200/60
                        shadow-sm
                      "
                    >
                      <Crown className="w-2.5 h-2.5 mr-1" />
                      Pro
                    </Badge>
                  </div>
                )}
                
                {/* Subtle hover effect overlay */}
                {hasAccess && (
                  <div className={`
                    absolute inset-0 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-b from-blue-50/20 to-transparent' 
                      : 'group-hover:bg-gradient-to-b group-hover:from-slate-50/30 group-hover:to-transparent'
                    }
                  `} />
                )}
              </button>
            );
          })}
          
          {/* Subtle end fade effect */}
          <div className="flex-1 relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50 pointer-events-none" />
          </div>
        </nav>
      </div>
    </div>
  );
};
