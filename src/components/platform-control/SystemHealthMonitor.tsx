
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Server, 
  Cpu, 
  HardDrive, 
  Plus,
  Shield,
  RefreshCw
} from 'lucide-react';

export const SystemHealthMonitor = () => {
  const healthMetrics = [
    { 
      title: 'System Uptime', 
      value: '99.98%', 
      change: '+0.02%', 
      icon: Activity, 
      trend: 'up'
    },
    { 
      title: 'Response Time', 
      value: '23ms', 
      change: '-12.5%', 
      icon: Server, 
      trend: 'down'
    },
    { 
      title: 'CPU Usage', 
      value: '23%', 
      change: '+2.1%', 
      icon: Cpu, 
      trend: 'up'
    },
    { 
      title: 'Storage Used', 
      value: '67%', 
      change: '+5.2%', 
      icon: HardDrive, 
      trend: 'up'
    }
  ];

  const systemComponents = [
    { name: 'Web Servers', status: 'healthy', value: 98, color: 'bg-green-500' },
    { name: 'Database', status: 'optimal', value: 95, color: 'bg-green-500' },
    { name: 'Cache Layer', status: 'warning', value: 78, color: 'bg-yellow-500' },
    { name: 'Message Queue', status: 'healthy', value: 92, color: 'bg-green-500' },
    { name: 'File Storage', status: 'healthy', value: 88, color: 'bg-green-500' },
    { name: 'CDN', status: 'optimal', value: 99, color: 'bg-green-500' }
  ];

  const alerts = [
    { 
      id: 1, 
      title: 'High Memory Usage',
      severity: 'warning', 
      component: 'Cache Layer',
      time: '5 minutes ago'
    },
    { 
      id: 2, 
      title: 'Backup Completed',
      severity: 'info', 
      component: 'Database',
      time: '2 hours ago'
    },
    { 
      id: 3, 
      title: 'SSL Certificate Renewed',
      severity: 'success', 
      component: 'Web Servers',
      time: '1 day ago'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">System Health Monitor</h1>
          <p className="text-gray-600">Real-time system performance and infrastructure monitoring</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button size="sm">
            <Shield className="w-4 h-4 mr-2" />
            Run Diagnostics
          </Button>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthMetrics.map((metric, index) => {
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
                  <span className={`text-xs ${
                    (metric.trend === 'up' && !metric.title.includes('Usage')) || 
                    (metric.trend === 'down' && metric.title === 'Response Time')
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change} from baseline
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Component Health */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Server className="w-5 h-5 text-gray-600" />
              <span>Component Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemComponents.map((component, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{component.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{component.value}%</span>
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        component.status === 'healthy' || component.status === 'optimal' ? 'text-green-700 border-green-300' :
                        'text-yellow-700 border-yellow-300'
                      }`}
                    >
                      {component.status}
                    </Badge>
                  </div>
                </div>
                <Progress value={component.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Activity className="w-5 h-5 text-gray-600" />
              <span>System Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded-full ${
                    alert.severity === 'warning' ? 'bg-yellow-100' :
                    alert.severity === 'success' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <Activity className={`w-3 h-3 ${
                      alert.severity === 'warning' ? 'text-yellow-600' :
                      alert.severity === 'success' ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                    <p className="text-sm text-gray-600">{alert.component}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      alert.severity === 'warning' ? 'text-yellow-700 border-yellow-300' :
                      alert.severity === 'success' ? 'text-green-700 border-green-300' :
                      'text-blue-700 border-blue-300'
                    }`}
                  >
                    {alert.severity}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
