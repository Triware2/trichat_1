
import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { NavigationHeader } from '@/components/NavigationHeader';
import { TeamMonitor } from '@/components/supervisor/TeamMonitor';
import { QueueManagement } from '@/components/supervisor/QueueManagement';
import { Reports } from '@/components/supervisor/Reports';
import { ChatSupervision } from '@/components/supervisor/ChatSupervision';
import { SupervisorHeader } from '@/components/supervisor/SupervisorHeader';
import { SupervisorTabs } from '@/components/supervisor/SupervisorTabs';
import { SupervisorOverview } from '@/components/supervisor/SupervisorOverview';
import { ManualAssignmentSettings } from '@/components/supervisor/ManualAssignmentSettings';

const SupervisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader 
        title="Supervisor Dashboard" 
        role="supervisor"
        userEmail="supervisor@trichat.com"
      />
      
      <div className="p-6">
        <SupervisorHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <SupervisorTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <TabsContent value="overview" className="space-y-6">
            <SupervisorOverview />
          </TabsContent>

          <TabsContent value="chats" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChatSupervision />
              </div>
              <div>
                <ManualAssignmentSettings />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <TeamMonitor />
          </TabsContent>

          <TabsContent value="queue">
            <QueueManagement />
          </TabsContent>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
