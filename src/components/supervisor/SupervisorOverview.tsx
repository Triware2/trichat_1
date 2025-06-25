import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AgentPerformanceCard } from './AgentPerformanceCard';
import { SystemAlertsCard } from './SystemAlertsCard';
import { Users, MessageSquare, Clock, CheckCircle, TrendingUp, Target, Zap, Star, AlertTriangle, Award, TrendingDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SupervisorStats } from './SupervisorStats';
import { PerformanceMetrics } from './PerformanceMetrics';
import { SupervisorCSATOverview } from './SupervisorCSATOverview';

export const SupervisorOverview = () => {
  // Stats
  const [teamStats, setTeamStats] = useState<any[]>([]);
  // Metrics
  const [metrics, setMetrics] = useState({ todayTarget: '-', teamEfficiency: '-', teamCSAT: '-', totalResponses: '-', activeAlerts: '-', reserved: '-' });
  // Agent CSAT/Department
  const [agentCSAT, setAgentCSAT] = useState<any[]>([]);
  const [deptCSAT, setDeptCSAT] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      // Stats
      const { data: agents } = await supabase.from('profiles').select('id, full_name, email, status, department').eq('role', 'agent');
      const { data: chats } = await supabase.from('chats').select('*');
      const activeAgents = agents?.length || 0;
      const queueLength = chats?.filter((c: any) => c.status === 'queued').length || 0;
      const avgResponse = chats && chats.length > 0 ? (chats.reduce((acc: number, c: any) => acc + (c.response_time || 0), 0) / chats.length / 60).toFixed(1) : '0';
      const resolutionRate = chats && chats.length > 0 ? ((chats.filter((c: any) => c.status === 'resolved').length / chats.length) * 100).toFixed(1) : '0';
      setTeamStats([
        { title: 'Active Agents', value: String(activeAgents), icon: Users, subtitle: 'from last hour', tooltip: 'Number of agents online and available.' },
        { title: 'Queue Length', value: String(queueLength), icon: MessageSquare, subtitle: 'from last hour', tooltip: 'Number of chats waiting in the queue.' },
        { title: 'Avg Response Time', value: `${avgResponse}m`, icon: Clock, subtitle: 'from last hour', tooltip: 'Average time taken to respond to a chat.' },
        { title: 'Resolution Rate', value: `${resolutionRate}%`, icon: CheckCircle, subtitle: 'from last hour', tooltip: 'Percentage of chats resolved.' },
      ]);
      // Metrics
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const chatsToday = chats?.filter((c: any) => c.closed_at && new Date(c.closed_at) >= todayStart) || [];
      const resolvedToday = chatsToday.filter((c: any) => c.status === 'resolved');
      const todayTarget = chatsToday.length > 0 ? ((resolvedToday.length / chatsToday.length) * 100).toFixed(1) : '-';
      const resolvedAll = chats?.filter((c: any) => c.status === 'resolved') || [];
      const teamEfficiency = chats && chats.length > 0 ? ((resolvedAll.length / chats.length) * 100).toFixed(1) : '-';
      // CSAT
      const satisfactionRatings = (chats || []).map((c: any) => c.satisfaction_rating).filter((r: number) => r !== null && r > 0);
      const teamCSAT = satisfactionRatings.length > 0 ? (satisfactionRatings.reduce((a: number, b: number) => a + b, 0) / satisfactionRatings.length).toFixed(2) : '-';
      const totalResponses = satisfactionRatings.length;
      const { data: alerts } = await supabase.from('notifications').select('id').eq('type', 'system_alert').is('is_read', false);
      setMetrics({
        todayTarget,
        teamEfficiency,
        teamCSAT,
        totalResponses: String(totalResponses),
        activeAlerts: String(alerts?.length || 0),
        reserved: '-',
      });
      // Agent CSAT
      const agentMap: Record<string, { name: string; email: string; csat: number[]; responses: number }> = {};
      (agents || []).forEach((a: any) => {
        agentMap[a.id] = { name: a.full_name, email: a.email, csat: [], responses: 0 };
      });
      (chats || []).forEach((c: any) => {
        if (c.assigned_agent_id && agentMap[c.assigned_agent_id] && c.satisfaction_rating && c.satisfaction_rating > 0) {
          agentMap[c.assigned_agent_id].csat.push(c.satisfaction_rating);
          agentMap[c.assigned_agent_id].responses++;
        }
      });
      const agentPerf = Object.entries(agentMap).map(([id, a]) => ({
        name: a.name,
        email: a.email,
        csat: a.csat.length > 0 ? (a.csat.reduce((x, y) => x + y, 0) / a.csat.length).toFixed(2) : '-',
        responses: a.responses,
      }));
      setAgentCSAT(agentPerf);
      // Department CSAT
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
      setDeptCSAT(deptPerf);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <TooltipProvider>
          {teamStats.map((stat, i) => (
            <Card key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 w-full h-full flex flex-col items-start justify-center transition hover:shadow-lg">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-2 bg-gray-50 rounded-lg mb-2 cursor-help">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>{stat.tooltip}</TooltipContent>
              </Tooltip>
              <p className="text-2xl font-semibold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-base font-medium text-gray-800 mb-1">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </Card>
          ))}
        </TooltipProvider>
      </div>

      {/* Agent Performance & System Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AgentPerformanceCard />
        <SystemAlertsCard />
      </div>

      {/* Team Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <Card className="bg-white rounded-2xl shadow border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <span className="text-xs text-gray-500">Today's Target</span>
            </div>
            <p className="text-xl font-semibold text-emerald-900">{metrics.todayTarget}%</p>
            <p className="text-xs text-emerald-700">Resolution Rate</p>
          </div>
        </Card>
        <Card className="bg-white rounded-2xl shadow border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-xs text-gray-500">Team Efficiency</span>
            </div>
            <p className="text-xl font-semibold text-purple-900">{metrics.teamEfficiency}%</p>
            <p className="text-xs text-purple-700">Above Baseline</p>
          </div>
        </Card>
        <Card className="bg-white rounded-2xl shadow border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-xs text-gray-500">Team CSAT</span>
            </div>
            <p className="text-xl font-semibold text-gray-900">{metrics.teamCSAT}</p>
            <p className="text-xs text-gray-700">(all time)</p>
          </div>
        </Card>
        <Card className="bg-white rounded-2xl shadow border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-gray-500">Total Responses</span>
            </div>
            <p className="text-xl font-semibold text-blue-900">{metrics.totalResponses}</p>
            <p className="text-xs text-blue-700">(all time)</p>
          </div>
        </Card>
        <Card className="bg-white rounded-2xl shadow border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-gray-500">Active Alerts</span>
            </div>
            <p className="text-xl font-semibold text-orange-900">{metrics.activeAlerts}</p>
            <p className="text-xs text-orange-700">Needs attention</p>
          </div>
        </Card>
        <Card className="bg-white rounded-2xl shadow border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-gray-500">Reserved</span>
            </div>
            <p className="text-xl font-semibold text-gray-900">-</p>
            <p className="text-xs text-gray-500">-</p>
          </div>
        </Card>
      </div>

      {/* Agent CSAT Performance */}
      <a id="agent-csat-performance" />
      <Card className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Agent CSAT Performance
          </CardTitle>
          <CardDescription>Individual agent satisfaction scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm align-middle">
              <thead>
                <tr className="text-gray-600">
                  <th className="px-4 py-2 text-left font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>Name</span>
                        </TooltipTrigger>
                        <TooltipContent>Agent full name</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                  <th className="px-4 py-2 text-left font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>Email</span>
                        </TooltipTrigger>
                        <TooltipContent>Agent email address</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                  <th className="px-4 py-2 text-center font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>CSAT Responses</span>
                        </TooltipTrigger>
                        <TooltipContent>Number of CSAT survey responses</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                  <th className="px-4 py-2 text-center font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>CSAT Score</span>
                        </TooltipTrigger>
                        <TooltipContent>Average CSAT score</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                </tr>
              </thead>
              <tbody>
                {agentCSAT.map((agent, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 flex items-center gap-2">
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium text-sm">
                        {agent.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                      <span className="font-medium text-gray-900">{agent.name}</span>
                    </td>
                    <td className="px-4 py-2 text-gray-700">{agent.email}</td>
                    <td className="px-4 py-2 text-center">{agent.responses}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${parseFloat(agent.csat) >= 4.5 ? 'bg-green-100 text-green-800' : parseFloat(agent.csat) >= 3.5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {agent.csat}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Department Performance */}
      <a id="department-performance" />
      <Card className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Department Performance
          </CardTitle>
          <CardDescription>CSAT comparison across departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm align-middle">
              <thead>
                <tr className="text-gray-600">
                  <th className="px-4 py-2 text-left font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>Department</span>
                        </TooltipTrigger>
                        <TooltipContent>Department name</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                  <th className="px-4 py-2 text-center font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>Avg CSAT</span>
                        </TooltipTrigger>
                        <TooltipContent>Average CSAT score for department</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                  <th className="px-4 py-2 text-center font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>Agents</span>
                        </TooltipTrigger>
                        <TooltipContent>Number of agents in department</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                  <th className="px-4 py-2 text-center font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>Trend</span>
                        </TooltipTrigger>
                        <TooltipContent>CSAT trend (up/down)</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                </tr>
              </thead>
              <tbody>
                {deptCSAT.map((dept, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-900">{dept.department}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${parseFloat(dept.csat) >= 4.5 ? 'bg-green-100 text-green-800' : parseFloat(dept.csat) >= 3.5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {dept.csat}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">{dept.agents}</td>
                    <td className="px-4 py-2 text-center">
                      {parseFloat(dept.csat) >= 4.5 ? <TrendingUp className="w-4 h-4 text-green-600 mx-auto" /> : parseFloat(dept.csat) < 3.5 ? <TrendingDown className="w-4 h-4 text-red-600 mx-auto" /> : <TrendingUp className="w-4 h-4 text-yellow-600 mx-auto rotate-90" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
