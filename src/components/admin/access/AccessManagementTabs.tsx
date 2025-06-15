
import { useState } from 'react';
import { HorizontalTabs } from '../dashboard/HorizontalTabs';
import { AccessManagement } from './AccessManagement';

export const AccessManagementTabs = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'roles', label: 'Roles' },
    { id: 'permissions', label: 'Permissions' },
    { id: 'audit', label: 'Audit Log' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
      case 'users':
      case 'roles':
      case 'permissions':
      case 'audit':
      default:
        return <AccessManagement />;
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
