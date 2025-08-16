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
  Filter,
  Search,
  TrendingUp,
  Users,
  Timer,
  MoreHorizontal,
  UserCheck,
  Download,
  Activity,
  Zap,
  Target,
  ArrowUpRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { ManualAssignmentSettings } from './ManualAssignmentSettings';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define proper interfaces
interface QueueItem {
  id: string;
  customer_id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  waitTime: string;
  category: string;
  assignedAgent?: string;
  lastMessage: string;
  timestamp: string;
  created_at: string;
  status: string;
  channel: string;
}

interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  activeChats: number;
  maxChats: number;
  department?: string;
  availability: 'Available' | 'Busy' | 'Away' | 'Offline';
}

interface QueueAnalytics {
  totalQueue: number;
  avgWaitTime: number;
  highPriorityCount: number;
  availableAgents: number;
  assignmentRate: number;
  resolutionTime: number;
}

export const QueueManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const { toast } = useToast();
  const { user: supervisor } = useAuth();
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<QueueAnalytics>({
    totalQueue: 0,
    avgWaitTime: 0,
    highPriorityCount: 0,
    availableAgents: 0,
    assignmentRate: 0,
    resolutionTime: 0
  });
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedQueueItem, setSelectedQueueItem] = useState<string>('');

  const fetchQueueAndAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch queued chats with customer and agent data
      const { data: chats, error: chatsError } = await supabase
        .from('chats')
        .select(`
          id,
          customer_id,
          subject,
          priority,
          status,
          created_at,
          channel,
          assigned_agent_id,
          wait_time,
          response_time,
          customers (
            id,
            name,
            email
          ),
          profiles:assigned_agent_id (
            id,
            full_name
          )
        `)
        .eq('status', 'queued')
        .order('created_at', { ascending: true });

      if (chatsError) throw chatsError;

      // Fetch agents
      const { data: agents, error: agentsError } = await supabase
        .from('profiles')
        .select('id, full_name, status, department, max_concurrent_chats')
        .eq('role', 'agent');

      if (agentsError) throw agentsError;

      // Map queue items with customer data
      const mappedQueue: QueueItem[] = (chats || []).map((chat) => {
        const customer = chat.customers;
        const assignedAgent = chat.profiles;
        
        return {
          id: chat.id,
          customer_id: chat.customer_id || '',
          customerName: customer?.name || 'Unknown Customer',
          customerEmail: customer?.email || '',
          subject: chat.subject || 'No subject',
          priority: (chat.priority as QueueItem['priority']) || 'medium',
          waitTime: getWaitTime(chat.created_at),
          category: 'General',
          assignedAgent: assignedAgent?.full_name,
          lastMessage: '',
          timestamp: chat.created_at,
          created_at: chat.created_at,
          status: chat.status,
          channel: chat.channel || 'web'
        };
      });

      setQueueItems(mappedQueue);

      // Get active chats count for each agent
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

      // Map available agents
      const mappedAgents: Agent[] = (agents || []).map((agent) => ({
        id: agent.id,
        name: agent.full_name,
        status: (agent.status as Agent['status']) || 'offline',
        activeChats: activeChatCounts.get(agent.id) || 0,
        maxChats: agent.max_concurrent_chats || 5,
        department: agent.department,
        availability: getAgentAvailability(agent.status || 'offline', activeChatCounts.get(agent.id) || 0, agent.max_concurrent_chats || 5)
      }));

      setAvailableAgents(mappedAgents);

      // Calculate analytics
      const totalWaitTime = mappedQueue.reduce((sum, item) => sum + parseWaitTime(item.waitTime), 0);
      const avgWaitTime = mappedQueue.length > 0 ? totalWaitTime / mappedQueue.length : 0;
      const highPriorityCount = mappedQueue.filter(item => 
        ['high', 'urgent'].includes(item.priority)).length;
      const availableCount = mappedAgents.filter(agent => 
        agent.availability === 'Available').length;

      setAnalytics({
        totalQueue: mappedQueue.length,
        avgWaitTime,
        highPriorityCount,
        availableAgents: availableCount,
        assignmentRate: 85, // This would be calculated from historical data
        resolutionTime: 12.5 // This would be calculated from historical data
      });

    } catch (err) {
      console.error('Error fetching queue data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch queue data');
      toast({
        title: 'Error',
        description: 'Failed to fetch queue data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getAgentAvailability = (status: string, activeChats: number, maxChats: number): Agent['availability'] => {
    if (status !== 'online') return 'Offline';
    if (activeChats >= maxChats) return 'Busy';
    return 'Available';
  };

  const parseWaitTime = (waitTime: string): number => {
    // Convert wait time string to minutes
    if (waitTime.includes('m')) {
      return parseInt(waitTime.replace('m', ''));
    } else if (waitTime.includes('h')) {
      const parts = waitTime.split('h');
      const hours = parseInt(parts[0]);
      const minutes = parts[1] ? parseInt(parts[1].replace('m', '')) : 0;
      return hours * 60 + minutes;
    } else if (waitTime.includes('d')) {
      const parts = waitTime.split('d');
      const days = parseInt(parts[0]);
      return days * 24 * 60; // Convert to minutes
    }
    return 0;
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

  useEffect(() => {
    fetchQueueAndAgents();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchQueueAndAgents, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredQueue = queueItems.filter(item => {
    const matchesSearch = item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || item.priority.toLowerCase() === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'urgent': 'destructive',
      'high': 'destructive',
      'medium': 'default',
      'low': 'secondary'
    } as const;
    return <Badge variant={variants[priority as keyof typeof variants] || 'default'}>{priority}</Badge>;
  };

  const handleAssignAgent = async (queueId: string, agentId: string) => {
    if (!agentId || !supervisor?.id) {
      toast({
        title: 'Error',
        description: 'Please select an agent',
        variant: 'destructive',
      });
      return;
    }

    setActionLoading(true);
    setError(null);
    try {
      // Update chat assignment and status
      const { error: updateError } = await supabase
        .from('chats')
        .update({ 
          assigned_agent_id: agentId,
          status: 'active'
        })
        .eq('id', queueId);

      if (updateError) throw updateError;

      // Create notification for the agent
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: agentId,
          type: 'chat_assigned',
          title: 'New Chat Assigned',
          message: `You have been assigned a new chat`,
          data: { chat_id: queueId, assigned_by: supervisor.id }
        });

      if (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }
    
    toast({
        title: 'Agent Assigned',
        description: 'Queue item has been assigned to agent',
      });

      // Refresh data
      await fetchQueueAndAgents();
    } catch (err) {
      console.error('Error assigning agent:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign agent';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
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

      if (error) throw error;

      toast({
        title: 'Priority Updated',
        description: `Queue item priority changed to ${newPriority}`,
      });

      // Update local state
      setQueueItems(prev => prev.map(item => 
        item.id === queueId 
          ? { ...item, priority: newPriority.toLowerCase() as QueueItem['priority'] }
          : item
      ));
    } catch (err) {
      console.error('Error updating priority:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update priority';
      setError(errorMessage);
    toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
    });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchQueueAndAgents();
    toast({
      title: 'Queue Refreshed',
      description: 'Queue data has been updated',
    });
  };

  const handleAutoAssignAll = async () => {
    setActionLoading(true);
    setError(null);
    try {
      // Find unassigned queue items
      const unassigned = queueItems.filter((item) => !item.assignedAgent);
      const available = availableAgents.filter((a) => a.availability === 'Available');
      
      if (unassigned.length === 0) {
        toast({
          title: 'No Unassigned Items',
          description: 'All queue items are already assigned',
        });
        return;
      }

      if (available.length === 0) {
        toast({
          title: 'No Available Agents',
          description: 'No agents are currently available for assignment',
          variant: 'destructive',
        });
        return;
      }

      // Simple round-robin assignment
      for (let i = 0; i < unassigned.length; i++) {
        const agent = available[i % available.length];
        await handleAssignAgent(unassigned[i].id, agent.id);
      }

      toast({
        title: 'Auto-Assignment Complete',
        description: `${unassigned.length} queue items have been assigned to available agents.`,
      });
    } catch (err) {
      console.error('Error in auto-assignment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to auto-assign';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrioritizeCritical = async () => {
    setActionLoading(true);
    try {
      const urgentItems = queueItems.filter(item => item.priority === 'urgent');
      const highItems = queueItems.filter(item => item.priority === 'high');
      
      const priorityItems = [...urgentItems, ...highItems];
      
      if (priorityItems.length === 0) {
        toast({
          title: 'No Priority Items',
          description: 'No high or urgent priority items in queue',
        });
        return;
      }

      const available = availableAgents.filter(a => a.availability === 'Available');
      
      if (available.length === 0) {
        toast({
          title: 'No Available Agents',
          description: 'No agents available for priority assignment',
          variant: 'destructive',
        });
        return;
      }

      // Assign priority items first
      for (let i = 0; i < Math.min(priorityItems.length, available.length); i++) {
        await handleAssignAgent(priorityItems[i].id, available[i].id);
      }

      toast({
        title: 'Priority Assignment Complete',
        description: `${Math.min(priorityItems.length, available.length)} priority items assigned`,
      });
    } catch (err) {
      console.error('Error prioritizing critical:', err);
      toast({
        title: 'Error',
        description: 'Failed to prioritize critical items',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLoadBalance = async () => {
    setActionLoading(true);
    try {
      const unassigned = queueItems.filter(item => !item.assignedAgent);
      const available = availableAgents.filter(a => a.availability === 'Available');
      
      if (unassigned.length === 0 || available.length === 0) {
        toast({
          title: 'Load Balancing Not Needed',
          description: 'No unassigned items or no available agents',
        });
        return;
      }

      // Sort agents by current workload (ascending)
      const sortedAgents = [...available].sort((a, b) => a.activeChats - b.activeChats);
      
      // Assign to agents with lowest workload first
      for (let i = 0; i < unassigned.length; i++) {
        const agentIndex = i % sortedAgents.length;
        await handleAssignAgent(unassigned[i].id, sortedAgents[agentIndex].id);
      }

      toast({
        title: 'Load Balancing Complete',
        description: 'Chats distributed evenly across available agents',
      });
    } catch (err) {
      console.error('Error load balancing:', err);
      toast({
        title: 'Error',
        description: 'Failed to load balance assignments',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleManualAssignment = async () => {
    if (!selectedQueueItem || !selectedAgent) {
      toast({
        title: 'Selection Required',
        description: 'Please select both a queue item and an agent',
        variant: 'destructive',
      });
      return;
    }

    await handleAssignAgent(selectedQueueItem, selectedAgent);
    setSelectedQueueItem('');
    setSelectedAgent('');
  };

  const handleExportQueue = async () => {
    try {
      const csvData = [
        ['ID', 'Customer', 'Subject', 'Priority', 'Wait Time', 'Created', 'Status', 'Channel'],
        ...filteredQueue.map(item => [
          item.id,
          item.customerName,
          item.subject,
          item.priority,
          item.waitTime,
          new Date(item.created_at).toLocaleString(),
          item.status,
          item.channel
        ])
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `queue-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export Complete',
        description: 'Queue data exported successfully',
      });
    } catch (error) {
      console.error('Error exporting queue:', error);
    toast({
        title: 'Export Failed',
        description: 'Failed to export queue data',
        variant: 'destructive',
    });
    }
  };

  const handleViewCustomer = (queueId: string) => {
    const item = queueItems.find(q => q.id === queueId);
    if (item) {
    toast({
      title: "Customer Details",
        description: `Opening details for ${item.customerName}`,
      });
      // Here you would typically navigate to customer details page
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <ArrowUpRight className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Timer className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-20">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Queue Management</h1>
                <p className="text-sm text-slate-600 mt-1">Monitor and manage chat queue assignments</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white hover:bg-slate-50 border-slate-200"
                      onClick={handleRefresh}
                      disabled={loading}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh queue data</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                onClick={handleExportQueue}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto p-6">
        {/* Queue Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Queue Length</p>
                  <p className="text-3xl font-bold text-slate-900">{analytics.totalQueue}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    Active chats waiting
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
            </div>
          </CardContent>
        </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-slate-600">Available Agents</p>
                  <p className="text-3xl font-bold text-slate-900">{analytics.availableAgents}</p>
                  <p className="text-xs text-green-600 mt-1">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Ready for assignment
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
            </div>
          </CardContent>
        </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-slate-600">Avg Wait Time</p>
                  <p className="text-3xl font-bold text-slate-900">{analytics.avgWaitTime.toFixed(1)}m</p>
                  <p className="text-xs text-orange-600 mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Current average
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl">
                  <Timer className="w-6 h-6 text-orange-600" />
                </div>
            </div>
          </CardContent>
        </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-slate-600">High Priority</p>
                  <p className="text-3xl font-bold text-slate-900">{analytics.highPriorityCount}</p>
                  <p className="text-xs text-red-600 mt-1">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    Urgent attention
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Search and Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
                    placeholder="Search by customer, subject, or chat ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/70 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'urgent', 'high', 'medium', 'low'].map((priority) => (
                  <Button
                    key={priority}
                    variant={filterPriority === priority ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterPriority(priority)}
                    className={filterPriority === priority 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-md' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Button>
                ))}
        </div>
      </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Queue Table */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-slate-900">Chat Queue</CardTitle>
                    <CardDescription className="text-slate-600">
                      {filteredQueue.length} chats waiting for assignment
          </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                    Live Data
                  </Badge>
                </div>
        </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-slate-600">Loading queue...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Error Loading Queue</h3>
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button onClick={handleRefresh}>Try Again</Button>
                    </div>
                  </div>
                ) : filteredQueue.length === 0 ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Queue is Empty</h3>
                      <p className="text-slate-600">All chats have been assigned to agents</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
          <Table>
            <TableHeader>
                        <TableRow className="bg-slate-50/50 border-b border-slate-200">
                          <TableHead className="font-semibold text-slate-700">Customer</TableHead>
                          <TableHead className="font-semibold text-slate-700">Subject</TableHead>
                          <TableHead className="font-semibold text-slate-700">Priority</TableHead>
                          <TableHead className="font-semibold text-slate-700">Wait Time</TableHead>
                          <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQueue.map((item) => (
                          <TableRow 
                            key={item.id} 
                            className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                          >
                            <TableCell className="py-4">
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md">
                                  <AvatarFallback className="text-white text-sm font-medium">
                                    {item.customerName?.charAt(0).toUpperCase() || '?'}
                                  </AvatarFallback>
                                </Avatar>
                    <div>
                                  <p className="font-medium text-slate-900">{item.customerName || 'Unknown Customer'}</p>
                                  <p className="text-sm text-slate-600">ID: {item.id.slice(0, 8)}</p>
                                </div>
                    </div>
                  </TableCell>
                  <TableCell>
                              <p className="text-slate-900 line-clamp-2">{item.subject || 'No subject'}</p>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger className="flex items-center">
                                      {getPriorityIcon(item.priority)}
                                    </TooltipTrigger>
                                    <TooltipContent>{item.priority} priority</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                                  {item.priority}
                                </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-700 font-medium">
                        {item.waitTime}
                      </span>
                    </div>
                  </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleAssignAgent(item.id, availableAgents[0]?.id || '')}
                                        disabled={actionLoading || availableAgents.length === 0}
                                        className="bg-white hover:bg-green-50 border-green-200 text-green-700"
                                      >
                                        <UserCheck className="w-4 h-4 mr-1" />
                                        Assign
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Auto-assign to available agent</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                      <Button 
                        size="sm"
                                        variant="outline"
                                        className="bg-white hover:bg-slate-50 border-slate-200"
                      >
                                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>More actions</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
                  </div>
                )}
        </CardContent>
      </Card>
          </div>

          {/* Available Agents & Manual Assignment */}
          <div className="space-y-6">
      {/* Available Agents */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50/50 border-b border-slate-200/60">
                <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-slate-900">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span>Available Agents</span>
                </CardTitle>
        </CardHeader>
                <CardContent className="p-4">
                {availableAgents.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-600">No agents available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableAgents.map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl border border-green-100">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 shadow-md">
                            <AvatarFallback className="text-white text-sm">
                              {agent.name?.charAt(0).toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{agent.name}</p>
                            <p className="text-xs text-slate-600">{agent.activeChats}/{agent.maxChats} chats</p>
                          </div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            agent.availability === 'Available' ? 'bg-green-100 text-green-700 border-green-200' :
                            agent.availability === 'Busy' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          {agent.availability}
                    </Badge>
                      </div>
                    ))}
                  </div>
                )}
                </CardContent>
              </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50/50 border-b border-slate-200/60">
                <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-slate-900">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                    <Zap className="w-4 h-4 text-white" />
          </div>
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
                  onClick={handleAutoAssignAll}
                  disabled={actionLoading}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Auto-assign All
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-white hover:bg-yellow-50 border-yellow-200 text-yellow-700"
                  onClick={handlePrioritizeCritical}
                  disabled={actionLoading}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Prioritize Critical
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-white hover:bg-green-50 border-green-200 text-green-700"
                  onClick={handleLoadBalance}
                  disabled={actionLoading}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Load Balance
                </Button>
        </CardContent>
      </Card>

            {/* Manual Assignment */}
            <ManualAssignmentSettings />
          </div>
        </div>
      </div>
    </div>
  );
};
