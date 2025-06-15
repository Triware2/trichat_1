
import { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { NavigationHeader } from '@/components/NavigationHeader';
import { UserManagement } from '@/components/admin/UserManagement';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { ChatWidgetGenerator } from '@/components/admin/ChatWidgetGenerator';
import { AccessManagement } from '@/components/admin/access/AccessManagement';
import { BotTraining } from '@/components/admin/chatbot/BotTraining';
import { ApiKeyManagement } from '@/components/admin/api/ApiKeyManagement';
import { DashboardHeader } from '@/components/admin/dashboard/DashboardHeader';
import { DashboardOverview } from '@/components/admin/dashboard/DashboardOverview';
import { DataSourcesManagement } from '@/components/admin/datasources/DataSourcesManagement';
import { ChatManagement } from '@/components/admin/chat/ChatManagement';
import { SLAManagement } from '@/components/admin/sla/SLAManagement';
import { CSATManagement } from '@/components/admin/csat/CSATManagement';
import { CustomizationStudio } from '@/components/admin/customization/CustomizationStudio';
import { AdminSidebar } from '@/components/admin/dashboard/AdminSidebar';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'users':
        return <UserManagement />;
      case 'access':
        return <AccessManagement />;
      case 'chatbot':
        return <BotTraining />;
      case 'api-keys':
        return <ApiKeyManagement />;
      case 'sla':
        return <SLAManagement />;
      case 'csat':
        return <CSATManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'widget':
        return <ChatWidgetGenerator />;
      case 'datasources':
        return <DataSourcesManagement />;
      case 'chat-management':
        return <ChatManagement />;
      case 'customization':
        return <CustomizationStudio />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader 
        title="Admin Dashboard" 
        role="admin"
        userEmail="admin@trichat.com"
      />
      
      <DashboardHeader />
      
      <div className="flex h-[calc(100vh-120px)]">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
