import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Headphones, 
  MessageSquare, 
  Mail, 
  Phone, 
  Video, 
  FileText, 
  BookOpen, 
  Search, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Users,
  Settings,
  Globe,
  Database,
  Cpu,
  Network,
  Layers,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Send,
  Plus,
  Calendar,
  Star,
  TrendingUp,
  Award,
  Rocket,
  Lightbulb,
  Bot,
  Code,
  Palette,
  Workflow,
  Key,
  Bell,
  Eye,
  Reply,
  Archive,
  Trash2,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  User,
  Tag,
  CreditCard,
  ChevronRight,
  ArrowRight,
  Activity,
  MessageCircle,
  PhoneCall,
  VideoIcon,
  FileText as FileTextIcon,
  TrendingDown,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  Info as InfoIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Globe as GlobeIcon,
  Database as DatabaseIcon,
  Cpu as CpuIcon,
  Network as NetworkIcon,
  Layers as LayersIcon,
  Sparkles as SparklesIcon,
  HelpCircle as HelpCircleIcon,
  ExternalLink as ExternalLinkIcon,
  Send as SendIcon,
  Plus as PlusIcon,
  Calendar as CalendarIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Award as AwardIcon,
  Rocket as RocketIcon,
  Lightbulb as LightbulbIcon,
  Bot as BotIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  Workflow as WorkflowIcon,
  Key as KeyIcon,
  Bell as BellIcon
} from 'lucide-react';

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  subject: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  response?: string;
  attachments?: string[];
}

const CreatorSupportManagement = () => {
  const { user } = useAuth();
  const { isPlatformCreator } = useFeatureAccess();
  const { toast } = useToast();
  
  console.log('CreatorSupportManagement rendering', { user, isPlatformCreator });
  
  // Add a visible indicator for testing
  useEffect(() => {
    console.log('CreatorSupportManagement mounted successfully');
  }, []);
  
  // State management
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [liveChats, setLiveChats] = useState<Array<{
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    status: 'active' | 'waiting' | 'ended';
    lastMessage: string;
    lastMessageTime: Date;
    messages: Array<{id: string; message: string; sender: 'user' | 'agent'; timestamp: Date}>;
  }>>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [response, setResponse] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    urgentTickets: 0,
    activeChats: 0,
    waitingChats: 0
  });

  // Simulate real-time notifications to users
  const sendUserNotification = (userId: string, type: string, data: any) => {
    // In a real app, this would use WebSockets, push notifications, or email
    console.log(`🔔 Notification sent to user ${userId}:`, {
      type,
      data,
      timestamp: new Date().toISOString(),
      channel: 'real-time'
    });
  };

  const sendEmailNotification = (email: string, subject: string, message: string) => {
    // In a real app, this would integrate with an email service
    console.log(`📧 Email sent to ${email}:`, {
      subject,
      message,
      timestamp: new Date().toISOString(),
      channel: 'email'
    });
  };

  // Check if user is platform creator
  useEffect(() => {
    if (!isPlatformCreator) {
      // Redirect to dashboard if not creator
      window.location.href = '/dashboard';
    }
  }, [isPlatformCreator]);

  // Load support tickets
  useEffect(() => {
    if (isPlatformCreator) {
      loadTickets();
    }
  }, [isPlatformCreator]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      const mockTickets: SupportTicket[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          category: 'technical',
          priority: 'high',
          status: 'open',
          subject: 'Chatbot not responding',
          description: 'My chatbot has stopped responding to customer messages. It was working fine yesterday.',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Jane Smith',
          userEmail: 'jane@example.com',
          category: 'billing',
          priority: 'medium',
          status: 'in_progress',
          subject: 'Payment method update',
          description: 'I need to update my payment method for the subscription.',
          createdAt: '2024-01-14T15:45:00Z',
          updatedAt: '2024-01-15T09:20:00Z',
          assignedTo: 'support@stellar-cx.com'
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Mike Johnson',
          userEmail: 'mike@example.com',
          category: 'features',
          priority: 'low',
          status: 'resolved',
          subject: 'Feature request: Dark mode',
          description: 'I would like to request a dark mode feature for the dashboard.',
          createdAt: '2024-01-13T12:15:00Z',
          updatedAt: '2024-01-14T16:30:00Z',
          assignedTo: 'support@stellar-cx.com',
          response: 'Thank you for your feature request. We have added this to our roadmap and will notify you when it\'s available.'
        }
      ];
      
      // Mock live chats
      const mockChats = [
        {
          id: 'chat1',
          userId: 'user4',
          userName: 'Alice Brown',
          userEmail: 'alice@example.com',
          status: 'active' as const,
          lastMessage: 'I need help with my chatbot configuration',
          lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          messages: [
            {
              id: '1',
              message: 'Hello! I need help with my chatbot configuration',
              sender: 'user' as const,
              timestamp: new Date(Date.now() - 10 * 60 * 1000)
            },
            {
              id: '2',
              message: 'Hello Alice! I\'d be happy to help you with your chatbot configuration. What specific issue are you experiencing?',
              sender: 'agent' as const,
              timestamp: new Date(Date.now() - 8 * 60 * 1000)
            },
            {
              id: '3',
              message: 'I need help with my chatbot configuration',
              sender: 'user' as const,
              timestamp: new Date(Date.now() - 5 * 60 * 1000)
            }
          ]
        },
        {
          id: 'chat2',
          userId: 'user5',
          userName: 'Bob Wilson',
          userEmail: 'bob@example.com',
          status: 'waiting' as const,
          lastMessage: 'My payment failed',
          lastMessageTime: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
          messages: [
            {
              id: '1',
              message: 'My payment failed',
              sender: 'user' as const,
              timestamp: new Date(Date.now() - 2 * 60 * 1000)
            }
          ]
        }
      ];
      
      setTickets(mockTickets);
      setLiveChats(mockChats);
      
      // Calculate stats
      const ticketStats = {
        totalTickets: mockTickets.length,
        openTickets: mockTickets.filter(t => t.status === 'open').length,
        inProgressTickets: mockTickets.filter(t => t.status === 'in_progress').length,
        resolvedTickets: mockTickets.filter(t => t.status === 'resolved').length,
        urgentTickets: mockTickets.filter(t => t.priority === 'urgent').length,
        activeChats: mockChats.filter(c => c.status === 'active').length,
        waitingChats: mockChats.filter(c => c.status === 'waiting').length
      };
      
      setStats(ticketStats);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load support tickets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return Cpu;
      case 'billing':
        return CreditCard;
      case 'features':
        return Sparkles;
      case 'general':
        return HelpCircle;
      default:
        return FileText;
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus as any, updatedAt: new Date().toISOString() }
          : ticket
      ));
      
      toast({
        title: "Status Updated",
        description: "Ticket status has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive"
      });
    }
  };

  const handleSendResponse = async () => {
    if (!selectedTicket || !response.trim()) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update ticket with response
      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { ...ticket, response, status: 'resolved' as const, updatedAt: new Date().toISOString() }
          : ticket
      ));
      
      // Send notifications to user
      sendEmailNotification(
        selectedTicket.userEmail, 
        `Re: ${selectedTicket.subject}`, 
        `Your support ticket has been updated.\n\nResponse: ${response}\n\nTicket ID: ${selectedTicket.id}`
      );
      
      sendUserNotification(selectedTicket.userId, 'ticket_response', {
        ticketId: selectedTicket.id,
        subject: selectedTicket.subject,
        message: response,
        agentName: 'Support Team',
        status: 'resolved'
      });
      
      toast({
        title: "Response Sent",
        description: `Response sent to ${selectedTicket.userName} (${selectedTicket.userEmail})`,
      });
      
      setShowResponseDialog(false);
      setResponse('');
      setSelectedTicket(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatMessage.trim() || !selectedChat) return;

    const agentMessage = {
      id: Date.now().toString(),
      message: chatMessage,
      sender: 'agent' as const,
      timestamp: new Date()
    };

    // Update chat with new message
    setLiveChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { 
            ...chat, 
            messages: [...chat.messages, agentMessage],
            lastMessage: chatMessage,
            lastMessageTime: new Date()
          }
        : chat
    ));

    // Update selected chat
    setSelectedChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, agentMessage],
      lastMessage: chatMessage,
      lastMessageTime: new Date()
    } : null);

    // Send real-time notifications to user
    sendUserNotification(selectedChat.userId, 'live_chat_message', {
      chatId: selectedChat.id,
      message: chatMessage,
      agentName: 'Sarah (Support Team)',
      agentId: 'support_agent_001'
    });

    // Simulate WebSocket message delivery
    console.log(`💬 Live chat message delivered to ${selectedChat.userName} (${selectedChat.userEmail}):`, {
      chatId: selectedChat.id,
      message: chatMessage,
      timestamp: new Date().toISOString(),
      agentId: 'support_agent_001',
      agentName: 'Sarah (Support Team)',
      deliveryStatus: 'delivered'
    });

    setChatMessage('');

    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedChat.userName} in live chat`,
    });
  };

  if (!isPlatformCreator) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300">
              <Headphones className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                Support Management
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                Manage and respond to user support requests. Provide world-class support experience to your users.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg"
                onClick={loadTickets}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-xl"
              >
                <RefreshCw className={`w-5 h-5 mr-3 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('/support', '_blank')}
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-xl bg-white/80 backdrop-blur-sm"
              >
                <ExternalLink className="w-5 h-5 mr-3" />
                View Support Page
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Stats Overview */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg mb-6">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
              Support Overview
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Real-time statistics and metrics for your support operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
            {[
              { 
                label: 'Total Tickets', 
                value: stats.totalTickets, 
                icon: FileText, 
                color: 'from-blue-500 to-blue-600', 
                gradient: 'from-blue-500 to-blue-600',
                action: () => {
                  setActiveTab('tickets');
                  setFilterStatus('all');
                  setFilterPriority('all');
                  toast({
                    title: "Filter Applied",
                    description: "Showing all tickets",
                  });
                }
              },
              { 
                label: 'Open', 
                value: stats.openTickets, 
                icon: AlertCircle, 
                color: 'from-red-500 to-red-600', 
                gradient: 'from-red-500 to-red-600',
                action: () => {
                  setActiveTab('tickets');
                  setFilterStatus('open');
                  toast({
                    title: "Filter Applied",
                    description: "Showing open tickets only",
                  });
                }
              },
              { 
                label: 'In Progress', 
                value: stats.inProgressTickets, 
                icon: Clock, 
                color: 'from-orange-500 to-orange-600', 
                gradient: 'from-orange-500 to-orange-600',
                action: () => {
                  setActiveTab('tickets');
                  setFilterStatus('in_progress');
                  toast({
                    title: "Filter Applied",
                    description: "Showing in-progress tickets only",
                  });
                }
              },
              { 
                label: 'Resolved', 
                value: stats.resolvedTickets, 
                icon: CheckCircle, 
                color: 'from-emerald-500 to-emerald-600', 
                gradient: 'from-emerald-500 to-emerald-600',
                action: () => {
                  setActiveTab('tickets');
                  setFilterStatus('resolved');
                  toast({
                    title: "Filter Applied",
                    description: "Showing resolved tickets only",
                  });
                }
              },
              { 
                label: 'Urgent', 
                value: stats.urgentTickets, 
                icon: Bell, 
                color: 'from-red-500 to-red-600', 
                gradient: 'from-red-500 to-red-600',
                action: () => {
                  setActiveTab('tickets');
                  setFilterPriority('urgent');
                  toast({
                    title: "Filter Applied",
                    description: "Showing urgent tickets only",
                  });
                }
              },
              { 
                label: 'Active Chats', 
                value: stats.activeChats, 
                icon: MessageCircle, 
                color: 'from-emerald-500 to-emerald-600', 
                gradient: 'from-emerald-500 to-emerald-600',
                action: () => {
                  setActiveTab('chats');
                  toast({
                    title: "Live Chats",
                    description: "Showing active chat sessions",
                  });
                }
              },
              { 
                label: 'Waiting', 
                value: stats.waitingChats, 
                icon: Clock, 
                color: 'from-yellow-500 to-yellow-600', 
                gradient: 'from-yellow-500 to-yellow-600',
                action: () => {
                  setActiveTab('chats');
                  toast({
                    title: "Waiting Chats",
                    description: "Showing chats waiting for response",
                  });
                }
              }
            ].map((stat) => (
              <Card 
                key={stat.label} 
                className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden cursor-pointer"
                onClick={stat.action}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-1">
            <TabsTrigger value="tickets" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Support Tickets
            </TabsTrigger>
            <TabsTrigger value="chats" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              Live Chats
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            {/* Filters */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tickets List */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Support Tickets</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage and respond to user support requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets found</h3>
                    <p className="text-gray-600">No support tickets match your current filters.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets
                      .filter(ticket => {
                        // Filter by status
                        if (filterStatus !== 'all' && ticket.status !== filterStatus) return false;
                        // Filter by priority
                        if (filterPriority !== 'all' && ticket.priority !== filterPriority) return false;
                        // Filter by search query
                        if (searchQuery && !ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) && 
                            !ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
                            !ticket.userName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                        return true;
                      })
                      .map((ticket) => (
                      <Card 
                        key={ticket.id} 
                        className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowTicketDialog(true);
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <CardContent className="relative p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                {(() => {
                                  const IconComponent = getCategoryIcon(ticket.category);
                                  return <IconComponent className="w-6 h-6 text-white" />;
                                })()}
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">{ticket.subject}</h4>
                                <p className="text-sm text-gray-600">by {ticket.userName}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status.replace('_', ' ')}
                              </Badge>
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ticket.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {ticket.userEmail}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Chats Tab */}
          <TabsContent value="chats" className="space-y-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Live Chat Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Monitor and respond to active live chat sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {liveChats.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No active chats</h3>
                    <p className="text-gray-600">No live chat sessions are currently active.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {liveChats.map((chat) => (
                      <Card 
                        key={chat.id} 
                        className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden"
                        onClick={() => {
                          setSelectedChat(chat);
                          setShowChatDialog(true);
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <CardContent className="relative p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                                chat.status === 'active' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 
                                chat.status === 'waiting' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' : 
                                'bg-gradient-to-br from-gray-500 to-gray-600'
                              }`}>
                                <MessageCircle className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">{chat.userName}</h4>
                                <p className="text-sm text-gray-600">{chat.userEmail}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={
                                chat.status === 'active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                chat.status === 'waiting' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                'bg-gray-100 text-gray-800 border-gray-200'
                              }>
                                {chat.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">{chat.lastMessage}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {chat.lastMessageTime.toLocaleTimeString()}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              {chat.messages.length} messages
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Support Analytics</CardTitle>
                <CardDescription className="text-gray-600">
                  Insights and metrics for your support operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-blue-600">85%</span>
                    </div>
                    <h3 className="font-semibold text-blue-900 mb-2">Customer Satisfaction</h3>
                    <p className="text-blue-700 text-sm">Based on recent support interactions</p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-emerald-600">2.3h</span>
                    </div>
                    <h3 className="font-semibold text-emerald-900 mb-2">Average Response Time</h3>
                    <p className="text-emerald-700 text-sm">Time to first response</p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-purple-600">94%</span>
                    </div>
                    <h3 className="font-semibold text-purple-900 mb-2">Resolution Rate</h3>
                    <p className="text-purple-700 text-sm">Tickets resolved successfully</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ticket Details Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Ticket Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Subject</Label>
                  <p className="text-gray-900 font-medium">{selectedTicket.subject}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Category</Label>
                  <p className="text-gray-900">{selectedTicket.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Priority</Label>
                  <Badge className={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Badge className={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <p className="text-gray-900 mt-1">{selectedTicket.description}</p>
              </div>
              
              {selectedTicket.response && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Response</Label>
                  <p className="text-gray-900 mt-1">{selectedTicket.response}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowTicketDialog(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowTicketDialog(false);
                    setShowResponseDialog(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Reply className="w-4 h-4 mr-2" />
                  Respond
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              Live Chat - {selectedChat?.userName}
            </DialogTitle>
            <DialogDescription>
              Chat with {selectedChat?.userName} in real-time
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col">
            {selectedChat && (
              <>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg">
                  {selectedChat.messages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Chat Input */}
                <div className="flex gap-2 pt-4">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your response..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendChatMessage}
                    disabled={!chatMessage.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Response</DialogTitle>
            <DialogDescription>
              Send a response to the user regarding their support ticket.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="response">Response</Label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter your response..."
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowResponseDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendResponse} className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Send Response
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatorSupportManagement; 