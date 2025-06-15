
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Shield, 
  Database, 
  Server, 
  Plus,
  Activity,
  Lock
} from 'lucide-react';

export const AdvancedSystemSettings = () => {
  const settingsMetrics = [
    { 
      title: 'Active Configs', 
      value: '1,247', 
      change: '+89', 
      icon: Settings, 
      trend: 'up'
    },
    { 
      title: 'Security Rules', 
      value: '342', 
      change: '+23', 
      icon: Shield, 
      trend: 'up'
    },
    { 
      title: 'Database Pools', 
      value: '12', 
      change: '+2', 
      icon: Database, 
      trend: 'up'
    },
    { 
      title: 'Server Instances', 
      value: '28', 
      change: '+4', 
      icon: Server, 
      trend: 'up'
    }
  ];

  const systemComponents = [
    { 
      id: 1, 
      name: 'Authentication Service',
      status: 'healthy', 
      uptime: '99.99%',
      lastUpdate: '2 hours ago'
    },
    { 
      id: 2, 
      name: 'Database Cluster',
      status: 'optimal', 
      uptime: '100%',
      lastUpdate: '1 day ago'
    },
    { 
      id: 3, 
      name: 'Cache Layer',
      status: 'warning', 
      uptime: '99.8%',
      lastUpdate: '30 minutes ago'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Advanced System Settings</h1>
          <p className="text-gray-600">Core system configuration and infrastructure management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Lock className="w-4 h-4 mr-2" />
            Backup Config
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Setting
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {settingsMetrics.map((metric, index) => {
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
                  <span className="text-xs text-green-600">+{metric.change} this month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Components */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Server className="w-5 h-5 text-gray-600" />
              <span>System Components</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemComponents.map((component) => (
              <div key={component.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded-full ${
                    component.status === 'healthy' || component.status === 'optimal' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <Activity className={`w-3 h-3 ${
                      component.status === 'healthy' || component.status === 'optimal' ? 'text-green-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{component.name}</h4>
                    <p className="text-sm text-gray-600">Uptime: {component.uptime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      component.status === 'healthy' || component.status === 'optimal' ? 'text-green-700 border-green-300' :
                      'text-yellow-700 border-yellow-300'
                    }`}
                  >
                    {component.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{component.lastUpdate}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Settings Categories */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Settings className="w-5 h-5 text-gray-600" />
              <span>Configuration Areas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Security Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Database className="w-4 h-4 mr-2" />
              Database Configuration
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Server className="w-4 h-4 mr-2" />
              Infrastructure Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Activity className="w-4 h-4 mr-2" />
              Performance Tuning
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
