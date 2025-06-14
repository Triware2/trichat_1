
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, TrendingUp } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

interface AgentSidebarProps {
  todayPerformance: {
    chatsHandled: number;
    avgResponse: string;
    satisfaction: number;
  };
}

export const AgentSidebar = ({ todayPerformance }: AgentSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className="border-r border-slate-200 shadow-sm" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-slate-900">Navigation</h2>
          )}
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="p-4">
          <TabsList className="grid w-full grid-cols-1 h-auto space-y-2 bg-transparent p-0">
            <TabsTrigger 
              value="dashboard" 
              className="w-full justify-start px-3 py-2 rounded-lg text-left data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 hover:bg-slate-50 transition-all duration-200"
            >
              <TrendingUp className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="ml-2">Dashboard</span>}
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="w-full justify-start px-3 py-2 rounded-lg text-left data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 hover:bg-slate-50 transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="ml-2">Conversations</span>
                  <Badge className="ml-auto bg-emerald-500 text-white text-xs px-2 py-0.5">3</Badge>
                </>
              )}
              {isCollapsed && (
                <Badge className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full p-0">3</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="responses" 
              className="w-full justify-start px-3 py-2 rounded-lg text-left data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 hover:bg-slate-50 transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="ml-2">Templates</span>}
            </TabsTrigger>
            <TabsTrigger 
              value="customer" 
              className="w-full justify-start px-3 py-2 rounded-lg text-left data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 hover:bg-slate-50 transition-all duration-200"
            >
              <Users className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="ml-2">Customer Info</span>}
            </TabsTrigger>
          </TabsList>
        </div>
      </SidebarContent>

      {/* Quick Stats Sidebar */}
      <SidebarFooter className="p-4">
        <div className={`p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 shadow-sm ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed ? (
            <>
              <h3 className="font-bold text-emerald-900 mb-3 text-base">Today's Performance</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700 font-medium">Chats:</span>
                  <span className="font-bold text-emerald-900">{todayPerformance.chatsHandled}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700 font-medium">Avg:</span>
                  <span className="font-bold text-emerald-900">{todayPerformance.avgResponse}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700 font-medium">Rating:</span>
                  <span className="font-bold text-emerald-900">{todayPerformance.satisfaction}★</span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <div className="text-xs font-bold text-emerald-900">{todayPerformance.chatsHandled}</div>
              <div className="text-xs text-emerald-700">{todayPerformance.avgResponse}</div>
              <div className="text-xs text-emerald-700">{todayPerformance.satisfaction}★</div>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
