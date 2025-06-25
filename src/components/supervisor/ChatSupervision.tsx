import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send, Eye, UserCheck, AlertTriangle, Search, Filter, MoreHorizontal, Download, RefreshCw, UserCircle2, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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

  // Fetch chats
  useEffect(() => {
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
    fetchChats();
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

  // Send supervisor message
  const handleSendSupervisorMessage = async () => {
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

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] font-sans overflow-x-hidden">
      {/* Header Row */}
      <div className="px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Tabs defaultValue="active" className="hidden md:block">
            <TabsList className="bg-white rounded-xl shadow border flex gap-2">
              <TabsTrigger value="active" className="font-semibold text-md px-4">Active</TabsTrigger>
              <TabsTrigger value="escalated" className="font-semibold text-md px-4">Escalated</TabsTrigger>
            </TabsList>
          </Tabs>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-blue-500" />
            Chat Supervision
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-blue-100" onClick={() => window.location.reload()}><RefreshCw className="w-5 h-5" /></Button>
              </TooltipTrigger>
              <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-blue-100"><Download className="w-5 h-5" /></Button>
              </TooltipTrigger>
              <TooltipContent>Export Report</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="w-9 h-9 border-2 border-blue-200">
                  <AvatarFallback><UserCircle2 className="w-7 h-7 text-blue-400" /></AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>Supervisor Profile</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {/* Main 3-Column Layout */}
      <div className="w-full px-4 h-[calc(100vh-120px)]">
        <div className="grid grid-cols-12 gap-4 w-full h-full transition-all">
          {/* Left: Active Conversations */}
          <div className="col-span-12 md:col-span-3 h-full min-h-0 flex flex-col w-full max-w-none overflow-y-auto transition-all">
            <Card className="bg-white rounded-2xl shadow-md border-0 flex flex-col h-full">
              <CardHeader className="p-5 border-b bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Active Conversations
                </CardTitle>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by agent, customer, or topic"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto flex-1">
                {loadingChats ? (
                  <div className="p-8 text-center text-gray-400">Loading chats...</div>
                ) : error ? (
                  <div className="p-8 text-center text-red-600">{error}</div>
                ) : filteredChats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
                    <div className="text-gray-400 text-lg font-medium">No active chats at the moment</div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredChats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition-all rounded-xl ${selectedChatId === chat.id ? 'bg-blue-50 border-l-4 border-blue-500 shadow' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedChatId(chat.id)}
                      >
                        <Avatar className="w-10 h-10 bg-blue-100">
                          <AvatarFallback>{chat.customer?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 truncate">{chat.customer}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Badge className="text-xs capitalize px-2 py-0.5" variant="outline">
                                      {chat.priority === 'high' ? <ArrowUpRight className="inline w-3 h-3 text-red-500 mr-1" /> : chat.priority === 'low' ? <ArrowDownRight className="inline w-3 h-3 text-green-500 mr-1" /> : null}
                                      {chat.priority}
                                    </Badge>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>Priority: {chat.priority}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Badge className={`text-xs capitalize px-2 py-0.5 ${chat.status === 'active' ? 'bg-green-100 text-green-800' : chat.status === 'escalated' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                      {chat.status === 'active' ? <CheckCircle2 className="inline w-3 h-3 mr-1 text-green-500" /> : chat.status === 'escalated' ? <AlertCircle className="inline w-3 h-3 mr-1 text-yellow-500" /> : null}
                                      {chat.status}
                                    </Badge>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>Status: {chat.status}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-xs text-gray-500 truncate max-w-xs">{chat.lastMessage}</p>
                          <p className="text-xs text-gray-400 mt-1">{chat.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Center: Conversation Panel */}
          <div className="col-span-12 md:col-span-6 h-full min-h-0 flex flex-col w-full max-w-none overflow-y-auto transition-all">
            <Card className="bg-white rounded-2xl shadow-md border-0 flex flex-col h-full min-h-[520px]">
              <CardHeader className="rounded-t-2xl p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg font-bold">Conversation</CardTitle>
                  <CardDescription className="text-gray-500">View and participate in the selected chat</CardDescription>
                </div>
                {selectedChatId && (
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <Button variant="outline" size="sm" onClick={handleTakeOver} className="font-bold border-2 border-blue-500 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50">
                      Take Over
                    </Button>
                    <Button variant="outline" size="sm" className="font-bold border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                      End Chat
                    </Button>
                    <Button variant="outline" size="sm" className="font-bold border-2 border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-50">
                      Escalate
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between p-6 min-h-[400px]">
                {!selectedChatId ? (
                  <div className="flex flex-col items-center justify-center h-full py-16">
                    <Eye className="w-16 h-16 text-blue-200 mb-6" />
                    <div className="text-gray-400 text-xl font-semibold mb-2">No conversation selected</div>
                    <div className="text-gray-500 text-md">Select a conversation to supervise or participate.</div>
                  </div>
                ) : loadingMessages ? (
                  <div className="text-gray-400 text-center my-24 text-lg">Loading messages...</div>
                ) : error ? (
                  <div className="text-red-600 text-center my-24 text-lg">{error}</div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto space-y-4 pb-4 max-h-[340px]">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender_type === 'supervisor' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`rounded-2xl px-5 py-3 shadow-sm ${msg.sender_type === 'supervisor' ? 'bg-gradient-to-r from-purple-200 to-blue-200 text-purple-900' : 'bg-gray-100 text-gray-900'}`} style={{ maxWidth: '70%' }}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold uppercase tracking-wide">
                                {msg.sender_type.charAt(0).toUpperCase() + msg.sender_type.slice(1)}
                              </span>
                              {msg.sender_type === 'supervisor' && (
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-500 text-white text-xs font-bold">Supervisor</span>
                              )}
                            </div>
                            <p className="text-base break-words">{msg.content}</p>
                            <p className="text-xs text-gray-500 mt-2 text-right">{msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Sticky Message Input */}
                    <div className="flex items-center gap-3 mt-6 sticky bottom-0 bg-white py-4 rounded-b-2xl border-t">
                      <Input
                        placeholder="Send message as supervisor..."
                        value={supervisorMessage}
                        onChange={(e) => setSupervisorMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendSupervisorMessage(); }}
                        disabled={sending}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200"
                      />
                      <Button onClick={handleSendSupervisorMessage} disabled={!supervisorMessage.trim() || sending} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg rounded-lg px-6 py-3 text-lg">
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">Your messages will be marked as supervisor interventions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Right: My Chats */}
          <div className="col-span-12 md:col-span-3 h-full min-h-0 flex flex-col w-full max-w-none overflow-y-auto transition-all">
            <Card className="bg-white rounded-2xl shadow-md border-0 flex flex-col h-full">
              <CardHeader className="p-5 border-b bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <UserCheck className="w-5 h-5 text-green-500" />
                  My Chats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto flex-1">
                {myChats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
                    <div className="text-gray-400 text-lg font-medium">You have no assigned chats</div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {myChats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition-all rounded-xl ${selectedChatId === chat.id ? 'bg-green-50 border-l-4 border-green-500 shadow' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedChatId(chat.id)}
                      >
                        <Avatar className="w-10 h-10 bg-green-100">
                          <AvatarFallback>{chat.customer?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 truncate">{chat.customer}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Badge className="text-xs capitalize px-2 py-0.5" variant="outline">
                                      {chat.priority === 'high' ? <ArrowUpRight className="inline w-3 h-3 text-red-500 mr-1" /> : chat.priority === 'low' ? <ArrowDownRight className="inline w-3 h-3 text-green-500 mr-1" /> : null}
                                      {chat.priority}
                                    </Badge>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>Priority: {chat.priority}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Badge className={`text-xs capitalize px-2 py-0.5 ${chat.status === 'active' ? 'bg-green-100 text-green-800' : chat.status === 'escalated' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                      {chat.status === 'active' ? <CheckCircle2 className="inline w-3 h-3 mr-1 text-green-500" /> : chat.status === 'escalated' ? <AlertCircle className="inline w-3 h-3 mr-1 text-yellow-500" /> : null}
                                      {chat.status}
                                    </Badge>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>Status: {chat.status}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-xs text-gray-500 truncate max-w-xs">{chat.lastMessage}</p>
                          <p className="text-xs text-gray-400 mt-1">{chat.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
