import { TrendingUp, MessageSquare, Clock, Star } from 'lucide-react';

interface TodayPerformance {
  chatsHandled: number;
  avgResponse: string;
  satisfaction: number;
}

interface SidebarPerformanceStatsProps {
  todayPerformance: TodayPerformance;
}

export const SidebarPerformanceStats = ({ todayPerformance }: SidebarPerformanceStatsProps) => {
  return (
    <div
      className="glass-card-modern shadow-xl rounded-xl p-3 group-data-[collapsible=icon]:hidden transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.80)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(180,200,255,0.13)',
        boxShadow: '0 4px 16px 0 rgba(31,38,135,0.08)',
        maxWidth: '240px',
        minWidth: '180px',
      }}
    >
      <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1">
        <span className="bg-gradient-to-tr from-blue-400 to-indigo-400 p-1.5 rounded-lg shadow">
          <TrendingUp className="w-4 h-4 text-white" />
        </span>
        <span>Today's Performance</span>
      </h4>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 p-1.5 rounded-full flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </span>
          <div className="flex flex-col flex-1">
            <span className="text-[11px] text-slate-500 font-medium">Chats Handled</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-extrabold text-base text-slate-900 tracking-tight">{todayPerformance.chatsHandled}</span>
              <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-purple-100 p-1.5 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-purple-500" />
          </span>
          <div className="flex flex-col flex-1">
            <span className="text-[11px] text-slate-500 font-medium">Avg Response</span>
            <span className="font-extrabold text-base text-slate-900 tracking-tight mt-0.5">{todayPerformance.avgResponse}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-yellow-100 p-1.5 rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </span>
          <div className="flex flex-col flex-1">
            <span className="text-[11px] text-slate-500 font-medium">Satisfaction</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-extrabold text-base text-slate-900 tracking-tight">{todayPerformance.satisfaction}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
