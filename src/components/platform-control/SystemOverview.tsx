
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
      trend: 'up'
    },
    { 
      title: 'Active Clients', 
      value: '12,847', 
      change: '+24.3%', 
      icon: Users, 
      trend: 'up'
    },
    { 
      title: 'System Uptime', 
      value: '99.98%', 
      change: '+0.02%', 
      icon: Server, 
      trend: 'up'
    },
    { 
      title: 'API Calls (24h)', 
      value: '8.4M', 
      change: '+31.2%', 
      icon: Activity, 
      trend: 'up'
    },
    { 
      title: 'Response Time', 
      value: '23ms', 
      change: '-12.5%', 
      icon: Zap, 
      trend: 'down'
    },
    { 
      title: 'Support Tickets', 
      value: '127', 
      change: '-28.4%', 
      icon: AlertTriangle, 
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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">System Overview</h1>
          <p className="text-gray-600">Real-time platform monitoring and management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Shield className="w-4 h-4 mr-2" />
            Security Scan
          </Button>
          <Button size="sm">
            <Database className="w-4 h-4 mr-2" />
            Create Backup
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{metric.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-gray-900 mb-1">{metric.value}</div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className={`w-3 h-3 ${
                    (metric.trend === 'up' && !metric.title.includes('Support Tickets')) || 
                    (metric.trend === 'down' && (metric.title === 'Response Time' || metric.title === 'Support Tickets'))
                      ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <p className={`text-xs ${
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health Monitor */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Cpu className="w-5 h-5 text-gray-600" />
              <span>System Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemHealth.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        item.status === 'optimal' || item.status === 'excellent' ? 'text-green-700 border-green-300' :
                        item.status === 'good' ? 'text-blue-700 border-blue-300' : 'text-yellow-700 border-yellow-300'
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-gray-600" />
                <span>System Alerts</span>
              </div>
              <Badge variant="outline" className="text-orange-700 border-orange-300">
                {recentAlerts.length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className={`p-1 rounded-full ${
                  alert.type === 'warning' ? 'bg-yellow-100' :
                  alert.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {alert.type === 'warning' ? <AlertTriangle className="w-3 h-3 text-yellow-600" /> :
                   alert.type === 'success' ? <CheckCircle className="w-3 h-3 text-green-600" /> :
                   <Clock className="w-3 h-3 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      alert.severity === 'high' ? 'text-red-700 border-red-300' :
                      alert.severity === 'medium' ? 'text-yellow-700 border-yellow-300' :
                      'text-blue-700 border-blue-300'
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
