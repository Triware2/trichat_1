
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, MessageSquare, Clock, CheckCircle } from 'lucide-react';

export const SupervisorStats = () => {
  const teamStats = [
    {
      title: "Active Agents",
      value: "12",
      change: "+2",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Queue Length",
      value: "23",
      change: "-5",
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      title: "Avg Response Time",
      value: "1.8m",
      change: "-12%",
      icon: Clock,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700"
    },
    {
      title: "Resolution Rate",
      value: "87%",
      change: "+4%",
      icon: CheckCircle,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {teamStats.map((stat, index) => (
        <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <stat.icon className="w-5 h-5 text-gray-600" />
              </div>
              <Badge className={`${stat.bgColor} ${stat.textColor} border-0 text-xs px-2 py-1`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </Badge>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-gray-900 mb-1">{stat.title}</p>
              <p className="text-xs text-gray-500">from last hour</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
