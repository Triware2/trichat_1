import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2,
  AlertTriangle,
  Clock, 
  Users,
  MessageSquare,
  Tag,
  Bell,
  Zap,
  Target,
  Calendar,
  Hash,
  Timer,
  Star,
  Mail,
  Workflow,
  Settings,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Interface for ChatRule
interface ChatRule {
  id: string;
  name: string;
  description: string;
  channel_id: string | null;
  trigger_type: string;
  trigger_conditions: any;
  actions: any;
  priority: number;
  is_active: boolean;
  execution_order: number;
  conditions_logic: 'AND' | 'OR';
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface ChatRulesProps {
  onRuleUpdate?: () => void;
}

export const ChatRules = ({ onRuleUpdate }: ChatRulesProps) => {
  const [rules, setRules] = useState<ChatRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ChatRule | null>(null);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    channel_id: null as string | null,
    trigger_type: 'keyword' as const,
    trigger_conditions: {
      keywords: [],
      customer_type: [],
      time_conditions: {
        enabled: false,
        business_hours: true,
        timezone: 'UTC',
        specific_times: []
      },
      queue_length: {
        enabled: false,
        threshold: 5,
        operator: 'greater_than'
      },
      customer_history: {
        enabled: false,
        min_conversations: 1,
        satisfaction_threshold: 3
      },
      message_count: {
        enabled: false,
        threshold: 3,
        operator: 'greater_than'
      },
      response_time: {
        enabled: false,
        threshold: 300, // 5 minutes
        operator: 'greater_than'
      }
    },
    actions: {
      auto_response: {
        enabled: false,
        message: '',
        delay: 0
      },
      routing: {
        enabled: false,
        type: 'skill_based',
        target_agents: [],
        skill_requirements: []
      },
      escalation: {
        enabled: false,
        priority: 'medium',
        target_department: '',
        conditions: []
      },
      tagging: {
        enabled: false,
        tags: []
      },
      assignment: {
        enabled: false,
        agent_id: '',
        reason: ''
      },
      notification: {
        enabled: false,
        type: 'email',
        recipients: [],
        template: ''
      },
      workflow: {
        enabled: false,
        steps: []
      }
    },
    priority: 1,
    is_active: true,
    execution_order: 1,
    conditions_logic: 'AND' as 'AND' | 'OR'
  });
  const { toast } = useToast();

    const fetchRules = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      // Use any type to bypass TypeScript issues for now
      const { data, error: fetchError } = await (supabase as any)
        .from('chat_rules')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching rules:', fetchError);
        setError(fetchError.message);
        return;
      }

      setRules((data as ChatRule[]) || []);
    } catch (err: any) {
      console.error('Error in fetchRules:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch chat rules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
    };

  useEffect(() => {
    fetchRules();
  }, []);

  // Create Rule
  const createRule = async (rule: Omit<ChatRule, 'id' | 'created_at' | 'updated_at'>) => {
    try {
    setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Use any type to bypass TypeScript issues for now
      const { data, error: insertError } = await (supabase as any)
        .from('chat_rules')
        .insert([{
          ...rule,
          created_by: user.id
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating rule:', insertError);
        throw new Error(insertError.message);
      }

      if (data) {
        setRules(prev => [data as ChatRule, ...prev]);
        onRuleUpdate?.();
        toast({
          title: "Success",
          description: "Rule created successfully",
        });
        setIsAddDialogOpen(false);
        
        // Reset form
        setNewRule({
          name: '',
          description: '',
          channel_id: null,
          trigger_type: 'keyword' as const,
          trigger_conditions: {
            keywords: [],
            customer_type: [],
            time_conditions: {
              enabled: false,
              business_hours: true,
              timezone: 'UTC',
              specific_times: []
            },
            queue_length: {
              enabled: false,
              threshold: 5,
              operator: 'greater_than'
            },
            customer_history: {
              enabled: false,
              min_conversations: 1,
              satisfaction_threshold: 3
            },
            message_count: {
              enabled: false,
              threshold: 3,
              operator: 'greater_than'
            },
            response_time: {
              enabled: false,
              threshold: 300,
              operator: 'greater_than'
            }
          },
          actions: {
            auto_response: {
              enabled: false,
              message: '',
              delay: 0
            },
            routing: {
              enabled: false,
              type: 'skill_based',
              target_agents: [],
              skill_requirements: []
            },
            escalation: {
              enabled: false,
              priority: 'medium',
              target_department: '',
              conditions: []
            },
            tagging: {
              enabled: false,
              tags: []
            },
            assignment: {
              enabled: false,
              agent_id: '',
              reason: ''
            },
            notification: {
              enabled: false,
              type: 'email',
              recipients: [],
              template: ''
            },
            workflow: {
              enabled: false,
              steps: []
            }
          },
          priority: 1,
          is_active: true,
          execution_order: 1,
          conditions_logic: 'AND' as const
        });
      }
    } catch (err: any) {
      console.error('Error in createRule:', err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
    setLoading(false);
    }
  };

  // Edit Rule
  const editRule = async (rule: ChatRule) => {
    try {
    setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Use any type to bypass TypeScript issues for now
      const { data, error: updateError } = await (supabase as any)
        .from('chat_rules')
        .update({
          name: rule.name,
          description: rule.description,
          channel_id: rule.channel_id,
          trigger_type: rule.trigger_type,
          trigger_conditions: rule.trigger_conditions,
          actions: rule.actions,
          priority: rule.priority,
          is_active: rule.is_active,
          execution_order: rule.execution_order,
          conditions_logic: rule.conditions_logic
        })
        .eq('id', rule.id)
        .eq('created_by', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating rule:', updateError);
        throw new Error(updateError.message);
      }

      if (data) {
        setRules(prev => prev.map(r => r.id === rule.id ? data as ChatRule : r));
        onRuleUpdate?.();
        toast({
          title: "Success",
          description: "Rule updated successfully",
        });
        setIsAddDialogOpen(false);
        setEditingRule(null);
      }
    } catch (err: any) {
      console.error('Error in editRule:', err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
    setLoading(false);
    }
  };

  // Delete Rule
  const deleteRule = async (ruleId: string) => {
    try {
    setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Use any type to bypass TypeScript issues for now
      const { error: deleteError } = await (supabase as any)
        .from('chat_rules')
        .delete()
        .eq('id', ruleId)
        .eq('created_by', user.id);

      if (deleteError) {
        console.error('Error deleting rule:', deleteError);
        throw new Error(deleteError.message);
      }

      setRules(prev => prev.filter(r => r.id !== ruleId));
      onRuleUpdate?.();
      toast({
        title: "Success",
        description: "Rule deleted successfully",
      });
    } catch (err: any) {
      console.error('Error in deleteRule:', err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle Rule Status
  const toggleRuleStatus = async (ruleId: string, isActive: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Use any type to bypass TypeScript issues for now
      const { data, error: updateError } = await (supabase as any)
        .from('chat_rules')
        .update({ is_active: isActive })
        .eq('id', ruleId)
        .eq('created_by', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error toggling rule status:', updateError);
        throw new Error(updateError.message);
      }

      if (data) {
        setRules(prev => prev.map(r => r.id === ruleId ? data as ChatRule : r));
        onRuleUpdate?.();
        toast({
          title: "Success",
          description: `Rule ${isActive ? 'activated' : 'deactivated'} successfully`,
        });
      }
    } catch (err: any) {
      console.error('Error in toggleRuleStatus:', err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  // Handle Edit Rule
  const handleEditRule = (rule: ChatRule) => {
    console.log('Edit button clicked for rule:', rule);
    setEditingRule(rule);
    setNewRule({
      name: rule.name,
      description: rule.description,
      channel_id: rule.channel_id,
      trigger_type: rule.trigger_type as any,
      trigger_conditions: rule.trigger_conditions,
      actions: rule.actions,
      priority: rule.priority,
      is_active: rule.is_active,
      execution_order: rule.execution_order,
      conditions_logic: rule.conditions_logic
    });
    setIsAddDialogOpen(true); // Use the same dialog for both create and edit
    console.log('Dialog should now be open');
  };

  // Handle Delete Rule
  const handleDeleteRule = async (ruleId: string) => {
    if (confirm('Are you sure you want to delete this rule? This action cannot be undone.')) {
      await deleteRule(ruleId);
    }
  };

  // Handle form submission
  const handleCreateRule = async () => {
    if (!newRule.name.trim()) {
      toast({
        title: "Error",
        description: "Rule name is required",
        variant: "destructive"
      });
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive"
      });
      return;
    }
    
    if (editingRule) {
      // Update existing rule
      await editRule({
        ...editingRule,
        ...newRule,
        channel_id: null, // Make it a global rule
        created_by: user.id
      });
    } else {
      // Create new rule
      await createRule({
        ...newRule,
        channel_id: null, // Make it a global rule
        created_by: user.id
      });
    }
  };

  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'keyword': return <AlertTriangle className="w-4 h-4" />;
      case 'time': return <Clock className="w-4 h-4" />;
      case 'customer_type': return <Users className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-orange-100 text-orange-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-slate-600">Loading chat rules...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchRules} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Rule Button */}
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {editingRule ? 'Edit Chat Rule' : 'Create Advanced Chat Rule'}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="triggers" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Triggers
                </TabsTrigger>
                <TabsTrigger value="actions" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Actions
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-2">
                  <Workflow className="w-4 h-4" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rule Name *</Label>
                    <Input 
                      placeholder="e.g., VIP Customer Escalation" 
                      value={newRule.name}
                      onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    />
                </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select 
                      value={newRule.priority.toString()} 
                      onValueChange={(value) => setNewRule(prev => ({ ...prev, priority: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">🔴 High Priority</SelectItem>
                        <SelectItem value="2">🟡 Medium Priority</SelectItem>
                        <SelectItem value="3">🟢 Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
              </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Describe what this rule does and when it should trigger..." 
                    value={newRule.description}
                    onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={newRule.is_active ? 'active' : 'inactive'} 
                      onValueChange={(value) => setNewRule(prev => ({ ...prev, is_active: value === 'active' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">✅ Active</SelectItem>
                        <SelectItem value="inactive">⏸️ Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Execution Order</Label>
                    <Input 
                      type="number"
                      placeholder="1"
                      value={newRule.execution_order}
                      onChange={(e) => setNewRule(prev => ({ ...prev, execution_order: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Triggers Tab */}
              <TabsContent value="triggers" className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  
                  {/* Keyword Triggers */}
                  <AccordionItem value="keywords">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Keyword Detection
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Keywords (one per line)</Label>
                        <Textarea 
                          placeholder="urgent&#10;emergency&#10;help&#10;broken&#10;issue"
                          value={newRule.trigger_conditions.keywords.join('\n')}
                          onChange={(e) => setNewRule(prev => ({
                            ...prev,
                            trigger_conditions: {
                              ...prev.trigger_conditions,
                              keywords: e.target.value.split('\n').filter(k => k.trim())
                            }
                          }))}
                          rows={4}
                        />
                        <p className="text-xs text-gray-500">Enter keywords that will trigger this rule. One keyword per line.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Customer Type */}
                  <AccordionItem value="customer-type">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Customer Segmentation
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Customer Types</Label>
                        <div className="space-y-2">
                          {['VIP', 'Premium', 'Enterprise', 'Free', 'Trial'].map(type => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox 
                                id={type}
                                checked={newRule.trigger_conditions.customer_type.includes(type)}
                                onCheckedChange={(checked) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    trigger_conditions: {
                                      ...prev.trigger_conditions,
                                      customer_type: checked 
                                        ? [...prev.trigger_conditions.customer_type, type]
                                        : prev.trigger_conditions.customer_type.filter(t => t !== type)
                                    }
                                  }));
                                }}
                              />
                              <Label htmlFor={type}>{type}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Time Conditions */}
                  <AccordionItem value="time">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Time-Based Triggers
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="time-enabled"
                            checked={newRule.trigger_conditions.time_conditions.enabled}
                            onCheckedChange={(checked) => {
                              setNewRule(prev => ({
                                ...prev,
                                trigger_conditions: {
                                  ...prev.trigger_conditions,
                                  time_conditions: {
                                    ...prev.trigger_conditions.time_conditions,
                                    enabled: checked === true
                                  }
                                }
                              }));
                            }}
                          />
                          <Label htmlFor="time-enabled">Enable time-based triggers</Label>
                        </div>
                        
                        {newRule.trigger_conditions.time_conditions.enabled && (
                          <div className="space-y-4 pl-6">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="business-hours"
                                checked={newRule.trigger_conditions.time_conditions.business_hours}
                                onCheckedChange={(checked) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    trigger_conditions: {
                                      ...prev.trigger_conditions,
                                      time_conditions: {
                                        ...prev.trigger_conditions.time_conditions,
                                        business_hours: checked === true
                                      }
                                    }
                                  }));
                                }}
                              />
                              <Label htmlFor="business-hours">Only during business hours</Label>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Timezone</Label>
                              <Select 
                                value={newRule.trigger_conditions.time_conditions.timezone}
                                onValueChange={(value) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    trigger_conditions: {
                                      ...prev.trigger_conditions,
                                      time_conditions: {
                                        ...prev.trigger_conditions.time_conditions,
                                        timezone: value
                                      }
                                    }
                                  }));
                                }}
                              >
                      <SelectTrigger>
                                  <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                                  <SelectItem value="UTC">UTC</SelectItem>
                                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Queue Length */}
                  <AccordionItem value="queue">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Queue Length Monitoring
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="queue-enabled"
                            checked={newRule.trigger_conditions.queue_length.enabled}
                            onCheckedChange={(checked) => {
                              setNewRule(prev => ({
                                ...prev,
                                trigger_conditions: {
                                  ...prev.trigger_conditions,
                                  queue_length: {
                                    ...prev.trigger_conditions.queue_length,
                                    enabled: checked === true
                                  }
                                }
                              }));
                            }}
                          />
                          <Label htmlFor="queue-enabled">Enable queue length monitoring</Label>
                  </div>
                  
                        {newRule.trigger_conditions.queue_length.enabled && (
                          <div className="grid grid-cols-2 gap-4 pl-6">
                            <div className="space-y-2">
                              <Label>Threshold</Label>
                              <Input 
                                type="number"
                                value={newRule.trigger_conditions.queue_length.threshold}
                                onChange={(e) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    trigger_conditions: {
                                      ...prev.trigger_conditions,
                                      queue_length: {
                                        ...prev.trigger_conditions.queue_length,
                                        threshold: parseInt(e.target.value) || 5
                                      }
                                    }
                                  }));
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Operator</Label>
                              <Select 
                                value={newRule.trigger_conditions.queue_length.operator}
                                onValueChange={(value) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    trigger_conditions: {
                                      ...prev.trigger_conditions,
                                      queue_length: {
                                        ...prev.trigger_conditions.queue_length,
                                        operator: value
                                      }
                                    }
                                  }));
                                }}
                              >
                      <SelectTrigger>
                                  <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                                  <SelectItem value="greater_than">Greater than</SelectItem>
                                  <SelectItem value="less_than">Less than</SelectItem>
                                  <SelectItem value="equals">Equals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Customer History */}
                  <AccordionItem value="history">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Customer History
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="history-enabled"
                            checked={newRule.trigger_conditions.customer_history.enabled}
                            onCheckedChange={(checked) => {
                              setNewRule(prev => ({
                                ...prev,
                                trigger_conditions: {
                                  ...prev.trigger_conditions,
                                  customer_history: {
                                    ...prev.trigger_conditions.customer_history,
                                    enabled: checked === true
                                  }
                                }
                              }));
                            }}
                          />
                          <Label htmlFor="history-enabled">Enable customer history checks</Label>
                </div>
                        
                        {newRule.trigger_conditions.customer_history.enabled && (
                          <div className="grid grid-cols-2 gap-4 pl-6">
                            <div className="space-y-2">
                              <Label>Min Conversations</Label>
                              <Input 
                                type="number"
                                value={newRule.trigger_conditions.customer_history.min_conversations}
                                onChange={(e) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    trigger_conditions: {
                                      ...prev.trigger_conditions,
                                      customer_history: {
                                        ...prev.trigger_conditions.customer_history,
                                        min_conversations: parseInt(e.target.value) || 1
                                      }
                                    }
                                  }));
                                }}
                              />
              </div>
                            <div className="space-y-2">
                              <Label>Satisfaction Threshold</Label>
                              <Input 
                                type="number"
                                min="1"
                                max="5"
                                value={newRule.trigger_conditions.customer_history.satisfaction_threshold}
                                onChange={(e) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    trigger_conditions: {
                                      ...prev.trigger_conditions,
                                      customer_history: {
                                        ...prev.trigger_conditions.customer_history,
                                        satisfaction_threshold: parseInt(e.target.value) || 3
                                      }
                                    }
                                  }));
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* Actions Tab */}
              <TabsContent value="actions" className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  
                  {/* Auto Response */}
                  <AccordionItem value="auto-response">
                    <AccordionTrigger className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Auto Response
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
              <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="auto-response-enabled"
                            checked={newRule.actions.auto_response.enabled}
                            onCheckedChange={(checked) => {
                              setNewRule(prev => ({
                                ...prev,
                                actions: {
                                  ...prev.actions,
                                  auto_response: {
                                    ...prev.actions.auto_response,
                                    enabled: checked === true
                                  }
                                }
                              }));
                            }}
                          />
                          <Label htmlFor="auto-response-enabled">Send automatic response</Label>
                        </div>
                        
                        {newRule.actions.auto_response.enabled && (
                          <div className="space-y-4 pl-6">
                            <div className="space-y-2">
                              <Label>Response Message</Label>
                              <Textarea 
                                placeholder="Thank you for contacting us. We'll get back to you shortly..."
                                value={newRule.actions.auto_response.message}
                                onChange={(e) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    actions: {
                                      ...prev.actions,
                                      auto_response: {
                                        ...prev.actions.auto_response,
                                        message: e.target.value
                                      }
                                    }
                                  }));
                                }}
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Delay (seconds)</Label>
                              <Input 
                                type="number"
                                value={newRule.actions.auto_response.delay}
                                onChange={(e) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    actions: {
                                      ...prev.actions,
                                      auto_response: {
                                        ...prev.actions.auto_response,
                                        delay: parseInt(e.target.value) || 0
                                      }
                                    }
                                  }));
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Routing */}
                  <AccordionItem value="routing">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Smart Routing
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="routing-enabled"
                            checked={newRule.actions.routing.enabled}
                            onCheckedChange={(checked) => {
                              setNewRule(prev => ({
                                ...prev,
                                actions: {
                                  ...prev.actions,
                                  routing: {
                                    ...prev.actions.routing,
                                    enabled: checked === true
                                  }
                                }
                              }));
                            }}
                          />
                          <Label htmlFor="routing-enabled">Enable smart routing</Label>
                        </div>
                        
                        {newRule.actions.routing.enabled && (
                          <div className="space-y-4 pl-6">
                            <div className="space-y-2">
                              <Label>Routing Type</Label>
                              <Select 
                                value={newRule.actions.routing.type}
                                onValueChange={(value) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    actions: {
                                      ...prev.actions,
                                      routing: {
                                        ...prev.actions.routing,
                                        type: value
                                      }
                                    }
                                  }));
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="skill_based">Skill-based</SelectItem>
                                  <SelectItem value="round_robin">Round Robin</SelectItem>
                                  <SelectItem value="least_busy">Least Busy</SelectItem>
                                  <SelectItem value="priority">Priority-based</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Required Skills</Label>
                              <div className="space-y-2">
                                {['Technical', 'Billing', 'Sales', 'Support', 'Escalation'].map(skill => (
                                  <div key={skill} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={skill}
                                      checked={newRule.actions.routing.skill_requirements.includes(skill)}
                                      onCheckedChange={(checked) => {
                                        setNewRule(prev => ({
                                          ...prev,
                                          actions: {
                                            ...prev.actions,
                                            routing: {
                                              ...prev.actions.routing,
                                              skill_requirements: checked 
                                                ? [...prev.actions.routing.skill_requirements, skill]
                                                : prev.actions.routing.skill_requirements.filter(s => s !== skill)
                                            }
                                          }
                                        }));
                                      }}
                                    />
                                    <Label htmlFor={skill}>{skill}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Escalation */}
                  <AccordionItem value="escalation">
                    <AccordionTrigger className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Escalation
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="escalation-enabled"
                            checked={newRule.actions.escalation.enabled}
                            onCheckedChange={(checked) => {
                              setNewRule(prev => ({
                                ...prev,
                                actions: {
                                  ...prev.actions,
                                  escalation: {
                                    ...prev.actions.escalation,
                                    enabled: checked === true
                                  }
                                }
                              }));
                            }}
                          />
                          <Label htmlFor="escalation-enabled">Enable escalation</Label>
                        </div>
                        
                        {newRule.actions.escalation.enabled && (
                          <div className="grid grid-cols-2 gap-4 pl-6">
                            <div className="space-y-2">
                    <Label>Priority</Label>
                              <Select 
                                value={newRule.actions.escalation.priority}
                                onValueChange={(value) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    actions: {
                                      ...prev.actions,
                                      escalation: {
                                        ...prev.actions.escalation,
                                        priority: value
                                      }
                                    }
                                  }));
                                }}
                              >
                      <SelectTrigger>
                                  <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                            <div className="space-y-2">
                              <Label>Target Department</Label>
                              <Select 
                                value={newRule.actions.escalation.target_department}
                                onValueChange={(value) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    actions: {
                                      ...prev.actions,
                                      escalation: {
                                        ...prev.actions.escalation,
                                        target_department: value
                                      }
                                    }
                                  }));
                                }}
                              >
                      <SelectTrigger>
                                  <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                                  <SelectItem value="supervisor">Supervisor</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                  <SelectItem value="specialist">Specialist</SelectItem>
                                  <SelectItem value="technical">Technical Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Tagging */}
                  <AccordionItem value="tagging">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Auto Tagging
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="tagging-enabled"
                            checked={newRule.actions.tagging.enabled}
                            onCheckedChange={(checked) => {
                              setNewRule(prev => ({
                                ...prev,
                                actions: {
                                  ...prev.actions,
                                  tagging: {
                                    ...prev.actions.tagging,
                                    enabled: checked === true
                                  }
                                }
                              }));
                            }}
                          />
                          <Label htmlFor="tagging-enabled">Auto-tag conversations</Label>
                </div>

                        {newRule.actions.tagging.enabled && (
                          <div className="space-y-4 pl-6">
                            <div className="space-y-2">
                  <Label>Tags (comma separated)</Label>
                              <Input 
                                placeholder="urgent, escalation, vip, technical"
                                value={newRule.actions.tagging.tags.join(', ')}
                                onChange={(e) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    actions: {
                                      ...prev.actions,
                                      tagging: {
                                        ...prev.actions.tagging,
                                        tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                                      }
                                    }
                                  }));
                                }}
                              />
                </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Notifications */}
                  <AccordionItem value="notifications">
                    <AccordionTrigger className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Notifications
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-4">
                <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="notification-enabled"
                            checked={newRule.actions.notification.enabled}
                            onCheckedChange={(checked) => {
                              setNewRule(prev => ({
                                ...prev,
                                actions: {
                                  ...prev.actions,
                                  notification: {
                                    ...prev.actions.notification,
                                    enabled: checked === true
                                  }
                                }
                              }));
                            }}
                          />
                          <Label htmlFor="notification-enabled">Send notifications</Label>
                </div>
                        
                        {newRule.actions.notification.enabled && (
                          <div className="space-y-4 pl-6">
                            <div className="space-y-2">
                              <Label>Notification Type</Label>
                              <Select 
                                value={newRule.actions.notification.type}
                                onValueChange={(value) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    actions: {
                                      ...prev.actions,
                                      notification: {
                                        ...prev.actions.notification,
                                        type: value
                                      }
                                    }
                                  }));
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="slack">Slack</SelectItem>
                                  <SelectItem value="sms">SMS</SelectItem>
                                  <SelectItem value="in_app">In-App</SelectItem>
                                </SelectContent>
                              </Select>
              </div>
                            
                            <div className="space-y-2">
                              <Label>Recipients (comma separated emails)</Label>
                              <Input 
                                placeholder="manager@company.com, supervisor@company.com"
                                value={newRule.actions.notification.recipients.join(', ')}
                                onChange={(e) => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    actions: {
                                      ...prev.actions,
                                      notification: {
                                        ...prev.actions.notification,
                                        recipients: e.target.value.split(',').map(r => r.trim()).filter(r => r)
                                      }
                                    }
                                  }));
                                }}
                              />
            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Conditions Logic</Label>
                    <Select 
                      value={newRule.conditions_logic}
                      onValueChange={(value) => {
                        setNewRule(prev => ({
                          ...prev,
                          conditions_logic: value as 'AND' | 'OR'
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">All conditions must be met (AND)</SelectItem>
                        <SelectItem value="OR">Any condition can be met (OR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Rule Preview</Label>
                    <div className="p-4 bg-gray-50 rounded-lg text-sm">
                      <p><strong>When:</strong> {newRule.trigger_conditions.keywords.length > 0 && `Keywords: ${newRule.trigger_conditions.keywords.join(', ')}`}</p>
                      <p><strong>Then:</strong> {newRule.actions.auto_response.enabled && 'Send auto-response'}</p>
                      <p><strong>Priority:</strong> {newRule.priority === 1 ? 'High' : newRule.priority === 2 ? 'Medium' : 'Low'}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setEditingRule(null);
                  // Reset form
                  setNewRule({
                    name: '',
                    description: '',
                    channel_id: null,
                    trigger_type: 'keyword' as const,
                    trigger_conditions: {
                      keywords: [],
                      customer_type: [],
                      time_conditions: {
                        enabled: false,
                        business_hours: true,
                        timezone: 'UTC',
                        specific_times: []
                      },
                      queue_length: {
                        enabled: false,
                        threshold: 5,
                        operator: 'greater_than'
                      },
                      customer_history: {
                        enabled: false,
                        min_conversations: 1,
                        satisfaction_threshold: 3
                      },
                      message_count: {
                        enabled: false,
                        threshold: 3,
                        operator: 'greater_than'
                      },
                      response_time: {
                        enabled: false,
                        threshold: 300,
                        operator: 'greater_than'
                      }
                    },
                    actions: {
                      auto_response: {
                        enabled: false,
                        message: '',
                        delay: 0
                      },
                      routing: {
                        enabled: false,
                        type: 'skill_based',
                        target_agents: [],
                        skill_requirements: []
                      },
                      escalation: {
                        enabled: false,
                        priority: 'medium',
                        target_department: '',
                        conditions: []
                      },
                      tagging: {
                        enabled: false,
                        tags: []
                      },
                      assignment: {
                        enabled: false,
                        agent_id: '',
                        reason: ''
                      },
                      notification: {
                        enabled: false,
                        type: 'email',
                        recipients: [],
                        template: ''
                      },
                      workflow: {
                        enabled: false,
                        steps: []
                      }
                    },
                    priority: 1,
                    is_active: true,
                    execution_order: 1,
                    conditions_logic: 'AND' as 'AND' | 'OR'
                  });
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateRule}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editingRule ? 'Update Rule' : 'Create Advanced Rule'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rules.map((rule) => (
          <Card key={rule.id} className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    {getTriggerIcon(rule.trigger_type)}
                    </div>
                  <div>
                    <CardTitle className="text-base">{rule.name}</CardTitle>
                    <Badge className={getPriorityColor(rule.priority)}>
                      Priority {rule.priority}
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                    onClick={() => {
                      console.log('Edit button clicked');
                      handleEditRule(rule);
                    }}
                      >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteRule(rule.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">{rule.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Trigger: {rule.trigger_type}</span>
                  <Switch checked={rule.is_active} onCheckedChange={(checked) => toggleRuleStatus(rule.id, checked)} />
                </div>
              </div>
        </CardContent>
      </Card>
        ))}
      </div>

      {rules.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Rules Configured</h3>
          <p className="text-slate-600 mb-4">Create your first chat rule to automate customer interactions</p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Rule
          </Button>
        </div>
      )}
    </div>
  );
};
