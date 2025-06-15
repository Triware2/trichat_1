
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
  Database,
  UserCog,
  Wrench,
  Palette
} from 'lucide-react';

interface PlatformControlSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export const PlatformControlSidebar = ({ activeModule, onModuleChange }: PlatformControlSidebarProps) => {
  const modules = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: LayoutDashboard,
      alerts: 0
    },
    { 
      id: 'clients', 
      label: 'Clients', 
      icon: Users,
      alerts: 3
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: UserCog,
      alerts: 0
    },
    { 
      id: 'customization', 
      label: 'Customization', 
      icon: Palette,
      alerts: 0
    },
    { 
      id: 'system-settings', 
      label: 'Settings', 
      icon: Wrench,
      alerts: 0
    },
    { 
      id: 'revenue', 
      label: 'Revenue', 
      icon: DollarSign,
      alerts: 1
    },
    { 
      id: 'health', 
      label: 'Health', 
      icon: Activity,
      alerts: 0
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: Shield,
      alerts: 0
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3,
      alerts: 0
    },
    { 
      id: 'api', 
      label: 'API', 
      icon: Database,
      alerts: 0
    },
    { 
      id: 'automation', 
      label: 'Automation', 
      icon: Bot,
      alerts: 0
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Platform Control</h2>
        <p className="text-sm text-gray-600 mt-1">Enterprise Management</p>
      </div>

      {/* Status */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-700 font-medium">System Online</span>
          <span className="text-gray-500">99.98%</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        {modules.map((module) => {
          const IconComponent = module.icon;
          const isActive = activeModule === module.id;
          
          return (
            <Button
              key={module.id}
              variant="ghost"
              onClick={() => onModuleChange(module.id)}
              className={`w-full justify-start h-10 px-4 mx-2 mb-1 transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-50 border-r-2 border-blue-600' 
                  : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{module.label}</span>
                </div>
                {module.alerts > 0 && (
                  <Badge variant="destructive" className="bg-red-500 text-white text-xs h-5 px-1.5">
                    {module.alerts}
                  </Badge>
                )}
              </div>
            </Button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          <div>Platform v2.1.0</div>
          <div className="mt-1">Enterprise Edition</div>
        </div>
      </div>
    </div>
  );
};
