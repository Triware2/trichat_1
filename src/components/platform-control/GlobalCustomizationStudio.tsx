
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Code, 
  Settings, 
  Workflow, 
  Plus,
  Shield,
  Database
} from 'lucide-react';

export const GlobalCustomizationStudio = () => {
  const customizationMetrics = [
    { 
      title: 'Active Themes', 
      value: '12', 
      change: '+3', 
      icon: Palette, 
      trend: 'up'
    },
    { 
      title: 'Custom Scripts', 
      value: '847', 
      change: '+127', 
      icon: Code, 
      trend: 'up'
    },
    { 
      title: 'Workflows', 
      value: '234', 
      change: '+45', 
      icon: Workflow, 
      trend: 'up'
    },
    { 
      title: 'Configurations', 
      value: '1,284', 
      change: '+298', 
      icon: Settings, 
      trend: 'up'
    }
  ];

  const recentCustomizations = [
    { 
      id: 1, 
      name: 'Brand Color Update',
      type: 'Theme', 
      status: 'deployed',
      time: '2 hours ago'
    },
    { 
      id: 2, 
      name: 'Auto-Assignment Workflow',
      type: 'Workflow', 
      status: 'testing',
      time: '1 day ago'
    },
    { 
      id: 3, 
      name: 'Custom Validation Script',
      type: 'Code', 
      status: 'active',
      time: '3 days ago'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Global Customization Studio</h1>
          <p className="text-gray-600">Platform-wide theming, scripting, and configuration management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Shield className="w-4 h-4 mr-2" />
            Deploy All
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Custom
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {customizationMetrics.map((metric, index) => {
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
        {/* Recent Customizations */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Settings className="w-5 h-5 text-gray-600" />
              <span>Recent Changes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCustomizations.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-1 rounded-full bg-purple-100">
                    <Code className="w-3 h-3 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      item.status === 'deployed' ? 'text-green-700 border-green-300' :
                      item.status === 'testing' ? 'text-yellow-700 border-yellow-300' :
                      'text-blue-700 border-blue-300'
                    }`}
                  >
                    {item.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Customization Tools */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Palette className="w-5 h-5 text-gray-600" />
              <span>Studio Tools</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Palette className="w-4 h-4 mr-2" />
              Theme Builder
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Code className="w-4 h-4 mr-2" />
              Script Editor
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Workflow className="w-4 h-4 mr-2" />
              Workflow Designer
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Database className="w-4 h-4 mr-2" />
              Field Manager
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
