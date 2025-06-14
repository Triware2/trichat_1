import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle,
  User,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

interface ChatData {
  id: number;
  customer: string;
  email: string;
  phone: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'urgent';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedAgent: string | null;
  createdAt: string;
  lastActivity: string;
  frtTarget: number; // minutes
  frtElapsed: number; // minutes
  source: 'website' | 'email' | 'phone' | 'social';
  category: string;
}

const mockChats: ChatData[] = [
  {
    id: 1,
    customer: 'John Smith',
    email: 'john@example.com',
    phone: '+1234567890',
    subject: 'Order delivery issue',
    status: 'urgent',
    priority: 'High',
    assignedAgent: 'Agent Smith',
    createdAt: '2024-01-15T10:30:00Z',
    lastActivity: '2024-01-15T11:45:00Z',
    frtTarget: 15,
    frtElapsed: 25,
    source: 'website',
    category: 'Order Issues'
  },
  {
    id: 2,
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1234567891',
    subject: 'Product return request',
    status: 'open',
    priority: 'Medium',
    assignedAgent: null,
    createdAt: '2024-01-15T09:15:00Z',
    lastActivity: '2024-01-15T09:15:00Z',
    frtTarget: 30,
    frtElapsed: 10,
    source: 'email',
    category: 'Returns'
  },
  {
    id: 3,
    customer: 'Bob Williams',
    email: 'bob@example.com',
    phone: '+1234567892',
    subject: 'Technical support needed',
    status: 'pending',
    priority: 'Critical',
    assignedAgent: 'Agent Davis',
    createdAt: '2024-01-15T08:00:00Z',
    lastActivity: '2024-01-15T10:20:00Z',
    frtTarget: 10,
    frtElapsed: 15,
    source: 'phone',
    category: 'Technical'
  },
  {
    id: 4,
    customer: 'Emily Brown',
    email: 'emily@example.com',
    phone: '+1234567893',
    subject: 'Account access problem',
    status: 'resolved',
    priority: 'Low',
    assignedAgent: 'Agent Wilson',
    createdAt: '2024-01-14T14:30:00Z',
    lastActivity: '2024-01-14T16:45:00Z',
    frtTarget: 60,
    frtElapsed: 45,
    source: 'social',
    category: 'Account'
  }
];

export const AllChatsContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredChats = useMemo(() => {
    let filtered = mockChats.filter(chat => {
      const matchesSearch = searchTerm === '' || 
        chat.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || chat.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || chat.priority === priorityFilter;
      const matchesAgent = agentFilter === 'all' || 
        (agentFilter === 'unassigned' && !chat.assignedAgent) ||
        chat.assignedAgent === agentFilter;
      const matchesSource = sourceFilter === 'all' || chat.source === sourceFilter;
      const matchesCategory = categoryFilter === 'all' || chat.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesAgent && matchesSource && matchesCategory;
    });

    // Sort by status priority: open/urgent first, then pending, then resolved
    filtered.sort((a, b) => {
      const statusPriority = { urgent: 0, open: 1, pending: 2, resolved: 3 };
      return statusPriority[a.status] - statusPriority[b.status];
    });

    return filtered;
  }, [searchTerm, statusFilter, priorityFilter, agentFilter, sourceFilter, categoryFilter, dateRange]);

  const paginatedChats = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredChats.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredChats, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredChats.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      open: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      Critical: 'bg-red-500 text-white',
      High: 'bg-orange-500 text-white',
      Medium: 'bg-yellow-500 text-white',
      Low: 'bg-green-500 text-white'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const getFRTStatus = (chat: ChatData) => {
    const isBreached = chat.frtElapsed > chat.frtTarget;
    const timeRemaining = chat.frtTarget - chat.frtElapsed;
    
    if (chat.status === 'resolved') {
      return { status: 'completed', color: 'text-green-600', icon: null };
    }
    
    if (isBreached) {
      return { status: 'breached', color: 'text-red-600', icon: <AlertTriangle className="w-4 h-4" /> };
    }
    
    if (timeRemaining <= 5) {
      return { status: 'warning', color: 'text-orange-600', icon: <Clock className="w-4 h-4" /> };
    }
    
    return { status: 'normal', color: 'text-green-600', icon: <Clock className="w-4 h-4" /> };
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setAgentFilter('all');
    setSourceFilter('all');
    setCategoryFilter('all');
    setDateRange({});
    setCurrentPage(1);
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full flex flex-col">
        <Card className="flex-1 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">All Chats</CardTitle>
              <Badge variant="outline" className="text-sm">
                {filteredChats.length} chats
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex flex-col h-full overflow-hidden">
            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="Agent Smith">Agent Smith</SelectItem>
                  <SelectItem value="Agent Davis">Agent Davis</SelectItem>
                  <SelectItem value="Agent Wilson">Agent Wilson</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>

            {/* Chat Table */}
            <div className="flex-1 overflow-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>FRT Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedChats.map((chat) => {
                    const frtStatus = getFRTStatus(chat);
                    return (
                      <TableRow key={chat.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{chat.customer}</div>
                            <div className="text-sm text-gray-500">{chat.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={chat.subject}>
                            {chat.subject}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(chat.status)}>
                            {chat.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityBadge(chat.priority)}>
                            {chat.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {chat.assignedAgent ? (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              {chat.assignedAgent}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{chat.source}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-2 ${frtStatus.color}`}>
                            {frtStatus.icon}
                            <span className="text-sm">
                              {chat.frtElapsed}m / {chat.frtTarget}m
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(chat.createdAt), 'MMM dd, HH:mm')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(chat.lastActivity), 'MMM dd, HH:mm')}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredChats.length)} of {filteredChats.length} chats
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
