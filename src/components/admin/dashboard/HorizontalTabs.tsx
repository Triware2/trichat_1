
import { Button } from '@/components/ui/button';

interface Tab {
  id: string;
  label: string;
}

interface HorizontalTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const HorizontalTabs = ({ tabs, activeTab, onTabChange }: HorizontalTabsProps) => {
  return (
    <div className="bg-white border-b border-slate-200">
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
                  : 'text-slate-500 hover:text-slate-700 hover:border-slate-300'
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
