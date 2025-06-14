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
    { title: 'Open Tickets', value: '24', icon: MessageSquare, color: 'bg-blue-100' },
    { title: 'Active Users', value: '150', icon: Users, color: 'bg-green-100' },
    { title: 'Avg. Wait Time', value: '3 mins', icon: Clock, color: 'bg-yellow-100' },
    { title: 'Resolution Rate', value: '95%', icon: CheckCircle, color: 'bg-purple-100' },
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-600">Manage customer conversations and support requests</p>
        </div>

        <Tabs defaultValue="dashboard" className="h-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="responses">Canned Responses</TabsTrigger>
            <TabsTrigger value="customer">Customer Info</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats stats={stats} onStatClick={handleStatClick} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <QueueStatus chats={chats} onQueueAction={handleQueueAction} />
              <RecentActivity activities={activities} />
            </div>
          </TabsContent>

          <TabsContent value="chat" className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div className="lg:col-span-1">
                <ChatList 
                  chats={chats}
                  selectedChat={selectedChat}
                  onChatSelect={setSelectedChat}
                  onFilter={handleFilter}
                />
              </div>
              <div className="lg:col-span-2">
                <ChatInterface
                  customerName="John Smith"
                  customerStatus="Online"
                  onSendMessage={handleSendMessage}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="responses" className="h-full">
            <CannedResponses onSelectResponse={() => {}} isSelectionMode={false} />
          </TabsContent>

          <TabsContent value="customer" className="h-full">
            <CustomerInfo customerId={selectedChat} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentDashboard;
