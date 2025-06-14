import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatInterface } from '@/components/agent/ChatInterface';
import { CannedResponses } from '@/components/agent/CannedResponses';
import { CustomerInfo } from '@/components/agent/CustomerInfo';
import { ChatList } from '@/components/agent/ChatList';
import { DashboardStats } from '@/components/agent/DashboardStats';
import { QueueStatus } from '@/components/agent/QueueStatus';
import { RecentActivity } from '@/components/agent/RecentActivity';
import { MessageSquare, Users, Clock, CheckCircle, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AgentDashboard = () => {
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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Agent Dashboard</h1>
                <p className="text-sm text-slate-600">Manage conversations and support requests</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Online
            </Badge>
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        <nav className="w-64 bg-white border-r border-slate-200 p-4">
          <div className="space-y-1">
            <TabsList className="grid w-full grid-cols-1 h-auto space-y-1 bg-transparent p-0">
              <TabsTrigger 
                value="dashboard" 
                className="w-full justify-start px-3 py-2 rounded-lg text-left data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 hover:bg-slate-50"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="w-full justify-start px-3 py-2 rounded-lg text-left data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 hover:bg-slate-50"
              >
                <Users className="w-4 h-4 mr-2" />
                Conversations
              </TabsTrigger>
              <TabsTrigger 
                value="responses" 
                className="w-full justify-start px-3 py-2 rounded-lg text-left data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 hover:bg-slate-50"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger 
                value="customer" 
                className="w-full justify-start px-3 py-2 rounded-lg text-left data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 hover:bg-slate-50"
              >
                <Users className="w-4 h-4 mr-2" />
                Customer Info
              </TabsTrigger>
            </TabsList>
          </div>
        </nav>

        <main className="flex-1 overflow-hidden">
          <Tabs defaultValue="dashboard" className="h-full flex flex-col">
            <TabsContent value="dashboard" className="flex-1 p-6 space-y-6 overflow-y-auto">
              <DashboardStats stats={stats} onStatClick={handleStatClick} />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <QueueStatus chats={chats} onQueueAction={handleQueueAction} />
                <RecentActivity activities={activities} />
              </div>
            </TabsContent>

            <TabsContent value="chat" className="flex-1 flex">
              <div className="flex w-full h-full">
                <div className="w-80 border-r border-slate-200 bg-white">
                  <ChatList 
                    chats={chats}
                    selectedChat={selectedChat}
                    onChatSelect={setSelectedChat}
                    onFilter={handleFilter}
                  />
                </div>
                <div className="flex-1">
                  <ChatInterface
                    customerName="John Smith"
                    customerStatus="Online"
                    onSendMessage={handleSendMessage}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="responses" className="flex-1 p-6">
              <CannedResponses onSelectResponse={() => {}} isSelectionMode={false} />
            </TabsContent>

            <TabsContent value="customer" className="flex-1 p-6">
              <CustomerInfo customer={getSelectedCustomer()} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AgentDashboard;
