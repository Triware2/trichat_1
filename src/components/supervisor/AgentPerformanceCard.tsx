import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AgentPerformance {
  id: string;
  name: string;
  status: string;
  chats: number;
  avgResponse: string;
  satisfaction: string;
  statusColor: string;
}

export const AgentPerformanceCard = () => {
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgentPerformance = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all agents
        const { data: agents, error: agentsError } = await supabase
          .from('profiles')
          .select('id, full_name, status')
          .eq('role', 'agent');
        if (agentsError) throw new Error('Failed to fetch agents');

        // Fetch all chats
        const { data: chats, error: chatsError } = await supabase
          .from('chats')
          .select('id, assigned_agent_id, response_time, satisfaction_rating, status');
        if (chatsError) throw new Error('Failed to fetch chats');

        // Compute metrics for each agent
        const performance = agents.map((agent: any) => {
          const agentChats = chats.filter((c: any) => c.assigned_agent_id === agent.id && c.status !== 'queued');
          const chatsCount = agentChats.length;
          const avgResponse = chatsCount > 0 ? (agentChats.reduce((acc: number, c: any) => acc + (c.response_time || 0), 0) / chatsCount / 60).toFixed(1) : '0';
          const avgSatisfaction = chatsCount > 0 ? (agentChats.reduce((acc: number, c: any) => acc + (c.satisfaction_rating || 0), 0) / chatsCount).toFixed(2) : '0';
          // Status color logic
          let statusColor = 'bg-slate-500';
          if (agent.status === 'Online') statusColor = 'bg-emerald-500';
          else if (agent.status === 'Busy') statusColor = 'bg-yellow-500';
          else if (agent.status === 'Away') statusColor = 'bg-gray-500';
          else if (agent.status === 'Break') statusColor = 'bg-orange-500';
          return {
            id: agent.id,
            name: agent.full_name,
            status: agent.status,
            chats: chatsCount,
            avgResponse: `${avgResponse}m`,
            satisfaction: `${avgSatisfaction}%`,
            statusColor,
          };
        });
        setAgentPerformance(performance);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch agent performance');
      } finally {
        setLoading(false);
      }
    };
    fetchAgentPerformance();
  }, []);

  const getPerformanceBadge = (satisfaction: string) => {
    const value = parseFloat(satisfaction);
    if (value >= 95) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (value >= 90) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  if (loading) {
    return <Card className="border border-gray-200"><CardContent className="p-6 text-center">Loading agent performance...</CardContent></Card>;
  }
  if (error) {
    return <Card className="border border-gray-200"><CardContent className="p-6 text-center text-red-600">{error}</CardContent></Card>;
  }

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
          {agentPerformance.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full ${agent.statusColor} flex-shrink-0`}></div>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-medium text-xs flex-shrink-0">
                    {agent.name.split(' ').map((n: string) => n[0]).join('')}
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
                <Badge className={`${getPerformanceBadge(agent.satisfaction)} border text-xs`}>
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
