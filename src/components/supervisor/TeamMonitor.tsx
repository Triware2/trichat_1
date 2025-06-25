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
  AlertCircle
} from 'lucide-react';
import { AdvancedFiltersModal } from './AdvancedFiltersModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export const TeamMonitor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [showAgentDetails, setShowAgentDetails] = useState(false);
  const [showAgentActions, setShowAgentActions] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [appliedAdvancedFilters, setAppliedAdvancedFilters] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user: supervisor } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch agents
        const { data: agentData, error: agentError } = await supabase
          .from('profiles')
          .select('id, full_name, email, status, department, phone, created_at')
          .eq('role', 'agent');
        if (agentError) throw new Error('Failed to fetch agents');
        // Fetch chats
        const { data: chatData, error: chatError } = await supabase
          .from('chats')
          .select('id, assigned_agent_id, status, response_time, satisfaction_rating, created_at')
        if (chatError) throw new Error('Failed to fetch chats');
        // Compute metrics for each agent
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const mappedAgents = (agentData || []).map((agent: any) => {
          const agentChats = (chatData || []).filter((c: any) => c.assigned_agent_id === agent.id);
          const activeChats = agentChats.filter((c: any) => c.status === 'active').length;
          const queuedChats = agentChats.filter((c: any) => c.status === 'queued').length;
          const todayChats = agentChats.filter((c: any) => c.created_at && new Date(c.created_at) >= todayStart);
          const avgResponse = agentChats.length > 0 ? (agentChats.reduce((acc: number, c: any) => acc + (c.response_time || 0), 0) / agentChats.length / 60).toFixed(1) : '0';
          const satisfaction = agentChats.length > 0 ? (agentChats.reduce((acc: number, c: any) => acc + (c.satisfaction_rating || 0), 0) / agentChats.length).toFixed(2) : '0';
          const totalResolved = agentChats.filter((c: any) => c.status === 'resolved').length;
          const lastActivity = agentChats.length > 0 ? agentChats[agentChats.length - 1].created_at : '-';
          return {
            id: agent.id,
            name: agent.full_name,
            email: agent.email,
            status: agent.status,
            activeChats,
            queuedChats,
            avgResponseTime: `${avgResponse}m`,
            satisfaction,
            totalChatsToday: todayChats.length,
            lastActivity: lastActivity ? new Date(lastActivity).toLocaleTimeString() : '-',
            statusColor: agent.status === 'online' ? 'bg-green-500' : agent.status === 'busy' ? 'bg-yellow-500' : agent.status === 'away' ? 'bg-gray-500' : 'bg-orange-500',
            phone: agent.phone,
            department: agent.department,
            joinDate: agent.created_at ? new Date(agent.created_at).toLocaleDateString() : '-',
            totalResolved
          };
        });
        setAgents(mappedAgents);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch team data');
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const applyAdvancedFiltering = (agentsList: any[], filters: any) => {
    if (!filters) return agentsList;
    return agentsList.filter(agent => {
      if (filters.departments.length > 0 && !filters.departments.includes(agent.department)) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(agent.status)) return false;
      if (filters.performanceRange.satisfactionMin && agent.satisfaction < parseInt(filters.performanceRange.satisfactionMin)) return false;
      if (filters.performanceRange.satisfactionMax && agent.satisfaction > parseInt(filters.performanceRange.satisfactionMax)) return false;
      if (filters.workload.activeChatMin && agent.activeChats < parseInt(filters.workload.activeChatMin)) return false;
      if (filters.workload.activeChatMax && agent.activeChats > parseInt(filters.workload.activeChatMax)) return false;
      if (filters.showOnlineOnly && agent.status !== 'online') return false;
      if (filters.showHighPerformers && agent.satisfaction < 95) return false;
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

  const getStatusBadge = (status: string, statusColor: string) => {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
        <Badge variant={status === 'online' ? 'default' : status === 'busy' ? 'destructive' : 'secondary'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
    );
  };

  const handleViewAgent = (agent: any) => {
    setSelectedAgent(agent);
    setShowAgentDetails(true);
  };

  const handleAgentAction = (agent: any) => {
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
      if (error) throw new Error(error.message);
      toast({
        title: 'Status Updated',
        description: `${selectedAgent.name}'s status changed to ${newStatus}`,
      });
      // Update local state
      setAgents((prev) => prev.map((a) => a.id === selectedAgent.id ? { ...a, status: newStatus.toLowerCase() } : a));
      setShowAgentActions(false);
    } catch (err: any) {
      setActionError(err.message || 'Failed to update status');
      toast({
        title: 'Error',
        description: err.message || 'Failed to update status',
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
      if (error) throw new Error(error.message);
      toast({
        title: 'Message Sent',
        description: `Message sent to ${selectedAgent.name}`,
      });
      setShowAgentActions(false);
      setMessage('');
    } catch (err: any) {
      setActionError(err.message || 'Failed to send message');
      toast({
        title: 'Error',
        description: err.message || 'Failed to send message',
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white z-10"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="busy">Busy</option>
              <option value="away">Away</option>
              <option value="break">Break</option>
            </select>
          </div>
          <div className="flex gap-2">
            {appliedAdvancedFilters && (
              <Button 
                variant="outline"
                onClick={() => setAppliedAdvancedFilters(null)}
                className="text-orange-600 border-orange-300"
              >
                Clear Advanced Filters
              </Button>
            )}
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAdvancedFilters}
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
              {appliedAdvancedFilters && (
                <Badge className="ml-2 bg-orange-500">Active</Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Agent Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Team Members ({filteredAgents.length})
            </CardTitle>
            <CardDescription>
              Real-time monitoring of agent activities and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active Chats</TableHead>
                  <TableHead>Queue</TableHead>
                  <TableHead>Avg Response</TableHead>
                  <TableHead>Satisfaction</TableHead>
                  <TableHead>Today's Chats</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{agent.name}</p>
                        <p className="text-sm text-gray-500">{agent.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(agent.status, agent.statusColor)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{agent.activeChats}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${agent.queuedChats > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                        {agent.queuedChats}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{agent.avgResponseTime}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${agent.satisfaction >= 95 ? 'bg-green-500' : agent.satisfaction >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span className="font-medium">{agent.satisfaction}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{agent.totalChatsToday}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{agent.lastActivity}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewAgent(agent)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAgentAction(agent)}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Agent Details Dialog */}
        <Dialog open={showAgentDetails} onOpenChange={setShowAgentDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Agent Details - {selectedAgent?.name}
              </DialogTitle>
              <DialogDescription>
                Detailed information and performance metrics
              </DialogDescription>
            </DialogHeader>
            {selectedAgent && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedAgent.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedAgent.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Joined: {selectedAgent.joinDate}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium">{selectedAgent.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Resolved</p>
                      <p className="font-medium">{selectedAgent.totalResolved}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedAgent.activeChats}</p>
                    <p className="text-sm text-gray-600">Active Chats</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedAgent.satisfaction}%</p>
                    <p className="text-sm text-gray-600">Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{selectedAgent.avgResponseTime}</p>
                    <p className="text-sm text-gray-600">Avg Response</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Agent Actions Dialog */}
        <Dialog open={showAgentActions} onOpenChange={setShowAgentActions}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MoreHorizontal className="w-5 h-5" />
                Agent Actions - {selectedAgent?.name}
              </DialogTitle>
              <DialogDescription>
                Manage agent status and send communications
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Change Status</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAgentStatusChange('Online')} className="bg-green-600 hover:bg-green-700" disabled={actionLoading}>
                    Online
                  </Button>
                  <Button size="sm" onClick={() => handleAgentStatusChange('Away')} variant="outline" disabled={actionLoading}>
                    Away
                  </Button>
                  <Button size="sm" onClick={() => handleAgentStatusChange('Break')} className="bg-orange-600 hover:bg-orange-700" disabled={actionLoading}>
                    Break
                  </Button>
                </div>
                {actionError && <p className="text-xs text-red-600 mt-2">{actionError}</p>}
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Communication</p>
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-48"
                    disabled={actionLoading}
                  />
                  <Button size="sm" onClick={handleSendMessage} variant="outline" disabled={actionLoading || !message.trim()}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button size="sm" variant="outline" disabled>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Agent
                  </Button>
                </div>
                {actionError && <p className="text-xs text-red-600 mt-2">{actionError}</p>}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Advanced Filters Modal */}
        <AdvancedFiltersModal 
          open={showAdvancedFilters}
          onOpenChange={setShowAdvancedFilters}
          onApplyFilters={handleApplyAdvancedFilters}
        />

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agents Online</p>
                <p className="text-2xl font-bold text-green-600">
                  {agents.filter(a => a.status === 'Online').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Active Chats</p>
                <p className="text-2xl font-bold text-blue-600">
                  {agents.reduce((sum, agent) => sum + agent.activeChats, 0)}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Queue Length</p>
                <p className="text-2xl font-bold text-orange-600">
                  {agents.reduce((sum, agent) => sum + agent.queuedChats, 0)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
