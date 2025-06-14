
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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <NavigationHeader 
        title="Admin Dashboard" 
        role="admin"
        userEmail="admin@trichat.com"
      />
      
      <div className="w-full min-h-[calc(100vh-64px)] px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <div className="w-full max-w-[1920px] mx-auto">
          <DashboardHeader />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 lg:space-y-8">
            <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <TabsContent value="overview" className="space-y-6 lg:space-y-8">
              <DashboardOverview />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="access">
              <AccessManagement />
            </TabsContent>

            <TabsContent value="chatbot">
              <BotTraining />
            </TabsContent>

            <TabsContent value="api-keys">
              <ApiKeyManagement />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="widget">
              <ChatWidgetGenerator />
            </TabsContent>

            <TabsContent value="settings">
              <SystemSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
