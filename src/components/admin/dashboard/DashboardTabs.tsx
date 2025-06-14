
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Bot, 
  BarChart3, 
  Code2, 
  Settings,
  Key
} from 'lucide-react';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'access', label: 'Access', icon: Shield },
    { id: 'chatbot', label: 'Chatbot', icon: Bot },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'widget', label: 'Widget', icon: Code2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="border-b border-gray-200">
      <TabsList className="h-auto p-0 bg-transparent w-full justify-start space-x-0">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all duration-200
                  border-b-2 border-transparent whitespace-nowrap min-w-fit
                  ${activeTab === tab.id 
                    ? 'text-orange-600 border-orange-500 bg-orange-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
  );
};
