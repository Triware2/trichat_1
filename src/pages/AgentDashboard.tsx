
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Clock,
  User,
  Star,
  History,
  CheckCircle,
  MessageCircle
} from 'lucide-react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { ChatInterface } from '@/components/agent/ChatInterface';
import { CustomerInfo } from '@/components/agent/CustomerInfo';
import { CannedResponses } from '@/components/agent/CannedResponses';
import { ChatList } from '@/components/agent/ChatList';
import { DashboardStats } from '@/components/agent/DashboardStats';
import { QueueStatus } from '@/components/agent/QueueStatus';
import { RecentActivity } from '@/components/agent/RecentActivity';

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(1);
  const { toast } = useToast();

  const activeChats = [
    {
      id: 1,
      customer: "John Smith",
      lastMessage: "I need help with my order",
      time: "2 min ago",
      status: "urgent",
      unread: 2,
      priority: "High"
    },
    {
      id: 2,
      customer: "Sarah Wilson",
      lastMessage: "Thank you for your help!",
      time: "5 min ago",
      status: "resolved",
      unread: 0,
      priority: "Low"
    },
    {
      id: 3,
      customer: "Mike Johnson",
      lastMessage: "When will my refund be processed?",
      time: "8 min ago",
      status: "pending",
      unread: 1,
      priority: "Medium"
    },
    {
      id: 4,
      customer: "Emily Davis",
      lastMessage: "I can't access my account",
      time: "12 min ago",
      status: "urgent",
      unread: 3,
      priority: "High"
    }
  ];

  const customerData = {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    customerSince: "2023",
    tier: "Premium",
    previousChats: 8,
    satisfaction: 4.8,
    lastContact: "2 weeks ago",
    totalOrders: 12,
    totalSpent: "$2,450"
  };

  const todayStats = [
    {
      title: "Chats Handled",
      value: "12",
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      title: "Avg Response Time",
      value: "1.8m",
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "Satisfaction Rate",
      value: "96%",
      icon: Star,
      color: "text-yellow-600"
    },
    {
      title: "Resolved Issues",
      value: "10",
      icon: CheckCircle,
      color: "text-purple-600"
    }
  ];

  const recentActivity = [
    {
      customer: "Alice Cooper",
      action: "Chat resolved",
      time: "5 min ago",
      type: "success"
    },
    {
      customer: "Bob Wilson",
      action: "Escalated to supervisor",
      time: "15 min ago",
      type: "warning"
    },
    {
      customer: "Carol Brown",
      action: "New chat assigned",
      time: "20 min ago",
      type: "info"
    }
  ];

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    toast({
      title: "Message sent",
      description: "Your message has been delivered to the customer.",
    });
  };

  const handleChatSelect = (chatId: number) => {
    setSelectedChat(chatId);
    toast({
      title: "Chat selected",
      description: `Switched to conversation with ${activeChats.find(c => c.id === chatId)?.customer}`,
    });
  };

  const handleFilterChats = () => {
    toast({
      title: "Filter applied",
      description: "Chat filters have been applied.",
    });
  };

  const handleViewHistory = () => {
    toast({
      title: "Opening history",
      description: "Loading detailed chat history...",
    });
  };

  const handleStatClick = (statTitle: string) => {
    toast({
      title: "Stat details",
      description: `Viewing details for: ${statTitle}`,
    });
  };

  const handleQueueAction = (customer: string) => {
    toast({
      title: "Queue action",
      description: `Opening conversation with ${customer}`,
    });
  };

  const selectedChatData = activeChats.find(chat => chat.id === selectedChat);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader 
        title="Agent Dashboard" 
        role="agent"
        userEmail="agent@supportpro.com"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white border">
            <TabsTrigger value="chats" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Active Chats
            </TabsTrigger>
            <TabsTrigger value="responses" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Canned Responses
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <ChatList 
                  chats={activeChats}
                  selectedChat={selectedChat}
                  onChatSelect={handleChatSelect}
                  onFilter={handleFilterChats}
                />
              </div>

              <div className="lg:col-span-2">
                {selectedChatData ? (
                  <ChatInterface
                    customerName={selectedChatData.customer}
                    customerStatus="Online"
                    onSendMessage={handleSendMessage}
                  />
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Select a chat to start messaging</p>
                    </div>
                  </Card>
                )}
              </div>

              <div className="lg:col-span-1">
                <CustomerInfo customer={customerData} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="responses">
            <CannedResponses />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats stats={todayStats} onStatClick={handleStatClick} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QueueStatus chats={activeChats} onQueueAction={handleQueueAction} />
              <RecentActivity activities={recentActivity} />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Chat History</CardTitle>
                <CardDescription>View and search through your previous conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => handleStatClick("Today")}>
                      <h4 className="font-medium mb-2">Today</h4>
                      <p className="text-2xl font-bold text-blue-600">12</p>
                      <p className="text-sm text-gray-600">Conversations</p>
                    </div>
                    <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => handleStatClick("This Week")}>
                      <h4 className="font-medium mb-2">This Week</h4>
                      <p className="text-2xl font-bold text-green-600">58</p>
                      <p className="text-sm text-gray-600">Conversations</p>
                    </div>
                    <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => handleStatClick("This Month")}>
                      <h4 className="font-medium mb-2">This Month</h4>
                      <p className="text-2xl font-bold text-purple-600">247</p>
                      <p className="text-sm text-gray-600">Conversations</p>
                    </div>
                  </div>
                  
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Detailed chat history interface would appear here</p>
                    <Button variant="outline" className="mt-4" onClick={handleViewHistory}>
                      View Full History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentDashboard;
