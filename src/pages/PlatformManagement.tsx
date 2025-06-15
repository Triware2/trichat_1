
import { useState } from 'react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { PlatformSidebar } from '@/components/platform/PlatformSidebar';
import { PlatformDashboard } from '@/components/platform/dashboard/PlatformDashboard';
import { ClientManagement } from '@/components/platform/clients/ClientManagement';
import { PricingManagement } from '@/components/platform/pricing/PricingManagement';
import { UsageMonitoring } from '@/components/platform/usage/UsageMonitoring';
import { AnalyticsReports } from '@/components/platform/analytics/AnalyticsReports';
import { SecurityManagement } from '@/components/platform/security/SecurityManagement';
import { ApiManagement } from '@/components/platform/api/ApiManagement';
import { SystemHealth } from '@/components/platform/system/SystemHealth';
import { SupportManagement } from '@/components/platform/support/SupportManagement';

const PlatformManagement = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <PlatformDashboard />;
      case 'clients':
        return <ClientManagement />;
      case 'pricing':
        return <PricingManagement />;
      case 'usage':
        return <UsageMonitoring />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'security':
        return <SecurityManagement />;
      case 'api':
        return <ApiManagement />;
      case 'system':
        return <SystemHealth />;
      case 'support':
        return <SupportManagement />;
      default:
        return <PlatformDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader 
        title="Platform Management" 
        role="admin"
        userEmail="admin@platform.com"
      />
      
      <div className="flex h-[calc(100vh-64px)]">
        <PlatformSidebar 
          activeModule={activeModule} 
          onModuleChange={setActiveModule} 
        />
        
        <div className="flex-1 overflow-auto">
          {renderModule()}
        </div>
      </div>
    </div>
  );
};

export default PlatformManagement;
