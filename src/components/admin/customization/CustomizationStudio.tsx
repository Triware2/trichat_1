
import { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { CustomizationHeader } from './CustomizationHeader';
import { QuickStats } from './QuickStats';
import { CustomizationTabs } from './CustomizationTabs';
import { CustomizationTabContent } from './CustomizationTabContent';
import { useCustomizationStudio } from '@/hooks/useCustomizationStudio';

export const CustomizationStudio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { customizations, isLoading } = useCustomizationStudio();

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <CustomizationHeader />
        
        <QuickStats customizations={customizations} isLoading={isLoading} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0">
          <CustomizationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <CustomizationTabContent activeTab={activeTab} />
          </div>
        </Tabs>
      </div>
    </div>
  );
};
