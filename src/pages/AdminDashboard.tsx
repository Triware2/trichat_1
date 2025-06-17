
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import { FeatureGuard } from '@/components/FeatureGuard';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const AdminDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Map URL paths to tab names
  const getTabFromPath = (pathname: string) => {
    const pathMap: { [key: string]: string } = {
      '/admin': 'overview',
      '/admin/user-management': 'users',
      '/admin/access-control': 'access',
      '/admin/chatbot-training': 'chatbot',
      '/admin/api-keys': 'api-keys',
      '/admin/sla': 'sla',
      '/admin/csat': 'csat',
      '/admin/analytics': 'analytics',
      '/admin/widgets': 'widget',
      '/admin/data-sources': 'datasources',
      '/admin/chat-management': 'chat-management',
      '/admin/customization': 'customization',
      '/admin/system-settings': 'settings'
    };
    return pathMap[pathname] || 'overview';
  };

  // Update active tab based on current route
  useEffect(() => {
    const tab = getTabFromPath(location.pathname);
    setActiveTab(tab);
  }, [location.pathname]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'users':
        return (
          <FeatureGuard feature="user_management_basic">
            <div className="min-h-screen bg-gray-50/30">
              <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
                <UserManagement />
              </div>
            </div>
          </FeatureGuard>
        );
      case 'access':
        return (
          <FeatureGuard feature="access_control_basic">
            <div className="min-h-screen bg-gray-50/30">
              <AccessManagementTabs />
            </div>
          </FeatureGuard>
        );
      case 'chatbot':
        return (
          <FeatureGuard feature="bot_training_studio">
            <div className="min-h-screen bg-gray-50/30">
              <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
                <BotTraining />
              </div>
            </div>
          </FeatureGuard>
        );
      case 'api-keys':
        return (
          <FeatureGuard feature="api_access">
            <div className="min-h-screen bg-gray-50/30">
              <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
                <ApiKeyManagement />
              </div>
            </div>
          </FeatureGuard>
        );
      case 'sla':
        return (
          <FeatureGuard feature="sla_create">
            <div className="min-h-screen bg-gray-50/30">
              <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
                <SLAManagement />
              </div>
            </div>
          </FeatureGuard>
        );
      case 'csat':
        return (
          <FeatureGuard feature="csat_dashboard">
            <div className="min-h-screen bg-gray-50/30">
              <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
                <CSATManagement />
              </div>
            </div>
          </FeatureGuard>
        );
      case 'analytics':
        return (
          <FeatureGuard feature="analytics_overview">
            <AnalyticsDashboard />
          </FeatureGuard>
        );
      case 'widget':
        return (
          <FeatureGuard feature="web_widget_basic">
            <ChatWidgetGenerator />
          </FeatureGuard>
        );
      case 'datasources':
        return (
          <FeatureGuard feature="data_sources_basic">
            <div className="min-h-screen bg-gray-50/30">
              <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
                <DataSourcesManagement />
              </div>
            </div>
          </FeatureGuard>
        );
      case 'chat-management':
        return (
          <FeatureGuard feature="chat_management">
            <div className="min-h-screen bg-gray-50/30">
              <ChatManagementTabs />
            </div>
          </FeatureGuard>
        );
      case 'customization':
        return (
          <FeatureGuard feature="customization_themes">
            <CustomizationStudio />
          </FeatureGuard>
        );
      case 'settings':
        return (
          <FeatureGuard feature="system_settings_basic">
            <SystemSettings />
          </FeatureGuard>
        );
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
      <div className="xl:hidden bg-white border-b border-gray-200 px-4 py-2">
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
            className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed xl:static inset-y-0 left-0 z-50 xl:z-auto
          transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          xl:translate-x-0 transition-transform duration-300 ease-in-out
          bg-white shadow-lg xl:shadow-none
          ${isMobileMenuOpen ? 'w-72' : 'w-0'} xl:w-56 2xl:w-64
          overflow-hidden xl:overflow-visible
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
