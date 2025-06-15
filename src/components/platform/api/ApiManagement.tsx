
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Key, 
  Activity, 
  Plus,
  Eye,
  Copy,
  Trash2,
  BarChart3
} from 'lucide-react';

export const ApiManagement = () => {
  const apiKeys = [
    { id: 1, name: 'Production API', key: 'pk_live_1234...', usage: '85%', status: 'active', lastUsed: '2 hours ago' },
    { id: 2, name: 'Development API', key: 'pk_dev_5678...', usage: '45%', status: 'active', lastUsed: '1 day ago' },
    { id: 3, name: 'Testing API', key: 'pk_test_9012...', usage: '12%', status: 'inactive', lastUsed: '1 week ago' }
  ];

  const endpoints = [
    { name: '/api/clients', method: 'GET', calls: '145K', avgResponse: '120ms', status: 'healthy' },
    { name: '/api/usage', method: 'POST', calls: '89K', avgResponse: '95ms', status: 'healthy' },
    { name: '/api/billing', method: 'GET', calls: '67K', avgResponse: '180ms', status: 'warning' },
    { name: '/api/analytics', method: 'GET', calls: '34K', avgResponse: '250ms', status: 'healthy' }
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Management</h1>
          <p className="text-gray-600 mt-1">Manage API keys, endpoints, and integrations</p>
        </div>
        <Button className="bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* API Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-green-600">+23% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Key className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-600">2 inactive keys</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142ms</div>
            <p className="text-xs text-green-600">-5ms improved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Settings className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <p className="text-xs text-green-600">+0.1% improvement</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{key.name}</h3>
                  <p className="text-sm text-gray-600 font-mono">{key.key}</p>
                  <p className="text-xs text-gray-500">Usage: {key.usage} • Last used: {key.lastUsed}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={key.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {key.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">{endpoint.method}</Badge>
                    <code className="text-sm">{endpoint.name}</code>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {endpoint.calls} calls • Avg: {endpoint.avgResponse}
                  </p>
                </div>
                <Badge className={
                  endpoint.status === 'healthy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }>
                  {endpoint.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
