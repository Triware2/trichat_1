
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Database, 
  Workflow, 
  Code, 
  Zap, 
  Settings,
  ArrowRight,
  Sparkles,
  Users,
  Shield
} from 'lucide-react';

export const CustomizationOverview = () => {
  const features = [
    {
      title: 'Theme & Branding',
      description: 'Customize colors, fonts, logos, and overall visual identity',
      icon: Palette,
      status: 'active',
      color: 'purple',
      items: ['Primary Colors', 'Typography', 'Logo Upload', 'Custom CSS']
    },
    {
      title: 'Custom Fields',
      description: 'Add custom data fields to existing objects and forms',
      icon: Database,
      status: 'active',
      color: 'blue',
      items: ['Text Fields', 'Dropdowns', 'Date Pickers', 'File Uploads']
    },
    {
      title: 'Workflow Automation',
      description: 'Create automated business processes and rules',
      icon: Workflow,
      status: 'active',
      color: 'green',
      items: ['Trigger Rules', 'Actions', 'Conditions', 'Notifications']
    },
    {
      title: 'Custom Code',
      description: 'Advanced scripting and custom functionality',
      icon: Code,
      status: 'coming-soon',
      color: 'orange',
      items: ['JavaScript SDK', 'API Hooks', 'Custom Functions', 'Sandbox']
    }
  ];

  const recentCustomizations = [
    { name: 'Updated brand colors', type: 'Theme', time: '2 hours ago', user: 'Admin User' },
    { name: 'Added priority field', type: 'Custom Field', time: '1 day ago', user: 'John Doe' },
    { name: 'Auto-assign workflow', type: 'Workflow', time: '3 days ago', user: 'Jane Smith' },
    { name: 'Logo refresh', type: 'Theme', time: '1 week ago', user: 'Admin User' }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                Welcome to Customization Studio
              </h2>
              <p className="text-purple-100 mb-4">
                Transform your platform with enterprise-grade customization tools. 
                Create, configure, and control every aspect of your system.
              </p>
              <Button variant="outline" className="text-purple-600 bg-white hover:bg-purple-50">
                <Code className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-sm text-purple-200">Active Customizations</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm text-purple-200">System Performance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${feature.color}-100`}>
                      <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <Badge 
                        variant={feature.status === 'active' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {feature.status === 'active' ? 'Available' : 'Coming Soon'}
                      </Badge>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {feature.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full bg-${feature.color}-400`}></div>
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Recent Customizations
          </CardTitle>
          <CardDescription>
            Latest changes and updates to your platform configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCustomizations.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Settings className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.type} • {item.time}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  by {item.user}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
