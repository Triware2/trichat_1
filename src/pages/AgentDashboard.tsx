
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs } from '@/components/ui/tabs';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { NavigationHeader } from '@/components/NavigationHeader';
import { AgentSidebar } from '@/components/agent/dashboard/AgentSidebar';
import { DashboardContent } from '@/components/agent/dashboard/DashboardContent';
import { ChatContent } from '@/components/agent/dashboard/ChatContent';
import { AllChatsContent } from '@/components/agent/dashboard/AllChatsContent';
import { ContactsContent } from '@/components/agent/dashboard/ContactsContent';
import { CustomerInfo } from '@/components/agent/CustomerInfo';
import { OtherTabsContent } from '@/components/agent/dashboard/OtherTabsContent';
import { MessageSquare, Users, Clock, CheckCircle } from 'lucide-react';

const AgentDashboard = () => {
  console.log("AgentDashboard component rendering...");
  
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState(1);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Map URL paths to tab names
  const getTabFromPath = (pathname: string) => {
    const pathMap: { [key: string]: string } = {
      '/agent': 'dashboard',
      '/agent/active-chat': 'chat',
      '/agent/all-chats': 'all-chats',
      '/agent/contacts': 'contacts',
      '/agent/customer-360': 'customer-insights',
      '/agent/settings': 'settings'
    };
    return pathMap[pathname] || 'dashboard';
  };

  // Update active tab based on current route
  useEffect(() => {
    const tab = getTabFromPath(location.pathname);
    setActiveTab(tab);
  }, [location.pathname]);

  const [stats, setStats] = useState([
    { title: 'Open Tickets', value: '24', icon: MessageSquare, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { title: 'Active Users', value: '150', icon: Users, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { title: 'Avg. Wait Time', value: '3 mins', icon: Clock, color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { title: 'Resolution Rate', value: '95%', icon: CheckCircle, color: 'bg-violet-50 text-violet-600 border-violet-200' },
  ]);

  const [chats, setChats] = useState([
    { id: 1, customer: 'John Smith', lastMessage: 'Hi, I need help with my order', time: '10:30 AM', status: 'urgent', unread: 2, priority: 'High' },
    { id: 2, customer: 'Alice Johnson', lastMessage: 'Thanks, issue resolved!', time: '10:45 AM', status: 'resolved', unread: 0, priority: 'Low' },
    { id: 3, customer: 'Bob Williams', lastMessage: 'Still waiting for a response...', time: '11:00 AM', status: 'pending', unread: 1, priority: 'Medium' },
    { id: 4, customer: 'Emily Brown', lastMessage: 'The product is not working as expected', time: '11:15 AM', status: 'pending', unread: 3, priority: 'High' },
  ]);

  const [activities, setActivities] = useState([
    { customer: 'John Smith', action: 'Opened a new ticket', time: '10:30 AM', type: 'success' },
    { customer: 'Alice Johnson', action: 'Closed the ticket', time: '10:45 AM', type: 'success' },
    { customer: 'Bob Williams', action: 'Awaiting response', time: '11:00 AM', type: 'warning' },
    { customer: 'Emily Brown', action: 'Reported a problem', time: '11:15 AM', type: 'error' },
  ]);

  const todayPerformance = {
    chatsHandled: 12,
    avgResponse: '2.3min',
    satisfaction: 4.8
  };

  const getSelectedCustomer = () => {
    const selectedChatData = chats.find(chat => chat.id === selectedChat);
    return {
      name: selectedChatData?.customer || 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, USA',
      customerSince: '2023-01-15',
      tier: 'Premium',
      previousChats: 12,
      satisfaction: 4.8,
      lastContact: '2024-01-10',
      totalOrders: 8,
      totalSpent: '$2,450.00'
    };
  };

  const getSelectedCustomerName = () => {
    const selectedChatData = chats.find(chat => chat.id === selectedChat);
    return selectedChatData?.customer || 'John Smith';
  };

  const handleStatClick = (statTitle: string) => {
    console.log(`Stat clicked: ${statTitle}`);
  };

  const handleQueueAction = (customer: string) => {
    console.log(`Queue action for: ${customer}`);
  };

  const handleSendMessage = (message: string) => {
    console.log(`Sending message: ${message}`);
  };

  const handleFilter = () => {
    console.log('Filtering chats...');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardContent
            stats={stats}
            chats={chats}
            activities={activities}
            onStatClick={handleStatClick}
            onQueueAction={handleQueueAction}
          />
        );
      case 'chat':
        return (
          <ChatContent
            chats={chats}
            selectedChat={selectedChat}
            onChatSelect={setSelectedChat}
            onFilter={handleFilter}
            onSendMessage={handleSendMessage}
            getSelectedCustomerName={getSelectedCustomerName}
          />
        );
      case 'all-chats':
        return <AllChatsContent />;
      case 'contacts':
        return <ContactsContent />;
      case 'customer-insights':
        return (
          <FeatureGuard feature="customer_360">
            <CustomerInfo customer={getSelectedCustomer()} />
          </FeatureGuard>
        );
      case 'settings':
        return <OtherTabsContent customer={getSelectedCustomer()} />;
      default:
        return (
          <DashboardContent
            stats={stats}
            chats={chats}
            activities={activities}
            onStatClick={handleStatClick}
            onQueueAction={handleQueueAction}
          />
        );
    }
  };

  return (
    <div className="h-screen bg-gray-50">
      <NavigationHeader 
        title="Agent Dashboard" 
        role="agent"
        userEmail="agent@trichat.com"
      />

      {/* Main Content with Sidebar */}
      <div className="h-[calc(100vh-64px)]">
        <SidebarProvider defaultOpen={true}>
          <div className="flex h-full w-full">
            {/* Collapsible Sidebar */}
            <AgentSidebar 
              todayPerformance={todayPerformance}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Main Content Area */}
            <SidebarInset className="flex-1 overflow-hidden">
              {renderTabContent()}
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default AgentDashboard;
