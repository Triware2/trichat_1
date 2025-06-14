
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  Clock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface StatItem {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  textColor: string;
}

export const AdminStats = () => {
  const stats: StatItem[] = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Active Chats",
      value: "89",
      change: "+5%",
      changeType: "increase",
      icon: MessageSquare,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700"
    },
    {
      title: "Response Time",
      value: "2.3m",
      change: "-15%",
      changeType: "decrease",
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      title: "Satisfaction",
      value: "94%",
      change: "+3%",
      changeType: "increase",
      icon: CheckCircle,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-md`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <Badge className={`${stat.bgColor} ${stat.textColor} border-0 font-lexend font-medium text-xs px-2 py-1`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-lexend font-medium text-slate-600 mb-1 tracking-wide uppercase">{stat.title}</p>
              <p className="text-xl font-lexend font-bold text-slate-900 tracking-tight">{stat.value}</p>
              <p className="text-xs font-lexend text-slate-500 mt-1">
                {stat.changeType === 'increase' ? '↗️' : '↘️'} from last month
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
