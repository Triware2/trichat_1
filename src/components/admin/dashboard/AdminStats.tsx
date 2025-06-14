
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  MessageSquare, 
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface StatItem {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const AdminStats = () => {
  const stats: StatItem[] = [
    {
      title: "Total users",
      value: "1,234",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      description: "Active users this month"
    },
    {
      title: "Active conversations",
      value: "89",
      change: "+5%",
      changeType: "increase",
      icon: MessageSquare,
      description: "Currently ongoing chats"
    },
    {
      title: "Avg response time",
      value: "2.3m",
      change: "-15%",
      changeType: "decrease",
      icon: Clock,
      description: "Average first response"
    },
    {
      title: "Customer satisfaction",
      value: "94%",
      change: "+3%",
      changeType: "increase",
      icon: CheckCircle,
      description: "Based on recent surveys"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-6 h-6 text-gray-600" />
              <div className={`flex items-center text-sm ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'increase' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-900 mb-1">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
