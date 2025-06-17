
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import { TeamSettings } from '@/components/supervisor/TeamSettings';

const SupervisorDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Map URL paths to tab names
  const getTabFromPath = (pathname: string) => {
    const pathMap: { [key: string]: string } = {
      '/supervisor': 'overview',
      '/supervisor/chat-supervision': 'chats',
      '/supervisor/team-monitor': 'team',
      '/supervisor/team-settings': 'team-settings',
      '/supervisor/queue-management': 'queue',
      '/supervisor/reports': 'reports'
    };
    return pathMap[pathname] || 'overview';
  };

  // Update active tab based on current route
  useEffect(() => {
    const tab = getTabFromPath(location.pathname);
    setActiveTab(tab);
  }, [location.pathname]);

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
            <FeatureGuard feature="supervisor_chat_supervision">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ChatSupervision />
                </div>
                <div>
                  <ManualAssignmentSettings />
                </div>
              </div>
            </FeatureGuard>
          </TabsContent>

          <TabsContent value="team">
            <FeatureGuard feature="supervisor_team_monitor">
              <TeamMonitor />
            </FeatureGuard>
          </TabsContent>

          <TabsContent value="team-settings">
            <TeamSettings />
          </TabsContent>

          <TabsContent value="queue">
            <FeatureGuard feature="supervisor_queue_management">
              <QueueManagement />
            </FeatureGuard>
          </TabsContent>

          <TabsContent value="reports">
            <FeatureGuard feature="supervisor_reports">
              <Reports />
            </FeatureGuard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
