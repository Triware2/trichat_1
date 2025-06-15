
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  Key, 
  Activity, 
  Globe, 
  Shield,
  Zap,
  Plus,
  Edit,
  Copy,
  Eye,
  Settings,
  Code,
  Link,
  Clock
} from 'lucide-react';

export const ApiManagementCenter = () => {
  const apiMetrics = [
    { title: 'Total API Calls', value: '12.4M', change: '+28.7%', icon: Activity, color: 'from-blue-400 to-blue-600' },
    { title: 'Active API Keys', value: '1,247', change: '+15.2%', icon: Key, color: 'from-purple-400 to-purple-600' },
    { title: 'Success Rate', value: '99.94%', change: '+0.08%', icon: Shield, color: 'from-green-400 to-green-600' },
    { title: 'Avg Response Time', value: '145ms', change: '-23ms', icon: Zap, color: 'from-orange-400 to-orange-600' },
    { title: 'Endpoints Active', value: '847', change: '+23', icon: Globe, color: 'from-indigo-400 to-indigo-600' },
    { title: 'Rate Limit Hits', value: '0.02%', change: '-87%', icon: Clock, color: 'from-red-400 to-red-600' }
  ];

  const apiKeys = [
    {
      id: 'ak_1x2y3z4a5b6c',
      name: 'Enterprise Corp - Production',
      client: 'TechCorp Industries',
      permissions: ['read', 'write', 'admin'],
      usage: '2.4M calls/month',
      rateLimit: '10K/hour',
      status: 'active',
      created: '2024-01-15',
      lastUsed: '2 min ago'
    },
    {
      id: 'ak_7h8i9j0k1l2m',
      name: 'Innovate Solutions - Staging',
      client: 'Innovate Solutions',
      permissions: ['read', 'write'],
      usage: '890K calls/month',
      rateLimit: '5K/hour',
      status: 'active',
      created: '2024-02-20',
      lastUsed: '1 hour ago'
    },
    {
      id: 'ak_3n4o5p6q7r8s',
      name: 'StartupCo - Development',
      client: 'StartupCo',
      permissions: ['read'],
      usage: '45K calls/month',
      rateLimit: '1K/hour',
      status: 'suspended',
      created: '2024-06-10',
      lastUsed: '3 days ago'
    }
  ];

  const apiEndpoints = [
    { endpoint: '/api/v1/users', method: 'GET', calls: '2.1M', success: '99.98%', avg: '89ms' },
    { endpoint: '/api/v1/chats', method: 'POST', calls: '1.8M', success: '99.95%', avg: '156ms' },
    { endpoint: '/api/v1/messages', method: 'POST', calls: '3.2M', success: '99.99%', avg: '67ms' },
    { endpoint: '/api/v1/analytics', method: 'GET', calls: '567K', success: '99.92%', avg: '234ms' },
    { endpoint: '/api/v1/webhooks', method: 'POST', calls: '234K', success: '99.87%', avg: '123ms' }
  ];

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'write': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'read': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50/30 to-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">API Management Center</h1>
          </div>
          <p className="text-gray-600 ml-12">Comprehensive API control and integration management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="border-gray-300">
            <Code className="w-4 h-4 mr-2" />
            API Docs
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Generate API Key
          </Button>
        </div>
      </div>

      {/* API Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiMetrics.map((metric, index) => {
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
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <p className={`text-sm font-medium ${
                  metric.change.startsWith('+') && !metric.title.includes('Rate Limit') ? 'text-green-600' : 
                  metric.change.startsWith('-') && (metric.title.includes('Response Time') || metric.title.includes('Rate Limit')) ? 'text-green-600' :
                  metric.change.startsWith('-') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Keys Management */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900">
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-purple-600" />
                <span>API Keys Management</span>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                {apiKeys.length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{key.name}</h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                      <span>Client: {key.client}</span>
                      <span>•</span>
                      <span>Created: {key.created}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      {key.permissions.map((permission, index) => (
                        <Badge 
                          key={index}
                          variant="outline"
                          className={`text-xs ${getPermissionColor(permission)}`}
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge className={key.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}>
                    {key.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-3">
                  <div>Usage: {key.usage}</div>
                  <div>Rate Limit: {key.rateLimit}</div>
                  <div>Last Used: {key.lastUsed}</div>
                  <div>Key ID: {key.id.substring(0, 12)}...</div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="bg-white/60">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/60">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/60">
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* API Endpoints Performance */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Endpoint Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiEndpoints.map((endpoint, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        endpoint.method === 'POST' ? 'bg-green-100 text-green-700 border-green-200' :
                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}
                    >
                      {endpoint.method}
                    </Badge>
                    <span className="font-mono text-sm text-gray-900">{endpoint.endpoint}</span>
                  </div>
                  <Badge 
                    variant="outline"
                    className="text-xs bg-green-100 text-green-700 border-green-200"
                  >
                    {endpoint.success} success
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div>Calls: {endpoint.calls}</div>
                  <div>Avg Response: {endpoint.avg}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* API Tools */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">API Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Code className="w-8 h-8 mb-2 text-blue-600" />
              <span className="font-semibold">API Documentation</span>
              <span className="text-xs text-gray-500">Interactive docs</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Shield className="w-8 h-8 mb-2 text-green-600" />
              <span className="font-semibold">Rate Limiting</span>
              <span className="text-xs text-gray-500">Control usage</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Link className="w-8 h-8 mb-2 text-purple-600" />
              <span className="font-semibold">Webhooks</span>
              <span className="text-xs text-gray-500">Event notifications</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col bg-white/60 hover:shadow-lg transition-all">
              <Settings className="w-8 h-8 mb-2 text-orange-600" />
              <span className="font-semibold">API Settings</span>
              <span className="text-xs text-gray-500">Configuration</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
