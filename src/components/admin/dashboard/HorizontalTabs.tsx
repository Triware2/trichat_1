
import { Button } from '@/components/ui/button';

interface HorizontalTabsProps {
  tabs: Array<{
    id: string;
    label: string;
  }>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const HorizontalTabs = ({ tabs, activeTab, onTabChange }: HorizontalTabsProps) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={`
                relative px-1 py-4 text-sm font-medium transition-colors
                border-b-2 border-transparent rounded-none
                ${activeTab === tab.id 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};
