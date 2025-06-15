
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Key, 
  Globe, 
  Activity, 
  Plus,
  Shield,
  Code
} from 'lucide-react';

export const ApiManagementCenter = () => {
  const apiMetrics = [
    { 
      title: 'API Calls (24h)', 
      value: '8.4M', 
      change: '+31.2%', 
      icon: Activity, 
      trend: 'up'
    },
    { 
      title: 'Active Keys', 
      value: '2,847', 
      change: '+187', 
      icon: Key, 
      trend: 'up'
    },
    { 
      title: 'Endpoints', 
      value: '234', 
      change: '+12', 
      icon: Globe, 
      trend: 'up'
    },
    { 
      title: 'Avg Response', 
      value: '23ms', 
      change: '-5ms', 
      icon: Zap, 
      trend: 'down'
    }
  ];

  const apiEndpoints = [
    { 
      id: 1, 
      endpoint: '/api/v1/users',
      method: 'GET', 
      calls: '2.3M',
      status: 'healthy',
      uptime: '99.99%'
    },
    { 
      id: 2, 
      endpoint: '/api/v1/auth',
      method: 'POST', 
      calls: '1.8M',
      status: 'healthy',
      uptime: '100%'
    },
    { 
      id: 3, 
      endpoint: '/api/v1/data',
      method: 'GET', 
      calls: '4.2M',
      status: 'warning',
      uptime: '99.8%'
    }
  ];

  const apiKeys = [
    { 
      id: 1, 
      name: 'Production Key - TechCorp',
      type: 'Production', 
      usage: '847K',
      limit: '1M',
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Development Key - InnoLabs',
      type: 'Development', 
      usage: '234K',
      limit: '500K',
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Staging Key - DigitalCorp',
      type: 'Staging', 
      usage: '12K',
      limit: '100K',
      status: 'active'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">API Management Center</h1>
          <p className="text-gray-600">Monitor and manage API endpoints, keys, and usage</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Code className="w-4 h-4 mr-2" />
            API Docs
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Key
          </Button>
        </div>
      </div>

      {/* API Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {apiMetrics.map((metric, index) => {
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
                    (metric.trend === 'up' && !metric.title.includes('Response')) || 
                    (metric.trend === 'down' && metric.title.includes('Response'))
                      ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {metric.change} from yesterday
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Endpoints */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Globe className="w-5 h-5 text-gray-600" />
              <span>API Endpoints</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {apiEndpoints.map((endpoint) => (
              <div key={endpoint.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded-full ${
                    endpoint.status === 'healthy' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <Activity className={`w-3 h-3 ${
                      endpoint.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{endpoint.endpoint}</h4>
                    <p className="text-sm text-gray-600">{endpoint.method} • {endpoint.calls} calls</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      endpoint.status === 'healthy' ? 'text-green-700 border-green-300' :
                      'text-yellow-700 border-yellow-300'
                    }`}
                  >
                    {endpoint.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{endpoint.uptime} uptime</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Key className="w-5 h-5 text-gray-600" />
              <span>API Keys</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {apiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-1 rounded-full bg-blue-100">
                    <Key className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{key.name}</h4>
                    <p className="text-sm text-gray-600">{key.type} • {key.usage}/{key.limit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline"
                    className="text-xs text-green-700 border-green-300"
                  >
                    {key.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="mt-1">
                    <Shield className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
