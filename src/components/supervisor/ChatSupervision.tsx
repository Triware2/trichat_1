
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Send, 
  Eye, 
  UserCheck, 
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';

interface Chat {
  id: number;
  customer: string;
  agent: string;
  status: 'active' | 'pending' | 'escalated';
  priority: 'High' | 'Medium' | 'Low';
  lastMessage: string;
  time: string;
  unread: number;
  messages: Array<{
    id: number;
    sender: 'agent' | 'customer' | 'supervisor';
    message: string;
    time: string;
  }>;
}

export const ChatSupervision = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [supervisorMessage, setSupervisorMessage] = useState('');
  const { toast } = useToast();

  const activeChats: Chat[] = [
    {
      id: 1,
      customer: "John Smith",
      agent: "Sarah Johnson",
      status: "active",
      priority: "High",
      lastMessage: "I need help with my order urgently",
      time: "2 min ago",
      unread: 2,
      messages: [
        { id: 1, sender: "customer", message: "Hi, I need help with my recent order #12345", time: "10:30 AM" },
        { id: 2, sender: "agent", message: "Hello! I'd be happy to help you with your order.", time: "10:31 AM" },
        { id: 3, sender: "customer", message: "It was supposed to arrive yesterday but I haven't received it yet", time: "10:32 AM" },
        { id: 4, sender: "agent", message: "Let me check the tracking information for you.", time: "10:33 AM" },
        { id: 5, sender: "customer", message: "I need help with my order urgently", time: "10:35 AM" }
      ]
    },
    {
      id: 2,
      customer: "Emily Davis",
      agent: "Mike Chen",
      status: "escalated",
      priority: "High",
      lastMessage: "This issue needs supervisor attention",
      time: "5 min ago",
      unread: 3,
      messages: [
        { id: 1, sender: "customer", message: "I can't access my account and I'm losing business", time: "10:25 AM" },
        { id: 2, sender: "agent", message: "I understand your concern. Let me try to help.", time: "10:26 AM" },
        { id: 3, sender: "customer", message: "This is taking too long, I need immediate help!", time: "10:28 AM" },
        { id: 4, sender: "agent", message: "This issue needs supervisor attention", time: "10:30 AM" }
      ]
    },
    {
      id: 3,
      customer: "Robert Wilson",
      agent: "Emily Rodriguez",
      status: "pending",
      priority: "Medium",
      lastMessage: "Waiting for technical team response",
      time: "8 min ago",
      unread: 1,
      messages: [
        { id: 1, sender: "customer", message: "My software keeps crashing", time: "10:20 AM" },
        { id: 2, sender: "agent", message: "I'll need to check with our technical team.", time: "10:22 AM" },
        { id: 3, sender: "customer", message: "How long will this take?", time: "10:25 AM" },
        { id: 4, sender: "agent", message: "Waiting for technical team response", time: "10:27 AM" }
      ]
    }
  ];

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
      'active': 'default',
      'pending': 'secondary',
      'escalated': 'destructive'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const filteredChats = activeChats.filter(chat => {
    const matchesSearch = chat.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || chat.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleChatSelect = (chatId: number) => {
    setSelectedChat(chatId);
    const chat = activeChats.find(c => c.id === chatId);
    toast({
      title: "Chat selected",
      description: `Viewing conversation between ${chat?.agent} and ${chat?.customer}`,
    });
  };

  const handleSendSupervisorMessage = () => {
    if (supervisorMessage.trim() && selectedChatData) {
      const newMessage = {
        id: selectedChatData.messages.length + 1,
        sender: 'supervisor' as const,
        message: supervisorMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // In a real app, this would update the chat data
      setSupervisorMessage('');
      
      toast({
        title: "Message sent",
        description: `Your message has been sent to the conversation between ${selectedChatData.agent} and ${selectedChatData.customer}`,
      });
    }
  };

  const handleTakeOver = () => {
    if (selectedChatData) {
      toast({
        title: "Chat taken over",
        description: `You are now handling the conversation with ${selectedChatData.customer}`,
      });
    }
  };

  const handleEscalateToManager = () => {
    if (selectedChatData) {
      toast({
        title: "Escalated to manager",
        description: `Chat with ${selectedChatData.customer} has been escalated to management`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chat Supervision</h2>
          <p className="text-gray-600">Monitor and participate in ongoing customer conversations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{filteredChats.length} Active Chats</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Active Conversations
              </CardTitle>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={filterStatus === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                  >
                    All
                  </Button>
                  <Button 
                    variant={filterStatus === 'escalated' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('escalated')}
                  >
                    Escalated
                  </Button>
                  <Button 
                    variant={filterStatus === 'pending' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('pending')}
                  >
                    Pending
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredChats.map((chat) => (
                  <div 
                    key={chat.id} 
                    className={`p-4 hover:bg-gray-50 cursor-pointer border-b transition-colors ${
                      selectedChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{chat.customer}</h4>
                        <p className="text-sm text-gray-600">Agent: {chat.agent}</p>
                      </div>
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
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedChatData.customer}</CardTitle>
                    <CardDescription>
                      Handled by {selectedChatData.agent} • {getStatusBadge(selectedChatData.status)} • {getPriorityBadge(selectedChatData.priority)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleTakeOver}>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Take Over
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleEscalateToManager}>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Escalate
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedChatData.messages.map((message) => (
                    <div key={message.id} className={`flex ${
                      message.sender === 'agent' || message.sender === 'supervisor' ? 'justify-end' : 'justify-start'
                    }`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'supervisor' 
                          ? 'bg-purple-600 text-white border-l-4 border-l-purple-800'
                          : message.sender === 'agent' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-900'
                      }`}>
                        {message.sender === 'supervisor' && (
                          <p className="text-xs text-purple-100 mb-1">Supervisor</p>
                        )}
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'supervisor' ? 'text-purple-100' :
                          message.sender === 'agent' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Supervisor Message Input */}
                <div className="p-4 border-t bg-purple-50">
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Send message as supervisor..."
                      value={supervisorMessage}
                      onChange={(e) => setSupervisorMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendSupervisorMessage();
                        }
                      }}
                      className="flex-1 border-purple-200 focus:border-purple-400"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleSendSupervisorMessage}
                      disabled={!supervisorMessage.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-purple-700 mt-1">
                    Your messages will be marked as supervisor interventions
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <div className="text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a conversation to monitor and participate</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
