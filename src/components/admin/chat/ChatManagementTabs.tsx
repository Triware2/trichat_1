
import { useState } from 'react';
import { HorizontalTabs } from '../dashboard/HorizontalTabs';
import { ChatManagement } from './ChatManagement';

export const ChatManagementTabs = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'channels', label: 'Channels' },
    { id: 'routing', label: 'Routing' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
      case 'channels':
      case 'routing':
      case 'analytics':
      case 'settings':
      default:
        return <ChatManagement />;
    }
  };

  return (
    <div>
      <HorizontalTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};
