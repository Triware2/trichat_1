
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, TrendingUp } from 'lucide-react';

interface AgentSidebarProps {
  todayPerformance: {
    chatsHandled: number;
    avgResponse: string;
    satisfaction: number;
  };
}

export const AgentSidebar = ({ todayPerformance }: AgentSidebarProps) => {
  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <TabsList className="grid w-full grid-cols-1 h-auto space-y-2 bg-transparent p-0">
          <TabsTrigger 
            value="dashboard" 
            className="w-full justify-start px-4 py-3 rounded-xl text-left data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 hover:bg-slate-50 transition-all duration-200"
          >
            <TrendingUp className="w-5 h-5 mr-3" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="chat" 
            className="w-full justify-start px-4 py-3 rounded-xl text-left data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 hover:bg-slate-50 transition-all duration-200"
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            Conversations
            <Badge className="ml-auto bg-emerald-500 text-white text-xs px-2 py-1">3</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="responses" 
            className="w-full justify-start px-4 py-3 rounded-xl text-left data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 hover:bg-slate-50 transition-all duration-200"
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            Templates
          </TabsTrigger>
          <TabsTrigger 
            value="customer" 
            className="w-full justify-start px-4 py-3 rounded-xl text-left data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 hover:bg-slate-50 transition-all duration-200"
          >
            <Users className="w-5 h-5 mr-3" />
            Customer Info
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Quick Stats Sidebar */}
      <div className="mt-auto p-6">
        <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-sm">
          <h3 className="font-bold text-emerald-900 mb-4 text-lg">Today's Performance</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-emerald-700 font-medium">Chats Handled:</span>
              <span className="font-bold text-emerald-900 text-lg">{todayPerformance.chatsHandled}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-700 font-medium">Avg Response:</span>
              <span className="font-bold text-emerald-900 text-lg">{todayPerformance.avgResponse}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-700 font-medium">Satisfaction:</span>
              <span className="font-bold text-emerald-900 text-lg">{todayPerformance.satisfaction}★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
