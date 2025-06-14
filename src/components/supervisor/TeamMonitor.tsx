
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  Clock,
  Activity,
  MoreHorizontal
} from 'lucide-react';

export const TeamMonitor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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
      statusColor: "bg-green-500"
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
      statusColor: "bg-yellow-500"
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
      statusColor: "bg-green-500"
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
      statusColor: "bg-gray-500"
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
      statusColor: "bg-orange-500"
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
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="busy">Busy</option>
            <option value="away">Away</option>
            <option value="break">Break</option>
          </select>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
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
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
