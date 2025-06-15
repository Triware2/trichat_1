
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { SidebarPerformanceStats } from './SidebarPerformanceStats';
import { SidebarHeader as CustomSidebarHeader } from './SidebarHeader';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarStatusIndicator } from './SidebarStatusIndicator';

interface TodayPerformance {
  chatsHandled: number;
  avgResponse: string;
  satisfaction: number;
}

interface AgentSidebarProps {
  todayPerformance: TodayPerformance;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const AgentSidebar = ({ todayPerformance, activeTab = 'dashboard', onTabChange }: AgentSidebarProps) => {
  return (
    <Sidebar className="border-r-0 bg-gradient-to-b from-slate-50 to-white shadow-xl" collapsible="icon">
      {/* Header Section with Stats */}
      <SidebarHeader className="p-6 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm group-data-[collapsible=icon]:p-2">
        <div className="space-y-4 group-data-[collapsible=icon]:space-y-2">
          <CustomSidebarHeader />
          <SidebarPerformanceStats todayPerformance={todayPerformance} />
        </div>
      </SidebarHeader>
      
      {/* Navigation Content */}
      <SidebarContent className="p-4 space-y-2 group-data-[collapsible=icon]:p-2">
        <SidebarNavigation activeTab={activeTab} onTabChange={onTabChange} />
        <SidebarStatusIndicator />
      </SidebarContent>
    </Sidebar>
  );
};
