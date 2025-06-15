
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
    <div className="space-y-6">
      <CustomizationHeader />
      
      <QuickStats customizations={customizations} isLoading={isLoading} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <CustomizationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <CustomizationTabContent activeTab={activeTab} />
      </Tabs>
    </div>
  );
};
