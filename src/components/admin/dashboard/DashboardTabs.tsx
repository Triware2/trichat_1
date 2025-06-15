
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
  ChevronDown,
  Grid3x3
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

  // Core navigation items (always visible)
  const coreNavigation = [
    { value: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'text-blue-600' },
    { value: 'users', label: 'Users', icon: Users, color: 'text-green-600' },
    { value: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-purple-600' }
  ];

  // Advanced features organized by category
  const advancedFeatures = [
    { 
      category: 'Security & Access',
      icon: Shield,
      color: 'text-red-600',
      items: [
        { value: 'access', label: 'Access Control', icon: Shield, description: 'Manage user permissions and roles' },
        { value: 'api-keys', label: 'API Management', icon: Key, description: 'Generate and manage API keys' }
      ]
    },
    { 
      category: 'AI & Automation',
      icon: Bot,
      color: 'text-indigo-600',
      items: [
        { value: 'chatbot', label: 'Bot Training', icon: Bot, description: 'Configure AI chatbot responses' },
        { value: 'sla', label: 'SLA Monitoring', icon: Target, description: 'Service level agreement tracking' }
      ]
    },
    { 
      category: 'Customer Experience',
      icon: Heart,
      color: 'text-pink-600',
      items: [
        { value: 'csat', label: 'CSAT Analytics', icon: Heart, description: 'Customer satisfaction metrics' },
        { value: 'chat-management', label: 'Chat Operations', icon: MessageSquare, description: 'Manage chat workflows' }
      ]
    },
    { 
      category: 'Integration & Data',
      icon: Database,
      color: 'text-cyan-600',
      items: [
        { value: 'datasources', label: 'Data Sources', icon: Database, description: 'Connect external data sources' },
        { value: 'widget', label: 'Widget Builder', icon: Code, description: 'Customize chat widget appearance' }
      ]
    }
  ];

  const getActiveAdvancedFeature = () => {
    for (const category of advancedFeatures) {
      const activeItem = category.items.find(item => item.value === activeTab);
      if (activeItem) return { item: activeItem, category };
    }
    return null;
  };

  const activeAdvanced = getActiveAdvancedFeature();
  const isAdvancedTabActive = !!activeAdvanced;

  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-16 z-40 shadow-sm">
      <div className="px-8 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          
          {/* Core Navigation */}
          <div className="flex items-center">
            <TabsList className="h-12 bg-gray-50/80 p-1 rounded-lg border border-gray-200/50">
              {coreNavigation.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`
                    relative h-10 px-6 py-0 text-sm font-medium rounded-md
                    transition-all duration-300 ease-out
                    data-[state=active]:bg-white data-[state=active]:text-gray-900 
                    data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200
                    hover:bg-white/60 hover:text-gray-800
                    flex items-center space-x-2.5 group
                  `}
                  onClick={() => onTabChange(tab.value)}
                >
                  <tab.icon className={`w-4 h-4 transition-colors duration-200 ${
                    activeTab === tab.value ? tab.color : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  <span>{tab.label}</span>
                  {activeTab === tab.value && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Advanced Features & Settings */}
          <div className="flex items-center space-x-3">
            
            {/* Advanced Features Dropdown */}
            <DropdownMenu open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`
                    h-10 px-4 text-sm font-medium rounded-md border-gray-200 
                    transition-all duration-200 ease-out
                    ${isAdvancedTabActive 
                      ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' 
                      : 'bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700'
                    }
                    flex items-center space-x-2.5
                  `}
                >
                  {isAdvancedTabActive ? (
                    <>
                      <activeAdvanced.item.icon className="w-4 h-4" />
                      <span>{activeAdvanced.item.label}</span>
                      <Badge variant="secondary" className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5">
                        Active
                      </Badge>
                    </>
                  ) : (
                    <>
                      <Grid3x3 className="w-4 h-4" />
                      <span>Advanced</span>
                    </>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMoreMenuOpen ? 'rotate-180' : ''
                  }`} />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                className="w-80 bg-white/95 backdrop-blur-md border border-gray-200/60 shadow-xl rounded-xl p-3"
                sideOffset={8}
              >
                <DropdownMenuLabel className="text-sm font-semibold text-gray-800 px-3 py-2 mb-1">
                  Advanced Features
                </DropdownMenuLabel>
                
                {advancedFeatures.map((category, categoryIndex) => (
                  <div key={category.category}>
                    <div className="px-3 py-2 mb-2">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center ${category.color}`}>
                          <category.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {category.category}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        {category.items.map((item) => (
                          <DropdownMenuItem
                            key={item.value}
                            onClick={() => {
                              onTabChange(item.value);
                              setIsMoreMenuOpen(false);
                            }}
                            className={`
                              flex items-start space-x-3 px-3 py-3 rounded-lg cursor-pointer 
                              transition-all duration-200 ease-out
                              ${activeTab === item.value 
                                ? 'bg-blue-50/80 text-blue-800 border border-blue-200/50' 
                                : 'hover:bg-gray-50/80 text-gray-700 hover:text-gray-900'
                              }
                            `}
                          >
                            <div className={`
                              w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                              ${activeTab === item.value 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                              }
                            `}>
                              <item.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-sm truncate">{item.label}</div>
                                {activeTab === item.value && (
                                  <Badge variant="secondary" className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5">
                                    Active
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                {item.description}
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </div>
                    {categoryIndex < advancedFeatures.length - 1 && (
                      <DropdownMenuSeparator className="my-3 bg-gray-200/60" />
                    )}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <TabsTrigger
              value="settings"
              className={`
                h-10 px-4 py-0 text-sm font-medium rounded-md border
                transition-all duration-300 ease-out
                ${activeTab === 'settings'
                  ? 'bg-gray-900 text-white border-gray-800 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }
                flex items-center space-x-2
              `}
              onClick={() => onTabChange('settings')}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </div>
        </div>
      </div>
    </div>
  );
};
