
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  MessageSquare, 
  Clock, 
  Users, 
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter
} from 'lucide-react';

export const ChatAnalytics = () => {
  // Mock data for charts
  const channelData = [
    { name: 'Website', chats: 450, percentage: 45 },
    { name: 'WhatsApp', chats: 300, percentage: 30 },
    { name: 'Facebook', chats: 150, percentage: 15 },
    { name: 'Email', chats: 100, percentage: 10 }
  ];

  const timeData = [
    { hour: '9 AM', chats: 25 },
    { hour: '10 AM', chats: 45 },
    { hour: '11 AM', chats: 65 },
    { hour: '12 PM', chats: 85 },
    { hour: '1 PM', chats: 75 },
    { hour: '2 PM', chats: 95 },
    { hour: '3 PM', chats: 120 },
    { hour: '4 PM', chats: 110 },
    { hour: '5 PM', chats: 85 }
  ];

  const responseTimeData = [
    { day: 'Mon', avgTime: 2.3 },
    { day: 'Tue', avgTime: 1.8 },
    { day: 'Wed', avgTime: 2.1 },
    { day: 'Thu', avgTime: 1.9 },
    { day: 'Fri', avgTime: 2.5 },
    { day: 'Sat', avgTime: 3.2 },
    { day: 'Sun', avgTime: 2.8 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Chat Analytics & Insights</h2>
          <p className="text-gray-600">Monitor chat performance and trends</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="7d">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Chats</p>
                <p className="text-2xl font-bold">1,247</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold">2.3min</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">-8.2%</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                <p className="text-2xl font-bold">94.2%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+2.1%</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
                <p className="text-2xl font-bold">4.8/5</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+0.3</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Chat Distribution by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="chats"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Chat Volume by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="chats" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Average Response Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelData.map((channel, index) => (
                <div key={channel.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="font-medium">{channel.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{channel.chats} chats</div>
                    <div className="text-sm text-gray-600">{channel.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Chats Started</span>
              <span className="font-semibold">89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chats Resolved</span>
              <span className="font-semibold">76</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Currently Active</span>
              <span className="font-semibold">23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Queue</span>
              <span className="font-semibold">12</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Agent Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Top Performer</span>
              <Badge className="bg-green-100 text-green-800">Agent Sarah</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Chats/Agent</span>
              <span className="font-semibold">12.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Agents Online</span>
              <span className="font-semibold">8/12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Utilization Rate</span>
              <span className="font-semibold">78%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Quality Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">First Contact Resolution</span>
              <span className="font-semibold">85%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Escalation Rate</span>
              <span className="font-semibold">8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Abandonment Rate</span>
              <span className="font-semibold">3.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quality Score</span>
              <span className="font-semibold">92/100</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
