
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
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
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

  const itemsPerPage = 8;
  const totalPages = Math.ceil(tabs.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleTabs = tabs.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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

      {/* Navigation Items */}
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {visibleTabs.map((tab) => {
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

      {/* Pagination Controls */}
      {totalPages > 1 && !isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="h-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-gray-500">
              {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="h-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Collapsed Pagination */}
      {totalPages > 1 && isCollapsed && (
        <div className="p-2 border-t border-gray-200 flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
