
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Bot, 
  BarChart3, 
  Code2, 
  Settings,
  Key,
  Database,
  MessageSquare,
  Clock
} from 'lucide-react';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'access', label: 'Access control', icon: Shield },
    { id: 'chatbot', label: 'AI Assistant', icon: Bot },
    { id: 'api-keys', label: 'API keys', icon: Key },
    { id: 'sla', label: 'SLA Management', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'widget', label: 'Integrations', icon: Code2 },
    { id: 'datasources', label: 'Data Sources', icon: Database },
    { id: 'chat-management', label: 'Chat Management', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6">
        <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
          <div className="flex space-x-0 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                    border-b-2 border-transparent whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                      : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </div>
        </TabsList>
      </div>
    </div>
  );
};
