
import { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { CustomizationHeader } from './CustomizationHeader';
import { QuickStats } from './QuickStats';
import { CustomizationTabs } from './CustomizationTabs';
import { CustomizationTabContent } from './CustomizationTabContent';

export const CustomizationStudio = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <CustomizationHeader />
      
      <QuickStats />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <CustomizationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <CustomizationTabContent />
      </Tabs>
    </div>
  );
};
