import { useState } from 'react';
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

export const QueueManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const { toast } = useToast();

  const queueItems = [
    {
      id: 1,
      customerName: "John Smith",
      customerEmail: "john.smith@email.com",
      subject: "Payment issue with order #12345",
      priority: "High",
      waitTime: "8m 32s",
      category: "Billing",
      assignedAgent: null,
      lastMessage: "I can't process my refund, getting error message",
      timestamp: "2 minutes ago"
    },
    {
      id: 2,
      customerName: "Sarah Wilson",
      customerEmail: "sarah.w@email.com",
      subject: "Product inquiry - Premium features",
      priority: "Medium",
      waitTime: "5m 15s",
      category: "Sales",
      assignedAgent: "Mike Chen",
      lastMessage: "Can you explain the difference between plans?",
      timestamp: "5 minutes ago"
    },
    {
      id: 3,
      customerName: "Robert Brown",
      customerEmail: "robert.b@email.com",
      subject: "Technical support needed",
      priority: "Low",
      waitTime: "12m 8s",
      category: "Technical",
      assignedAgent: null,
      lastMessage: "Having trouble connecting to the API",
      timestamp: "12 minutes ago"
    },
    {
      id: 4,
      customerName: "Maria Garcia",
      customerEmail: "maria.g@email.com",
      subject: "Account access problems",
      priority: "High",
      waitTime: "3m 45s",
      category: "Account",
      assignedAgent: null,
      lastMessage: "Can't log into my account, password reset not working",
      timestamp: "1 minute ago"
    },
    {
      id: 5,
      customerName: "David Lee",
      customerEmail: "david.l@email.com",
      subject: "Shipping delay inquiry",
      priority: "Medium",
      waitTime: "15m 22s",
      category: "Shipping",
      assignedAgent: "Emily Rodriguez",
      lastMessage: "When will my order arrive? Tracking shows no updates",
      timestamp: "15 minutes ago"
    }
  ];

  const availableAgents = [
    { name: "Sarah Johnson", status: "Available", activeChats: 2 },
    { name: "Mike Chen", status: "Busy", activeChats: 5 },
    { name: "Emily Rodriguez", status: "Available", activeChats: 1 },
    { name: "David Kim", status: "Away", activeChats: 0 }
  ];

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

  const handleAssignAgent = (queueId: number, agentName: string) => {
    if (!agentName) return;
    
    toast({
      title: "Agent Assigned",
      description: `Queue item ${queueId} has been assigned to ${agentName}`,
    });
    console.log(`Assigning queue item ${queueId} to ${agentName}`);
  };

  const handlePriorityChange = (queueId: number, newPriority: string) => {
    toast({
      title: "Priority Updated",
      description: `Queue item ${queueId} priority changed to ${newPriority}`,
    });
    console.log(`Changing priority of queue item ${queueId} to ${newPriority}`);
  };

  const handleRefresh = () => {
    toast({
      title: "Queue Refreshed",
      description: "Queue data has been updated",
    });
  };

  const handleAutoAssign = () => {
    toast({
      title: "Auto-Assignment Started",
      description: "Automatically assigning queue items to available agents",
    });
  };

  const handleViewCustomer = (queueId: number) => {
    toast({
      title: "Customer Details",
      description: `Opening details for queue item ${queueId}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
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
        <Card>
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
        <Card>
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
        <Card>
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

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
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

      {/* Queue Table */}
      <Card>
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
                      <p className="text-sm text-gray-500 max-w-xs truncate">{item.lastMessage}</p>
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
                      <span className="text-sm text-gray-500">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {!item.assignedAgent && (
                        <select
                          onChange={(e) => handleAssignAgent(item.id, e.target.value)}
                          className="text-xs px-2 py-1 border rounded bg-white z-10"
                          defaultValue=""
                        >
                          <option value="" disabled>Assign to...</option>
                          {availableAgents
                            .filter(agent => agent.status === 'Available')
                            .map(agent => (
                              <option key={agent.name} value={agent.name}>
                                {agent.name}
                              </option>
                            ))}
                        </select>
                      )}
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

      {/* Available Agents */}
      <Card>
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
    </div>
  );
};
