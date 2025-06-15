
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Bot, 
  Key, 
  Target, 
  Heart, 
  BarChart3, 
  Code, 
  Database, 
  MessageSquare, 
  Settings,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Primary navigation items (always visible)
  const primaryTabs = [
    { value: 'overview', label: 'Overview', icon: LayoutDashboard },
    { value: 'users', label: 'Users', icon: Users },
    { value: 'analytics', label: 'Analytics', icon: BarChart3 },
    { value: 'settings', label: 'Settings', icon: Settings }
  ];

  // Secondary navigation items (in dropdown)
  const secondaryTabs = [
    { 
      category: 'Security & Access',
      items: [
        { value: 'access', label: 'Access Management', icon: Shield },
        { value: 'api-keys', label: 'API Keys', icon: Key }
      ]
    },
    { 
      category: 'AI & Automation',
      items: [
        { value: 'chatbot', label: 'Bot Training', icon: Bot },
        { value: 'sla', label: 'SLA Management', icon: Target }
      ]
    },
    { 
      category: 'Quality & Data',
      items: [
        { value: 'csat', label: 'CSAT Management', icon: Heart },
        { value: 'datasources', label: 'Data Sources', icon: Database }
      ]
    },
    { 
      category: 'Integration & Tools',
      items: [
        { value: 'widget', label: 'Chat Widget', icon: Code },
        { value: 'chat-management', label: 'Chat Management', icon: MessageSquare }
      ]
    }
  ];

  const getActiveSecondaryTab = () => {
    for (const category of secondaryTabs) {
      const activeItem = category.items.find(item => item.value === activeTab);
      if (activeItem) return activeItem;
    }
    return null;
  };

  const activeSecondaryTab = getActiveSecondaryTab();
  const isSecondaryTabActive = !!activeSecondaryTab;

  return (
    <div className="bg-white border-b border-gray-200/80 sticky top-16 z-40">
      <div className="px-6">
        <div className="flex items-center justify-between">
          {/* Primary Navigation */}
          <TabsList className="h-14 bg-transparent p-0 space-x-1">
            {primaryTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`
                  relative h-12 px-6 py-0 text-sm font-medium rounded-none border-b-2 border-transparent
                  transition-all duration-200 hover:bg-blue-50/50 hover:text-blue-700
                  data-[state=active]:bg-transparent data-[state=active]:text-blue-600 
                  data-[state=active]:border-blue-600 data-[state=active]:shadow-none
                  flex items-center space-x-2
                `}
                onClick={() => onTabChange(tab.value)}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Secondary Navigation Dropdown */}
          <DropdownMenu open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`
                  h-12 px-4 text-sm font-medium rounded-lg border transition-all duration-200
                  ${isSecondaryTabActive 
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' 
                    : 'bg-gray-50/50 text-gray-600 border-gray-200 hover:bg-blue-50/50 hover:text-blue-700 hover:border-blue-200'
                  }
                  flex items-center space-x-2
                `}
              >
                {isSecondaryTabActive ? (
                  <>
                    <activeSecondaryTab.icon className="w-4 h-4" />
                    <span>{activeSecondaryTab.label}</span>
                    <Badge variant="secondary" className="ml-1 text-xs bg-blue-100 text-blue-700">
                      Active
                    </Badge>
                  </>
                ) : (
                  <>
                    <span>More Tools</span>
                  </>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              align="end" 
              className="w-72 bg-white border border-gray-200 shadow-xl rounded-xl p-2"
            >
              {secondaryTabs.map((category, categoryIndex) => (
                <div key={category.category}>
                  <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                    {category.category}
                  </DropdownMenuLabel>
                  {category.items.map((item) => (
                    <DropdownMenuItem
                      key={item.value}
                      onClick={() => {
                        onTabChange(item.value);
                        setIsMoreMenuOpen(false);
                      }}
                      className={`
                        flex items-center space-x-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200
                        ${activeTab === item.value 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-gray-50 text-gray-700'
                        }
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200
                        ${activeTab === item.value 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                        }
                      `}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.label}</div>
                      </div>
                      {activeTab === item.value && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          Active
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                  {categoryIndex < secondaryTabs.length - 1 && (
                    <DropdownMenuSeparator className="my-2" />
                  )}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
