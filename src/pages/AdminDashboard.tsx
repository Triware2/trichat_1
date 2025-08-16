
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationHeader } from '@/components/NavigationHeader';
import { AdminSidebar } from '@/components/admin/dashboard/AdminSidebar';
import { DashboardHeader } from '@/components/admin/dashboard/DashboardHeader';
import { DashboardOverview } from '@/components/admin/dashboard/DashboardOverview';
import { UserManagement } from '@/components/admin/users/UserManagement';
import { AccessManagement } from '@/components/admin/access/AccessManagement';
import { BotTraining } from '@/components/admin/chatbot/BotTraining';
import { ApiKeyManagement } from '@/components/admin/api/ApiKeyManagement';
import { SLAManagement } from '@/components/admin/sla/SLAManagement';
import { CSATManagement } from '@/components/admin/csat/CSATManagement';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { DataSourcesManagement } from '@/components/admin/datasources/DataSourcesManagement';
import { ChatManagement } from '@/components/admin/chat/ChatManagement';
import { CustomizationStudio } from '@/components/admin/customization/CustomizationStudio';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { ChatWidgetGenerator } from '@/components/admin/ChatWidgetGenerator';
import SupportPage from '@/pages/SupportPage';
import CreatorSupportManagement from '@/pages/CreatorSupportManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle route-based navigation for external routes
  useEffect(() => {
    const path = location.pathname;
    if (path === '/billing') {
      setActiveTab('billing');
    }
  }, [location.pathname]);

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Handle special routes that need navigation
    if (tab === 'billing') {
      navigate('/billing');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavigationHeader 
        title="Admin Dashboard" 
        role="admin"
        userEmail="admin@trichat.com"
      />
      <div className="flex h-[calc(100vh-64px)]">
        <AdminSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
          <DashboardHeader 
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={handleToggleCollapse}
            onTabChange={handleTabChange}
          />
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6 max-w-none transition-all duration-300">
              {activeTab === 'overview' && <DashboardOverview />}
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'access' && <AccessManagement />}
              {activeTab === 'chatbot' && <BotTraining />}
              {activeTab === 'api-keys' && <ApiKeyManagement />}
              {activeTab === 'sla' && <SLAManagement />}
              {activeTab === 'csat' && <CSATManagement />}
              {activeTab === 'analytics' && <AnalyticsDashboard />}
              {activeTab === 'widget' && <ChatWidgetGenerator />}
              {activeTab === 'datasources' && <DataSourcesManagement />}
              {activeTab === 'chat-management' && <ChatManagement />}
              {activeTab === 'customization' && <CustomizationStudio />}
              {activeTab === 'settings' && <SystemSettings />}
              {activeTab === 'support' && <SupportPage />}
              {activeTab === 'support-management' && <CreatorSupportManagement />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
