import { useEffect, useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

export const SupervisorCSATOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamMetrics, setTeamMetrics] = useState<any>({});
  const [agentPerformance, setAgentPerformance] = useState<any[]>([]);
  const [departmentComparison, setDepartmentComparison] = useState<any[]>([]);

  useEffect(() => {
    const fetchCSATData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all chats and agent profiles
        const [{ data: chats, error: chatsError }, { data: agents, error: agentsError }, { data: alerts, error: alertsError }] = await Promise.all([
          supabase.from('chats').select('id, assigned_agent_id, satisfaction_rating, status, metadata'),
          supabase.from('profiles').select('id, full_name, department').eq('role', 'agent'),
          supabase.from('notifications').select('id').eq('type', 'system_alert').is('is_read', false)
        ]);
        if (chatsError || agentsError || alertsError) throw new Error('Failed to fetch CSAT data');

        // Team metrics
        const satisfactionRatings = (chats || []).map((c: any) => c.satisfaction_rating).filter((r: number) => r !== null && r > 0);
        const averageCSAT = satisfactionRatings.length > 0 ? (satisfactionRatings.reduce((a: number, b: number) => a + b, 0) / satisfactionRatings.length).toFixed(2) : '-';
        const totalResponses = satisfactionRatings.length;
        const unresolvedAlerts = alerts?.length || 0;
        setTeamMetrics({
          averageCSAT,
          totalResponses,
          alerts: unresolvedAlerts,
        });

        // Agent performance
        const agentMap: Record<string, { name: string; csat: number[]; responses: number }> = {};
        (agents || []).forEach((a: any) => {
          agentMap[a.id] = { name: a.full_name, csat: [], responses: 0 };
        });
        (chats || []).forEach((c: any) => {
          if (c.assigned_agent_id && agentMap[c.assigned_agent_id] && c.satisfaction_rating && c.satisfaction_rating > 0) {
            agentMap[c.assigned_agent_id].csat.push(c.satisfaction_rating);
            agentMap[c.assigned_agent_id].responses++;
          }
        });
        const agentPerf = Object.entries(agentMap).map(([id, a]) => ({
          name: a.name,
          csat: a.csat.length > 0 ? (a.csat.reduce((x, y) => x + y, 0) / a.csat.length).toFixed(2) : '-',
          responses: a.responses,
        }));
        setAgentPerformance(agentPerf);

        // Department comparison
        const deptMap: Record<string, { csat: number[]; agents: Set<string> }> = {};
        (agents || []).forEach((a: any) => {
          if (!a.department) return;
          if (!deptMap[a.department]) deptMap[a.department] = { csat: [], agents: new Set() };
          deptMap[a.department].agents.add(a.id);
        });
        (chats || []).forEach((c: any) => {
          const agent = agents?.find((a: any) => a.id === c.assigned_agent_id);
          if (agent && agent.department && c.satisfaction_rating && c.satisfaction_rating > 0) {
            deptMap[agent.department].csat.push(c.satisfaction_rating);
          }
        });
        const deptPerf = Object.entries(deptMap).map(([department, d]) => ({
          department,
          csat: d.csat.length > 0 ? (d.csat.reduce((x, y) => x + y, 0) / d.csat.length).toFixed(2) : '-',
          agents: d.agents.size,
        }));
        setDepartmentComparison(deptPerf);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch CSAT data');
      } finally {
        setLoading(false);
      }
    };
    fetchCSATData();
  }, []);

  if (loading) {
    return <div className="space-y-6"><Card><CardContent className="p-6 text-center">Loading CSAT metrics...</CardContent></Card></div>;
  }
  if (error) {
    return <div className="space-y-6"><Card><CardContent className="p-6 text-center text-red-600">{error}</CardContent></Card></div>;
  }

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
                  <span className="text-xs text-green-600">(all time)</span>
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
                <p className="text-sm text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-gray-900">{teamMetrics.totalResponses}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-blue-600">(all time)</span>
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
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{teamMetrics.alerts}</p>
                <p className="text-xs text-orange-600 mt-1">Needs attention</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">(Reserved)</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
                <p className="text-xs text-gray-500 mt-1">-</p>
              </div>
              <Award className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Agent CSAT Performance</CardTitle>
          <CardDescription>Individual agent satisfaction scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentPerformance.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium text-sm">
                    {agent.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{agent.name}</h4>
                    <p className="text-sm text-gray-600">{agent.responses} responses</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">CSAT</p>
                    <p className="text-lg font-semibold">{agent.csat}</p>
                  </div>
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
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{dept.department}</h4>
                  <p className="text-sm text-gray-600">{dept.agents} agents</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">CSAT</p>
                    <p className="text-lg font-semibold">{dept.csat}</p>
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
