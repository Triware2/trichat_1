import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface Stat {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface DashboardStatsProps {
  stats: Stat[];
  onStatClick: (statTitle: string) => void;
}

export const DashboardStats = ({ stats, onStatClick }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm bg-white overflow-hidden relative" 
          onClick={() => onStatClick(stat.title)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide font-roboto">
                  {stat.title}
                </p>
                <p className="text-3xl font-extrabold text-black group-hover:text-slate-900 transition-colors">
                  {stat.value}
                </p>
                <div className="flex items-center text-sm text-emerald-600">
                  <span className="font-bold">+12%</span>
                  <span className="text-slate-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-slate-100 to-slate-200"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
