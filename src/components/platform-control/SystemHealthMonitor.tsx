
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Shield,
  TrendingUp,
  Settings,
  RefreshCw
} from 'lucide-react';

export const SystemHealthMonitor = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const systemMetrics = [
    { title: 'System Uptime', value: '99.98%', change: '+0.02%', icon: Server, color: 'from-green-400 to-green-600', status: 'excellent' },
    { title: 'Response Time', value: '23ms', change: '-12%', icon: Zap, color: 'from-blue-400 to-blue-600', status: 'excellent' },
    { title: 'Throughput', value: '847K/min', change: '+18%', icon: Activity, color: 'from-purple-400 to-purple-600', status: 'good' },
    { title: 'Error Rate', value: '0.01%', change: '-45%', icon: AlertTriangle, color: 'from-red-400 to-red-600', status: 'excellent' },
    { title: 'Availability', value: '100%', change: '0%', icon: Globe, color: 'from-emerald-400 to-emerald-600', status: 'excellent' },
    { title: 'Security Score', value: '98.7%', change: '+2.1%', icon: Shield, color: 'from-orange-400 to-orange-600', status: 'excellent' }
  ];

  const resourceMonitoring = [
    { name: 'CPU Usage', value: 23, threshold: 80, status: 'optimal', color: 'bg-green-500', icon: Cpu },
    { name: 'Memory Usage', value: 67, threshold: 85, status: 'good', color: 'bg-blue-500', icon: Database },
    { name: 'Disk Space', value: 45, threshold: 90, status: 'optimal', color: 'bg-green-500', icon: HardDrive },
    { name: 'Network I/O', value: 89, threshold: 95, status: 'high', color: 'bg-yellow-500', icon: Wifi },
    { name: 'Database Load', value: 34, threshold: 80, status: 'optimal', color: 'bg-green-500', icon: Database },
    { name: 'API Load', value: 56, threshold: 85, status: 'good', color: 'bg-blue-500', icon: Activity }
  ];

  const serviceStatus = [
    { service: 'API Gateway', status: 'online', uptime: '99.99%', lastCheck: '30s ago', region: 'Global' },
    { service: 'Database Cluster', status: 'online', uptime: '99.98%', lastCheck: '15s ago', region: 'US-East' },
    { service: 'Cache Layer', status: 'online', uptime: '100%', lastCheck: '45s ago', region: 'Global' },
    { service: 'Message Queue', status: 'online', uptime: '99.97%', lastCheck: '20s ago', region: 'EU-West' },
    { service: 'File Storage', status: 'online', uptime: '99.99%', lastCheck: '60s ago', region: 'Global' },
    { service: 'Analytics Engine', status: 'maintenance', uptime: '99.95%', lastCheck: '2m ago', region: 'US-West' }
  ];

  const performanceAlerts = [
    { 
      id: 1, 
      severity: 'warning', 
      title: 'High Memory Usage Detected',
      service: 'Database Cluster',
      message: 'Memory usage is at 89% - approaching threshold', 
      time: '3 min ago',
      action: 'Scale resources'
    },
    { 
      id: 2, 
      severity: 'info', 
      title: 'Scheduled Maintenance Complete',
      service: 'Analytics Engine',
      message: 'Performance optimization deployment successful', 
      time: '15 min ago',
      action: 'Review metrics'
    },
    { 
      id: 3, 
      severity: 'success', 
      title: 'Auto-scaling Triggered',
      service: 'API Gateway',
      message: 'Successfully scaled up to handle increased load', 
      time: '1 hour ago',
      action: 'Monitor usage'
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50/30 to-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">System Health Monitor</h1>
          </div>
          <p className="text-gray-600 ml-12">Real-time performance and infrastructure monitoring</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-gray-300"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
            <Settings className="w-4 h-4 mr-2" />
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* System Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{metric.title}</CardTitle>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                  <Badge 
                    variant="outline"
                    className={`${
                      metric.status === 'excellent' ? 'bg-green-100 text-green-700 border-green-200' :
                      metric.status === 'good' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}
                  >
                    {metric.status}
                  </Badge>
                </div>
                <p className={`text-sm font-medium ${
                  metric.change.startsWith('+') && !metric.title.includes('Error') ? 'text-green-600' : 
                  metric.change.startsWith('-') && metric.title.includes('Error') ? 'text-green-600' :
                  metric.change.startsWith('-') && metric.title.includes('Response') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change} from last hour
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resource Monitoring */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Cpu className="w-5 h-5 text-green-600" />
              <span>Resource Monitoring</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {resourceMonitoring.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{resource.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-900">{resource.value}%</span>
                      <Badge 
                        variant="outline"
                        className={`text-xs ${
                          resource.status === 'optimal' ? 'bg-green-100 text-green-700 border-green-200' :
                          resource.status === 'good' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          'bg-yellow-100 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        {resource.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={resource.value} 
                      className="h-2"
                    />
                    {/* Threshold line */}
                    <div 
                      className="absolute top-0 h-2 w-0.5 bg-red-400"
                      style={{ left: `${resource.threshold}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    Threshold: {resource.threshold}%
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Service Status */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Server className="w-5 h-5 text-blue-600" />
              <span>Service Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceStatus.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'online' ? 'bg-green-500 animate-pulse' : 
                    service.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{service.service}</h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Uptime: {service.uptime}</span>
                      <span>Region: {service.region}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline"
                    className={`text-xs mb-1 ${
                      service.status === 'online' ? 'bg-green-100 text-green-700 border-green-200' :
                      service.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                      'bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    {service.status}
                  </Badge>
                  <div className="text-xs text-gray-500">{service.lastCheck}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Alerts */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Performance Alerts</span>
            </div>
            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
              {performanceAlerts.length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {performanceAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md transition-shadow">
              <div className={`p-1 rounded-full ${
                alert.severity === 'warning' ? 'bg-yellow-100' :
                alert.severity === 'success' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {alert.severity === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-600" /> :
                 alert.severity === 'success' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                 <Clock className="w-4 h-4 text-blue-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{alert.title}</h4>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                    {alert.service}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      alert.severity === 'warning' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                      alert.severity === 'success' ? 'bg-green-50 text-green-600 border-green-200' :
                      'bg-blue-50 text-blue-600 border-blue-200'
                    }`}
                  >
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                <Button size="sm" variant="outline" className="bg-white/60">
                  {alert.action}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
