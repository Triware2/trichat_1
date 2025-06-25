import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Clock, 
  User, 
  ArrowRight, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { ManualAssignmentSettings } from './ManualAssignmentSettings';

export const QueueManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const { toast } = useToast();
  const { user: supervisor } = useAuth();
  const [queueItems, setQueueItems] = useState<any[]>([]);
  const [availableAgents, setAvailableAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQueueAndAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch queued chats
      const { data: chats, error: chatError } = await supabase
        .from('chats')
        .select('id, customer_id, subject, priority, status, assigned_agent_id, created_at, closed_at')
        .eq('status', 'queued');
      if (chatError) throw new Error('Failed to fetch queue');
      // Fetch customers
      const customerIds = [...new Set((chats || []).map((c: any) => c.customer_id).filter(Boolean))];
      const { data: customers } = customerIds.length > 0
        ? await supabase.from('customers').select('id, name, email').in('id', customerIds)
        : { data: [] };
      // Fetch agents
      const { data: agents, error: agentError } = await supabase
        .from('profiles')
        .select('id, full_name, status')
        .eq('role', 'agent');
      if (agentError) throw new Error('Failed to fetch agents');
      // Map queue items
      const mappedQueue = (chats || []).map((chat: any) => {
        const customer = customers?.find((c: any) => c.id === chat.customer_id);
        const assignedAgent = agents?.find((a: any) => a.id === chat.assigned_agent_id);
        return {
          id: chat.id,
          customerName: customer?.name || 'Unknown',
          customerEmail: customer?.email || '',
          subject: chat.subject || '',
          priority: chat.priority ? chat.priority.charAt(0).toUpperCase() + chat.priority.slice(1) : 'Normal',
          waitTime: chat.created_at ? `${Math.floor((Date.now() - new Date(chat.created_at).getTime()) / 60000)}m` : '-',
          category: '-',
          assignedAgent: assignedAgent ? assignedAgent.full_name : null,
          lastMessage: '',
          timestamp: chat.created_at ? new Date(chat.created_at).toLocaleString() : '',
        };
      });
      setQueueItems(mappedQueue);
      // Map available agents
      const mappedAgents = (agents || []).map((agent: any) => ({
        id: agent.id,
        name: agent.full_name,
        status: agent.status === 'online' ? 'Available' : agent.status.charAt(0).toUpperCase() + agent.status.slice(1),
        activeChats: (chats || []).filter((c: any) => c.assigned_agent_id === agent.id).length,
      }));
      setAvailableAgents(mappedAgents);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch queue or agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueAndAgents();
    // eslint-disable-next-line
  }, []);

  const filteredQueue = queueItems.filter(item => {
    const matchesSearch = item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || item.priority.toLowerCase() === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'High': 'destructive',
      'Medium': 'default',
      'Low': 'secondary'
    } as const;
    return <Badge variant={variants[priority as keyof typeof variants]}>{priority}</Badge>;
  };

  const handleAssignAgent = async (queueId: string, agentId: string) => {
    if (!agentId || !supervisor?.id) return;
    setActionLoading(true);
    setError(null);
    try {
      // Update chat assignment
      const { error: updateError } = await supabase
        .from('chats')
        .update({ assigned_agent_id: agentId })
        .eq('id', queueId);
      if (updateError) throw new Error('Failed to assign agent');
      // Log assignment
      const { error: logError } = await supabase
        .from('chat_assignments')
        .insert([
          {
            chat_id: queueId,
            agent_id: agentId,
            assigned_by: supervisor.id,
            assigned_at: new Date().toISOString(),
            note: 'Queue assignment',
          },
        ]);
      if (logError) throw new Error('Assignment succeeded, but failed to log assignment');
      toast({
        title: 'Agent Assigned',
        description: `Queue item has been assigned to agent`,
      });
      fetchQueueAndAgents();
    } catch (err: any) {
      setError(err.message || 'Failed to assign agent');
      toast({
        title: 'Error',
        description: err.message || 'Failed to assign agent',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePriorityChange = async (queueId: string, newPriority: string) => {
    setActionLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('chats')
        .update({ priority: newPriority.toLowerCase() })
        .eq('id', queueId);
      if (error) throw new Error('Failed to update priority');
      toast({
        title: 'Priority Updated',
        description: `Queue item priority changed to ${newPriority}`,
      });
      fetchQueueAndAgents();
    } catch (err: any) {
      setError(err.message || 'Failed to update priority');
      toast({
        title: 'Error',
        description: err.message || 'Failed to update priority',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchQueueAndAgents();
    toast({
      title: 'Queue Refreshed',
      description: 'Queue data has been updated',
    });
  };

  const handleAutoAssign = async () => {
    setActionLoading(true);
    setError(null);
    try {
      // Find unassigned queue items
      const unassigned = queueItems.filter((item) => !item.assignedAgent);
      const available = availableAgents.filter((a) => a.status === 'Available');
      if (unassigned.length === 0 || available.length === 0) throw new Error('No unassigned items or available agents');
      // Simple round-robin assignment
      for (let i = 0; i < unassigned.length; i++) {
        const agent = available[i % available.length];
        await handleAssignAgent(unassigned[i].id, agent.id);
      }
      toast({
        title: 'Auto-Assignment Complete',
        description: 'Unassigned queue items have been assigned to available agents.',
      });
      fetchQueueAndAgents();
    } catch (err: any) {
      setError(err.message || 'Failed to auto-assign');
      toast({
        title: 'Error',
        description: err.message || 'Failed to auto-assign',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewCustomer = (queueId: number) => {
    toast({
      title: "Customer Details",
      description: `Opening details for queue item ${queueId}`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white rounded-2xl shadow-md p-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total in Queue</p>
                <p className="text-2xl font-bold text-orange-600">{queueItems.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-2xl shadow-md p-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {queueItems.filter(item => item.priority === 'High').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-2xl shadow-md p-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Wait Time</p>
                <p className="text-2xl font-bold text-blue-600">7m 24s</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-2xl shadow-md p-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Agents</p>
                <p className="text-2xl font-bold text-green-600">
                  {availableAgents.filter(agent => agent.status === 'Available').length}
                </p>
              </div>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6">
        <div className="flex gap-2">
          <Input
            placeholder="Search queue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white z-10"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAutoAssign}>
            <Filter className="w-4 h-4 mr-2" />
            Auto-Assign
          </Button>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Support Queue
          </CardTitle>
          <CardDescription>
            Manage customer support requests and agent assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Wait Time</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Assigned Agent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQueue.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{item.customerName}</p>
                      <p className="text-sm text-gray-500">{item.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900 max-w-xs truncate">{item.subject}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className={`font-medium ${item.waitTime.startsWith('1') ? 'text-red-600' : 'text-gray-600'}`}>
                        {item.waitTime}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.assignedAgent ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{item.assignedAgent}</span>
                      </div>
                    ) : (
                      <select
                        onChange={(e) => handleAssignAgent(item.id, e.target.value)}
                        className="text-xs px-2 py-1 border rounded bg-white z-10"
                        defaultValue=""
                        disabled={actionLoading}
                      >
                        <option value="" disabled>Assign to...</option>
                        {availableAgents
                          .filter(agent => agent.status === 'Available')
                          .map(agent => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name}
                            </option>
                          ))}
                      </select>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewCustomer(item.id)}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Available Agents</CardTitle>
          <CardDescription>Current agent availability and workload</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableAgents.map((agent, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{agent.name}</p>
                    <Badge variant={agent.status === 'Available' ? 'default' : agent.status === 'Busy' ? 'destructive' : 'secondary'}>
                      {agent.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">Active chats: {agent.activeChats}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <ManualAssignmentSettings />
    </div>
  );
};
