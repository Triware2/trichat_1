import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationHeader } from '@/components/NavigationHeader';
import { SupervisorTabs } from '@/components/supervisor/SupervisorTabs';
import { SupervisorOverview } from '@/components/supervisor/SupervisorOverview';
import { ChatSupervision } from '@/components/supervisor/ChatSupervision';
import { TeamMonitor } from '@/components/supervisor/TeamMonitor';
import { TeamSettings } from '@/components/supervisor/TeamSettings';
import { QueueManagement } from '@/components/supervisor/QueueManagement';
import { SupervisorProfile } from '@/components/supervisor/SupervisorProfile';
import { SupervisorSettings } from '@/components/supervisor/SupervisorSettings';
import SupervisorReports from '@/components/supervisor/Reports';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';

const SupervisorDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Get active tab from current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/supervisor' || path === '/supervisor/') return 'overview';
    if (path.includes('/chat-supervision')) return 'chats';
    if (path.includes('/team-monitor')) return 'team';
    if (path.includes('/team-settings')) return 'team-settings';
    if (path.includes('/queue-management')) return 'queue';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/settings')) return 'settings';
    return 'overview';
  };

  const currentTab = getActiveTab();

  const handleTabChange = (newTab: string) => {
    const pathMap: { [key: string]: string } = {
      'overview': '/supervisor',
      'chats': '/supervisor/chat-supervision',
      'team': '/supervisor/team-monitor',
      'team-settings': '/supervisor/team-settings',
      'queue': '/supervisor/queue-management',
      'reports': '/supervisor/reports',
      'profile': '/supervisor/profile',
      'settings': '/supervisor/settings'
    };

    const path = pathMap[newTab];
    if (path) {
      navigate(path);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
        return <SupervisorOverview />;
      case 'chats':
        return <ChatSupervision />;
      case 'team':
        return <TeamMonitor />;
      case 'team-settings':
        return <TeamSettings />;
      case 'queue':
        return <QueueManagement />;
      case 'reports':
        return <SupervisorReports />;
      case 'profile':
        return <SupervisorProfile />;
      case 'settings':
        return <SupervisorSettings />;
      default:
        return <SupervisorOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Navigation Header */}
      <NavigationHeader 
        title="Supervisor Dashboard" 
        role="supervisor"
        userEmail={user?.email}
      />
      
      {/* Top Tab Navigation - Sticky */}
      <div className="sticky top-16 z-40">
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <SupervisorTabs activeTab={currentTab} onTabChange={handleTabChange} />
        </Tabs>
      </div>
      
      {/* Full-width content */}
      <main className="w-full">
        {renderContent()}
      </main>
    </div>
  );
};

export default SupervisorDashboard;
