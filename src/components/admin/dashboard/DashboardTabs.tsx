
import { 
  BarChart3, 
  Users, 
  Shield, 
  Settings, 
  MessageSquare, 
  Bot, 
  Key, 
  Database,
  UserCheck,
  Star,
  TrendingUp
} from 'lucide-react';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'access', label: 'Access Control', icon: Shield },
    { id: 'chatbot', label: 'Chatbot', icon: Bot },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'sla', label: 'SLA Management', icon: TrendingUp },
    { id: 'csat', label: 'CSAT & Feedback', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'widget', label: 'Widget', icon: MessageSquare },
    { id: 'datasources', label: 'Data Sources', icon: Database },
    { id: 'chat-management', label: 'Chat Management', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6">
        <nav className="flex space-x-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                border-b-2 border-transparent whitespace-nowrap min-w-0
                ${activeTab === tab.id 
                  ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                  : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
