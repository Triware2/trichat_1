
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building, 
  Activity, 
  TrendingUp, 
  Plus,
  Settings,
  Shield
} from 'lucide-react';

export const ClientControlCenter = () => {
  const clientMetrics = [
    { 
      title: 'Total Clients', 
      value: '2,847', 
      change: '+18.7%', 
      icon: Users, 
      trend: 'up'
    },
    { 
      title: 'Active Clients', 
      value: '2,634', 
      change: '+24.3%', 
      icon: Activity, 
      trend: 'up'
    },
    { 
      title: 'Enterprise Clients', 
      value: '284', 
      change: '+31.2%', 
      icon: Building, 
      trend: 'up'
    },
    { 
      title: 'Growth Rate', 
      value: '12.5%', 
      change: '+2.1%', 
      icon: TrendingUp, 
      trend: 'up'
    }
  ];

  const recentClients = [
    { 
      id: 1, 
      name: 'TechCorp Industries',
      plan: 'Enterprise', 
      status: 'active',
      joinDate: '2 days ago'
    },
    { 
      id: 2, 
      name: 'Innovation Labs',
      plan: 'Professional', 
      status: 'active',
      joinDate: '1 week ago'
    },
    { 
      id: 3, 
      name: 'Digital Solutions',
      plan: 'Standard', 
      status: 'pending',
      joinDate: '2 weeks ago'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Client Control Center</h1>
          <p className="text-gray-600">Manage and monitor client relationships and accounts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Shield className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {clientMetrics.map((metric, index) => {
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
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">
                    {metric.change} from last month
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Users className="w-5 h-5 text-gray-600" />
              <span>Recent Clients</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentClients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-1 rounded-full bg-blue-100">
                    <Building className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{client.name}</h4>
                    <p className="text-sm text-gray-600">{client.plan} Plan</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      client.status === 'active' ? 'text-green-700 border-green-300' :
                      'text-yellow-700 border-yellow-300'
                    }`}
                  >
                    {client.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{client.joinDate}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Client Management Tools */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Settings className="w-5 h-5 text-gray-600" />
              <span>Management Tools</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Bulk Client Operations
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Activity className="w-4 h-4 mr-2" />
              Usage Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Building className="w-4 h-4 mr-2" />
              Account Management
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Growth Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
