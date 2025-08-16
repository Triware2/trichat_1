import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Users, 
  Tag, 
  AlertTriangle, 
  Archive, 
  Trash2, 
  MessageSquare, 
  Clock, 
  Star,
  CheckCircle,
  X,
  Loader2,
  Filter,
  Search,
  Download,
  Upload,
  Settings,
  Zap,
  Target,
  Bell,
  Mail,
  Calendar,
  Hash,
  UserCheck,
  UserX,
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Share2,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  Save,
  Edit,
  Plus,
  Minus,
  MoreHorizontal,
  Flag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Interfaces
interface ChatConversation {
  id: string;
  chat_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_type: 'new' | 'returning' | 'vip' | 'enterprise';
  channel_id: string;
  channel_name: string;
  subject: string;
  status: 'active' | 'waiting' | 'resolved' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_agent_id?: string;
  assigned_agent_name?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  last_message_at: string;
  last_message: string;
  message_count: number;
  satisfaction_score?: number;
  is_flagged: boolean;
  escalation_level: number;
  response_time: number;
  resolution_time?: number;
  language: string;
  timezone: string;
  metadata: any;
}

interface BulkOperation {
  id: string;
  type: 'assign' | 'close' | 'tag' | 'priority' | 'archive' | 'delete' | 'escalate' | 'flag' | 'export' | 'import' | 'merge' | 'split' | 'schedule' | 'notify' | 'analyze' | 'automate';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  affected_count: number;
  created_by: string;
  created_at: string;
  completed_at?: string;
  details: any;
}

interface BulkOperationsProps {
  onOperationComplete?: () => void;
}

export const BulkOperations = ({ onOperationComplete }: BulkOperationsProps) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    channel: 'all',
    agent: 'all',
    dateRange: 'all',
    tags: [] as string[]
  });
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  const [isOperationDialogOpen, setIsOperationDialogOpen] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<{
    type: string;
    data: any;
  } | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockConversations: ChatConversation[] = [
    {
      id: '1',
      chat_id: 'chat_001',
      customer_id: 'cust_001',
      customer_name: 'John Smith',
      customer_email: 'john@example.com',
      customer_type: 'returning',
      channel_id: 'web',
      channel_name: 'Website Chat',
      subject: 'Website Chat - Product Inquiry',
      status: 'active',
      priority: 'high',
      assigned_agent_id: 'agent_001',
      assigned_agent_name: 'Sarah Johnson',
      tags: ['urgent', 'technical'],
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T11:45:00Z',
      last_message_at: '2024-01-15T11:45:00Z',
      last_message: 'Hello, I need help with the product.',
      message_count: 15,
      satisfaction_score: 4,
      is_flagged: false,
      escalation_level: 0,
      response_time: 120,
      language: 'en',
      timezone: 'America/New_York',
      metadata: { browser: 'Chrome', os: 'Windows' }
    },
    {
      id: '2',
      chat_id: 'chat_002',
      customer_id: 'cust_001',
      customer_name: 'John Smith',
      customer_email: 'john@example.com',
      customer_type: 'returning',
      channel_id: 'email',
      channel_name: 'Email Support',
      subject: 'Email Support - Billing Question',
      status: 'waiting',
      priority: 'medium',
      tags: ['billing'],
      created_at: '2024-01-15T14:20:00Z',
      updated_at: '2024-01-15T14:20:00Z',
      last_message_at: '2024-01-15T14:20:00Z',
      last_message: 'I have a question about my recent bill.',
      message_count: 3,
      is_flagged: false,
      escalation_level: 0,
      response_time: 600,
      language: 'en',
      timezone: 'America/New_York',
      metadata: { email_client: 'Gmail' }
    },
    {
      id: '3',
      chat_id: 'chat_003',
      customer_id: 'cust_002',
      customer_name: 'Emma Wilson',
      customer_email: 'emma@example.com',
      customer_type: 'new',
      channel_id: 'whatsapp',
      channel_name: 'WhatsApp',
      subject: 'WhatsApp Chat - Billing Issue',
      status: 'waiting',
      priority: 'medium',
      tags: ['billing'],
      created_at: '2024-01-15T09:15:00Z',
      updated_at: '2024-01-15T10:20:00Z',
      last_message_at: '2024-01-15T10:20:00Z',
      last_message: 'I have a billing issue, my account was charged twice.',
      message_count: 8,
      is_flagged: false,
      escalation_level: 0,
      response_time: 300,
      language: 'en',
      timezone: 'Europe/London',
      metadata: { platform: 'mobile' }
    },
    {
      id: '4',
      chat_id: 'chat_004',
      customer_id: 'cust_002',
      customer_name: 'Emma Wilson',
      customer_email: 'emma@example.com',
      customer_type: 'new',
      channel_id: 'web',
      channel_name: 'Website Chat',
      subject: 'Website Chat - Account Setup',
      status: 'resolved',
      priority: 'low',
      assigned_agent_id: 'agent_002',
      assigned_agent_name: 'Mike Davis',
      tags: ['account', 'setup'],
      created_at: '2024-01-14T16:45:00Z',
      updated_at: '2024-01-15T08:30:00Z',
      last_message_at: '2024-01-15T08:30:00Z',
      last_message: 'Thank you for helping me set up my account!',
      message_count: 12,
      satisfaction_score: 5,
      is_flagged: false,
      escalation_level: 0,
      response_time: 180,
      resolution_time: 3600,
      language: 'en',
      timezone: 'Europe/London',
      metadata: { browser: 'Safari', os: 'macOS' }
    },
    {
      id: '5',
      chat_id: 'chat_005',
      customer_id: 'cust_003',
      customer_name: 'Michael Brown',
      customer_email: 'michael@example.com',
      customer_type: 'vip',
      channel_id: 'email',
      channel_name: 'Email Support',
      subject: 'Email Support - Technical Issue',
      status: 'resolved',
      priority: 'low',
      assigned_agent_id: 'agent_002',
      assigned_agent_name: 'Mike Davis',
      tags: ['general'],
      created_at: '2024-01-14T14:20:00Z',
      updated_at: '2024-01-15T09:30:00Z',
      last_message_at: '2024-01-15T09:30:00Z',
      last_message: 'I am experiencing a technical issue with the application.',
      message_count: 12,
      satisfaction_score: 5,
      is_flagged: false,
      escalation_level: 0,
      response_time: 180,
      resolution_time: 3600,
      language: 'en',
      timezone: 'America/Los_Angeles',
      metadata: { vip_level: 'gold' }
    },
    {
      id: '6',
      chat_id: 'chat_006',
      customer_id: 'cust_003',
      customer_name: 'Michael Brown',
      customer_email: 'michael@example.com',
      customer_type: 'vip',
      channel_id: 'phone',
      channel_name: 'Phone Support',
      subject: 'Phone Support - Feature Request',
      status: 'active',
      priority: 'high',
      assigned_agent_id: 'agent_001',
      assigned_agent_name: 'Sarah Johnson',
      tags: ['feature-request', 'vip'],
      created_at: '2024-01-15T13:00:00Z',
      updated_at: '2024-01-15T15:45:00Z',
      last_message_at: '2024-01-15T15:45:00Z',
      last_message: 'I would like to request a new feature for the dashboard.',
      message_count: 6,
      is_flagged: false,
      escalation_level: 0,
      response_time: 90,
      language: 'en',
      timezone: 'America/Los_Angeles',
      metadata: { call_duration: '15m', vip_level: 'gold' }
    },
    {
      id: '7',
      chat_id: 'chat_007',
      customer_id: 'cust_004',
      customer_name: 'Lisa Chen',
      customer_email: 'lisa@example.com',
      customer_type: 'enterprise',
      channel_id: 'web',
      channel_name: 'Website Chat',
      subject: 'Website Chat - Enterprise Integration',
      status: 'active',
      priority: 'urgent',
      assigned_agent_id: 'agent_003',
      assigned_agent_name: 'Lisa Chen',
      tags: ['enterprise', 'integration', 'urgent'],
      created_at: '2024-01-15T12:00:00Z',
      updated_at: '2024-01-15T16:20:00Z',
      last_message_at: '2024-01-15T16:20:00Z',
      last_message: 'We need help with enterprise integration setup.',
      message_count: 25,
      is_flagged: true,
      escalation_level: 2,
      response_time: 60,
      language: 'en',
      timezone: 'Asia/Shanghai',
      metadata: { company: 'TechCorp Inc', enterprise_tier: 'premium' }
    },
    {
      id: '8',
      chat_id: 'chat_008',
      customer_id: 'cust_004',
      customer_name: 'Lisa Chen',
      customer_email: 'lisa@example.com',
      customer_type: 'enterprise',
      channel_id: 'email',
      channel_name: 'Email Support',
      subject: 'Email Support - Contract Renewal',
      status: 'waiting',
      priority: 'medium',
      tags: ['contract', 'renewal'],
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      last_message_at: '2024-01-15T10:00:00Z',
      last_message: 'I need information about contract renewal options.',
      message_count: 2,
      is_flagged: false,
      escalation_level: 0,
      response_time: 1200,
      language: 'en',
      timezone: 'Asia/Shanghai',
      metadata: { company: 'TechCorp Inc', enterprise_tier: 'premium' }
    }
  ];

  useEffect(() => {
    fetchConversations();
    fetchBulkOperations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      // In production, this would fetch from the database
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBulkOperations = async () => {
    try {
      // In production, this would fetch from the database
      setBulkOperations([]);
    } catch (error) {
      console.error('Error fetching bulk operations:', error);
    }
  };

  // Selection handlers
  const toggleSelection = (conversationId: string) => {
    const newSelection = new Set(selectedConversations);
    if (newSelection.has(conversationId)) {
      newSelection.delete(conversationId);
    } else {
      newSelection.add(conversationId);
    }
    setSelectedConversations(newSelection);
  };

  const selectAll = () => {
    if (selectedConversations.size === conversations.length) {
      setSelectedConversations(new Set());
    } else {
      setSelectedConversations(new Set(conversations.map(c => c.id)));
    }
  };

  // Filter and search
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.last_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filters.status === 'all' || conversation.status === filters.status;
    const matchesPriority = filters.priority === 'all' || conversation.priority === filters.priority;
    const matchesChannel = filters.channel === 'all' || conversation.channel_id === filters.channel;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesChannel;
  });

  // Bulk operation handlers
  const handleBulkOperation = async (operationType: string, operationData: any) => {
    if (selectedConversations.size === 0) {
      toast({
        title: "Warning",
        description: "Please select at least one conversation",
        variant: "destructive"
      });
      return;
    }

    setCurrentOperation({ type: operationType, data: operationData });
    setIsOperationDialogOpen(true);
  };

  const executeBulkOperation = async () => {
    if (!currentOperation) return;

    try {
      setOperationLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const selectedIds = Array.from(selectedConversations);
      const operationId = Date.now().toString();

      // Create operation record
      const newOperation: BulkOperation = {
        id: operationId,
        type: currentOperation.type as any,
        status: 'processing',
        affected_count: selectedIds.length,
        created_by: user.id,
        created_at: new Date().toISOString(),
        details: currentOperation.data
      };

      setBulkOperations(prev => [newOperation, ...prev]);

      // Simulate operation processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update conversations based on operation type
      let updatedConversations = [...conversations];
      
      switch (currentOperation.type) {
        case 'assign':
          updatedConversations = conversations.map(conv => 
            selectedIds.includes(conv.id) 
              ? { ...conv, assigned_agent_id: currentOperation.data.agentId, assigned_agent_name: currentOperation.data.agentName }
              : conv
          );
          break;
        
        case 'close':
          updatedConversations = conversations.map(conv => 
            selectedIds.includes(conv.id) 
              ? { ...conv, status: 'closed', updated_at: new Date().toISOString() }
              : conv
          );
          break;
        
        case 'tag':
          updatedConversations = conversations.map(conv => 
            selectedIds.includes(conv.id) 
              ? { 
                  ...conv, 
                  tags: currentOperation.data.action === 'add' 
                    ? [...new Set([...conv.tags, ...currentOperation.data.tags])]
                    : conv.tags.filter(tag => !currentOperation.data.tags.includes(tag))
                }
              : conv
          );
          break;
        
        case 'priority':
          updatedConversations = conversations.map(conv => 
            selectedIds.includes(conv.id) 
              ? { ...conv, priority: currentOperation.data.priority }
              : conv
          );
          break;
        
        case 'archive':
          updatedConversations = conversations.map(conv => 
            selectedIds.includes(conv.id) 
              ? { ...conv, status: 'archived', updated_at: new Date().toISOString() }
              : conv
          );
          break;
        
        case 'escalate':
          updatedConversations = conversations.map(conv => 
            selectedIds.includes(conv.id) 
              ? { ...conv, escalation_level: conv.escalation_level + 1, priority: 'urgent' }
              : conv
          );
          break;
        
        case 'flag':
          updatedConversations = conversations.map(conv => 
            selectedIds.includes(conv.id) 
              ? { ...conv, is_flagged: currentOperation.data.flagged }
              : conv
          );
          break;
      }

      setConversations(updatedConversations);
      
      // Update operation status
      setBulkOperations(prev => prev.map(op => 
        op.id === operationId 
          ? { ...op, status: 'completed', completed_at: new Date().toISOString() }
          : op
      ));

      // Clear selection
      setSelectedConversations(new Set());
      
      toast({
        title: "Success",
        description: `Bulk operation completed successfully. ${selectedIds.length} conversations affected.`,
      });

      onOperationComplete?.();
      
    } catch (error: any) {
      console.error('Error executing bulk operation:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setOperationLoading(false);
      setIsOperationDialogOpen(false);
      setCurrentOperation(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Action button handlers
  const handleViewConversation = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    setIsViewDialogOpen(true);
  };

  const handleEditConversation = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    setIsEditDialogOpen(true);
  };

  const handleMoreOptions = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    setIsMoreOptionsOpen(true);
  };

  const handleQuickAction = async (action: string, conversation: ChatConversation) => {
    try {
      switch (action) {
        case 'assign':
          toast({
            title: "Success",
            description: `Conversation assigned to agent`,
          });
          break;
        case 'close':
          toast({
            title: "Success",
            description: `Conversation closed`,
          });
          break;
        case 'escalate':
          toast({
            title: "Success",
            description: `Conversation escalated`,
          });
          break;
        case 'flag':
          toast({
            title: "Success",
            description: `Conversation flagged`,
          });
          break;
        case 'archive':
          toast({
            title: "Success",
            description: `Conversation archived`,
          });
          break;
        case 'delete':
          toast({
            title: "Success",
            description: `Conversation deleted`,
          });
          break;
      }
      setIsMoreOptionsOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-slate-600">Loading conversations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Bulk Operations</h2>
          <p className="text-sm text-slate-600">Manage multiple conversations efficiently</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Filter className="w-4 h-4" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Channel</Label>
              <Select value={filters.channel} onValueChange={(value) => setFilters(prev => ({ ...prev, channel: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="web">Website</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFilters({
                    status: 'all',
                    priority: 'all',
                    channel: 'all',
                    agent: 'all',
                    dateRange: 'all',
                    tags: []
                  })}
                >
                  Clear
                </Button>
                <Button size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedConversations.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedConversations.size} conversation{selectedConversations.size !== 1 ? 's' : ''} selected
                </span>
                <Button variant="outline" size="sm" onClick={() => setSelectedConversations(new Set())}>
                  <X className="w-4 h-4 mr-2" />
                  Clear Selection
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Select onValueChange={(value) => handleBulkOperation(value, {})}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Choose bulk action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assign">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Assign to Agent
                      </div>
                    </SelectItem>
                    <SelectItem value="close">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Close Chats
                      </div>
                    </SelectItem>
                    <SelectItem value="tag">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Add/Remove Tags
                      </div>
                    </SelectItem>
                    <SelectItem value="priority">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Change Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="archive">
                      <div className="flex items-center gap-2">
                        <Archive className="w-4 h-4" />
                        Archive Chats
                      </div>
                    </SelectItem>
                    <SelectItem value="escalate">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Escalate
                      </div>
                    </SelectItem>
                    <SelectItem value="flag">
                      <div className="flex items-center gap-2">
                        <Flag className="w-4 h-4" />
                        Flag/Unflag
                      </div>
                    </SelectItem>
                    <SelectItem value="notify">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Send Notifications
                      </div>
                    </SelectItem>
                    <SelectItem value="schedule">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Schedule Follow-up
                      </div>
                    </SelectItem>
                    <SelectItem value="merge">
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Merge Conversations
                      </div>
                    </SelectItem>
                    <SelectItem value="export">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Data
                      </div>
                    </SelectItem>
                    <SelectItem value="analyze">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Analyze Patterns
                      </div>
                    </SelectItem>
                    <SelectItem value="automate">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Create Automation
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkOperation('delete', {})}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversations Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">Select Chats for Bulk Operation</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">
                {filteredConversations.length} chat conversations
              </span>
              <Button variant="outline" size="sm" onClick={selectAll}>
                {selectedConversations.size === conversations.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    <Checkbox 
                      checked={selectedConversations.size === conversations.length && conversations.length > 0}
                      onCheckedChange={selectAll}
                    />
                  </th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Chat Subject</th>
                  <th className="text-left p-3">Channel</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Priority</th>
                  <th className="text-left p-3">Agent</th>
                  <th className="text-left p-3">Tags</th>
                  <th className="text-left p-3">Last Message</th>
                  <th className="text-left p-3">Last Activity</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConversations.map((conversation) => (
                  <tr key={conversation.id} className="border-b hover:bg-slate-50">
                    <td className="p-3">
                      <Checkbox 
                        checked={selectedConversations.has(conversation.id)}
                        onCheckedChange={() => toggleSelection(conversation.id)}
                      />
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{conversation.customer_name}</div>
                        <div className="text-sm text-slate-500">{conversation.customer_email}</div>
                        <div className="text-xs text-slate-400">{conversation.customer_type}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{conversation.subject}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{conversation.channel_name}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(conversation.status)}>
                        {conversation.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getPriorityColor(conversation.priority)}>
                        {conversation.priority}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {conversation.assigned_agent_name || (
                        <span className="text-slate-400">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {conversation.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">{conversation.last_message}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div>{new Date(conversation.last_message_at).toLocaleDateString()}</div>
                        <div className="text-slate-500">
                          {new Date(conversation.last_message_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewConversation(conversation)}
                          title="View conversation details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditConversation(conversation)}
                          title="Edit conversation"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMoreOptions(conversation)}
                          title="More options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Operation Dialog */}
      <Dialog open={isOperationDialogOpen} onOpenChange={setIsOperationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentOperation?.type === 'assign' && <UserCheck className="w-5 h-5" />}
              {currentOperation?.type === 'close' && <CheckCircle className="w-5 h-5" />}
              {currentOperation?.type === 'tag' && <Tag className="w-5 h-5" />}
              {currentOperation?.type === 'priority' && <AlertTriangle className="w-5 h-5" />}
              {currentOperation?.type === 'archive' && <Archive className="w-5 h-5" />}
              {currentOperation?.type === 'delete' && <Trash2 className="w-5 h-5" />}
              {currentOperation?.type === 'escalate' && <TrendingUp className="w-5 h-5" />}
              {currentOperation?.type === 'flag' && <Flag className="w-5 h-5" />}
              Bulk {currentOperation?.type?.charAt(0).toUpperCase() + currentOperation?.type?.slice(1)} Operation
            </DialogTitle>
            <DialogDescription>
              This action will affect {selectedConversations.size} selected conversation{selectedConversations.size !== 1 ? 's' : ''}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {currentOperation?.type === 'assign' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Agent</Label>
                  <Select onValueChange={(value) => setCurrentOperation(prev => ({ ...prev!, data: { ...prev!.data, agentId: value, agentName: value === 'agent_001' ? 'Sarah Johnson' : 'Mike Davis' } }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent_001">Sarah Johnson (Technical)</SelectItem>
                      <SelectItem value="agent_002">Mike Davis (General)</SelectItem>
                      <SelectItem value="agent_003">Lisa Chen (Billing)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Assignment Note (Optional)</Label>
                  <Textarea placeholder="Add a note about this assignment..." />
                </div>
              </div>
            )}

            {currentOperation?.type === 'tag' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select onValueChange={(value) => setCurrentOperation(prev => ({ ...prev!, data: { ...prev!.data, action: value } }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add or remove tags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">Add Tags</SelectItem>
                      <SelectItem value="remove">Remove Tags</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="space-y-2">
                    {['urgent', 'technical', 'billing', 'vip', 'escalated', 'resolved'].map(tag => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox 
                          id={tag}
                          onCheckedChange={(checked) => {
                            const currentTags = currentOperation?.data?.tags || [];
                            const newTags = checked 
                              ? [...currentTags, tag]
                              : currentTags.filter(t => t !== tag);
                            setCurrentOperation(prev => ({ ...prev!, data: { ...prev!.data, tags: newTags } }));
                          }}
                        />
                        <Label htmlFor={tag}>{tag}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentOperation?.type === 'priority' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>New Priority</Label>
                  <Select onValueChange={(value) => setCurrentOperation(prev => ({ ...prev!, data: { ...prev!.data, priority: value } }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">🔴 Urgent</SelectItem>
                      <SelectItem value="high">🟠 High</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="low">🟢 Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Reason for Change (Optional)</Label>
                  <Textarea placeholder="Explain why you're changing the priority..." />
                </div>
              </div>
            )}

            {currentOperation?.type === 'delete' && (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Warning: This action cannot be undone</span>
                  </div>
                  <p className="text-red-700 mt-2">
                    Deleting conversations will permanently remove them from the system. 
                    This action cannot be reversed.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Deletion Reason (Required)</Label>
                  <Select onValueChange={(value) => setCurrentOperation(prev => ({ ...prev!, data: { ...prev!.data, reason: value } }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="duplicate">Duplicate conversations</SelectItem>
                      <SelectItem value="spam">Spam or inappropriate content</SelectItem>
                      <SelectItem value="test">Test conversations</SelectItem>
                      <SelectItem value="cleanup">System cleanup</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea placeholder="Provide additional details..." />
                </div>
              </div>
            )}

            {currentOperation?.type === 'flag' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Flag Action</Label>
                  <Select onValueChange={(value) => setCurrentOperation(prev => ({ ...prev!, data: { ...prev!.data, flagged: value === 'flag' } }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Flag or unflag conversations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flag">🚩 Flag Conversations</SelectItem>
                      <SelectItem value="unflag">✅ Remove Flags</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Flag Reason (Optional)</Label>
                  <Textarea placeholder="Why are you flagging these conversations?" />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setIsOperationDialogOpen(false)}
                disabled={operationLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={executeBulkOperation}
                disabled={operationLoading}
                className={
                  currentOperation?.type === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }
              >
                {operationLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {currentOperation?.type === 'delete' ? 'Delete Permanently' : 'Execute Operation'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recent Operations */}
      {bulkOperations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Recent Bulk Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bulkOperations.slice(0, 5).map((operation) => (
                <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      operation.status === 'completed' ? 'bg-green-500' :
                      operation.status === 'processing' ? 'bg-yellow-500' :
                      operation.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <div className="font-medium capitalize">{operation.type} Operation</div>
                      <div className="text-sm text-slate-500">
                        {operation.affected_count} conversations affected
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium capitalize">{operation.status}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(operation.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Conversation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Conversation Details
            </DialogTitle>
          </DialogHeader>
          {selectedConversation && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Customer Information</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Name:</span>
                        <span className="font-medium">{selectedConversation.customer_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Email:</span>
                        <span className="font-medium">{selectedConversation.customer_email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Type:</span>
                        <Badge variant="outline">{selectedConversation.customer_type}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Chat Information</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Chat ID:</span>
                        <span className="font-medium">{selectedConversation.chat_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Subject:</span>
                        <span className="font-medium">{selectedConversation.subject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Channel:</span>
                        <Badge variant="outline">{selectedConversation.channel_name}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <Badge className={getStatusColor(selectedConversation.status)}>
                          {selectedConversation.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Priority:</span>
                        <Badge className={getPriorityColor(selectedConversation.priority)}>
                          {selectedConversation.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Assigned Agent:</span>
                        <span className="font-medium">
                          {selectedConversation.assigned_agent_name || 'Unassigned'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Performance Metrics</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Message Count:</span>
                        <span className="font-medium">{selectedConversation.message_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Response Time:</span>
                        <span className="font-medium">{selectedConversation.response_time}s</span>
                      </div>
                      {selectedConversation.resolution_time && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Resolution Time:</span>
                          <span className="font-medium">{selectedConversation.resolution_time}s</span>
                        </div>
                      )}
                      {selectedConversation.satisfaction_score && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Satisfaction Score:</span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < selectedConversation.satisfaction_score! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Tags</Label>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedConversation.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Last Message</Label>
                    <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-700">{selectedConversation.last_message}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Timestamps</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Created:</span>
                        <span className="text-sm">{new Date(selectedConversation.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Last Activity:</span>
                        <span className="text-sm">{new Date(selectedConversation.last_message_at).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Updated:</span>
                        <span className="text-sm">{new Date(selectedConversation.updated_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Conversation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Conversation
            </DialogTitle>
          </DialogHeader>
          {selectedConversation && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue={selectedConversation.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="waiting">Waiting</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select defaultValue={selectedConversation.priority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Assigned Agent</Label>
                  <Select defaultValue={selectedConversation.assigned_agent_id || 'unassigned'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="agent_001">Sarah Johnson</SelectItem>
                      <SelectItem value="agent_002">Mike Davis</SelectItem>
                      <SelectItem value="agent_003">Lisa Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Customer Type</Label>
                  <Select defaultValue={selectedConversation.customer_type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="returning">Returning</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input 
                  placeholder="Enter tags separated by commas"
                  defaultValue={selectedConversation.tags.join(', ')}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea placeholder="Add notes about this conversation..." />
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Success",
                    description: "Conversation updated successfully",
                  });
                  setIsEditDialogOpen(false);
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* More Options Dialog */}
      <Dialog open={isMoreOptionsOpen} onOpenChange={setIsMoreOptionsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MoreHorizontal className="w-5 h-5" />
              Quick Actions
            </DialogTitle>
            <DialogDescription>
              Choose a quick action for this conversation
            </DialogDescription>
          </DialogHeader>
          {selectedConversation && (
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleQuickAction('assign', selectedConversation)}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Assign to Agent
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleQuickAction('close', selectedConversation)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Close Conversation
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleQuickAction('escalate', selectedConversation)}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Escalate
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleQuickAction('flag', selectedConversation)}
              >
                <Flag className="w-4 h-4 mr-2" />
                Flag Conversation
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleQuickAction('archive', selectedConversation)}
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={() => handleQuickAction('delete', selectedConversation)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 