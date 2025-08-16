
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Shield, 
  Bot, 
  Key, 
  Clock, 
  Star, 
  MessageSquare, 
  Settings,
  Database,
  Palette
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: any;
}

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
    { id: 'sla', label: 'SLA', icon: Clock },
    { id: 'csat', label: 'CSAT', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'widget', label: 'Widget', icon: MessageSquare },
    { id: 'datasources', label: 'Data Sources', icon: Database },
    { id: 'chat-management', label: 'Chat Management', icon: MessageSquare },
    { id: 'customization', label: 'Customization', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="border-b border-slate-200 bg-white px-6">
      <TabsList className="grid grid-cols-13 w-full bg-transparent gap-0 h-auto p-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent hover:text-slate-900 hover:border-slate-300 transition-all rounded-none"
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </div>
  );
};
