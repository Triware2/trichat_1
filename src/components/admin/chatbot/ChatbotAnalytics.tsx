
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Bot, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Users,
  Clock,
  Target
} from 'lucide-react';

export const ChatbotAnalytics = () => {
  const monthlyData = [
    { month: 'Jan', total: 1200, resolved: 1020, escalated: 180, satisfaction: 4.2 },
    { month: 'Feb', total: 1400, resolved: 1260, escalated: 140, satisfaction: 4.3 },
    { month: 'Mar', total: 1800, resolved: 1620, escalated: 180, satisfaction: 4.1 },
    { month: 'Apr', total: 1600, resolved: 1456, escalated: 144, satisfaction: 4.4 },
    { month: 'May', total: 2000, resolved: 1880, escalated: 120, satisfaction: 4.5 },
    { month: 'Jun', total: 2200, resolved: 2068, escalated: 132, satisfaction: 4.6 }
  ];

  const resolutionData = [
    { name: 'Auto-Resolved', value: 68, color: '#10B981' },
    { name: 'Escalated to Agent', value: 23, color: '#F59E0B' },
    { name: 'Customer Left', value: 9, color: '#EF4444' }
  ];

  const botPerformanceData = [
    { name: 'Customer Support Bot', conversations: 456, resolution: 94, satisfaction: 4.6, type: 'LLM' },
    { name: 'Technical Support AI', conversations: 324, resolution: 96, satisfaction: 4.8, type: 'LLM' },
    { name: 'FAQ Assistant', conversations: 234, resolution: 87, satisfaction: 4.2, type: 'Standard' },
    { name: 'Billing Inquiries Bot', conversations: 189, resolution: 91, satisfaction: 4.4, type: 'Standard' }
  ];

  const kpiCards = [
    {
      title: 'Total Conversations',
      value: '12,456',
      change: '+18.2%',
      trend: 'up',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      title: 'Resolution Rate',
      value: '94.2%',
      change: '+5.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Avg Response Time',
      value: '1.2s',
      change: '-23.4%',
      trend: 'down',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.5/5',
      change: '+8.3%',
      trend: 'up',
      icon: Target,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Chatbot Analytics & Performance</h2>
        <p className="text-gray-600 mt-1">Monitor resolution rates, user satisfaction, and bot effectiveness</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
            <CardTitle className="text-lg font-semibold text-gray-900">Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3B82F6" name="Total Conversations" />
                <Bar dataKey="resolved" fill="#10B981" name="Resolved by Bot" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
            <CardTitle className="text-lg font-semibold text-gray-900">Resolution Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resolutionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resolutionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Satisfaction Trend */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
          <CardTitle className="text-lg font-semibold text-gray-900">Customer Satisfaction Trend</CardTitle>
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

      {/* Bot Performance Table */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
          <CardTitle className="text-lg font-semibold text-gray-900">Individual Bot Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {botPerformanceData.map((bot, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white">
                    {bot.type === 'LLM' ? <Brain className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{bot.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {bot.type} {bot.type === 'LLM' ? 'Powered' : 'Bot'}
                      </Badge>
                      <span className="text-sm text-gray-500">{bot.conversations} conversations</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">{bot.resolution}%</p>
                    <p className="text-xs text-gray-500">Resolution</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">{bot.satisfaction}</p>
                    <p className="text-xs text-gray-500">Satisfaction</p>
                  </div>
                  <Badge className={bot.resolution > 90 ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}>
                    {bot.resolution > 90 ? 'Excellent' : 'Good'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
