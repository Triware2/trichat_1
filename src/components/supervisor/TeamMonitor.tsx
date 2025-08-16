import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  Clock,
  Activity,
  MoreHorizontal,
  User,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Zap,
  TrendingUp,
  Users,
  BarChart3,
  Settings,
  RefreshCw,
  Download,
  Shield,
  Star,
  Target
} from 'lucide-react';
import { AdvancedFiltersModal } from './AdvancedFiltersModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Define proper interfaces
interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  activeChats: number;
  queuedChats: number;
  avgResponseTime: string;
  satisfaction: string;
  totalChatsToday: number;
  lastActivity: string;
  statusColor: string;
  phone?: string;
  department?: string;
  joinDate: string;
  totalResolved: number;
  maxChats: number;
}

interface TeamMetrics {
  totalAgents: number;
  onlineAgents: number;
  avgSatisfaction: number;
  totalActiveChats: number;
  avgResponseTime: string;
  resolutionRate: number;
}

export const TeamMonitor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showAgentDetails, setShowAgentDetails] = useState(false);
  const [showAgentActions, setShowAgentActions] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [appliedAdvancedFilters, setAppliedAdvancedFilters] = useState<any>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user: supervisor } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [teamMetrics, setTeamMetrics] = useState<TeamMetrics>({
    totalAgents: 0,
    onlineAgents: 0,
    avgSatisfaction: 0,
    totalActiveChats: 0,
    avgResponseTime: '0m',
    resolutionRate: 0
  });

  // Update agent status
  const updateAgentStatus = async (agentId: string, newStatus: string) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', agentId);
      
      if (error) throw error;
      
      // Update local state
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { 
              ...agent, 
              status: newStatus as Agent['status'],
              statusColor: newStatus === 'online' ? 'bg-green-500' : 
                          newStatus === 'busy' ? 'bg-yellow-500' : 
                          newStatus === 'away' ? 'bg-gray-500' : 'bg-orange-500'
            }
          : agent
      ));
      
      toast({
        title: 'Status Updated',
        description: `Agent status changed to ${newStatus}`,
      });
      
      // Refresh metrics
      calculateTeamMetrics();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update status';
      setActionError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Send message to agent
  const sendMessageToAgent = async (agentId: string, message: string) => {
    if (!message.trim() || !supervisor?.id) return;
    
    setActionLoading(true);
    setActionError(null);
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            type: 'supervisor_message',
            title: 'Message from Supervisor',
            message: message.trim(),
            user_id: agentId,
            data: {
              sender_id: supervisor.id,
              sender_name: supervisor.email || 'Supervisor', // Use email instead of full_name
              timestamp: new Date().toISOString()
            }
          }
        ]);
      
      if (error) throw error;
      
      setMessage('');
      toast({
        title: 'Message Sent',
        description: 'Your message has been sent to the agent',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send message';
      setActionError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Assign agent to department
  const assignToDepartment = async (agentId: string, department: string) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ department })
        .eq('id', agentId);
      
      if (error) throw error;
      
      // Update local state
      setAgents(prev => prev.map(agent => 
        agent.id === agentId ? { ...agent, department } : agent
      ));
      
      toast({
        title: 'Department Assigned',
        description: `Agent assigned to ${department} department`,
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to assign department';
      setActionError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate team metrics
  const calculateTeamMetrics = () => {
    const totalAgents = agents.length;
    const onlineAgents = agents.filter(a => a.status === 'online').length;
    const totalActiveChats = agents.reduce((sum, a) => sum + a.activeChats, 0);
    
    // Calculate average satisfaction
    const satisfactionScores = agents
      .map(a => parseFloat(a.satisfaction))
      .filter(score => !isNaN(score) && score > 0);
    const avgSatisfaction = satisfactionScores.length > 0 
      ? satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length 
      : 0;
    
    // Calculate average response time
    const responseTimes = agents
      .map(a => parseFloat(a.avgResponseTime.replace('m', '')))
      .filter(time => !isNaN(time) && time > 0);
    const avgResponseTime = responseTimes.length > 0 
      ? `${(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length).toFixed(1)}m`
      : '0m';
    
    // Calculate resolution rate
    const totalResolved = agents.reduce((sum, a) => sum + a.totalResolved, 0);
    const totalHandled = agents.reduce((sum, a) => sum + a.totalResolved + a.activeChats, 0);
    const resolutionRate = totalHandled > 0 ? (totalResolved / totalHandled) * 100 : 0;

    setTeamMetrics({
      totalAgents,
      onlineAgents,
      avgSatisfaction,
      totalActiveChats,
      avgResponseTime,
      resolutionRate
    });
  };

  // Export team data
  const exportTeamData = () => {
    const csvData = [
      ['Name', 'Email', 'Status', 'Department', 'Active Chats', 'Avg Response Time', 'Satisfaction', 'Total Resolved'],
      ...filteredAgents.map(agent => [
        agent.name,
        agent.email,
        agent.status,
        agent.department || '',
        agent.activeChats,
        agent.avgResponseTime,
        agent.satisfaction,
        agent.totalResolved
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `team-monitor-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: 'Export Completed',
      description: 'Team data has been exported to CSV',
    });
  };

  // Refresh team data
  const refreshTeamData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch agents with max_concurrent_chats field
      const { data: agentData, error: agentError } = await supabase
        .from('profiles')
        .select('id, full_name, email, status, department, created_at, max_concurrent_chats')
        .eq('role', 'agent');
      
      if (agentError) throw agentError;
      
      // Fetch chats
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('id, assigned_agent_id, status, response_time, satisfaction_rating, created_at');
      
      if (chatError) throw chatError;
      
      // Process agent data
      const processedAgents = processAgentData(agentData || [], chatData || []);
      setAgents(processedAgents);
      
      toast({
        title: 'Data Refreshed',
        description: 'Team monitor data has been updated',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to refresh team data';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Process agent data helper function
  const processAgentData = (agentData: any[], chatData: any[]): Agent[] => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return agentData.map((agent: any) => {
      const agentChats = chatData.filter((c: any) => c.assigned_agent_id === agent.id);
      const activeChats = agentChats.filter((c: any) => c.status === 'active').length;
      const queuedChats = agentChats.filter((c: any) => c.status === 'queued').length;
      const todayChats = agentChats.filter((c: any) => 
        c.created_at && new Date(c.created_at) >= todayStart
      );
      
      // Calculate average response time
      const responseTimes = agentChats
        .map((c: any) => c.response_time)
        .filter((time: any) => time && time > 0);
      const avgResponse = responseTimes.length > 0 
        ? (responseTimes.reduce((acc: number, time: number) => acc + time, 0) / responseTimes.length / 60).toFixed(1)
        : '0';
      
      // Calculate satisfaction
      const satisfactionRatings = agentChats
        .map((c: any) => c.satisfaction_rating)
        .filter((rating: any) => rating && rating > 0);
      const satisfaction = satisfactionRatings.length > 0 
        ? (satisfactionRatings.reduce((acc: number, rating: number) => acc + rating, 0) / satisfactionRatings.length).toFixed(2)
        : '0';
      
      const totalResolved = agentChats.filter((c: any) => c.status === 'resolved' || c.status === 'closed').length;
      const lastActivity = agentChats.length > 0 
        ? agentChats[agentChats.length - 1].created_at 
        : null;

      return {
        id: agent.id,
        name: agent.full_name || 'Unknown Agent',
        email: agent.email || '',
        status: (agent.status as Agent['status']) || 'offline',
        activeChats,
        queuedChats,
        avgResponseTime: `${avgResponse}m`,
        satisfaction,
        totalChatsToday: todayChats.length,
        lastActivity: lastActivity ? new Date(lastActivity).toLocaleTimeString() : '-',
        statusColor: agent.status === 'online' ? 'bg-green-500' : 
                    agent.status === 'busy' ? 'bg-yellow-500' : 
                    agent.status === 'away' ? 'bg-gray-500' : 'bg-orange-500',
        phone: undefined, // Phone field doesn't exist in database
        department: agent.department,
        joinDate: agent.created_at ? new Date(agent.created_at).toLocaleDateString() : '-',
        totalResolved,
        maxChats: agent.max_concurrent_chats || 5 // Use database value or default to 5
      };
    });
  };

  // Initial data fetch
  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch agents with max_concurrent_chats field
        const { data: agentData, error: agentError } = await supabase
          .from('profiles')
          .select('id, full_name, email, status, department, created_at, max_concurrent_chats')
          .eq('role', 'agent');
        
        if (agentError) throw agentError;
        
        // Log for debugging
        console.log('Fetched agent data:', agentData);
        
        // Check if we have any agents
        if (!agentData || agentData.length === 0) {
          console.log('No agents found in database');
          setAgents([]);
          setError('No agents found. Please ensure agents are properly configured in the system.');
          return;
        }
        
        // Fetch chats
        const { data: chatData, error: chatError } = await supabase
          .from('chats')
          .select('id, assigned_agent_id, status, response_time, satisfaction_rating, created_at');
        
        if (chatError) throw chatError;
        
        console.log('Fetched chat data:', chatData?.length || 0, 'chats');
        
        // Process agent data
        const processedAgents = processAgentData(agentData || [], chatData || []);
        console.log('Processed agents:', processedAgents);
        setAgents(processedAgents);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch team data';
        console.error('Error fetching team data:', err);
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgents();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchAgents, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate metrics when agents change
  useEffect(() => {
    calculateTeamMetrics();
  }, [agents]);

  const applyAdvancedFiltering = (agentsList: Agent[], filters: any) => {
    if (!filters) return agentsList;
    return agentsList.filter(agent => {
      if (filters.departments?.length > 0 && !filters.departments.includes(agent.department)) return false;
      if (filters.statuses?.length > 0 && !filters.statuses.includes(agent.status)) return false;
      if (filters.performanceRange?.satisfactionMin && parseFloat(agent.satisfaction) < parseInt(filters.performanceRange.satisfactionMin)) return false;
      if (filters.performanceRange?.satisfactionMax && parseFloat(agent.satisfaction) > parseInt(filters.performanceRange.satisfactionMax)) return false;
      if (filters.workload?.activeChatMin && agent.activeChats < parseInt(filters.workload.activeChatMin)) return false;
      if (filters.workload?.activeChatMax && agent.activeChats > parseInt(filters.workload.activeChatMax)) return false;
      if (filters.showOnlineOnly && agent.status !== 'online') return false;
      if (filters.showHighPerformers && parseFloat(agent.satisfaction) < 4.5) return false;
      if (filters.showOverloaded && agent.activeChats < 5) return false;
      return true;
    });
  };

  const filteredAgents = (() => {
    let result = agents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agent.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || agent.status.toLowerCase() === filterStatus;
      return matchesSearch && matchesFilter;
    });

    if (appliedAdvancedFilters) {
      result = applyAdvancedFiltering(result, appliedAdvancedFilters);
    }

    return result;
  })();

  const getStatusBadge = (status: string) => {
    const variants = {
      'online': 'default',
      'busy': 'secondary',
      'away': 'outline',
      'offline': 'destructive'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  const getPerformanceBadge = (satisfaction: string) => {
    const score = parseFloat(satisfaction);
    if (score >= 4.5) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 4.0) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (score >= 3.5) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  const getWorkloadBadge = (activeChats: number) => {
    if (activeChats === 0) return <Badge variant="outline">Idle</Badge>;
    if (activeChats <= 3) return <Badge className="bg-green-100 text-green-800">Light</Badge>;
    if (activeChats <= 6) return <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>;
    return <Badge className="bg-red-100 text-red-800">Heavy</Badge>;
  };

  const handleViewAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowAgentDetails(true);
  };

  const handleAgentAction = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowAgentActions(true);
    console.log('Opening agent actions for:', agent.name);
  };

  const handleAgentStatusChange = async (newStatus: string) => {
    if (!selectedAgent) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus.toLowerCase() })
        .eq('id', selectedAgent.id);
      if (error) throw error;
    toast({
        title: 'Status Updated',
        description: `${selectedAgent.name}'s status changed to ${newStatus}`,
    });
      // Update local state
      setAgents((prev) => prev.map((a) => a.id === selectedAgent.id ? { ...a, status: newStatus.toLowerCase() as Agent['status'] } : a));
    setShowAgentActions(false);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update status';
      setActionError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedAgent || !message.trim()) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: supervisor?.id,
            recipient_id: selectedAgent.id,
            content: message,
            sent_at: new Date().toISOString(),
            // Add other fields as needed
          },
        ]);
      if (error) throw error;
    toast({
        title: 'Message Sent',
        description: `Message sent to ${selectedAgent.name}`,
    });
    setShowAgentActions(false);
      setMessage('');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send message';
      setActionError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdvancedFilters = () => {
    setShowAdvancedFilters(true);
    console.log('Opening advanced filters');
  };

  const handleApplyAdvancedFilters = (filters: any) => {
    setAppliedAdvancedFilters(filters);
    toast({
      title: "Filters Applied",
      description: "Advanced filters have been applied to the team view",
    });
    console.log('Applied advanced filters:', filters);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'busy': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'away': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'offline': return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online': return 'default';
      case 'busy': return 'secondary';
      case 'away': return 'outline';
      case 'offline': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-20">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Team Monitor</h1>
                <p className="text-sm text-slate-600 mt-1">Monitor agent performance and manage team operations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 border-slate-200">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh team data</TooltipContent>
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
      <div className="max-w-full mx-auto p-6">
        {/* Team Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Agents</p>
                  <p className="text-3xl font-bold text-slate-900">{teamMetrics.totalAgents}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    <Users className="w-3 h-3 inline mr-1" />
                    Team members
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Online Now</p>
                  <p className="text-3xl font-bold text-slate-900">{teamMetrics.onlineAgents}</p>
                  <p className="text-xs text-green-600 mt-1">
                    <Activity className="w-3 h-3 inline mr-1" />
                    Active agents
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg Response Time</p>
                  <p className="text-3xl font-bold text-slate-900">{teamMetrics.avgResponseTime}</p>
                  <p className="text-xs text-orange-600 mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Team average
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Team CSAT</p>
                  <p className="text-3xl font-bold text-slate-900">{teamMetrics.avgSatisfaction.toFixed(1)}</p>
                  <p className="text-xs text-green-600 mt-1">
                    <Star className="w-3 h-3 inline mr-1" />
                    Average rating
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl">
                  <Star className="w-6 h-6 text-yellow-600" />
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
                    placeholder="Search agents by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/70 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
            />
          </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'online', 'busy', 'away', 'offline'].map((status) => (
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
            <Button 
              variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(true)}
                className="bg-white hover:bg-slate-50 border-slate-200"
          >
            <Filter className="w-4 h-4 mr-2" />
                Advanced
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Agents Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900">Team Members</CardTitle>
                <CardDescription className="text-slate-600">
                  {filteredAgents.length} agents • {agents.filter(a => a.status === 'online').length} online
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
                  <p className="text-slate-600">Loading team data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Error Loading Team Data</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={refreshTeamData} className="bg-blue-600 hover:bg-blue-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
          </Button>
        </div>
      </div>
            ) : filteredAgents.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No agents found</h3>
                  <p className="text-slate-600 mb-4">
                    {agents.length === 0 
                      ? 'No agents are configured in the system. Please add agents to get started.'
                      : 'Try adjusting your search or filters to find agents.'
                    }
                  </p>
                  {agents.length === 0 && (
                    <Button onClick={refreshTeamData} variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Data
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
          <Table>
            <TableHeader>
                    <TableRow className="bg-slate-50/50 border-b border-slate-200">
                      <TableHead className="font-semibold text-slate-700">Agent</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                      <TableHead className="font-semibold text-slate-700">Department</TableHead>
                      <TableHead className="font-semibold text-slate-700">Active Chats</TableHead>
                      <TableHead className="font-semibold text-slate-700">Performance</TableHead>
                      <TableHead className="font-semibold text-slate-700">Last Active</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                      <TableRow 
                        key={agent.id} 
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md">
                              <AvatarFallback className="text-white font-medium">
                                {agent.name?.charAt(0).toUpperCase() || '?'}
                              </AvatarFallback>
                            </Avatar>
                    <div>
                              <p className="font-medium text-slate-900">{agent.name || 'Unknown'}</p>
                              <p className="text-sm text-slate-600">{agent.email}</p>
                            </div>
                    </div>
                  </TableCell>
                  <TableCell>
                          <div className="flex items-center space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="flex items-center">
                                  {getStatusIcon(agent.status)}
                                </TooltipTrigger>
                                <TooltipContent>{agent.status} status</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Badge variant={getStatusBadgeVariant(agent.status)} className="text-xs">
                              {agent.status}
                            </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                          <span className="text-slate-700">{agent.department || 'General'}</span>
                  </TableCell>
                  <TableCell>
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4 text-blue-500" />
                            <span className="font-medium text-slate-900">{agent.activeChats || 0}</span>
                            <span className="text-xs text-slate-500">/ {agent.maxChats || 5}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                          <div className="flex items-center space-x-2">
                            <Star className={`w-4 h-4 ${getPerformanceColor(parseFloat(agent.satisfaction) || 0)}`} />
                            <span className={`font-medium ${getPerformanceColor(parseFloat(agent.satisfaction) || 0)}`}>
                              {agent.satisfaction || 'N/A'}
                            </span>
                    </div>
                  </TableCell>
                  <TableCell>
                          <span className="text-sm text-slate-600">
                            {agent.lastActivity ? new Date(agent.lastActivity).toLocaleDateString() : 'N/A'}
                          </span>
                  </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                      <Button 
                        size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedAgent(agent);
                                      setShowAgentDetails(true);
                                    }}
                                    className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                                </TooltipTrigger>
                                <TooltipContent>View details</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                      <Button 
                        size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedAgent(agent);
                                      setShowAgentActions(true);
                                    }}
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

      {/* Agent Details Dialog */}
      <Dialog open={showAgentDetails} onOpenChange={setShowAgentDetails}>
        <DialogContent className="max-w-2xl bg-white rounded-2xl border-slate-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">Agent Details</DialogTitle>
            <DialogDescription className="text-slate-600">
              Detailed information about {selectedAgent?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-xl">
                <Avatar className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg">
                  <AvatarFallback className="text-white text-xl font-bold">
                    {selectedAgent.name?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                  <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedAgent.name}</h3>
                  <p className="text-slate-600">{selectedAgent.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusIcon(selectedAgent.status)}
                    <Badge variant={getStatusBadgeVariant(selectedAgent.status)} className="text-xs">
                      {selectedAgent.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-slate-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 text-slate-500 mr-2" />
                        <span className="text-slate-700">{selectedAgent.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 text-slate-500 mr-2" />
                        <span className="text-slate-700">{selectedAgent.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Average Rating:</span>
                        <span className={`font-medium ${getPerformanceColor(parseFloat(selectedAgent.satisfaction) || 0)}`}>
                          {selectedAgent.satisfaction || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Active Chats:</span>
                        <span className="font-medium text-slate-900">{selectedAgent.activeChats || 0}</span>
                </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Response Time:</span>
                        <span className="font-medium text-slate-900">{selectedAgent.avgResponseTime || 'N/A'}</span>
                </div>
                </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Agent Actions Dialog */}
      <Dialog open={showAgentActions} onOpenChange={setShowAgentActions}>
        <DialogContent className="max-w-md bg-white rounded-2xl border-slate-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-slate-900">Agent Actions</DialogTitle>
            <DialogDescription className="text-slate-600">
              Actions for {selectedAgent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
              onClick={() => {
                // Handle send message
                setShowAgentActions(false);
              }}
            >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start bg-white hover:bg-yellow-50 border-yellow-200 text-yellow-700"
              onClick={() => {
                // Handle assign chat
                setShowAgentActions(false);
              }}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Assign Chat
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start bg-white hover:bg-slate-50 border-slate-200"
              onClick={() => {
                // Handle view performance
                setShowAgentActions(false);
              }}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Performance
                </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Advanced Filters Modal */}
      {showAdvancedFilters && (
      <AdvancedFiltersModal 
        open={showAdvancedFilters}
          onOpenChange={(open) => setShowAdvancedFilters(open)}
          onApplyFilters={(filters) => {
            setAppliedAdvancedFilters(filters);
            setShowAdvancedFilters(false);
          }}
        />
      )}
    </div>
  );
};
