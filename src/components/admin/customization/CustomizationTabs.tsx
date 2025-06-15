
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
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
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'forms', label: 'Forms', icon: FormInput },
    { id: 'objects', label: 'Objects', icon: Database },
    { id: 'fields', label: 'Fields', icon: Wrench },
    { id: 'rules', label: 'Rules', icon: Zap },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'code-editor', label: 'Code', icon: Terminal },
    { id: 'sandbox', label: 'Sandbox', icon: Cloud },
    { id: 'api-management', label: 'APIs', icon: Key }
  ];

  return (
    <TabsList className="grid w-full grid-cols-11 bg-white border shadow-sm rounded-xl p-1 h-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <TabsTrigger 
            key={tab.id}
            value={tab.id}
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};
