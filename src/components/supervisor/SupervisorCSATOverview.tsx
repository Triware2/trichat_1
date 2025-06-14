
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Users,
  AlertTriangle,
  Award,
  Target
} from 'lucide-react';

export const SupervisorCSATOverview = () => {
  const teamMetrics = {
    averageCSAT: 4.3,
    totalResponses: 456,
    responseRate: 68,
    npsScore: 45,
    sentimentTrend: 'positive',
    alerts: 2
  };

  const agentPerformance = [
    {
      name: 'Sarah Johnson',
      csat: 4.8,
      responses: 67,
      nps: 62,
      trend: 'up',
      sentiment: 'positive',
      alertCount: 0
    },
    {
      name: 'Mike Chen',
      csat: 4.6,
      responses: 54,
      nps: 58,
      trend: 'up',
      sentiment: 'positive',
      alertCount: 0
    },
    {
      name: 'Emily Rodriguez',
      csat: 4.4,
      responses: 48,
      nps: 51,
      trend: 'neutral',
      sentiment: 'neutral',
      alertCount: 1
    },
    {
      name: 'David Kim',
      csat: 3.9,
      responses: 42,
      nps: 28,
      trend: 'down',
      sentiment: 'negative',
      alertCount: 2
    }
  ];

  const departmentComparison = [
    { department: 'Technical Support', csat: 4.5, nps: 52, agents: 8 },
    { department: 'Sales Support', csat: 4.6, nps: 58, agents: 5 },
    { department: 'Billing', csat: 4.1, nps: 38, agents: 4 },
    { department: 'General Support', csat: 4.2, nps: 41, agents: 6 }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <div className="w-4 h-4" />;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Team CSAT</p>
                <p className="text-2xl font-bold text-gray-900">{teamMetrics.averageCSAT}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+0.2 this week</span>
                </div>
              </div>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">{teamMetrics.responseRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-blue-600">+5% this week</span>
                </div>
              </div>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Team NPS</p>
                <p className="text-2xl font-bold text-gray-900">{teamMetrics.npsScore}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-purple-600" />
                  <span className="text-xs text-purple-600">+8 this week</span>
                </div>
              </div>
              <Award className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{teamMetrics.alerts}</p>
                <p className="text-xs text-orange-600 mt-1">Needs attention</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Agent CSAT Performance</CardTitle>
          <CardDescription>Individual agent satisfaction scores and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentPerformance.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium text-sm">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{agent.name}</h4>
                    <p className="text-sm text-gray-600">{agent.responses} responses</p>
                  </div>
                  {agent.alertCount > 0 && (
                    <Badge className="bg-orange-100 text-orange-800">
                      {agent.alertCount} alert{agent.alertCount > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">CSAT</p>
                    <p className="text-lg font-semibold">{agent.csat}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">NPS</p>
                    <p className="text-lg font-semibold">{agent.nps}</p>
                  </div>
                  <Badge className={getSentimentColor(agent.sentiment)}>
                    {agent.sentiment}
                  </Badge>
                  {getTrendIcon(agent.trend)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>CSAT comparison across different departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentComparison.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <h4 className="font-medium text-gray-900">{dept.department}</h4>
                  <p className="text-sm text-gray-600">{dept.agents} agents</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">CSAT</p>
                    <p className="text-lg font-semibold">{dept.csat}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">NPS</p>
                    <p className="text-lg font-semibold">{dept.nps}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
