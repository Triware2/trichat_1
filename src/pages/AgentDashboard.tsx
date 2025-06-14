
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatInterface } from '@/components/agent/ChatInterface';
import { CannedResponses } from '@/components/agent/CannedResponses';
import { CustomerInfo } from '@/components/agent/CustomerInfo';
import { ChatList } from '@/components/agent/ChatList';
import { DashboardStats } from '@/components/agent/DashboardStats';
import { QueueStatus } from '@/components/agent/QueueStatus';
import { RecentActivity } from '@/components/agent/RecentActivity';
import { MessageSquare, Users, Clock, CheckCircle, Settings, Bell, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <div className="h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Agent Dashboard
                </h1>
                <p className="text-sm text-slate-600">Manage conversations and support requests</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              Online
            </Badge>
            <Button variant="ghost" size="sm" className="hover:bg-slate-100">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-slate-100">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-72 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-6">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-1 h-auto space-y-2 bg-transparent p-0">
                <TabsTrigger 
                  value="dashboard" 
                  className="w-full justify-start px-4 py-3 rounded-lg text-left data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 hover:bg-slate-50"
                >
                  <TrendingUp className="w-5 h-5 mr-3" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="chat" 
                  className="w-full justify-start px-4 py-3 rounded-lg text-left data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 hover:bg-slate-50"
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  Conversations
                  <Badge className="ml-auto bg-orange-500 text-white">3</Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="responses" 
                  className="w-full justify-start px-4 py-3 rounded-lg text-left data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 hover:bg-slate-50"
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  Templates
                </TabsTrigger>
                <TabsTrigger 
                  value="customer" 
                  className="w-full justify-start px-4 py-3 rounded-lg text-left data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 hover:bg-slate-50"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Customer Info
                </TabsTrigger>
              </TabsList>

              {/* Main Content Area */}
              <div className="mt-6 flex-1">
                <TabsContent value="dashboard" className="space-y-6 h-full overflow-y-auto">
                  <div className="pr-6">
                    <DashboardStats stats={stats} onStatClick={handleStatClick} />
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                      <QueueStatus chats={chats} onQueueAction={handleQueueAction} />
                      <RecentActivity activities={activities} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="chat" className="h-full">
                  <div className="flex h-full -mx-6">
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

                <TabsContent value="responses" className="h-full overflow-y-auto pr-6">
                  <CannedResponses onSelectResponse={() => {}} isSelectionMode={false} />
                </TabsContent>

                <TabsContent value="customer" className="h-full overflow-y-auto pr-6">
                  <CustomerInfo customer={getSelectedCustomer()} />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="mt-auto p-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Today's Chats:</span>
                  <span className="font-medium text-blue-900">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Avg Response:</span>
                  <span className="font-medium text-blue-900">2.3min</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AgentDashboard;
