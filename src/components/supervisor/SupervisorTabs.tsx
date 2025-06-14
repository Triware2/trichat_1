
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Eye, 
  Users, 
  MessageSquare, 
  BarChart3
} from 'lucide-react';

interface SupervisorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SupervisorTabs = ({ activeTab, onTabChange }: SupervisorTabsProps) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'chats', label: 'Chat Supervision', icon: Eye },
    { id: 'team', label: 'Team Monitor', icon: Users },
    { id: 'queue', label: 'Queue Management', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="-mb-px">
        <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
          <div className="flex space-x-0">
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
