import { Card, CardContent } from '@/components/ui/card';

interface DashboardStatsProps {
  stats: Array<{
    title: string;
    value: string;
    icon: any;
    color: string;
  }>;
  onStatClick: (statTitle: string) => void;
}

export const DashboardStats = ({ stats, onStatClick }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden"
          onClick={() => onStatClick(stat.title)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`flex items-center justify-center w-12 h-12 ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide truncate">
                      {stat.title}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <h3 className="text-3xl font-bold text-slate-900 group-hover:text-[#11b890] transition-colors">
                      {stat.value}
                    </h3>
                    <div className="flex items-center text-sm">
                      <span className="font-semibold text-[#11b890]">+12%</span>
                      <span className="text-slate-500 ml-1">vs last month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full h-1 bg-gradient-to-r from-[#11b890]/20 to-[#11b890]/30 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-[#11b890] to-[#0ea373] rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
