import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send, Eye, UserCheck, AlertTriangle, Search, Filter, MoreHorizontal, Download, RefreshCw, UserCircle2, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight, Clock, Hash, TrendingUp, Activity, Zap, Target, Users, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Chat {
  id: string;
  customer: string;
  agent: string;
  status: string;
  priority: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface Message {
  id: string;
  sender_id: string | null;
  sender_type: string;
  content: string;
  created_at: string | null;
}

export const ChatSupervision = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [supervisorMessage, setSupervisorMessage] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [myChats, setMyChats] = useState<Chat[]>([]);

  // Auto-refresh functionality
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch chats function (extracted for reuse)
  const fetchChats = async () => {
    setLoadingChats(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('chats')
        .select('id, customer_id, assigned_agent_id, status, priority, updated_at, subject')
        .in('status', ['active', 'escalated'])
        .order('updated_at', { ascending: false });
      if (fetchError) throw new Error('Failed to fetch chats');
      // Fetch customer and agent names
      const customerIds = [...new Set((data || []).map((c: any) => c.customer_id).filter(Boolean))];
      const agentIds = [...new Set((data || []).map((c: any) => c.assigned_agent_id).filter(Boolean))];
      const [{ data: customers }, { data: agents }] = await Promise.all([
        customerIds.length > 0 ? supabase.from('customers').select('id, name').in('id', customerIds) : { data: [] },
        agentIds.length > 0 ? supabase.from('profiles').select('id, full_name').in('id', agentIds) : { data: [] },
      ]);
      const getName = (id: string, arr: any[], key: string) => arr?.find((a: any) => a.id === id)?.[key] || 'Unknown';
      const mappedChats = (data || []).map((c: any) => ({
        id: c.id,
        customer: getName(c.customer_id, customers, 'name'),
        agent: getName(c.assigned_agent_id, agents, 'full_name'),
        status: c.status,
        priority: c.priority,
        lastMessage: c.subject || '',
        time: c.updated_at ? new Date(c.updated_at).toLocaleString() : '',
        unread: 0,
      }));
      setChats(mappedChats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch chats');
    } finally {
      setLoadingChats(false);
    }
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    await fetchChats();
    if (selectedChatId) {
      // Also refresh messages for selected chat
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', selectedChatId)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    }
    toast({
      title: 'Refreshed',
      description: 'Chat data has been updated.',
    });
  };

  // Fetch chats
  useEffect(() => {
    fetchChats();
  }, []);

  // Auto-refresh setup
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        fetchChats();
        // Also refresh messages if a chat is selected
        if (selectedChatId) {
          supabase
            .from('messages')
            .select('*')
            .eq('chat_id', selectedChatId)
            .order('created_at', { ascending: true })
            .then(({ data }) => {
              if (data) setMessages(data);
            });
        }
      }, 30000); // Refresh every 30 seconds
      
      setRefreshInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
  }, [isAutoRefresh, selectedChatId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChatId) return;
    const fetchMessages = async () => {
      setLoadingMessages(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', selectedChatId)
          .order('created_at', { ascending: true });
        if (fetchError) throw new Error('Failed to fetch messages');
        setMessages(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch messages');
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedChatId]);

  // Fetch chats assigned to supervisor
  useEffect(() => {
    if (!user?.id) return;
    const fetchMyChats = async () => {
      try {
        const { data, error } = await supabase
          .from('chats')
          .select('id, customer_id, assigned_agent_id, status, priority, updated_at, subject')
          .eq('assigned_agent_id', user.id)
          .in('status', ['active', 'escalated'])
          .order('updated_at', { ascending: false });
        if (error) throw new Error('Failed to fetch my chats');
        // Fetch customer names
        const customerIds = [...new Set((data || []).map((c: any) => c.customer_id).filter(Boolean))];
        const { data: customers } = customerIds.length > 0
          ? await supabase.from('customers').select('id, name').in('id', customerIds)
          : { data: [] };
        const getName = (id: string, arr: any[], key: string) => arr?.find((a: any) => a.id === id)?.[key] || 'Unknown';
        const mappedChats = (data || []).map((c: any) => ({
          id: c.id,
          customer: getName(c.customer_id, customers, 'name'),
          agent: user.id,
          status: c.status,
          priority: c.priority,
          lastMessage: c.subject || '',
          time: c.updated_at ? new Date(c.updated_at).toLocaleString() : '',
          unread: 0,
        }));
        setMyChats(mappedChats);
      } catch (err) {
        setMyChats([]);
      }
    };
    fetchMyChats();
  }, [user?.id, chats]);

  // Filtered chats
  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || chat.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Selected chat object
  const selectedChat = selectedChatId ? chats.find(c => c.id === selectedChatId) : null;

  // Send supervisor message
  const handleSendMessage = async () => {
    if (!supervisorMessage.trim() || !selectedChatId || !user?.id) return;
    setSending(true);
    setError(null);
    try {
      const supervisorId = user.id;
      const { error: sendError } = await supabase.from('messages').insert([
        {
          chat_id: selectedChatId,
          sender_id: supervisorId,
          sender_type: 'supervisor',
          message_type: 'text',
          content: supervisorMessage.trim(),
          created_at: new Date().toISOString(),
        },
      ]);
      if (sendError) throw new Error('Failed to send message');
      setSupervisorMessage('');
      toast({
        title: 'Message sent',
        description: 'Your message has been sent as supervisor.',
      });
      // Refresh messages
      const { data } = await supabase
        .from('messages')
        .select('id, sender_id, sender_type, content, created_at')
        .eq('chat_id', selectedChatId)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Send supervisor message (renamed for clarity)
  const handleSendSupervisorMessage = handleSendMessage;

  // Take over chat (assign to supervisor)
  const handleTakeOver = async () => {
    if (!selectedChatId || !user?.id) return;
    setError(null);
    try {
      const supervisorId = user.id;
      // Update chat assignment
      const { error: updateError } = await supabase
        .from('chats')
        .update({ assigned_agent_id: supervisorId })
        .eq('id', selectedChatId);
      if (updateError) throw new Error('Failed to take over chat');
      // Log assignment in chat_assignments table
      const { error: logError } = await supabase
        .from('chat_assignments')
        .insert([
          {
            chat_id: selectedChatId,
            agent_id: supervisorId,
            assigned_by: supervisorId,
            assigned_at: new Date().toISOString(),
            is_active: true,
          },
        ]);
      if (logError) throw new Error('Takeover succeeded, but failed to log assignment');
      toast({
        title: 'Chat taken over',
        description: 'You are now handling this conversation.',
      });
      // Refresh chats
      const { data, error: fetchError } = await supabase
        .from('chats')
        .select('id, customer_id, assigned_agent_id, status, priority, updated_at, subject')
        .in('status', ['active', 'escalated'])
        .order('updated_at', { ascending: false });
      if (!fetchError) {
        setChats((data || []).map((c: any) => ({
          id: c.id,
          customer: c.customer_id,
          agent: c.assigned_agent_id,
          status: c.status,
          priority: c.priority,
          lastMessage: c.subject || '',
          time: c.updated_at ? new Date(c.updated_at).toLocaleString() : '',
          unread: 0,
        })));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to take over chat');
      toast({
        title: 'Error',
        description: err.message || 'Failed to take over chat',
        variant: 'destructive',
      });
    }
  };

  // Escalate chat
  const handleEscalate = async () => {
    if (!selectedChatId || !user?.id) return;
    setError(null);
    try {
      // Update chat status to escalated and increase priority
      const { error: updateError } = await supabase
        .from('chats')
        .update({ 
          status: 'escalated',
          priority: 'high',
          escalated_at: new Date().toISOString(),
          escalated_by: user.id
        })
        .eq('id', selectedChatId);
      
      if (updateError) throw new Error('Failed to escalate chat');

      // Create escalation log
      const { error: logError } = await supabase
        .from('chat_escalations')
        .insert([
          {
            chat_id: selectedChatId,
            escalated_by: user.id,
            escalated_at: new Date().toISOString(),
            reason: 'Supervisor escalation',
            priority_level: 'high'
          }
        ]);

      if (logError) {
        console.warn('Failed to log escalation:', logError);
      }

      // Send escalation notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([
          {
            type: 'escalation',
            title: 'Chat Escalated',
            message: `Chat ${selectedChatId} has been escalated by supervisor`,
            user_id: user.id,
            metadata: {
              chat_id: selectedChatId,
              escalated_by: user.id,
              priority: 'high'
            }
          }
        ]);

      if (notificationError) {
        console.warn('Failed to send escalation notification:', notificationError);
      }

      toast({
        title: 'Chat escalated',
        description: 'This conversation has been escalated with high priority.',
      });

      // Refresh chats to show updated status
      const { data, error: fetchError } = await supabase
        .from('chats')
        .select('id, customer_id, assigned_agent_id, status, priority, updated_at, subject')
        .in('status', ['active', 'escalated'])
        .order('updated_at', { ascending: false });
      
      if (!fetchError && data) {
        const customerIds = [...new Set((data || []).map((c: any) => c.customer_id).filter(Boolean))];
        const agentIds = [...new Set((data || []).map((c: any) => c.assigned_agent_id).filter(Boolean))];
        const [{ data: customers }, { data: agents }] = await Promise.all([
          customerIds.length > 0 ? supabase.from('customers').select('id, name').in('id', customerIds) : { data: [] },
          agentIds.length > 0 ? supabase.from('profiles').select('id, full_name').in('id', agentIds) : { data: [] },
        ]);
        const getName = (id: string, arr: any[], key: string) => arr?.find((a: any) => a.id === id)?.[key] || 'Unknown';
        const mappedChats = (data || []).map((c: any) => ({
          id: c.id,
          customer: getName(c.customer_id, customers, 'name'),
          agent: getName(c.assigned_agent_id, agents, 'full_name'),
          status: c.status,
          priority: c.priority,
          lastMessage: c.subject || '',
          time: c.updated_at ? new Date(c.updated_at).toLocaleString() : '',
          unread: 0,
        }));
        setChats(mappedChats);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to escalate chat');
      toast({
        title: 'Error',
        description: err.message || 'Failed to escalate chat',
        variant: 'destructive',
      });
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <ArrowUpRight className="w-4 h-4 text-orange-500" />;
      case 'medium': return <ArrowDownRight className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'waiting': return 'secondary';
      case 'transferred': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <>
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #64748b #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #64748b;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-20">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Eye className="w-5 h-5 text-white" />
              </div>
        <div>
                <h1 className="text-2xl font-bold text-slate-900">Chat Supervision</h1>
                <p className="text-sm text-slate-600 mt-1">Monitor and manage live customer conversations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 border-slate-200" onClick={handleRefresh}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh chat list</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-6 h-[calc(100vh-200px)]">
        {myChats.length > 0 ? (
          /* Three-column layout when supervisor has chats - Independent Scrolling */
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Active Conversations Panel - Independent Scroll */}
            <div className="col-span-3 flex flex-col h-full">
              <Card className="flex-1 bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-xl rounded-2xl overflow-hidden flex flex-col">
                {/* Sticky Header */}
                <CardHeader className="flex-shrink-0 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                        <MessageSquare className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-slate-900">Active Conversations</CardTitle>
                        <CardDescription className="text-xs text-slate-600">
                          {chats.length} total • {chats.filter(c => c.status === 'active').length} active
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                      Live
                    </Badge>
                  </div>
                  
                  {/* Sticky Search and Filters */}
                  <div className="mt-3 space-y-2">
                <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <Input
                        placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 h-8 text-xs bg-white/70 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
                    <div className="flex flex-wrap gap-1">
                      {['all', 'active', 'waiting', 'transferred'].map((status) => (
                  <Button 
                          key={status}
                          variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                          onClick={() => setFilterStatus(status)}
                          className={filterStatus === status 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-md text-xs h-7 px-2' 
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 text-xs h-7 px-2'
                          }
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                
                {/* Scrollable Content Area */}
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <div className="h-full overflow-y-auto custom-scrollbar">
                    {loadingChats ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                          <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                          <p className="text-xs text-slate-600">Loading conversations...</p>
                        </div>
                      </div>
                    ) : filteredChats.length === 0 ? (
                      <div className="flex items-center justify-center h-48">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <MessageSquare className="w-6 h-6 text-slate-400" />
                          </div>
                          <h3 className="text-sm font-medium text-slate-900 mb-1">No conversations found</h3>
                          <p className="text-xs text-slate-600">Try adjusting your search or filters</p>
                        </div>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {filteredChats.map((chat) => (
                          <div
                            key={chat.id}
                            onClick={() => setSelectedChatId(chat.id)}
                            className={`p-3 cursor-pointer transition-all duration-200 hover:bg-slate-50/80 ${
                              selectedChatId === chat.id ? 'bg-blue-50/60 border-r-4 border-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-7 h-7 bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md">
                                  <AvatarFallback className="text-white text-xs font-medium">
                                    {chat.customer.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="text-xs font-medium text-slate-900 truncate">{chat.customer}</h4>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          {getPriorityIcon(chat.priority)}
                                        </TooltipTrigger>
                                        <TooltipContent>{chat.priority} priority</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <p className="text-xs text-slate-600">Agent: {chat.agent}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-1">
                                <Badge variant={getStatusBadgeVariant(chat.status)} className="text-xs">
                                  {chat.status}
                                </Badge>
                                {chat.unread > 0 && (
                                  <Badge variant="default" className="bg-red-500 text-white text-xs min-w-[16px] h-4 flex items-center justify-center rounded-full">
                                    {chat.unread}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-xs text-slate-700 line-clamp-2">{chat.lastMessage}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">{chat.time}</span>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-2.5 h-2.5 text-slate-400" />
                                  <span className="text-xs text-slate-500">2m ago</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Chat Panel - Independent Scroll */}
            <div className="col-span-6 flex flex-col h-full">
              <Card className="flex-1 bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-xl rounded-2xl overflow-hidden flex flex-col h-full">
                {selectedChatId ? (
                  <>
                    {/* Sticky Chat Header */}
                    <CardHeader className="flex-shrink-0 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 shadow-md">
                            <AvatarFallback className="text-white font-medium">
                              {selectedChat?.customer.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{selectedChat?.customer}</h3>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-sm text-slate-600">Agent: {selectedChat?.agent}</span>
                              <Badge variant={getStatusBadgeVariant(selectedChat?.status || '')} className="text-xs">
                                {selectedChat?.status}
                              </Badge>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="flex items-center">
                                    {getPriorityIcon(selectedChat?.priority || '')}
                                  </TooltipTrigger>
                                  <TooltipContent>{selectedChat?.priority} priority</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="sm" variant="outline" onClick={handleTakeOver} className="bg-white hover:bg-green-50 border-green-200 text-green-700">
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Take Over
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Take control of this conversation</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="sm" variant="outline" onClick={handleEscalate} className="bg-white hover:bg-red-50 border-red-200 text-red-700">
                                  <AlertTriangle className="w-4 h-4 mr-2" />
                                  Escalate
                  </Button>
                              </TooltipTrigger>
                              <TooltipContent>Escalate this conversation</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button size="sm" variant="outline" className="bg-white hover:bg-slate-50 border-slate-200">
                            <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

                    {/* Chat Content - Fixed Layout */}
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                      {/* Scrollable Messages Area */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
                        {loadingMessages ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                              <p className="text-slate-600">Loading messages...</p>
                            </div>
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-slate-400" />
                              </div>
                              <p className="text-slate-600">No messages yet</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Chat Messages */}
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.sender_type === 'customer' ? 'justify-start' : 'justify-end'}`}
                              >
                                <div
                                  className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                                    message.sender_type === 'customer'
                                      ? 'bg-white border border-slate-200 text-slate-900'
                                      : message.sender_type === 'agent'
                                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                                  }`}
                                >
                                  <p className="text-sm leading-relaxed">{message.content}</p>
                                  <p className={`text-xs mt-2 ${
                                    message.sender_type === 'customer' ? 'text-slate-500' : 'text-white/80'
                                  }`}>
                                    {message.created_at ? new Date(message.created_at).toLocaleTimeString() : 'Now'}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>

                      {/* Fixed Message Input - Always at Bottom */}
                      <div className="flex-shrink-0 border-t border-slate-200/60 bg-white/95 backdrop-blur-sm p-4">
                        <div className="flex space-x-3">
                          <div className="flex-1">
                            <Input
                              placeholder="Send a supervisor message..."
                              value={supervisorMessage}
                              onChange={(e) => setSupervisorMessage(e.target.value)}
                              className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                                }
                              }}
                            />
                          </div>
                          <Button
                            onClick={handleSendMessage}
                            disabled={sending || !supervisorMessage.trim()}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                          >
                            {sending ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-md">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Eye className="w-12 h-12 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-semibold text-slate-900 mb-3">Select a Conversation</h3>
                      <p className="text-slate-600 leading-relaxed">Choose a conversation from the left panel to monitor and supervise the chat interaction. You can take over conversations, send supervisor messages, and escalate when needed.</p>
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-700 font-medium">💡 Pro Tip</p>
                        <p className="text-xs text-blue-600 mt-1">Use the search and filters above to quickly find specific conversations by agent, customer, or status.</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Sidebar - Independent Scroll */}
            <div className="col-span-3 flex flex-col h-full space-y-4">
              {/* My Supervised Chats - Independent Scroll */}
              <Card className="flex-1 bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-xl rounded-2xl overflow-hidden flex flex-col">
                {/* Sticky Header */}
                <CardHeader className="flex-shrink-0 bg-gradient-to-r from-slate-50 to-green-50/50 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                        <UserCheck className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-slate-900">My Supervised Chats</CardTitle>
                        <CardDescription className="text-xs text-slate-600">
                          {myChats.length} chats under supervision
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                
                {/* Scrollable Content Area */}
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <div className="h-full overflow-y-auto custom-scrollbar">
                    <div className="divide-y divide-slate-100">
                      {myChats.map((chat) => (
                        <div
                          key={chat.id}
                          className="p-3 hover:bg-slate-50/80 transition-all duration-200 cursor-pointer"
                          onClick={() => setSelectedChatId(chat.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 shadow-md">
                                <AvatarFallback className="text-white text-xs">
                                  {chat.customer.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-medium text-slate-900 truncate">{chat.customer}</h4>
                                <p className="text-xs text-slate-600">Taken over</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge variant="default" className="bg-green-500 text-white text-xs h-4">
                                Supervised
                              </Badge>
                        {chat.unread > 0 && (
                                <Badge variant="default" className="bg-red-500 text-white text-xs min-w-[16px] h-4 flex items-center justify-center rounded-full">
                            {chat.unread}
                          </Badge>
                        )}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-xs text-slate-700 line-clamp-2">{chat.lastMessage}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">{chat.time}</span>
                              <div className="flex items-center space-x-1">
                                <Activity className="w-2.5 h-2.5 text-green-500" />
                                <span className="text-xs text-green-600">Active</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Metrics Panel - Minimal Professional Design */}
              <Card className="h-48 bg-white/95 backdrop-blur-sm border border-slate-200/60 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-200/40 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <CardTitle className="text-sm font-medium text-slate-900">Live Metrics</CardTitle>
                    </div>
                    <span className="text-xs text-slate-500">Real-time</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-xl font-semibold text-slate-900">{chats.length}</div>
                      <div className="text-xs text-slate-600">Active Chats</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-slate-900">2.4m</div>
                      <div className="text-xs text-slate-600">Avg Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-slate-900">4.8</div>
                      <div className="text-xs text-slate-600">CSAT Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-slate-900">{chats.filter(c => ['high', 'critical'].includes(c.priority?.toLowerCase())).length}</div>
                      <div className="text-xs text-slate-600">High Priority</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Two-column layout when supervisor has no chats - Independent Scrolling */
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Active Conversations Panel - Independent Scroll */}
            <div className="col-span-4 flex flex-col h-full">
              <Card className="flex-1 bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-xl rounded-2xl overflow-hidden flex flex-col">
                {/* Sticky Header */}
                <CardHeader className="flex-shrink-0 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-900">Active Conversations</CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                          {chats.length} conversations • {chats.filter(c => c.status === 'active').length} active
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                      Live
                    </Badge>
                  </div>
                  
                  {/* Sticky Search and Filters */}
                  <div className="mt-4 space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search by agent, customer, or topic..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/70 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'active', 'waiting', 'transferred'].map((status) => (
                        <Button
                          key={status}
                          variant={filterStatus === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilterStatus(status)}
                          className={filterStatus === status 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-md' 
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                
                {/* Scrollable Content Area */}
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <div className="h-full overflow-y-auto custom-scrollbar">
                    {loadingChats ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-slate-600">Loading conversations...</p>
                        </div>
                      </div>
                    ) : filteredChats.length === 0 ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-slate-400" />
                          </div>
                          <h3 className="text-lg font-medium text-slate-900 mb-2">No conversations found</h3>
                          <p className="text-sm text-slate-600">Try adjusting your search or filters</p>
                        </div>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {filteredChats.map((chat) => (
                          <div
                            key={chat.id}
                            onClick={() => setSelectedChatId(chat.id)}
                            className={`p-4 cursor-pointer transition-all duration-200 hover:bg-slate-50/80 ${
                            selectedChatId === chat.id ? 'bg-blue-50/60 border-r-4 border-blue-500' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md">
                                <AvatarFallback className="text-white text-sm font-medium">
                                  {chat.customer.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-sm font-medium text-slate-900 truncate">{chat.customer}</h4>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        {getPriorityIcon(chat.priority)}
                                      </TooltipTrigger>
                                      <TooltipContent>{chat.priority} priority</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <p className="text-xs text-slate-600">Agent: {chat.agent}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge variant={getStatusBadgeVariant(chat.status)} className="text-xs">
                                {chat.status}
                              </Badge>
                              {chat.unread > 0 && (
                                <Badge variant="default" className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                                  {chat.unread}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm text-slate-700 line-clamp-2">{chat.lastMessage}</p>
                    <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">{chat.time}</span>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span className="text-xs text-slate-500">2m ago</span>
                              </div>
                            </div>
                    </div>
                  </div>
                ))}
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

            {/* Conversation Panel - Independent Scroll */}
            <div className="col-span-5 flex flex-col h-full">
              <Card className="flex-1 bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-xl rounded-2xl overflow-hidden flex flex-col h-full">
                {selectedChatId ? (
                  <>
                    {/* Sticky Chat Header */}
                    <CardHeader className="flex-shrink-0 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60 pb-4">
                <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 shadow-md">
                            <AvatarFallback className="text-white font-medium">
                              {selectedChat?.customer.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                  <div>
                            <h3 className="text-lg font-semibold text-slate-900">{selectedChat?.customer}</h3>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-sm text-slate-600">Agent: {selectedChat?.agent}</span>
                              <Badge variant={getStatusBadgeVariant(selectedChat?.status || '')} className="text-xs">
                                {selectedChat?.status}
                              </Badge>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="flex items-center">
                                    {getPriorityIcon(selectedChat?.priority || '')}
                                  </TooltipTrigger>
                                  <TooltipContent>{selectedChat?.priority} priority</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                  </div>
                        <div className="flex items-center space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="sm" variant="outline" onClick={handleTakeOver} className="bg-white hover:bg-green-50 border-green-200 text-green-700">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Take Over
                    </Button>
                              </TooltipTrigger>
                              <TooltipContent>Take control of this conversation</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="sm" variant="outline" onClick={handleEscalate} className="bg-white hover:bg-red-50 border-red-200 text-red-700">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Escalate
                    </Button>
                              </TooltipTrigger>
                              <TooltipContent>Escalate this conversation</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button size="sm" variant="outline" className="bg-white hover:bg-slate-50 border-slate-200">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

                    {/* Chat Content - Proper Flex Layout */}
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                      {/* Scrollable Messages Area */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
                        {loadingMessages ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                              <p className="text-slate-600">Loading messages...</p>
                            </div>
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-slate-400" />
                              </div>
                              <p className="text-slate-600">No messages yet</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Chat Messages */}
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.sender_type === 'customer' ? 'justify-start' : 'justify-end'}`}
                              >
                                <div
                                  className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                                    message.sender_type === 'customer'
                                      ? 'bg-white border border-slate-200 text-slate-900'
                                      : message.sender_type === 'agent'
                                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                                  }`}
                                >
                                  <p className="text-sm leading-relaxed">{message.content}</p>
                                  <p className={`text-xs mt-2 ${
                                    message.sender_type === 'customer' ? 'text-slate-500' : 'text-white/80'
                                  }`}>
                                    {message.created_at ? new Date(message.created_at).toLocaleTimeString() : 'Now'}
                        </p>
                      </div>
                    </div>
                  ))}
                          </>
                        )}
                </div>

                      {/* Fixed Supervisor Message Input - Always Visible */}
                      <div className="flex-shrink-0 border-t border-slate-200/60 bg-white/95 backdrop-blur-sm p-4">
                        <div className="flex space-x-3">
                          <div className="flex-1">
                    <Input 
                              placeholder="Send a supervisor message..."
                      value={supervisorMessage}
                      onChange={(e) => setSupervisorMessage(e.target.value)}
                              className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                              onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                                  handleSendMessage();
                        }
                      }}
                    />
                          </div>
                    <Button 
                            onClick={handleSendMessage}
                            disabled={sending || !supervisorMessage.trim()}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                          >
                            {sending ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                      <Send className="w-4 h-4" />
                            )}
                    </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-md">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Eye className="w-12 h-12 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-semibold text-slate-900 mb-3">Select a Conversation</h3>
                      <p className="text-slate-600 leading-relaxed">Choose a conversation from the left panel to monitor and supervise the chat interaction. You can take over conversations, send supervisor messages, and escalate when needed.</p>
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-700 font-medium">💡 Pro Tip</p>
                        <p className="text-xs text-blue-600 mt-1">Use the search and filters above to quickly find specific conversations by agent, customer, or status.</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Sidebar - Analytics & Tools - Independent Scroll */}
            <div className="col-span-3 flex flex-col h-full space-y-4">
              {/* Live Analytics */}
              <Card className="h-48 bg-white/95 backdrop-blur-sm border border-slate-200/60 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-200/40 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <CardTitle className="text-sm font-medium text-slate-900">Live Metrics</CardTitle>
                    </div>
                    <span className="text-xs text-slate-500">Real-time</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-xl font-semibold text-slate-900">{chats.length}</div>
                      <div className="text-xs text-slate-600">Active Chats</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-slate-900">2.4m</div>
                      <div className="text-xs text-slate-600">Avg Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-slate-900">4.8</div>
                      <div className="text-xs text-slate-600">CSAT Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-slate-900">{chats.filter(c => ['high', 'critical'].includes(c.priority?.toLowerCase())).length}</div>
                      <div className="text-xs text-slate-600">High Priority</div>
                    </div>
                </div>
              </CardContent>
            </Card>

              {/* Quick Actions */}
              <Card className="h-40 bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-orange-50/50 border-b border-slate-200/60 pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                      <Target className="w-3 h-3 text-white" />
                    </div>
                    <CardTitle className="text-sm font-semibold text-slate-900">Quick Actions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-3 space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs h-8 bg-white hover:bg-blue-50 border-blue-200 text-blue-700">
                    <Activity className="w-3 h-3 mr-2" />
                    View All Agents
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs h-8 bg-white hover:bg-green-50 border-green-200 text-green-700">
                    <CheckCircle2 className="w-3 h-3 mr-2" />
                    Auto Assignment
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs h-8 bg-white hover:bg-yellow-50 border-yellow-200 text-yellow-700">
                    <AlertTriangle className="w-3 h-3 mr-2" />
                    Escalation Queue
                  </Button>
                </CardContent>
              </Card>

              {/* Team Status - Independent Scroll */}
              <Card className="flex-1 bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-xl rounded-2xl overflow-hidden flex flex-col">
                <CardHeader className="flex-shrink-0 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60 pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                    <CardTitle className="text-sm font-semibold text-slate-900">Team Status</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-3 overflow-hidden">
                  <div className="h-full overflow-y-auto custom-scrollbar">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-600">Online Agents</span>
                        <span className="font-semibold text-green-600">8 of 12</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{width: '67%'}}></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="text-center p-2 bg-green-50 rounded-lg border border-green-100">
                          <div className="text-sm font-bold text-green-600">8</div>
                          <div className="text-xs text-green-700">Online</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="text-sm font-bold text-gray-600">4</div>
                          <div className="text-xs text-gray-700">Offline</div>
                        </div>
                      </div>
                    </div>
              </div>
                </CardContent>
            </Card>
            </div>
          </div>
          )}
      </div>
    </div>
    </>
  );
};
