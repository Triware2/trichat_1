
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Filter } from 'lucide-react';

export const AgentPerformanceCard = () => {
  const agentPerformance = [
    {
      name: "Sarah Johnson",
      status: "Online",
      chats: 8,
      avgResponse: "1.2m",
      satisfaction: "96%",
      statusColor: "bg-emerald-500",
      performance: "excellent"
    },
    {
      name: "Mike Chen",
      status: "Busy",
      chats: 12,
      avgResponse: "2.1m",
      satisfaction: "94%",
      statusColor: "bg-yellow-500",
      performance: "good"
    },
    {
      name: "Emily Rodriguez",
      status: "Online",
      chats: 6,
      avgResponse: "1.5m",
      satisfaction: "98%",
      statusColor: "bg-emerald-500",
      performance: "excellent"
    },
    {
      name: "David Kim",
      status: "Away",
      chats: 4,
      avgResponse: "3.2m",
      satisfaction: "91%",
      statusColor: "bg-slate-500",
      performance: "average"
    }
  ];

  const getPerformanceBadge = (performance: string) => {
    const variants = {
      'excellent': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'good': 'bg-blue-100 text-blue-800 border-blue-200',
      'average': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return variants[performance as keyof typeof variants] || variants.average;
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <UserCheck className="w-4 h-4 text-blue-600" />
              Agent Performance
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-600">
              Real-time team member status and metrics
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {agentPerformance.map((agent, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full ${agent.statusColor} flex-shrink-0`}></div>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-medium text-xs flex-shrink-0">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{agent.name}</p>
                    <p className="text-xs text-gray-600">{agent.status}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium text-gray-900">{agent.chats} chats</p>
                  <p className="text-xs text-gray-500">{agent.avgResponse} avg</p>
                </div>
                <Badge className={`${getPerformanceBadge(agent.performance)} border text-xs`}>
                  {agent.satisfaction}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
