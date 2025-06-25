import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Clock, 
  Star,
  BarChart3,
  Code
} from 'lucide-react';
import { CustomAnalyticsBuilder } from './analytics/CustomAnalyticsBuilder';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const AnalyticsDashboard = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [channelData, setChannelData] = useState<any[]>([]);
  const [kpiCards, setKpiCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch chats for monthly and daily stats
        const { data: chats, error: chatsError } = await supabase.from('chats').select('*');
        if (chatsError) throw new Error('Failed to fetch chats');

        // Fetch agents
        const { data: agents, error: agentsError } = await supabase.from('profiles').select('*').eq('role', 'agent');
        if (agentsError) throw new Error('Failed to fetch agents');

        // Monthly Data (last 6 months)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        const monthlyStats = Array.from({ length: 6 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
          const monthStr = months[d.getMonth()];
          const chatsInMonth = chats.filter((c: any) => c.created_at && new Date(c.created_at).getMonth() === d.getMonth() && new Date(c.created_at).getFullYear() === d.getFullYear());
          const resolved = chatsInMonth.filter((c: any) => c.status === 'resolved').length;
          const satisfaction = chatsInMonth.length > 0 ? (chatsInMonth.reduce((acc: number, c: any) => acc + (c.satisfaction_rating || 0), 0) / chatsInMonth.length) : 0;
          return {
            month: monthStr,
            chats: chatsInMonth.length,
            resolved,
            satisfaction: satisfaction ? Number(satisfaction.toFixed(2)) : null,
          };
        });
        setMonthlyData(monthlyStats);

        // Daily Data (last 7 days)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dailyStats = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(now);
          d.setDate(now.getDate() - (6 - i));
          const dayStr = days[d.getDay()];
          const chatsInDay = chats.filter((c: any) => c.created_at && new Date(c.created_at).toDateString() === d.toDateString());
          const avgTime = chatsInDay.length > 0 ? (chatsInDay.reduce((acc: number, c: any) => acc + (c.response_time || 0), 0) / chatsInDay.length / 60).toFixed(1) : null;
          return {
            day: dayStr,
            chats: chatsInDay.length,
            avgTime: avgTime ? Number(avgTime) : null,
          };
        });
        setDailyData(dailyStats);

        // Channel Data (group by channel)
        const channelMap: Record<string, { name: string; value: number; color: string }> = {
          'website': { name: 'Website Chat', value: 0, color: '#3B82F6' },
          'mobile': { name: 'Mobile App', value: 0, color: '#8B5CF6' },
          'email': { name: 'Email', value: 0, color: '#10B981' },
          'social': { name: 'Social Media', value: 0, color: '#F59E0B' },
        };
        chats.forEach((c: any) => {
          if (c.channel && channelMap[c.channel]) {
            channelMap[c.channel].value += 1;
          }
        });
        setChannelData(Object.values(channelMap));

        // KPIs
        const totalChats = chats.length;
        const avgResponse = totalChats > 0 ? (chats.reduce((acc: number, c: any) => acc + (c.response_time || 0), 0) / totalChats / 60).toFixed(1) : '0';
        const avgSatisfaction = totalChats > 0 ? (chats.reduce((acc: number, c: any) => acc + (c.satisfaction_rating || 0), 0) / totalChats).toFixed(2) : '0';
        const activeAgents = agents.length;
        setKpiCards([
          {
            title: 'Total Conversations',
            value: totalChats.toLocaleString(),
            change: '',
            trend: 'up',
            icon: MessageSquare,
            color: 'text-blue-600',
          },
          {
            title: 'Avg Response Time',
            value: `${avgResponse} min`,
            change: '',
            trend: 'down',
            icon: Clock,
            color: 'text-green-600',
          },
          {
            title: 'Customer Satisfaction',
            value: `${avgSatisfaction}/5`,
            change: '',
            trend: 'up',
            icon: Star,
            color: 'text-yellow-600',
          },
          {
            title: 'Active Agents',
            value: activeAgents.toString(),
            change: '',
            trend: 'up',
            icon: Users,
            color: 'text-purple-600',
          },
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-semibold text-gray-900 font-segoe">Analytics Dashboard</h1>
          </div>
          <p className="text-base text-gray-600 leading-relaxed">
            Comprehensive insights into your support performance and customer interactions
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{kpi.title}</p>
                    <p className="text-2xl font-semibold text-gray-900 mb-2">{kpi.value}</p>
                    <div className="flex items-center mt-1">
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : kpi.change.startsWith('-') ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                    <kpi.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <Tabs defaultValue="overview" className="space-y-0">
            <div className="border-b border-gray-200">
              <TabsList className="h-auto bg-transparent p-0 space-x-0">
                <div className="flex overflow-x-auto scrollbar-hide">
                  <TabsTrigger value="overview" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                    Performance
                  </TabsTrigger>
                  <TabsTrigger value="channels" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                    Channels
                  </TabsTrigger>
                  <TabsTrigger value="agents" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                    Agents
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                    <Code className="w-4 h-4" />
                    Custom Analytics
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            <div className="p-8">
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
                      <CardTitle className="text-lg font-semibold text-gray-900">Monthly Chat Volume</CardTitle>
                      <CardDescription className="text-gray-600">
                        Total chats and resolution rate over the last 6 months
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="chats" fill="#3B82F6" name="Total Chats" />
                          <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
                      <CardTitle className="text-lg font-semibold text-gray-900">Customer Satisfaction Trend</CardTitle>
                      <CardDescription className="text-gray-600">
                        Average satisfaction rating over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[3.5, 5]} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="satisfaction" 
                            stroke="#8B5CF6" 
                            strokeWidth={3}
                            name="Satisfaction Score"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="mt-0 space-y-6">
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
                    <CardTitle className="text-lg font-semibold text-gray-900">Weekly Performance</CardTitle>
                    <CardDescription className="text-gray-600">
                      Daily chat volume and average response time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Bar yAxisId="left" dataKey="chats" fill="#3B82F6" name="Chats" />
                        <Line yAxisId="right" dataKey="avgTime" stroke="#F59E0B" name="Avg Time (min)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="channels" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
                      <CardTitle className="text-lg font-semibold text-gray-900">Channel Distribution</CardTitle>
                      <CardDescription className="text-gray-600">
                        Breakdown of conversations by channel
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={channelData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {channelData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
                      <CardTitle className="text-lg font-semibold text-gray-900">Channel Performance</CardTitle>
                      <CardDescription className="text-gray-600">
                        Key metrics by communication channel
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {channelData.map((channel, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: channel.color }}
                              />
                              <span className="font-medium text-gray-900">{channel.name}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">{channel.value}%</p>
                              <p className="text-xs text-gray-500">of total volume</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="agents" className="mt-0 space-y-6">
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
                    <CardTitle className="text-lg font-semibold text-gray-900">Agent Performance</CardTitle>
                    <CardDescription className="text-gray-600">
                      Individual agent metrics and rankings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        { name: 'Sarah Johnson', chats: 156, satisfaction: 4.8, responseTime: '1.2 min' },
                        { name: 'Michael Chen', chats: 142, satisfaction: 4.7, responseTime: '1.5 min' },
                        { name: 'Emily Rodriguez', chats: 138, satisfaction: 4.6, responseTime: '1.8 min' },
                        { name: 'David Wilson', chats: 124, satisfaction: 4.5, responseTime: '2.1 min' }
                      ].map((agent, index) => (
                        <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                              {agent.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{agent.name}</p>
                              <p className="text-sm text-gray-500">{agent.chats} chats this month</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm font-semibold text-gray-900">{agent.satisfaction}</p>
                              <p className="text-xs text-gray-500">Satisfaction</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-semibold text-gray-900">{agent.responseTime}</p>
                              <p className="text-xs text-gray-500">Avg Response</p>
                            </div>
                            <Badge className="bg-green-50 text-green-700 border-green-200">
                              Top Performer
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="custom" className="mt-0 space-y-6">
                <CustomAnalyticsBuilder />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
