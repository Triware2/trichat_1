
import { useState } from 'react';
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
        return (
          <div className="min-h-screen bg-gray-50/30">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <UserManagement />
            </div>
          </div>
        );
      case 'access':
        return (
          <div className="min-h-screen bg-gray-50/30">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <AccessManagement />
            </div>
          </div>
        );
      case 'chatbot':
        return (
          <div className="min-h-screen bg-gray-50/30">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <BotTraining />
            </div>
          </div>
        );
      case 'api-keys':
        return (
          <div className="min-h-screen bg-gray-50/30">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <ApiKeyManagement />
            </div>
          </div>
        );
      case 'sla':
        return (
          <div className="min-h-screen bg-gray-50/30">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <SLAManagement />
            </div>
          </div>
        );
      case 'csat':
        return (
          <div className="min-h-screen bg-gray-50/30">
            <div className="max-w-7xl mx-auto px-6 py-8">
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
            <div className="max-w-7xl mx-auto px-6 py-8">
              <DataSourcesManagement />
            </div>
          </div>
        );
      case 'chat-management':
        return (
          <div className="min-h-screen bg-gray-50/30">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <ChatManagement />
            </div>
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
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
