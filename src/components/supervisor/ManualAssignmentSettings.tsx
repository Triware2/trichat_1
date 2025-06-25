import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export const ManualAssignmentSettings = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedChat, setSelectedChat] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [{ data: agentData, error: agentError }, { data: chatData, error: chatError }] = await Promise.all([
          supabase.from('profiles').select('id, full_name, status').eq('role', 'agent').not('status', 'eq', 'offline'),
          supabase.from('chats').select('id, subject, status, assigned_agent_id').in('status', ['active', 'escalated'])
        ]);
        if (agentError || chatError) throw new Error('Failed to fetch agents or chats');
        setAgents(agentData || []);
        setChats(chatData || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedAgent || !selectedChat || !user?.id) return;
    setAssigning(true);
    setError(null);
    setSuccess(null);
    try {
      // Update chat assignment
      const { error: updateError } = await supabase
        .from('chats')
        .update({ assigned_agent_id: selectedAgent })
        .eq('id', selectedChat);
      if (updateError) throw new Error('Failed to assign chat');
      // Log assignment in chat_assignments table
      const { error: logError } = await supabase
        .from('chat_assignments')
        .insert([
          {
            chat_id: selectedChat,
            agent_id: selectedAgent,
            assigned_by: user.id,
            assigned_at: new Date().toISOString(),
          },
        ]);
      if (logError) throw new Error('Assignment succeeded, but failed to log assignment');
      setSuccess('Chat assigned and logged successfully!');
      setSelectedAgent('');
      setSelectedChat('');
      // Refresh chats
      const { data: chatData } = await supabase.from('chats').select('id, subject, status, assigned_agent_id').in('status', ['active', 'escalated']);
      setChats(chatData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to assign chat');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Manual Chat Assignment
        </CardTitle>
        <p className="text-sm text-gray-600">Assign chats to agents manually</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading agents and chats...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Select Chat</label>
                <Select value={selectedChat} onValueChange={setSelectedChat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a chat..." />
                  </SelectTrigger>
                  <SelectContent>
                    {chats.map((chat) => (
                      <SelectItem key={chat.id} value={chat.id}>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{chat.subject || chat.id}</span>
                          {chat.assigned_agent_id && <Badge className="ml-2 bg-yellow-100 text-yellow-800">Assigned</Badge>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Select Agent</label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose an agent..." />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{agent.full_name}</span>
                          <Badge className="ml-2 bg-green-100 text-green-800">{agent.status}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleAssign} disabled={!selectedAgent || !selectedChat || assigning} className="bg-blue-600 hover:bg-blue-700">
                  Assign
                </Button>
              </div>
            </div>
            {success && <div className="text-green-600 text-center mt-2">{success}</div>}
          </>
        )}
      </CardContent>
    </Card>
  );
};
