import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const SupervisorStats = () => {
  const [teamStats, setTeamStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Active agents
        const { data: agents, error: agentsError } = await supabase.from('profiles').select('*').eq('role', 'agent');
        if (agentsError) throw new Error('Failed to fetch agents');
        const activeAgents = agents.length;
        // Queue length
        const { data: chats, error: chatsError } = await supabase.from('chats').select('*');
        if (chatsError) throw new Error('Failed to fetch chats');
        const queueLength = chats.filter((c: any) => c.status === 'queued').length;
        // Avg response time
        const avgResponse = chats.length > 0 ? (chats.reduce((acc: number, c: any) => acc + (c.response_time || 0), 0) / chats.length / 60).toFixed(1) : '0';
        // Resolution rate
        const resolutionRate = chats.length > 0 ? ((chats.filter((c: any) => c.status === 'resolved').length / chats.length) * 100).toFixed(1) : '0';
        setTeamStats([
          {
            title: 'Active Agents',
            value: activeAgents.toString(),
            change: '',
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700'
          },
          {
            title: 'Queue Length',
            value: queueLength.toString(),
            change: '',
            icon: MessageSquare,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-700'
          },
          {
            title: 'Avg Response Time',
            value: `${avgResponse}m`,
            change: '',
            icon: Clock,
            color: 'from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-700'
          },
          {
            title: 'Resolution Rate',
            value: `${resolutionRate}%`,
            change: '',
            icon: CheckCircle,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700'
          }
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch team stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Card className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 w-full h-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {teamStats.map((stat, index) => (
          <div key={index} className="flex flex-col items-start justify-center">
            <div className="p-2 bg-gray-50 rounded-lg mb-2">
              <stat.icon className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-gray-900 mb-1">{stat.title}</p>
            <p className="text-xs text-gray-500">from last hour</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
