
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
  Star 
} from 'lucide-react';

export const AnalyticsDashboard = () => {
  const monthlyData = [
    { month: 'Jan', chats: 1200, resolved: 1100, satisfaction: 4.2 },
    { month: 'Feb', chats: 1400, resolved: 1250, satisfaction: 4.3 },
    { month: 'Mar', chats: 1800, resolved: 1650, satisfaction: 4.1 },
    { month: 'Apr', chats: 1600, resolved: 1480, satisfaction: 4.4 },
    { month: 'May', chats: 2000, resolved: 1850, satisfaction: 4.5 },
    { month: 'Jun', chats: 2200, resolved: 2050, satisfaction: 4.6 }
  ];

  const dailyData = [
    { day: 'Mon', chats: 45, avgTime: 3.2 },
    { day: 'Tue', chats: 52, avgTime: 2.8 },
    { day: 'Wed', chats: 49, avgTime: 3.1 },
    { day: 'Thu', chats: 63, avgTime: 2.9 },
    { day: 'Fri', chats: 71, avgTime: 3.4 },
    { day: 'Sat', chats: 35, avgTime: 2.7 },
    { day: 'Sun', chats: 28, avgTime: 2.5 }
  ];

  const channelData = [
    { name: 'Website Chat', value: 45, color: '#3B82F6' },
    { name: 'Mobile App', value: 30, color: '#8B5CF6' },
    { name: 'Email', value: 15, color: '#10B981' },
    { name: 'Social Media', value: 10, color: '#F59E0B' }
  ];

  const kpiCards = [
    {
      title: 'Total Conversations',
      value: '12,345',
      change: '+12.5%',
      trend: 'up',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      title: 'Avg Response Time',
      value: '2.3 min',
      change: '-15.2%',
      trend: 'down',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.6/5',
      change: '+8.3%',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      title: 'Active Agents',
      value: '24',
      change: '+2%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600">Comprehensive insights into your support performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
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
                <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Chat Volume</CardTitle>
                <CardDescription>
                  Total chats and resolution rate over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
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

            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction Trend</CardTitle>
                <CardDescription>
                  Average satisfaction rating over time
                </CardDescription>
              </CardHeader>
              <CardContent>
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

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
              <CardDescription>
                Daily chat volume and average response time
              </CardDescription>
            </CardHeader>
            <CardContent>
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

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Distribution</CardTitle>
                <CardDescription>
                  Breakdown of conversations by channel
                </CardDescription>
              </CardHeader>
              <CardContent>
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

            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>
                  Key metrics by communication channel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelData.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: channel.color }}
                        />
                        <span className="font-medium">{channel.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{channel.value}%</p>
                        <p className="text-xs text-gray-500">of total volume</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance</CardTitle>
              <CardDescription>
                Individual agent metrics and rankings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Sarah Johnson', chats: 156, satisfaction: 4.8, responseTime: '1.2 min' },
                  { name: 'Michael Chen', chats: 142, satisfaction: 4.7, responseTime: '1.5 min' },
                  { name: 'Emily Rodriguez', chats: 138, satisfaction: 4.6, responseTime: '1.8 min' },
                  { name: 'David Wilson', chats: 124, satisfaction: 4.5, responseTime: '2.1 min' }
                ].map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
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
                      <Badge className="bg-green-100 text-green-800">
                        Top Performer
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
