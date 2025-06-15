
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard,
  Users,
  DollarSign,
  Shield,
  BarChart3,
  Zap,
  Settings,
  Activity,
  Bot,
  Gauge,
  TrendingUp,
  Database,
  Lock,
  Palette,
  UserCog,
  Wrench
} from 'lucide-react';

interface PlatformControlSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export const PlatformControlSidebar = ({ activeModule, onModuleChange }: PlatformControlSidebarProps) => {
  const modules = [
    { 
      id: 'overview', 
      label: 'System Overview', 
      icon: LayoutDashboard,
      description: 'Real-time platform status',
      alerts: 0
    },
    { 
      id: 'clients', 
      label: 'Client Control Center', 
      icon: Users,
      description: 'Complete client management',
      alerts: 3
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: UserCog,
      description: 'Platform-wide user control',
      alerts: 0
    },
    { 
      id: 'customization', 
      label: 'Global Customization', 
      icon: Palette,
      description: 'Platform-wide theming',
      alerts: 0
    },
    { 
      id: 'system-settings', 
      label: 'System Configuration', 
      icon: Wrench,
      description: 'Advanced system settings',
      alerts: 0
    },
    { 
      id: 'revenue', 
      label: 'Revenue Engine', 
      icon: DollarSign,
      description: 'Dynamic pricing & billing',
      alerts: 1
    },
    { 
      id: 'health', 
      label: 'System Health', 
      icon: Activity,
      description: 'Performance monitoring',
      alerts: 0
    },
    { 
      id: 'security', 
      label: 'Security Center', 
      icon: Shield,
      description: 'Access control & audit',
      alerts: 0
    },
    { 
      id: 'analytics', 
      label: 'Analytics Engine', 
      icon: BarChart3,
      description: 'Advanced insights & reports',
      alerts: 0
    },
    { 
      id: 'api', 
      label: 'API Management', 
      icon: Database,
      description: 'Integration & automation',
      alerts: 0
    },
    { 
      id: 'automation', 
      label: 'Automation Hub', 
      icon: Bot,
      description: 'Workflow automation',
      alerts: 0
    }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <div className="p-6 border-b border-indigo-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
            <Gauge className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Control Center</h2>
            <p className="text-xs text-gray-600">Enterprise Platform Management</p>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="p-6 border-b border-indigo-200">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-100 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-800">System Online</span>
            </div>
            <div className="text-lg font-bold text-green-900 mt-1">99.98%</div>
          </div>
          <div className="bg-blue-100 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-800">Performance</span>
            </div>
            <div className="text-lg font-bold text-blue-900 mt-1">Optimal</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {modules.map((module) => {
          const IconComponent = module.icon;
          const isActive = activeModule === module.id;
          
          return (
            <Button
              key={module.id}
              variant={isActive ? "default" : "ghost"}
              onClick={() => onModuleChange(module.id)}
              className={`w-full justify-start h-auto p-4 transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105' 
                  : 'hover:bg-white/60 hover:shadow-md text-gray-700 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                  <div className="text-left">
                    <div className="font-semibold text-sm">{module.label}</div>
                    <div className={`text-xs ${isActive ? 'text-indigo-100' : 'text-gray-500'}`}>
                      {module.description}
                    </div>
                  </div>
                </div>
                {module.alerts > 0 && (
                  <Badge variant="destructive" className="bg-red-500 text-white text-xs">
                    {module.alerts}
                  </Badge>
                )}
              </div>
            </Button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-indigo-200">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-2">Platform Version</div>
          <div className="text-sm font-semibold text-gray-700">v2.1.0 Enterprise</div>
        </div>
      </div>
    </div>
  );
};
