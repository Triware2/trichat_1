
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  Server, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Download,
  Zap
} from 'lucide-react';

export const PlatformDashboard = () => {
  const stats = [
    { title: 'Total Clients', value: '2,847', change: '+12.5%', icon: Users, color: 'from-blue-400 to-blue-600' },
    { title: 'Monthly Revenue', value: '$127,430', change: '+8.2%', icon: DollarSign, color: 'from-green-400 to-emerald-600' },
    { title: 'Active Users', value: '18,392', change: '+15.3%', icon: Activity, color: 'from-purple-400 to-purple-600' },
    { title: 'API Calls (24h)', value: '1.2M', change: '+23.1%', icon: TrendingUp, color: 'from-violet-400 to-violet-600' },
    { title: 'System Uptime', value: '99.98%', change: '+0.01%', icon: Server, color: 'from-teal-400 to-cyan-600' },
    { title: 'Support Tickets', value: '43', change: '-18.6%', icon: AlertTriangle, color: 'from-red-400 to-red-600' }
  ];

  const recentAlerts = [
    { id: 1, type: 'warning', message: 'High API usage detected for Client ABC Corp', time: '5 min ago' },
    { id: 2, type: 'success', message: 'System backup completed successfully', time: '1 hour ago' },
    { id: 3, type: 'error', message: 'Payment failed for Client XYZ Ltd', time: '2 hours ago' },
    { id: 4, type: 'info', message: 'New client onboarded: Tech Solutions Inc', time: '4 hours ago' }
  ];

  const topClients = [
    { name: 'Enterprise Corp', revenue: '$45,230', usage: '95%', status: 'active' },
    { name: 'Tech Solutions', revenue: '$32,100', usage: '87%', status: 'active' },
    { name: 'Global Industries', revenue: '$28,950', usage: '76%', status: 'active' },
    { name: 'Innovation Labs', revenue: '$22,400', usage: '68%', status: 'warning' }
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-400 to-violet-500 rounded-lg">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">T</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>
          </div>
          <p className="text-gray-600 ml-12">Real-time platform insights and control</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-purple-400 to-violet-500 hover:from-purple-500 hover:to-violet-600 text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Advanced Analytics
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} shadow-sm`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') && stat.title === 'Support Tickets' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Alerts */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-500" />
                <span>Critical Alerts</span>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                {recentAlerts.length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className={`p-1 rounded-full ${
                  alert.type === 'error' ? 'bg-red-100' :
                  alert.type === 'warning' ? 'bg-yellow-100' :
                  alert.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {alert.type === 'error' ? <AlertTriangle className="w-3 h-3 text-red-600" /> :
                   alert.type === 'warning' ? <AlertTriangle className="w-3 h-3 text-yellow-600" /> :
                   alert.type === 'success' ? <CheckCircle className="w-3 h-3 text-green-600" /> :
                   <Clock className="w-3 h-3 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Top Revenue Clients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{client.name}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-green-600 font-medium">{client.revenue}</span>
                    <span className="text-sm text-gray-500">Usage: {client.usage}</span>
                  </div>
                </div>
                <Badge 
                  variant={client.status === 'active' ? 'default' : 'destructive'}
                  className={client.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}
                >
                  {client.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
