
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Palette, 
  FormInput, 
  Database, 
  Wrench, 
  Zap, 
  Workflow, 
  Link, 
  Terminal, 
  Cloud, 
  Key 
} from 'lucide-react';

interface CustomizationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const CustomizationTabs = ({ activeTab, onTabChange }: CustomizationTabsProps) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'forms', label: 'Forms', icon: FormInput },
    { id: 'objects', label: 'Objects', icon: Database },
    { id: 'fields', label: 'Fields', icon: Wrench },
    { id: 'dispositions', label: 'Dispositions', icon: Zap },
    { id: 'rules', label: 'Rules', icon: Zap },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'code-editor', label: 'Code', icon: Terminal },
    { id: 'sandbox', label: 'Sandbox', icon: Cloud },
    { id: 'api-management', label: 'APIs', icon: Key }
  ];

  return (
    <div className="border-b border-slate-200">
      <TabsList className="h-auto bg-transparent p-0 space-x-0">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id}
                value={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </div>
      </TabsList>
    </div>
  );
};
