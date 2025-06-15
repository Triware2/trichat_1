
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Database, 
  Workflow, 
  Code, 
  Settings,
  ArrowRight,
  BookOpen,
  Users,
  Activity
} from 'lucide-react';

export const CustomizationOverview = () => {
  const features = [
    {
      title: 'Theme & Branding',
      description: 'Customize colors, fonts, logos, and overall visual identity to match your brand',
      icon: Palette,
      status: 'available',
      color: 'blue',
      items: ['Primary Colors', 'Typography', 'Logo Upload', 'Custom CSS']
    },
    {
      title: 'Custom Fields',
      description: 'Add custom data fields to existing objects and forms for enhanced data collection',
      icon: Database,
      status: 'available',
      color: 'green',
      items: ['Text Fields', 'Dropdowns', 'Date Pickers', 'File Uploads']
    },
    {
      title: 'Workflow Automation',
      description: 'Create automated business processes and rules to streamline operations',
      icon: Workflow,
      status: 'available',
      color: 'purple',
      items: ['Trigger Rules', 'Actions', 'Conditions', 'Notifications']
    },
    {
      title: 'Custom Code',
      description: 'Advanced scripting and custom functionality for complex requirements',
      icon: Code,
      status: 'coming-soon',
      color: 'orange',
      items: ['JavaScript SDK', 'API Hooks', 'Custom Functions', 'Sandbox']
    }
  ];

  const recentCustomizations = [
    { name: 'Updated brand colors', type: 'Theme', time: '2 hours ago', user: 'Admin User', status: 'success' },
    { name: 'Added priority field', type: 'Custom Field', time: '1 day ago', user: 'John Doe', status: 'success' },
    { name: 'Auto-assign workflow', type: 'Workflow', time: '3 days ago', user: 'Jane Smith', status: 'success' },
    { name: 'Logo refresh', type: 'Theme', time: '1 week ago', user: 'Admin User', status: 'success' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="border-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
        <CardContent className="p-8 relative">
          <div className="flex items-center justify-between relative z-10">
            <div className="max-w-2xl">
              <h2 className="text-heading-2 font-semibold mb-3 text-white">
                Welcome to Customization Studio
              </h2>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Transform your platform with enterprise-grade customization tools. 
                Create, configure, and control every aspect of your system with real-time preview and deployment capabilities.
              </p>
              <Button variant="outline" className="bg-white text-blue-600 border-white hover:bg-blue-50 hover:text-blue-700">
                <BookOpen className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-semibold text-white">23</div>
                    <div className="text-sm text-blue-200">Active Customizations</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-white">98%</div>
                    <div className="text-sm text-blue-200">System Performance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-3xl"></div>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`
                      p-3 rounded-lg
                      ${feature.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                      ${feature.color === 'green' ? 'bg-green-50 text-green-600' : ''}
                      ${feature.color === 'purple' ? 'bg-purple-50 text-purple-600' : ''}
                      ${feature.color === 'orange' ? 'bg-orange-50 text-orange-600' : ''}
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</CardTitle>
                      <Badge 
                        variant="outline"
                        className={feature.status === 'available' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }
                      >
                        {feature.status === 'available' ? 'Available' : 'Coming Soon'}
                      </Badge>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {feature.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className={`
                        w-1.5 h-1.5 rounded-full
                        ${feature.color === 'blue' ? 'bg-blue-400' : ''}
                        ${feature.color === 'green' ? 'bg-green-400' : ''}
                        ${feature.color === 'purple' ? 'bg-purple-400' : ''}
                        ${feature.color === 'orange' ? 'bg-orange-400' : ''}
                      `}></div>
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
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="flex items-center gap-3 text-lg">
            <Activity className="w-5 h-5 text-blue-600" />
            Recent Customizations
          </CardTitle>
          <CardDescription className="text-gray-600">
            Latest changes and updates to your platform configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {recentCustomizations.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{item.type}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">by {item.user}</span>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
