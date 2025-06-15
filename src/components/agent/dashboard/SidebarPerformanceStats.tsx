
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
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100/50 group-data-[collapsible=icon]:hidden">
      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
        <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
        Today's Performance
      </h4>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 flex items-center">
            <MessageSquare className="w-3 h-3 mr-2 text-slate-400" />
            Chats Handled
          </span>
          <div className="flex items-center space-x-1">
            <span className="font-bold text-slate-800 text-lg">{todayPerformance.chatsHandled}</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 flex items-center">
            <Clock className="w-3 h-3 mr-2 text-slate-400" />
            Avg Response
          </span>
          <span className="font-bold text-slate-800">{todayPerformance.avgResponse}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 flex items-center">
            <Star className="w-3 h-3 mr-2 text-yellow-500" />
            Satisfaction
          </span>
          <div className="flex items-center space-x-1">
            <span className="font-bold text-slate-800">{todayPerformance.satisfaction}</span>
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
