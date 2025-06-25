import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Clock, 
  Filter,
  Target,
  Zap
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChatRule } from './types';
import { supabase } from '@/integrations/supabase/client';

export const ChatRules = () => {
  const [rules, setRules] = useState<ChatRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRule, setSelectedRule] = useState<ChatRule | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch rules from Supabase
  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('chat_rules').select('*');
      if (error) {
        setError('Failed to fetch rules');
        setLoading(false);
        return;
      }
      setRules(data || []);
      setLoading(false);
    };
    fetchRules();
  }, []);

  // Add Rule
  const addRule = async (rule: ChatRule) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('chat_rules').insert(rule);
    if (error) {
      setError('Failed to add rule');
      setLoading(false);
      return;
    }
    // Refetch rules
    const { data } = await supabase.from('chat_rules').select('*');
    setRules(data || []);
    setLoading(false);
  };

  // Update Rule
  const updateRule = async (rule: ChatRule) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('chat_rules').update(rule).eq('id', rule.id);
    if (error) {
      setError('Failed to update rule');
      setLoading(false);
      return;
    }
    // Refetch rules
    const { data } = await supabase.from('chat_rules').select('*');
    setRules(data || []);
    setLoading(false);
  };

  // Delete Rule
  const deleteRule = async (ruleId: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('chat_rules').delete().eq('id', ruleId);
    if (error) {
      setError('Failed to delete rule');
      setLoading(false);
      return;
    }
    // Refetch rules
    const { data } = await supabase.from('chat_rules').select('*');
    setRules(data || []);
    setLoading(false);
  };

  // Toggle Rule
  const toggleRule = async (ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId);
    if (!rule) return;
    await updateRule({ ...rule, enabled: !rule.enabled });
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Chat Rules & Automation</h2>
          <p className="text-gray-600">Configure automatic chat routing and response rules</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Chat Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label>Rule Name</Label>
                  <Input placeholder="Enter rule name" />
                </div>
                <div>
                  <Label>Description (Optional)</Label>
                  <Textarea placeholder="Describe what this rule does" />
                </div>
              </div>

              {/* Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Conditions
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Channels</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select channels" />
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
                    <Label>Customer Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New Customer</SelectItem>
                        <SelectItem value="returning">Returning Customer</SelectItem>
                        <SelectItem value="vip">VIP Customer</SelectItem>
                        <SelectItem value="all">All Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Time Range (Optional)</Label>
                    <div className="flex gap-2">
                      <Input type="time" placeholder="Start time" />
                      <Input type="time" placeholder="End time" />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Sentiment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Any sentiment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Keywords (comma separated)</Label>
                  <Input placeholder="billing, payment, refund, support" />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Actions
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Set priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Assign To</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent/team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto Assignment</SelectItem>
                        <SelectItem value="senior_agent">Senior Agent</SelectItem>
                        <SelectItem value="billing_specialist">Billing Specialist</SelectItem>
                        <SelectItem value="technical_support">Technical Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Auto Response Message</Label>
                  <Textarea placeholder="Enter automatic response message" />
                </div>

                <div>
                  <Label>Tags (comma separated)</Label>
                  <Input placeholder="urgent, billing, technical" />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="escalate" />
                  <Label htmlFor="escalate">Escalate to supervisor</Label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Create Rule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Active Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.conditions.customerType && (
                        <Badge variant="outline" className="text-xs">
                          {rule.conditions.customerType}
                        </Badge>
                      )}
                      {rule.conditions.channel?.map(channel => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                      {rule.conditions.keywords?.slice(0, 2).map(keyword => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.actions.priority && (
                        <Badge className={getPriorityColor(rule.actions.priority)}>
                          {rule.actions.priority}
                        </Badge>
                      )}
                      {rule.actions.escalate && (
                        <Badge className="bg-orange-100 text-orange-800">
                          escalate
                        </Badge>
                      )}
                      {rule.actions.assignTo && (
                        <Badge variant="outline" className="text-xs">
                          → {rule.actions.assignTo}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {rule.createdAt}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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
