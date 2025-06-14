
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreHorizontal,
  Clock,
  User,
  Star,
  History
} from 'lucide-react';
import { NavigationHeader } from '@/components/NavigationHeader';

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [message, setMessage] = useState('');

  const activeChats = [
    {
      id: 1,
      customer: "John Smith",
      lastMessage: "I need help with my order",
      time: "2 min ago",
      status: "urgent",
      unread: 2
    },
    {
      id: 2,
      customer: "Sarah Wilson",
      lastMessage: "Thank you for your help!",
      time: "5 min ago",
      status: "resolved",
      unread: 0
    },
    {
      id: 3,
      customer: "Mike Johnson",
      lastMessage: "When will my refund be processed?",
      time: "8 min ago",
      status: "pending",
      unread: 1
    }
  ];

  const chatHistory = [
    {
      sender: "customer",
      message: "Hi, I need help with my recent order #12345",
      time: "10:30 AM"
    },
    {
      sender: "agent",
      message: "Hello! I'd be happy to help you with your order. Let me look that up for you.",
      time: "10:31 AM"
    },
    {
      sender: "customer",
      message: "It was supposed to arrive yesterday but I haven't received it yet",
      time: "10:32 AM"
    },
    {
      sender: "agent",
      message: "I can see your order here. It looks like there was a delay in shipping. Let me check the tracking information.",
      time: "10:33 AM"
    }
  ];

  const quickResponses = [
    "Thank you for contacting us!",
    "I'd be happy to help you with that.",
    "Let me check that information for you.",
    "Is there anything else I can help you with?",
    "Thank you for your patience."
  ];

  const customerInfo = {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    previousChats: 3,
    satisfaction: "4.8/5",
    lastContact: "2 weeks ago"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader 
        title="Agent Dashboard" 
        role="agent"
        userEmail="agent@supportpro.com"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Active Chats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {activeChats.map((chat) => (
                    <div key={chat.id} className="p-4 hover:bg-gray-50 cursor-pointer border-b">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{chat.customer}</h4>
                        {chat.unread > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{chat.time}</span>
                        <Badge 
                          variant={chat.status === 'urgent' ? 'destructive' : 
                                 chat.status === 'resolved' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {chat.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      JS
                    </div>
                    <div>
                      <h3 className="font-medium">{customerInfo.name}</h3>
                      <p className="text-sm text-gray-500">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 p-4">
                <div className="h-96 overflow-y-auto space-y-4 mb-4">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'agent' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === 'agent' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Responses */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Quick Responses:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickResponses.slice(0, 3).map((response, index) => (
                      <Button 
                        key={index}
                        variant="outline" 
                        size="sm"
                        onClick={() => setMessage(response)}
                        className="text-xs"
                      >
                        {response}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input 
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{customerInfo.name}</h4>
                  <p className="text-sm text-gray-600">{customerInfo.email}</p>
                  <p className="text-sm text-gray-600">{customerInfo.phone}</p>
                  <p className="text-sm text-gray-600">{customerInfo.location}</p>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Previous Chats:</span>
                      <span className="text-sm font-medium">{customerInfo.previousChats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Satisfaction:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{customerInfo.satisfaction}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Contact:</span>
                      <span className="text-sm font-medium">{customerInfo.lastContact}</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <History className="w-4 h-4 mr-2" />
                  View History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
