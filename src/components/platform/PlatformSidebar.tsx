
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Activity, 
  BarChart3, 
  Shield, 
  Settings, 
  Server, 
  MessageSquare,
  Bell,
  Search
} from 'lucide-react';

interface PlatformSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export const PlatformSidebar = ({ activeModule, onModuleChange }: PlatformSidebarProps) => {
  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, color: 'blue', alerts: 0 },
    { id: 'clients', name: 'Client Management', icon: Users, color: 'green', alerts: 3 },
    { id: 'pricing', name: 'Pricing & Billing', icon: DollarSign, color: 'yellow', alerts: 1 },
    { id: 'usage', name: 'Usage Monitoring', icon: Activity, color: 'purple', alerts: 5 },
    { id: 'analytics', name: 'Analytics & Reports', icon: BarChart3, color: 'indigo', alerts: 0 },
    { id: 'security', name: 'Security & Access', icon: Shield, color: 'red', alerts: 2 },
    { id: 'api', name: 'API Management', icon: Settings, color: 'teal', alerts: 0 },
    { id: 'system', name: 'System Health', icon: Server, color: 'orange', alerts: 1 },
    { id: 'support', name: 'Support Management', icon: MessageSquare, color: 'cyan', alerts: 8 }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search modules..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* System Status */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-800">System Status</p>
            <p className="text-xs text-green-600">All systems operational</p>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </Card>

      {/* Modules Navigation */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Management Modules</h3>
        {modules.map((module) => {
          const IconComponent = module.icon;
          const isActive = activeModule === module.id;
          
          return (
            <Button
              key={module.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-between h-12 px-4 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
              onClick={() => onModuleChange(module.id)}
            >
              <div className="flex items-center space-x-3">
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{module.name}</span>
              </div>
              {module.alerts > 0 && (
                <Badge 
                  variant="destructive" 
                  className="bg-red-500 text-white text-xs px-2 py-0.5"
                >
                  {module.alerts}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <Button size="sm" variant="outline" className="w-full justify-start border-blue-200 text-blue-700">
            <Bell className="w-4 h-4 mr-2" />
            View All Alerts
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start border-blue-200 text-blue-700">
            <Users className="w-4 h-4 mr-2" />
            Add New Client
          </Button>
        </div>
      </Card>
    </div>
  );
};
