import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, CheckCircle, AlertCircle, MessageSquare, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: string;
  full_name: string;
  status: string;
  activeChats: number;
  maxChats: number;
}

interface QueuedChat {
  id: string;
  subject: string;
  status: string;
  assigned_agent_id: string | null;
  created_at: string;
  customerName: string;
  priority: string;
}

export const ManualAssignmentSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [chats, setChats] = useState<QueuedChat[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedChat, setSelectedChat] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch available agents
        const { data: agentData, error: agentError } = await supabase
          .from('profiles')
          .select('id, full_name, status, max_concurrent_chats')
          .eq('role', 'agent')
          .neq('status', 'offline');

        if (agentError) throw agentError;

        // Fetch active chats count for each agent
        const { data: activeChats } = await supabase
          .from('chats')
          .select('assigned_agent_id')
          .eq('status', 'active');

        const activeChatCounts = new Map<string, number>();
        (activeChats || []).forEach(chat => {
          if (chat.assigned_agent_id) {
            const count = activeChatCounts.get(chat.assigned_agent_id) || 0;
            activeChatCounts.set(chat.assigned_agent_id, count + 1);
          }
        });

        // Map agents with their current workload
        const mappedAgents: Agent[] = (agentData || []).map(agent => ({
          id: agent.id,
          full_name: agent.full_name,
          status: agent.status,
          activeChats: activeChatCounts.get(agent.id) || 0,
          maxChats: agent.max_concurrent_chats || 5
        }));

        // Fetch queued chats with customer data
        const { data: chatData, error: chatError } = await supabase
          .from('chats')
          .select(`
            id,
            subject,
            status,
            assigned_agent_id,
            created_at,
            priority,
            customers (
              name
            )
          `)
          .eq('status', 'queued')
          .order('created_at', { ascending: true });

        if (chatError) throw chatError;

        const mappedChats: QueuedChat[] = (chatData || []).map(chat => ({
          id: chat.id,
          subject: chat.subject || 'No subject',
          status: chat.status,
          assigned_agent_id: chat.assigned_agent_id,
          created_at: chat.created_at,
          customerName: chat.customers?.name || 'Unknown Customer',
          priority: chat.priority || 'medium'
        }));

        setAgents(mappedAgents);
        setChats(mappedChats);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedAgent || !selectedChat || !user?.id) {
      toast({
        title: 'Selection Required',
        description: 'Please select both a chat and an agent',
        variant: 'destructive',
      });
      return;
    }

    setAssigning(true);
    setError(null);
    
    try {
      // Update chat assignment and status
      const { error: updateError } = await supabase
        .from('chats')
        .update({ 
          assigned_agent_id: selectedAgent,
          status: 'active'
        })
        .eq('id', selectedChat);

      if (updateError) throw updateError;

      // Create notification for the agent
      const selectedAgentData = agents.find(a => a.id === selectedAgent);
      const selectedChatData = chats.find(c => c.id === selectedChat);

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: selectedAgent,
          type: 'chat_assigned',
          title: 'New Chat Assigned',
          message: `You have been assigned a new chat: ${selectedChatData?.subject || 'No subject'}`,
          data: { 
            chat_id: selectedChat, 
            assigned_by: user.id,
            customer_name: selectedChatData?.customerName
          }
        });

      if (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }

      toast({
        title: 'Chat Assigned Successfully',
        description: `Chat assigned to ${selectedAgentData?.full_name}`,
      });

      // Reset selections
      setSelectedAgent('');
      setSelectedChat('');

      // Refresh data
      const { data: chatData } = await supabase
        .from('chats')
        .select(`
          id,
          subject,
          status,
          assigned_agent_id,
          created_at,
          priority,
          customers (
            name
          )
        `)
        .eq('status', 'queued')
        .order('created_at', { ascending: true });

      const mappedChats: QueuedChat[] = (chatData || []).map(chat => ({
        id: chat.id,
        subject: chat.subject || 'No subject',
        status: chat.status,
        assigned_agent_id: chat.assigned_agent_id,
        created_at: chat.created_at,
        customerName: chat.customers?.name || 'Unknown Customer',
        priority: chat.priority || 'medium'
      }));

      setChats(mappedChats);
    } catch (err: any) {
      console.error('Error assigning chat:', err);
      setError(err.message || 'Failed to assign chat');
      toast({
        title: 'Assignment Failed',
        description: err.message || 'Failed to assign chat',
        variant: 'destructive',
      });
    } finally {
      setAssigning(false);
    }
  };

  const getWaitTime = (createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ${diffMins % 60}m`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ${diffHours % 24}h`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgentAvailability = (agent: Agent) => {
    if (agent.status !== 'online') return 'Offline';
    if (agent.activeChats >= agent.maxChats) return 'Full';
    return 'Available';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
        <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-slate-900">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <UserCheck className="w-4 h-4 text-white" />
          </div>
          <span>Manual Chat Assignment</span>
        </CardTitle>
        <p className="text-sm text-slate-600">Assign chats to agents manually</p>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading agents and chats...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Error Loading Data</h3>
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Chat</label>
                <Select value={selectedChat} onValueChange={setSelectedChat}>
                  <SelectTrigger className="w-full bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                    <SelectValue placeholder="Choose a chat..." />
                  </SelectTrigger>
                  <SelectContent>
                    {chats.length === 0 ? (
                      <div className="p-4 text-center text-slate-500">
                        No queued chats available
                      </div>
                    ) : (
                      chats.map((chat) => (
                        <SelectItem key={chat.id} value={chat.id}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-blue-600" />
                              <div>
                                <span className="font-medium">{chat.subject}</span>
                                <div className="text-xs text-slate-500">
                                  {chat.customerName} • {getWaitTime(chat.created_at)}
                                </div>
                              </div>
                            </div>
                            <Badge className={`ml-2 text-xs ${getPriorityColor(chat.priority)}`}>
                              {chat.priority}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Agent</label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger className="w-full bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                    <SelectValue placeholder="Choose an agent..." />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.length === 0 ? (
                      <div className="p-4 text-center text-slate-500">
                        No agents available
                      </div>
                    ) : (
                      agents.map((agent) => {
                        const availability = getAgentAvailability(agent);
                        return (
                          <SelectItem 
                            key={agent.id} 
                            value={agent.id}
                            disabled={availability === 'Full' || availability === 'Offline'}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-green-600" />
                                <div>
                                  <span className="font-medium">{agent.full_name}</span>
                                  <div className="text-xs text-slate-500">
                                    {agent.activeChats}/{agent.maxChats} chats
                                  </div>
                                </div>
                              </div>
                              <Badge 
                                variant="secondary"
                                className={`ml-2 text-xs ${
                                  availability === 'Available' ? 'bg-green-100 text-green-800' :
                                  availability === 'Full' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {availability}
                              </Badge>
                            </div>
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleAssign} 
                disabled={!selectedAgent || !selectedChat || assigning || chats.length === 0 || agents.length === 0} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                {assigning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Assigning...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Assign Chat
                  </>
                )}
              </Button>
            </div>

            {chats.length === 0 && (
              <div className="text-center py-4 bg-blue-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-blue-700 font-medium">All chats have been assigned!</p>
                <p className="text-blue-600 text-sm">No chats are currently waiting in the queue.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
