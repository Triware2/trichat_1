import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Play, 
  Square, 
  Download, 
  Upload,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Archive,
  Trash2,
  UserCheck,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BulkOperation, ChatFilter } from './types';
import { supabase } from '@/integrations/supabase/client';

export const BulkChatOperations = () => {
  const [operations, setOperations] = useState<BulkOperation[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bulkFilters, setBulkFilters] = useState<ChatFilter>({
    channels: [],
    status: [],
    priority: [],
    agents: [],
    dateRange: { start: '', end: '' },
    tags: []
  });
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('chats').select('*');
      if (error) {
        setError('Failed to fetch chats');
        setLoading(false);
        return;
      }
      setChats(data || []);
      setLoading(false);
    };
    fetchChats();
  }, []);

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'assign': return <UserCheck className="w-4 h-4" />;
      case 'close': return <CheckCircle className="w-4 h-4" />;
      case 'tag': return <Tag className="w-4 h-4" />;
      case 'priority': return <AlertTriangle className="w-4 h-4" />;
      case 'archive': return <Archive className="w-4 h-4" />;
      case 'delete': return <Trash2 className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedChatIds(chats.map(chat => chat.id));
    } else {
      setSelectedChatIds([]);
    }
  };

  const handleSelectChat = (chatId: string, checked: boolean) => {
    if (checked) {
      setSelectedChatIds(prev => [...prev, chatId]);
    } else {
      setSelectedChatIds(prev => prev.filter(id => id !== chatId));
    }
  };

  const executeBulkOperation = async () => {
    if (!bulkAction || selectedChatIds.length === 0) return;
    setLoading(true);
    setError(null);
    let updateData = {};
    if (bulkAction === 'close') updateData = { status: 'closed' };
    if (bulkAction === 'assign') updateData = { assigned_agent_id: 'agent_123' };
    if (bulkAction === 'tag') updateData = { tags: ['priority', 'follow_up'] };
    const { error } = await supabase.from('chats').update(updateData).in('id', selectedChatIds);
    if (error) {
      setError('Bulk operation failed');
      setLoading(false);
      return;
    }
    const newOperation: BulkOperation = {
      id: Date.now().toString(),
      type: bulkAction as any,
      status: 'completed',
      totalChats: selectedChatIds.length,
      processedChats: selectedChatIds.length,
      createdAt: new Date().toLocaleString(),
      createdBy: 'current_user@company.com',
      parameters: updateData
    };
    setOperations(prev => [newOperation, ...prev]);
    const { data } = await supabase.from('chats').select('*');
    setChats(data || []);
    setSelectedChatIds([]);
    setBulkAction('');
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Bulk Chat Operations</h2>
          <p className="text-gray-600">Manage multiple chats simultaneously</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Chats
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import Rules
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Bulk Operations</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Upload CSV File</Label>
                  <Input type="file" accept=".csv" />
                </div>
                <div>
                  <Label>Operation Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assign">Assign to Agent</SelectItem>
                      <SelectItem value="close">Close Chats</SelectItem>
                      <SelectItem value="tag">Add/Remove Tags</SelectItem>
                      <SelectItem value="priority">Change Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Import</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Chat Filters & Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>Channel</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All channels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Agent</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent1">Agent 1</SelectItem>
                  <SelectItem value="agent2">Agent 2</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">Apply Filters</Button>
            <Button variant="ghost">Clear Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Selection Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Select Chats for Bulk Operation</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedChatIds.length} of {chats.length} selected
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedChatIds.length === chats.length && chats.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chats.map((chat) => (
                <TableRow key={chat.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedChatIds.includes(chat.id)}
                      onCheckedChange={(checked) => handleSelectChat(chat.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{chat.customer}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{chat.channel}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      chat.status === 'active' ? 'bg-green-100 text-green-800' :
                      chat.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {chat.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{chat.agent || 'Unassigned'}</TableCell>
                  <TableCell>
                    <Badge className={
                      chat.priority === 'high' ? 'bg-red-100 text-red-800' :
                      chat.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {chat.priority}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedChatIds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Select Action</Label>
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose bulk action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assign">Assign to Agent</SelectItem>
                    <SelectItem value="close">Close Chats</SelectItem>
                    <SelectItem value="tag">Add/Remove Tags</SelectItem>
                    <SelectItem value="priority">Change Priority</SelectItem>
                    <SelectItem value="archive">Archive Chats</SelectItem>
                    <SelectItem value="delete">Delete Chats</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {bulkAction === 'assign' && (
                <div>
                  <Label>Assign to Agent</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent1">Agent 1</SelectItem>
                      <SelectItem value="agent2">Agent 2</SelectItem>
                      <SelectItem value="agent3">Agent 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                This action will affect {selectedChatIds.length} selected chats
              </span>
              <Button 
                onClick={executeBulkOperation}
                disabled={!bulkAction}
              >
                <Play className="w-4 h-4 mr-2" />
                Execute Action
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Operations History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Bulk Operations History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operation</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operations.map((operation) => (
                <TableRow key={operation.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getOperationIcon(operation.type)}
                      <span className="font-medium capitalize">
                        {operation.type.replace('_', ' ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{operation.processedChats}/{operation.totalChats}</span>
                        <span>{Math.round((operation.processedChats / operation.totalChats) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(operation.processedChats / operation.totalChats) * 100} 
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(operation.status)}>
                      {operation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{operation.createdBy}</TableCell>
                  <TableCell className="text-sm">{operation.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {operation.status === 'running' && (
                        <Button variant="ghost" size="sm">
                          <Square className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
