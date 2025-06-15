
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  Plus,
  Scan,
  Key
} from 'lucide-react';

export const SecurityCenter = () => {
  const securityMetrics = [
    { 
      title: 'Security Score', 
      value: '98/100', 
      change: '+2 points', 
      icon: Shield, 
      trend: 'up'
    },
    { 
      title: 'Active Threats', 
      value: '0', 
      change: '-3 this week', 
      icon: AlertTriangle, 
      trend: 'down'
    },
    { 
      title: 'Access Controls', 
      value: '847', 
      change: '+23', 
      icon: Lock, 
      trend: 'up'
    },
    { 
      title: 'Auth Sessions', 
      value: '12,847', 
      change: '+1,284', 
      icon: Key, 
      trend: 'up'
    }
  ];

  const securityEvents = [
    { 
      id: 1, 
      event: 'Failed Login Attempt Blocked',
      severity: 'medium', 
      source: '192.168.1.100',
      time: '5 minutes ago',
      status: 'resolved'
    },
    { 
      id: 2, 
      event: 'SSL Certificate Auto-Renewed',
      severity: 'info', 
      source: 'System',
      time: '2 hours ago',
      status: 'completed'
    },
    { 
      id: 3, 
      event: 'Security Scan Completed',
      severity: 'low', 
      source: 'Security Scanner',
      time: '1 day ago',
      status: 'completed'
    }
  ];

  const securityModules = [
    { name: 'Firewall', status: 'active', health: 100 },
    { name: 'Intrusion Detection', status: 'active', health: 98 },
    { name: 'Access Control', status: 'active', health: 95 },
    { name: 'Encryption', status: 'active', health: 100 },
    { name: 'Audit Logging', status: 'active', health: 92 },
    { name: 'Threat Intelligence', status: 'active', health: 88 }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Security Center</h1>
          <p className="text-gray-600">Comprehensive security monitoring and threat management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Scan className="w-4 h-4 mr-2" />
            Security Scan
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => {
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
                    metric.trend === 'up' && !metric.title.includes('Threats') ? 'text-green-600' :
                    metric.trend === 'down' && metric.title.includes('Threats') ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Events */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <AlertTriangle className="w-5 h-5 text-gray-600" />
              <span>Security Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {securityEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded-full ${
                    event.severity === 'medium' ? 'bg-yellow-100' :
                    event.severity === 'info' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {event.severity === 'medium' ? <AlertTriangle className="w-3 h-3 text-yellow-600" /> :
                     event.severity === 'info' ? <CheckCircle className="w-3 h-3 text-blue-600" /> :
                     <CheckCircle className="w-3 h-3 text-green-600" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{event.event}</h4>
                    <p className="text-sm text-gray-600">{event.source}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      event.status === 'resolved' || event.status === 'completed' ? 'text-green-700 border-green-300' :
                      'text-yellow-700 border-yellow-300'
                    }`}
                  >
                    {event.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Modules */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Shield className="w-5 h-5 text-gray-600" />
              <span>Security Modules</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {securityModules.map((module, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-1 rounded-full bg-green-100">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{module.name}</h4>
                    <p className="text-sm text-gray-600">Health: {module.health}%</p>
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className="text-xs text-green-700 border-green-300"
                >
                  {module.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
