

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatInterface } from '@/components/agent/ChatInterface';
import { CannedResponses } from '@/components/agent/CannedResponses';
import { CustomerInfo } from '@/components/agent/CustomerInfo';
import { ChatList } from '@/components/agent/ChatList';
import { DashboardStats } from '@/components/agent/DashboardStats';
import { QueueStatus } from '@/components/agent/QueueStatus';
import { RecentActivity } from '@/components/agent/RecentActivity';
import { MessageSquare, Users, Clock, CheckCircle } from 'lucide-react';

const AgentDashboard = () => {
  const [selectedChat, setSelectedChat] = useState(1);

  const [stats, setStats] = useState([
    { title: 'Open Tickets', value: '24', icon: MessageSquare, color: 'bg-blue-500' },
    { title: 'Active Users', value: '150', icon: Users, color: 'bg-green-500' },
    { title: 'Avg. Wait Time', value: '3 mins', icon: Clock, color: 'bg-yellow-500' },
    { title: 'Resolution Rate', value: '95%', icon: CheckCircle, color: 'bg-purple-500' },
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

  // Customer data for the selected chat
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

  const handleStatClick = (statTitle: string) => {
    alert(`Clicked on stat: ${statTitle}`);
  };

  const handleQueueAction = (customer: string) => {
    alert(`Taking action on customer: ${customer}`);
  };

  const handleSendMessage = (message: string) => {
    alert(`Sending message: ${message}`);
  };

  const handleFilter = () => {
    alert('Filtering chats...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <div className="flex-1 flex flex-col p-4 lg:p-8 max-h-screen overflow-hidden">
        <div className="mb-6 lg:mb-8 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900">Agent Dashboard</h1>
              <p className="text-sm lg:text-base text-slate-600 mt-1">Manage customer conversations and support requests</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-4 mb-6 lg:mb-8 flex-shrink-0 bg-white shadow-sm border border-slate-200 rounded-xl p-1">
            <TabsTrigger 
              value="dashboard" 
              className="text-sm lg:text-base font-medium rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="text-sm lg:text-base font-medium rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="responses" 
              className="text-sm lg:text-base font-medium rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Templates
            </TabsTrigger>
            <TabsTrigger 
              value="customer" 
              className="text-sm lg:text-base font-medium rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Customer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="flex-1 space-y-6 lg:space-y-8 overflow-y-auto">
            <DashboardStats stats={stats} onStatClick={handleStatClick} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              <QueueStatus chats={chats} onQueueAction={handleQueueAction} />
              <RecentActivity activities={activities} />
            </div>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 h-full">
              <div className="lg:col-span-1 min-h-0">
                <ChatList 
                  chats={chats}
                  selectedChat={selectedChat}
                  onChatSelect={setSelectedChat}
                  onFilter={handleFilter}
                />
              </div>
              <div className="lg:col-span-2 min-h-0">
                <ChatInterface
                  customerName="John Smith"
                  customerStatus="Online"
                  onSendMessage={handleSendMessage}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="responses" className="flex-1 min-h-0">
            <CannedResponses onSelectResponse={() => {}} isSelectionMode={false} />
          </TabsContent>

          <TabsContent value="customer" className="flex-1 min-h-0">
            <CustomerInfo customer={getSelectedCustomer()} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentDashboard;

