
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  Server, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Globe,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Shield
} from 'lucide-react';

export const SystemOverview = () => {
  const kpiMetrics = [
    { 
      title: 'Total Revenue', 
      value: '$2,847,392', 
      change: '+18.7%', 
      icon: DollarSign, 
      color: 'from-emerald-400 to-emerald-600',
      trend: 'up'
    },
    { 
      title: 'Active Clients', 
      value: '12,847', 
      change: '+24.3%', 
      icon: Users, 
      color: 'from-blue-400 to-blue-600',
      trend: 'up'
    },
    { 
      title: 'System Uptime', 
      value: '99.98%', 
      change: '+0.02%', 
      icon: Server, 
      color: 'from-green-400 to-green-600',
      trend: 'up'
    },
    { 
      title: 'API Calls (24h)', 
      value: '8.4M', 
      change: '+31.2%', 
      icon: Activity, 
      color: 'from-purple-400 to-purple-600',
      trend: 'up'
    },
    { 
      title: 'Response Time', 
      value: '23ms', 
      change: '-12.5%', 
      icon: Zap, 
      color: 'from-orange-400 to-orange-600',
      trend: 'down'
    },
    { 
      title: 'Support Tickets', 
      value: '127', 
      change: '-28.4%', 
      icon: AlertTriangle, 
      color: 'from-red-400 to-red-600',
      trend: 'down'
    }
  ];

  const systemHealth = [
    { name: 'CPU Usage', value: 23, status: 'optimal', color: 'bg-green-500' },
    { name: 'Memory Usage', value: 67, status: 'good', color: 'bg-blue-500' },
    { name: 'Disk Space', value: 45, status: 'optimal', color: 'bg-green-500' },
    { name: 'Network I/O', value: 89, status: 'high', color: 'bg-yellow-500' },
    { name: 'Database Load', value: 34, status: 'optimal', color: 'bg-green-500' },
    { name: 'Cache Hit Rate', value: 94, status: 'excellent', color: 'bg-emerald-500' }
  ];

  const recentAlerts = [
    { 
      id: 1, 
      type: 'warning', 
      title: 'High Network Traffic Detected',
      message: 'Unusual spike in API requests from EU region', 
      time: '2 min ago',
      severity: 'medium'
    },
    { 
      id: 2, 
      type: 'success', 
      title: 'Database Optimization Complete',
      message: 'Performance improved by 15% after index optimization', 
      time: '1 hour ago',
      severity: 'low'
    },
    { 
      id: 3, 
      type: 'info', 
      title: 'Scheduled Maintenance Window',
      message: 'Routine backup completed successfully', 
      time: '3 hours ago',
      severity: 'low'
    }
  ];

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50/30 to-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">System Command Center</h1>
          </div>
          <p className="text-gray-600 ml-12">Real-time platform monitoring and control</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="border-gray-300">
            <Shield className="w-4 h-4 mr-2" />
            Security Scan
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
            <Database className="w-4 h-4 mr-2" />
            System Backup
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{metric.title}</CardTitle>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className={`w-4 h-4 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'} ${metric.trend === 'down' && metric.title === 'Response Time' ? 'text-green-600' : ''}`} />
                  <p className={`text-sm font-medium ${
                    (metric.trend === 'up' && !metric.title.includes('Support Tickets')) || 
                    (metric.trend === 'down' && (metric.title === 'Response Time' || metric.title === 'Support Tickets'))
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change} from last month
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Health Monitor */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span>System Health Monitor</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {systemHealth.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                    <Badge 
                      variant={item.status === 'optimal' || item.status === 'excellent' ? 'default' : 
                              item.status === 'good' ? 'secondary' : 'destructive'}
                      className={`text-xs ${
                        item.status === 'optimal' || item.status === 'excellent' ? 'bg-green-100 text-green-700' :
                        item.status === 'good' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={item.value} 
                  className={`h-2 ${item.color}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Real-time Alerts */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span>Real-time System Alerts</span>
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                {recentAlerts.length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md transition-shadow">
                <div className={`p-1 rounded-full ${
                  alert.type === 'warning' ? 'bg-yellow-100' :
                  alert.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {alert.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-600" /> :
                   alert.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                   <Clock className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{alert.title}</h4>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      alert.severity === 'high' ? 'bg-red-50 text-red-600 border-red-200' :
                      alert.severity === 'medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                      'bg-blue-50 text-blue-600 border-blue-200'
                    }`}
                  >
                    {alert.severity} priority
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
