

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg bg-white hover:scale-105 hover:-translate-y-1" 
          onClick={() => onStatClick(stat.title)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600 group-hover:text-slate-700 transition-colors">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {stat.value}
                </p>
              </div>
              <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

