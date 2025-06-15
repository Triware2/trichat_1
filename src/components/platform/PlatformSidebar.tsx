
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  BarChart3, 
  TrendingUp, 
  Shield, 
  Settings, 
  Server, 
  MessageSquare
} from 'lucide-react';

interface PlatformSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export const PlatformSidebar = ({ activeModule, onModuleChange }: PlatformSidebarProps) => {
  const modules = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, color: 'from-purple-400 to-violet-500' },
    { id: 'clients', label: 'Client Management', icon: Users, color: 'from-blue-400 to-blue-600' },
    { id: 'pricing', label: 'Pricing Control', icon: DollarSign, color: 'from-green-400 to-emerald-600' },
    { id: 'usage', label: 'Usage Monitoring', icon: BarChart3, color: 'from-purple-400 to-purple-600' },
    { id: 'analytics', label: 'Analytics & Reports', icon: TrendingUp, color: 'from-pink-400 to-rose-600' },
    { id: 'security', label: 'Security', icon: Shield, color: 'from-red-400 to-red-600' },
    { id: 'api', label: 'API Management', icon: Settings, color: 'from-indigo-400 to-indigo-600' },
    { id: 'system', label: 'System Health', icon: Server, color: 'from-teal-400 to-cyan-600' },
    { id: 'support', label: 'Support Hub', icon: MessageSquare, color: 'from-violet-400 to-violet-600' }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-purple-400 to-violet-500 rounded-lg">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">T</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Platform Dashboard</h2>
            <p className="text-sm text-gray-600">Management Center</p>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-purple-400 to-violet-500 text-white border-0">
          Platform Access
        </Badge>
      </div>
      
      <nav className="p-4 space-y-2">
        {modules.map((module) => {
          const IconComponent = module.icon;
          const isActive = activeModule === module.id;
          
          return (
            <Button
              key={module.id}
              variant="ghost"
              className={`w-full justify-start h-auto p-4 text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-gray-100 text-gray-900 shadow-sm border border-gray-200' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => onModuleChange(module.id)}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${module.color} ${isActive ? 'shadow-md' : ''}`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{module.label}</div>
                  <div className="text-xs text-gray-500">
                    {module.id === 'dashboard' && 'Real-time insights'}
                    {module.id === 'clients' && 'Manage all clients'}
                    {module.id === 'pricing' && 'Revenue optimization'}
                    {module.id === 'usage' && 'Monitor consumption'}
                    {module.id === 'analytics' && 'Data intelligence'}
                    {module.id === 'security' && 'Access control'}
                    {module.id === 'api' && 'Integration hub'}
                    {module.id === 'system' && 'Platform status'}
                    {module.id === 'support' && 'Customer care'}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </nav>
    </div>
  );
};
