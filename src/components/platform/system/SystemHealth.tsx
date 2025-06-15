
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Cpu,
  HardDrive,
  Wifi,
  RefreshCw
} from 'lucide-react';

export const SystemHealth = () => {
  const systemMetrics = [
    { name: 'CPU Usage', value: 65, status: 'normal', icon: Cpu },
    { name: 'Memory', value: 78, status: 'warning', icon: Server },
    { name: 'Storage', value: 45, status: 'normal', icon: HardDrive },
    { name: 'Network', value: 92, status: 'normal', icon: Wifi }
  ];

  const services = [
    { name: 'API Gateway', status: 'online', uptime: '99.98%', lastCheck: '2 min ago' },
    { name: 'Database', status: 'online', uptime: '99.95%', lastCheck: '1 min ago' },
    { name: 'Cache Server', status: 'online', uptime: '99.99%', lastCheck: '30 sec ago' },
    { name: 'File Storage', status: 'maintenance', uptime: '99.87%', lastCheck: '5 min ago' }
  ];

  const incidents = [
    { id: 1, title: 'Database slow response', severity: 'medium', time: '2 hours ago', status: 'resolved' },
    { id: 2, title: 'API rate limit exceeded', severity: 'high', time: '1 day ago', status: 'resolved' },
    { id: 3, title: 'Scheduled maintenance', severity: 'low', time: '3 days ago', status: 'completed' }
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Health & Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time system performance and health monitoring</p>
        </div>
        <Button className="bg-blue-600">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* Overall Status */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h2 className="text-xl font-semibold text-green-800">All Systems Operational</h2>
                <p className="text-green-600">System uptime: 99.98% • Last incident: 2 days ago</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 text-lg px-4 py-2">
              Healthy
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                <IconComponent className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{metric.value}%</span>
                    <Badge className={
                      metric.status === 'normal' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }>
                      {metric.status}
                    </Badge>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className={`h-2 ${metric.value > 80 ? 'bg-yellow-100' : 'bg-blue-100'}`}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Services Status */}
        <Card>
          <CardHeader>
            <CardTitle>Services Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'online' ? 'bg-green-500' : 
                    service.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-gray-600">Uptime: {service.uptime} • Last check: {service.lastCheck}</p>
                  </div>
                </div>
                <Badge className={
                  service.status === 'online' ? 'bg-green-100 text-green-700' :
                  service.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }>
                  {service.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                  incident.severity === 'high' ? 'text-red-600' :
                  incident.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
                <div className="flex-1">
                  <h3 className="font-semibold">{incident.title}</h3>
                  <p className="text-sm text-gray-600">{incident.time}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={
                      incident.severity === 'high' ? 'bg-red-100 text-red-700' :
                      incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }>
                      {incident.severity}
                    </Badge>
                    <Badge className="bg-green-100 text-green-700">
                      {incident.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
