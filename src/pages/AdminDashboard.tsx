import { useState } from 'react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { UserManagement } from '@/components/admin/UserManagement';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { ChatWidgetGenerator } from '@/components/admin/ChatWidgetGenerator';
import { AccessManagementTabs } from '@/components/admin/access/AccessManagementTabs';
import { BotTraining } from '@/components/admin/chatbot/BotTraining';
import { ApiKeyManagement } from '@/components/admin/api/ApiKeyManagement';
import { DashboardHeader } from '@/components/admin/dashboard/DashboardHeader';
import { DashboardOverview } from '@/components/admin/dashboard/DashboardOverview';
import { DataSourcesManagement } from '@/components/admin/datasources/DataSourcesManagement';
import { ChatManagementTabs } from '@/components/admin/chat/ChatManagementTabs';
import { SLAManagement } from '@/components/admin/sla/SLAManagement';
import { CSATManagement } from '@/components/admin/csat/CSATManagement';
import { CustomizationStudio } from '@/components/admin/customization/CustomizationStudio';
import { AdminSidebar } from '@/components/admin/dashboard/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'users':
        return (
          <div className="min-h-screen bg-gray-50/30">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <UserManagement />
            </div>
          </div>
        );
      case 'access':
        return (
          <div className="min-h-screen bg-gray-50/30">
            <AccessManagementTabs />
          </div>
        );
      case 'chatbot':
        return (
          <div className="min-h-screen bg-gray-50/30">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <BotTraining />
            </div>
          </div>
        );
      case 'api-keys':
        return (
          <div className="min-h-screen bg-gray-50/30">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <ApiKeyManagement />
            </div>
          </div>
        );
      case 'sla':
        return (
          <div className="min-h-screen bg-gray-50/30">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <SLAManagement />
            </div>
          </div>
        );
      case 'csat':
        return (
          <div className="min-h-screen bg-gray-50/30">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <CSATManagement />
            </div>
          </div>
        );
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'widget':
        return <ChatWidgetGenerator />;
      case 'datasources':
        return (
          <div className="min-h-screen bg-gray-50/30">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <DataSourcesManagement />
            </div>
          </div>
        );
      case 'chat-management':
        return (
          <div className="min-h-screen bg-gray-50/30">
            <ChatManagementTabs />
          </div>
        );
      case 'customization':
        return <CustomizationStudio />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <NavigationHeader 
        title="Admin Dashboard" 
        role="admin"
        userEmail="admin@trichat.com"
      />
      
      {/* Mobile menu button */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className="flex items-center gap-2"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
          <span>Menu</span>
        </Button>
      </div>

      <DashboardHeader />
      
      <div className="flex w-full">
        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          bg-white shadow-lg lg:shadow-none
          ${isMobileMenuOpen ? 'w-72' : 'w-0'} lg:w-56 xl:w-52 2xl:w-56
          overflow-hidden lg:overflow-visible
          flex-shrink-0
        `}>
          <div className="h-full overflow-y-auto">
            <AdminSidebar 
              activeTab={activeTab} 
              onTabChange={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }} 
            />
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 w-full min-w-0">
          <div className="h-full w-full overflow-auto">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
