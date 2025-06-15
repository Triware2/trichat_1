
import { useState } from 'react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { PlatformControlSidebar } from '@/components/platform-control/PlatformControlSidebar';
import { SystemOverview } from '@/components/platform-control/SystemOverview';
import { ClientControlCenter } from '@/components/platform-control/ClientControlCenter';
import { UserManagementCenter } from '@/components/platform-control/UserManagementCenter';
import { GlobalCustomizationStudio } from '@/components/platform-control/GlobalCustomizationStudio';
import { AdvancedSystemSettings } from '@/components/platform-control/AdvancedSystemSettings';
import { RevenueManagement } from '@/components/platform-control/RevenueManagement';
import { SystemHealthMonitor } from '@/components/platform-control/SystemHealthMonitor';
import { SecurityCenter } from '@/components/platform-control/SecurityCenter';
import { AnalyticsEngine } from '@/components/platform-control/AnalyticsEngine';
import { ApiManagementCenter } from '@/components/platform-control/ApiManagementCenter';
import { AutomationHub } from '@/components/platform-control/AutomationHub';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const PlatformControl = () => {
  const [activeModule, setActiveModule] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderModule = () => {
    switch (activeModule) {
      case 'overview':
        return <SystemOverview />;
      case 'clients':
        return <ClientControlCenter />;
      case 'users':
        return <UserManagementCenter />;
      case 'customization':
        return <GlobalCustomizationStudio />;
      case 'system-settings':
        return <AdvancedSystemSettings />;
      case 'revenue':
        return <RevenueManagement />;
      case 'health':
        return <SystemHealthMonitor />;
      case 'security':
        return <SecurityCenter />;
      case 'analytics':
        return <AnalyticsEngine />;
      case 'api':
        return <ApiManagementCenter />;
      case 'automation':
        return <AutomationHub />;
      default:
        return <SystemOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <NavigationHeader 
        title="Platform Control Center" 
        role="admin"
        userEmail="admin@platform.com"
      />
      
      {/* Mobile menu button */}
      <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span>Control Panel</span>
        </Button>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          bg-white/95 backdrop-blur-lg shadow-xl lg:shadow-none border-r border-gray-200
          ${isMobileMenuOpen ? 'w-80' : 'w-0'} lg:w-72
          overflow-hidden lg:overflow-visible
          flex-shrink-0
        `}>
          <PlatformControlSidebar 
            activeModule={activeModule} 
            onModuleChange={(module) => {
              setActiveModule(module);
              setIsMobileMenuOpen(false);
            }} 
          />
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50/50 to-white">
          {renderModule()}
        </div>
      </div>
    </div>
  );
};

export default PlatformControl;
