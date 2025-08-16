
import { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { CustomizationHeader } from './CustomizationHeader';
import { QuickStats } from './QuickStats';
import { CustomizationTabs } from './CustomizationTabs';
import { CustomizationTabContent } from './CustomizationTabContent';
import { useCustomizationStudio } from '@/hooks/useCustomizationStudio';
import { Palette } from 'lucide-react';

export const CustomizationStudio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { customizations, isLoading } = useCustomizationStudio();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Palette className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">Customization Studio</h1>
        </div>
        <p className="text-sm text-slate-600">
          Customize the appearance and behavior of your customer support platform
        </p>
      </div>
      
      <QuickStats customizations={customizations} isLoading={isLoading} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0">
        <CustomizationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <CustomizationTabContent activeTab={activeTab} />
        </div>
      </Tabs>
    </div>
  );
};
