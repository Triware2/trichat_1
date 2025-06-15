
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
  Crown,
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
    <div className="p-8 space-y-8 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-400 to-violet-500 rounded-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Executive Command Center</h1>
          </div>
          <p className="text-slate-300 ml-12">Real-time platform insights and strategic control</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
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
            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-400' : stat.change.startsWith('-') && stat.title === 'Support Tickets' ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Alerts */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <span>Critical Alerts</span>
              </div>
              <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                {recentAlerts.length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                <div className={`p-1 rounded-full ${
                  alert.type === 'error' ? 'bg-red-500/20' :
                  alert.type === 'warning' ? 'bg-yellow-500/20' :
                  alert.type === 'success' ? 'bg-green-500/20' : 'bg-blue-500/20'
                }`}>
                  {alert.type === 'error' ? <AlertTriangle className="w-3 h-3 text-red-400" /> :
                   alert.type === 'warning' ? <AlertTriangle className="w-3 h-3 text-yellow-400" /> :
                   alert.type === 'success' ? <CheckCircle className="w-3 h-3 text-green-400" /> :
                   <Clock className="w-3 h-3 text-blue-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{alert.message}</p>
                  <p className="text-xs text-slate-400">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Elite Revenue Clients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                <div className="flex-1">
                  <p className="font-medium text-white">{client.name}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-green-400 font-medium">{client.revenue}</span>
                    <span className="text-sm text-slate-400">Usage: {client.usage}</span>
                  </div>
                </div>
                <Badge 
                  variant={client.status === 'active' ? 'default' : 'destructive'}
                  className={client.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}
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
