import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Target, 
  Star, 
  AlertTriangle, 
  Award, 
  TrendingDown,
  Activity,
  RefreshCw,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const SupervisorOverview = () => {
  // Stats
  const [teamStats, setTeamStats] = useState<any[]>([]);
  // Metrics
  const [metrics, setMetrics] = useState({ 
    todayTarget: '-', 
    teamEfficiency: '-', 
    teamCSAT: '-', 
    totalResponses: '-', 
    activeAlerts: '-', 
    reserved: '-' 
  });
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
        { 
          title: 'Active Agents', 
          value: String(activeAgents), 
          icon: Users, 
          subtitle: 'from last hour', 
          tooltip: 'Number of agents online and available.',
          trend: '+5.2%',
          trendUp: true
        },
        { 
          title: 'Queue Length', 
          value: String(queueLength), 
          icon: MessageSquare, 
          subtitle: 'from last hour', 
          tooltip: 'Number of chats waiting in the queue.',
          trend: '-12.3%',
          trendUp: false
        },
        { 
          title: 'Avg Response Time', 
          value: `${avgResponse}m`, 
          icon: Clock, 
          subtitle: 'from last hour', 
          tooltip: 'Average time taken to respond to a chat.',
          trend: '-8.1%',
          trendUp: false
        },
        { 
          title: 'Resolution Rate', 
          value: `${resolutionRate}%`, 
          icon: CheckCircle, 
          subtitle: 'from last hour', 
          tooltip: 'Percentage of chats resolved.',
          trend: '+15.7%',
          trendUp: true
        },
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
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="p-8 text-center text-slate-600">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-20">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-sm text-slate-600 mt-1">Real-time insights and team performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 border-slate-200">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh dashboard data</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamStats.map((stat, i) => (
            <Card key={i} className="bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.trendUp ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{stat.trend}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-lg font-semibold text-slate-700">{stat.title}</p>
                  <p className="text-sm text-slate-500">{stat.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Performance Metrics */}
        <Card className="bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-xl">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">Performance Metrics</CardTitle>
                  <CardDescription className="text-slate-600">Key performance indicators and team efficiency</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">Today's Target</span>
                </div>
                <p className="text-2xl font-bold text-emerald-900">{metrics.todayTarget}%</p>
                <p className="text-xs text-emerald-600">Resolution Rate</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Team Efficiency</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{metrics.teamEfficiency}%</p>
                <p className="text-xs text-purple-600">Above Baseline</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">Team CSAT</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{metrics.teamCSAT}</p>
                <p className="text-xs text-slate-600">(all time)</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Total Responses</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{metrics.totalResponses}</p>
                <p className="text-xs text-blue-600">(all time)</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Active Alerts</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">{metrics.activeAlerts}</p>
                <p className="text-xs text-orange-600">Needs attention</p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Reserved</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">-</p>
                <p className="text-xs text-slate-600">-</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Performance Table */}
        <Card className="bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-xl">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Agent Performance</CardTitle>
                <CardDescription className="text-slate-600">Individual agent satisfaction scores and metrics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Agent</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Responses</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">CSAT Score</th>
                  </tr>
                </thead>
                <tbody>
                  {agentCSAT.slice(0, 6).map((agent, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {agent.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <span className="font-medium text-slate-900">{agent.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{agent.email}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline" className="bg-slate-50 text-slate-700">
                          {agent.responses}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge 
                          className={`font-semibold ${
                            parseFloat(agent.csat) >= 4.5 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : parseFloat(agent.csat) >= 3.5 
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                                : 'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          {agent.csat}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-xl">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Department Performance</CardTitle>
                <CardDescription className="text-slate-600">CSAT comparison across different departments</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Department</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Agents</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Avg CSAT</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {deptCSAT.map((dept, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900">{dept.department}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline" className="bg-slate-50 text-slate-700">
                          {dept.agents}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge 
                          className={`font-semibold ${
                            parseFloat(dept.csat) >= 4.5 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : parseFloat(dept.csat) >= 3.5 
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                                : 'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          {dept.csat}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {parseFloat(dept.csat) >= 4.5 ? (
                          <TrendingUp className="w-4 h-4 text-green-600 mx-auto" />
                        ) : parseFloat(dept.csat) < 3.5 ? (
                          <TrendingDown className="w-4 h-4 text-red-600 mx-auto" />
                        ) : (
                          <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto"></div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
