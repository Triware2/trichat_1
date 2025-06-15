
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // All navigation items (previously split between core and advanced)
  const allNavigationItems = [
    { value: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'text-blue-600' },
    { value: 'users', label: 'Users', icon: Users, color: 'text-green-600' },
    { value: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-purple-600' },
    { value: 'access', label: 'Access Control', icon: Shield, color: 'text-red-600' },
    { value: 'chatbot', label: 'Bot Training', icon: Bot, color: 'text-indigo-600' },
    { value: 'api-keys', label: 'API Management', icon: Key, color: 'text-yellow-600' },
    { value: 'sla', label: 'SLA Monitoring', icon: Target, color: 'text-orange-600' },
    { value: 'csat', label: 'CSAT Analytics', icon: Heart, color: 'text-pink-600' },
    { value: 'chat-management', label: 'Chat Operations', icon: MessageSquare, color: 'text-cyan-600' },
    { value: 'datasources', label: 'Data Sources', icon: Database, color: 'text-teal-600' },
    { value: 'widget', label: 'Widget Builder', icon: Code, color: 'text-violet-600' },
    { value: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' }
  ];

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-16 z-40 shadow-sm">
      <div className="px-8 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          
          {/* Navigation with Scroll Controls */}
          <div className="flex items-center flex-1 min-w-0">
            
            {/* Left Scroll Button */}
            {canScrollLeft && (
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollLeft}
                className="p-2 mr-2 hover:bg-gray-100 transition-colors duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}

            {/* Scrollable Navigation Container */}
            <div className="flex-1 min-w-0 relative">
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onScroll={checkScrollButtons}
              >
                <TabsList className="h-12 bg-gray-50/80 p-1 rounded-lg border border-gray-200/50 inline-flex min-w-max">
                  {allNavigationItems.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={`
                        relative h-10 px-6 py-0 text-sm font-medium rounded-md whitespace-nowrap
                        transition-all duration-300 ease-out
                        data-[state=active]:bg-white data-[state=active]:text-gray-900 
                        data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200
                        hover:bg-white/60 hover:text-gray-800
                        flex items-center space-x-2.5 group
                      `}
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
            </div>

            {/* Right Scroll Button */}
            {canScrollRight && (
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollRight}
                className="p-2 ml-2 hover:bg-gray-100 transition-colors duration-200"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center ml-4">
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 px-2 py-1">
              {allNavigationItems.find(item => item.value === activeTab)?.label || 'Overview'}
            </Badge>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
