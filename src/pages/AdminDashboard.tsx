
import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { NavigationHeader } from '@/components/NavigationHeader';
import { UserManagement } from '@/components/admin/UserManagement';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { ChatWidgetGenerator } from '@/components/admin/ChatWidgetGenerator';
import { AccessManagement } from '@/components/admin/access/AccessManagement';
import { BotTraining } from '@/components/admin/chatbot/BotTraining';
import { ApiKeyManagement } from '@/components/admin/api/ApiKeyManagement';
import { DashboardHeader } from '@/components/admin/dashboard/DashboardHeader';
import { DashboardTabs } from '@/components/admin/dashboard/DashboardTabs';
import { DashboardOverview } from '@/components/admin/dashboard/DashboardOverview';
import { DataSourcesManagement } from '@/components/admin/datasources/DataSourcesManagement';
import { ChatManagement } from '@/components/admin/chat/ChatManagement';
import { SLAManagement } from '@/components/admin/sla/SLAManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader 
        title="Admin Dashboard" 
        role="admin"
        userEmail="admin@trichat.com"
      />
      
      <DashboardHeader />
      
      <div className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="px-6 py-6">
            <TabsContent value="overview" className="mt-0">
              <DashboardOverview />
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <UserManagement />
            </TabsContent>

            <TabsContent value="access" className="mt-0">
              <AccessManagement />
            </TabsContent>

            <TabsContent value="chatbot" className="mt-0">
              <BotTraining />
            </TabsContent>

            <TabsContent value="api-keys" className="mt-0">
              <ApiKeyManagement />
            </TabsContent>

            <TabsContent value="sla" className="mt-0">
              <SLAManagement />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="widget" className="mt-0">
              <ChatWidgetGenerator />
            </TabsContent>

            <TabsContent value="datasources" className="mt-0">
              <DataSourcesManagement />
            </TabsContent>

            <TabsContent value="chat-management" className="mt-0">
              <ChatManagement />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <SystemSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
