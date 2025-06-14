import { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { NavigationHeader } from '@/components/NavigationHeader';
import { AgentSidebar } from '@/components/agent/dashboard/AgentSidebar';
import { DashboardContent } from '@/components/agent/dashboard/DashboardContent';
import { ChatContent } from '@/components/agent/dashboard/ChatContent';
import { OtherTabsContent } from '@/components/agent/dashboard/OtherTabsContent';
import { MessageSquare, Users, Clock, CheckCircle } from 'lucide-react';

const AgentDashboard = () => {
  console.log("AgentDashboard component rendering...");
  
  const [selectedChat, setSelectedChat] = useState(1);

  const [stats, setStats] = useState([
    { title: 'Open Tickets', value: '24', icon: MessageSquare, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { title: 'Active Users', value: '150', icon: Users, color: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
    { title: 'Avg. Wait Time', value: '3 mins', icon: Clock, color: 'bg-gradient-to-br from-amber-500 to-amber-600' },
    { title: 'Resolution Rate', value: '95%', icon: CheckCircle, color: 'bg-gradient-to-br from-violet-500 to-violet-600' },
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

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <NavigationHeader 
        title="Agent Dashboard" 
        role="agent"
        userEmail="agent@trichat.com"
      />

      {/* Main Content with Sidebar */}
      <div className="h-[calc(100vh-64px)]">
        <SidebarProvider defaultOpen={true}>
          <div className="flex h-full w-full">
            <Tabs defaultValue="dashboard" className="flex h-full w-full">
              {/* Collapsible Sidebar */}
              <AgentSidebar todayPerformance={todayPerformance} />

              {/* Main Content Area */}
              <SidebarInset className="flex-1 overflow-hidden">
                <DashboardContent
                  stats={stats}
                  chats={chats}
                  activities={activities}
                  onStatClick={handleStatClick}
                  onQueueAction={handleQueueAction}
                />

                <ChatContent
                  chats={chats}
                  selectedChat={selectedChat}
                  onChatSelect={setSelectedChat}
                  onFilter={handleFilter}
                  onSendMessage={handleSendMessage}
                  getSelectedCustomerName={getSelectedCustomerName}
                />

                <OtherTabsContent customer={getSelectedCustomer()} />
              </SidebarInset>
            </Tabs>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default AgentDashboard;
