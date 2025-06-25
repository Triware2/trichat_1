import { useState, useMemo, useEffect } from 'react';
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
  ChevronRight,
  UserPlus,
  Inbox
} from 'lucide-react';
import { format } from 'date-fns';
import { ManualAssignmentModal } from './ManualAssignmentModal';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type ChatStatus = Database['public']['Enums']['chat_status'];
type ChatPriority = Database['public']['Enums']['chat_priority'];

interface ChatData {
  id: string;
  customer: string;
  email: string;
  phone: string;
  subject: string;
  status: ChatStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Critical' | 'Urgent';
  assignedAgent: string | null;
  createdAt: string;
  lastActivity: string;
  frtTarget: number; 
  frtElapsed: number; 
  source: string;
  category: string;
}

interface AllChatsContentProps {
  onChatSelect: (chatId: string) => void;
  refreshKey?: string | number;
}

// Mock supervisor settings - in real app, this would come from API/context
const mockSupervisorSettings = {
  manualAssignmentEnabled: true
};

const mapPriority = (priority: ChatPriority): ChatData['priority'] => {
  const mapping: Record<ChatPriority, ChatData['priority']> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  };
  return mapping[priority];
};

export const AllChatsContent = ({ onChatSelect, refreshKey }: AllChatsContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedChatForAssignment, setSelectedChatForAssignment] = useState<ChatData | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('chats')
        .select(`
          id,
          created_at,
          updated_at,
          status,
          priority,
          subject,
          channel,
          customers ( name, email, phone ),
          profiles ( full_name )
        `);

      if (error) {
        console.error("Error fetching chats:", error);
        setChats([]);
      } else if (data) {
        const formattedData: ChatData[] = data.map((chat: any) => ({
          id: chat.id,
          customer: chat.customers?.name || 'Unknown Customer',
          email: chat.customers?.email || 'N/A',
          phone: chat.customers?.phone || 'N/A',
          subject: chat.subject || 'No Subject',
          status: chat.status,
          priority: mapPriority(chat.priority),
          assignedAgent: chat.profiles?.full_name || null,
          createdAt: chat.created_at,
          lastActivity: chat.updated_at,
          frtTarget: 30, // Mocked for now
          frtElapsed: 10, // Mocked for now
          source: chat.channel || 'unknown',
          category: chat.metadata?.category || 'General'
        }));
        setChats(formattedData);
      }
      setLoading(false);
    };

    fetchChats();
  }, [refreshKey]);

  const filteredChats = useMemo(() => {
    let filtered = chats.filter(chat => {
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
      const statusPriority = { urgent: 0, open: 1, pending: 2, resolved: 3, closed: 4, active: 5, queued: 6, escalated: 7 };
      return statusPriority[a.status] - statusPriority[b.status];
    });

    return filtered;
  }, [searchTerm, statusFilter, priorityFilter, agentFilter, sourceFilter, categoryFilter, dateRange, chats]);

  const paginatedChats = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredChats.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredChats, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredChats.length / itemsPerPage);

  const handleAssignChat = (chat: ChatData) => {
    setSelectedChatForAssignment(chat);
    setIsAssignmentModalOpen(true);
  };

  const handleAssignmentComplete = (chatId: string, agentName: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, assignedAgent: agentName }
          : chat
      )
    );
    setIsAssignmentModalOpen(false);
    setSelectedChatForAssignment(null);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      open: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      active: 'bg-cyan-100 text-cyan-800',
      queued: 'bg-indigo-100 text-indigo-800',
      escalated: 'bg-pink-100 text-pink-800',
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

  const NoChatsPlaceholder = () => (
    <div className="text-center py-16">
      <Inbox className="mx-auto h-16 w-16 text-slate-300" />
      <h3 className="mt-4 text-lg font-semibold text-slate-800">No Chats Found</h3>
      <p className="mt-2 text-sm text-slate-500">
        There are no chats matching your current filters. <br />
        Try adjusting your search or filter criteria.
      </p>
      <Button variant="outline" className="mt-6" onClick={clearFilters}>
        <Filter className="w-4 h-4 mr-2" />
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full flex flex-col">
        <Card className="flex-1 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">All Chats</CardTitle>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm">{filteredChats.length} chats</Badge>
                {mockSupervisorSettings.manualAssignmentEnabled && (
                  <Badge className="bg-blue-100 text-blue-800 text-sm">Manual Assignment Enabled</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-full overflow-hidden p-0">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6 px-6 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger><SelectValue placeholder="Filter by priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger><SelectValue placeholder="Agent" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="Agent Smith">Agent Smith</SelectItem>
                  <SelectItem value="Agent Davis">Agent Davis</SelectItem>
                  <SelectItem value="Agent Wilson">Agent Wilson</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" onClick={clearFilters} className="w-full justify-center">Clear Filters</Button>
            </div>
            {/* Table or Placeholder */}
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chats...</p>
                </div>
              ) : filteredChats.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                      <TableHead className="w-[250px]">Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Agent</TableHead>
                      <TableHead>FRT Status</TableHead>
                    <TableHead>Source</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedChats.map(chat => {
                      const frt = getFRTStatus(chat);
                    return (
                        <TableRow
                          key={chat.id}
                          onClick={() => onChatSelect(chat.id)}
                          className="cursor-pointer hover:bg-slate-50"
                        >
                        <TableCell>
                            <div className="font-medium text-slate-800">{chat.customer}</div>
                            <div className="text-xs text-slate-500">{chat.email}</div>
                        </TableCell>
                          <TableCell>{chat.subject}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={getStatusBadge(chat.status)}>{chat.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge className={getPriorityBadge(chat.priority)}>{chat.priority}</Badge>
                        </TableCell>
                          <TableCell>{chat.assignedAgent || <span className="text-slate-400 italic">Unassigned</span>}</TableCell>
                          <TableCell>
                            <div className={`flex items-center gap-2 ${frt.color}`}>{frt.icon}<span>{chat.frtElapsed} / {chat.frtTarget} min</span></div>
                          </TableCell>
                          <TableCell>{chat.source}</TableCell>
                          <TableCell>{chat.category}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={e => {
                                  e.stopPropagation();
                                  onChatSelect(chat.id);
                                }}
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              {mockSupervisorSettings.manualAssignmentEnabled && (
                            <Button 
                              variant="outline" 
                              size="sm"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleAssignChat(chat);
                                  }}
                            >
                                  <UserPlus className="w-4 h-4 mr-2" />
                              {chat.assignedAgent ? 'Reassign' : 'Assign'}
                            </Button>
                              )}
                            </div>
                          </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              ) : (
                <NoChatsPlaceholder />
              )}
            </div>
            {/* Pagination */}
            {filteredChats.length > itemsPerPage && (
              <div className="flex items-center justify-between p-4 border-t">
                <span className="text-sm text-slate-600">
                  Showing {paginatedChats.length} of {filteredChats.length} results
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      {/* Manual Assignment Modal */}
      <ManualAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => {
          setIsAssignmentModalOpen(false);
          setSelectedChatForAssignment(null);
        }}
        chat={selectedChatForAssignment}
          onAssignment={handleAssignmentComplete}
      />
      </div>
    </div>
  );
};
