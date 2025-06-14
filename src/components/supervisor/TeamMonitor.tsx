import { useState } from 'react';
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

export const TeamMonitor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [showAgentDetails, setShowAgentDetails] = useState(false);
  const [showAgentActions, setShowAgentActions] = useState(false);
  const { toast } = useToast();

  const agents = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      status: "Online",
      activeChats: 3,
      queuedChats: 2,
      avgResponseTime: "1.2m",
      satisfaction: 96,
      totalChatsToday: 12,
      lastActivity: "2 min ago",
      statusColor: "bg-green-500",
      phone: "+1 (555) 123-4567",
      department: "Technical Support",
      joinDate: "2023-01-15",
      totalResolved: 1247
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.c@company.com",
      status: "Busy",
      activeChats: 5,
      queuedChats: 1,
      avgResponseTime: "2.1m",
      satisfaction: 94,
      totalChatsToday: 18,
      lastActivity: "1 min ago",
      statusColor: "bg-yellow-500",
      phone: "+1 (555) 234-5678",
      department: "Billing Support",
      joinDate: "2023-03-20",
      totalResolved: 892
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.r@company.com",
      status: "Online",
      activeChats: 2,
      queuedChats: 0,
      avgResponseTime: "1.5m",
      satisfaction: 98,
      totalChatsToday: 8,
      lastActivity: "30 sec ago",
      statusColor: "bg-green-500",
      phone: "+1 (555) 345-6789",
      department: "General Support",
      joinDate: "2022-11-10",
      totalResolved: 1563
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.k@company.com",
      status: "Away",
      activeChats: 0,
      queuedChats: 3,
      avgResponseTime: "3.2m",
      satisfaction: 91,
      totalChatsToday: 6,
      lastActivity: "15 min ago",
      statusColor: "bg-gray-500",
      phone: "+1 (555) 456-7890",
      department: "Technical Support",
      joinDate: "2023-05-08",
      totalResolved: 734
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa.w@company.com",
      status: "Break",
      activeChats: 0,
      queuedChats: 0,
      avgResponseTime: "1.8m",
      satisfaction: 95,
      totalChatsToday: 10,
      lastActivity: "5 min ago",
      statusColor: "bg-orange-500",
      phone: "+1 (555) 567-8901",
      department: "Billing Support",
      joinDate: "2023-02-14",
      totalResolved: 1089
    }
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || agent.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string, statusColor: string) => {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
        <Badge variant={status === 'Online' ? 'default' : status === 'Busy' ? 'destructive' : 'secondary'}>
          {status}
        </Badge>
      </div>
    );
  };

  const handleViewAgent = (agent: any) => {
    setSelectedAgent(agent);
    setShowAgentDetails(true);
    console.log('Opening agent details for:', agent.name);
  };

  const handleAgentAction = (agent: any) => {
    setSelectedAgent(agent);
    setShowAgentActions(true);
    console.log('Opening agent actions for:', agent.name);
  };

  const handleAgentStatusChange = (newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `${selectedAgent?.name}'s status changed to ${newStatus}`,
    });
    setShowAgentActions(false);
    console.log(`Changing ${selectedAgent?.name} status to:`, newStatus);
  };

  const handleSendMessage = () => {
    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedAgent?.name}`,
    });
    setShowAgentActions(false);
    console.log('Sending message to:', selectedAgent?.name);
  };

  const handleAdvancedFilters = () => {
    toast({
      title: "Advanced Filters",
      description: "Opening advanced filter options",
    });
    console.log('Opening advanced filters');
  };

  return (
    <div className="space-y-6">
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
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleAdvancedFilters}
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
        </Button>
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
                <Button size="sm" onClick={() => handleAgentStatusChange('Online')} className="bg-green-600 hover:bg-green-700">
                  Online
                </Button>
                <Button size="sm" onClick={() => handleAgentStatusChange('Away')} variant="outline">
                  Away
                </Button>
                <Button size="sm" onClick={() => handleAgentStatusChange('Break')} className="bg-orange-600 hover:bg-orange-700">
                  Break
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Communication</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSendMessage} variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Agent
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
