
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Clock,
  User,
  Star,
  History,
  CheckCircle,
  AlertCircle,
  Phone
} from 'lucide-react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { ChatInterface } from '@/components/agent/ChatInterface';
import { CustomerInfo } from '@/components/agent/CustomerInfo';

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(1);

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
    // Implementation would send the message to the backend
  };

  const handleChatSelect = (chatId: number) => {
    setSelectedChat(chatId);
  };

  const selectedChatData = activeChats.find(chat => chat.id === selectedChat);

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'High': 'destructive',
      'Medium': 'default',
      'Low': 'secondary'
    } as const;
    return <Badge variant={variants[priority as keyof typeof variants]}>{priority}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'urgent': 'destructive',
      'pending': 'default',
      'resolved': 'secondary'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader 
        title="Agent Dashboard" 
        role="agent"
        userEmail="agent@supportpro.com"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white border">
            <TabsTrigger value="chats" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Active Chats
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
              {/* Chat List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Active Chats</span>
                      <Badge variant="outline">{activeChats.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {activeChats.map((chat) => (
                        <div 
                          key={chat.id} 
                          className={`p-4 hover:bg-gray-50 cursor-pointer border-b transition-colors ${
                            selectedChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}
                          onClick={() => handleChatSelect(chat.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{chat.customer}</h4>
                            <div className="flex items-center gap-2">
                              {chat.unread > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {chat.unread}
                                </Badge>
                              )}
                              {getPriorityBadge(chat.priority)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-2">{chat.lastMessage}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{chat.time}</span>
                            {getStatusBadge(chat.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Interface */}
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

              {/* Customer Info */}
              <div className="lg:col-span-1">
                <CustomerInfo customer={customerData} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Today's Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {todayStats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Queue Status */}
              <Card>
                <CardHeader>
                  <CardTitle>My Queue</CardTitle>
                  <CardDescription>Current assigned conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeChats.slice(0, 3).map((chat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{chat.customer}</p>
                          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(chat.priority)}
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.customer}</span> - {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Today</h4>
                      <p className="text-2xl font-bold text-blue-600">12</p>
                      <p className="text-sm text-gray-600">Conversations</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">This Week</h4>
                      <p className="text-2xl font-bold text-green-600">58</p>
                      <p className="text-sm text-gray-600">Conversations</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">This Month</h4>
                      <p className="text-2xl font-bold text-purple-600">247</p>
                      <p className="text-sm text-gray-600">Conversations</p>
                    </div>
                  </div>
                  
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Detailed chat history interface would appear here</p>
                    <Button variant="outline" className="mt-4">
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
