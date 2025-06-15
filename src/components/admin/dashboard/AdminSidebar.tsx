
import { useState } from 'react';
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
  Palette,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
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
    <div className={cn(
      "bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="font-semibold text-gray-800">Navigation</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Scrollable Navigation Items */}
      <ScrollArea className="flex-1">
        <div className="py-4">
          <nav className="space-y-1 px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors",
                    isActive 
                      ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-blue-600" : "text-gray-500")} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium truncate">{tab.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
};
