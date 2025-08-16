
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { customizationService } from '@/services/customizationService';
import { 
  Workflow, 
  Plus, 
  Play, 
  Pause,
  Edit,
  Trash2,
  Zap,
  Mail,
  UserPlus,
  Bell,
  ArrowRight,
  Move
} from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  status: 'active' | 'inactive';
  executions: number;
}

function SortableActionItem({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition } as any;
  return (
    <div ref={setNodeRef} style={style} className="p-2 border rounded flex items-center justify-between bg-white" {...attributes} {...listeners}>
      <span className="text-sm">{label}</span>
      <Move className="w-4 h-4 text-gray-400" />
    </div>
  );
}

export const WorkflowBuilder = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowRule | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const sensors = useSensors(useSensor(PointerSensor));

  // Workflow creation state
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger: '',
    triggerObject: '',
    triggerField: '',
    actions: [] as any[]
  });
  const [availableObjects, setAvailableObjects] = useState<any[]>([]);
  const [configuringAction, setConfiguringAction] = useState<any>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        console.log('Loading workflows...');
        
        // Initialize database tables if they don't exist
        await customizationService.initializeDatabase();
        
        const [list, count, objects] = await Promise.all([
          customizationService.listWorkflows({ from: (page-1)*pageSize, to: (page*pageSize)-1, search }),
          customizationService.countWorkflows(search),
          customizationService.listObjects()
        ]);
        
        console.log('Workflows loaded:', list);
        console.log('Workflow count:', count);
        console.log('Objects loaded:', objects);
        
        const mapped: WorkflowRule[] = (list || []).map((w: any) => ({
          id: w.id,
          name: w.name,
          description: w.description,
          trigger: w.trigger,
          actions: w.actions || [],
          status: w.status || 'active',
          executions: w.executions || 0
        }));
        
        console.log('Mapped workflows:', mapped);
        
        setWorkflows(mapped);
        setTotal(count || 0);
        setAvailableObjects(objects || []);
      } catch (error) {
        console.error('Error loading workflows:', error);
        toast({
          title: "Error Loading Workflows",
          description: "Failed to load workflows. Please check your database connection.",
          variant: "destructive"
        });
      }
    };
    load();
  }, [page, search]);

  const triggerTypes = [
    { value: 'ticket_created', label: 'Ticket Created', icon: Plus },
    { value: 'ticket_resolved', label: 'Ticket Resolved', icon: Zap },
    { value: 'customer_registered', label: 'Customer Registered', icon: UserPlus },
    { value: 'time_based', label: 'Time-based', icon: Bell },
    { value: 'object_created', label: 'Object Record Created', icon: Plus },
    { value: 'object_updated', label: 'Object Record Updated', icon: Edit },
    { value: 'object_deleted', label: 'Object Record Deleted', icon: Trash2 },
    { value: 'relationship_created', label: 'Relationship Created', icon: ArrowRight },
    { value: 'field_value_changed', label: 'Field Value Changed', icon: Zap },
    { value: 'chat_started', label: 'Chat Started', icon: Plus },
    { value: 'chat_resolved', label: 'Chat Resolved', icon: Zap },
    { value: 'chat_escalated', label: 'Chat Escalated', icon: ArrowRight }
  ];

  const actionTypes = [
    { value: 'assign_agent', label: 'Assign to Agent', icon: UserPlus },
    { value: 'send_email', label: 'Send Email', icon: Mail },
    { value: 'send_notification', label: 'Send Notification', icon: Bell },
    { value: 'escalate', label: 'Escalate', icon: ArrowRight },
    { value: 'create_object_record', label: 'Create Object Record', icon: Plus },
    { value: 'update_object_record', label: 'Update Object Record', icon: Edit },
    { value: 'create_relationship', label: 'Create Relationship', icon: ArrowRight },
    { value: 'update_field_value', label: 'Update Field Value', icon: Edit },
    { value: 'send_sms', label: 'Send SMS', icon: Bell },
    { value: 'create_task', label: 'Create Task', icon: Plus },
    { value: 'schedule_followup', label: 'Schedule Follow-up', icon: Bell },
    { value: 'update_status', label: 'Update Status', icon: Edit }
  ];

  const handleToggleWorkflow = async (workflowId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setWorkflows(prev => prev.map(w => w.id === workflowId ? { ...w, status: newStatus as any } : w));
    await customizationService.toggleWorkflow(workflowId, newStatus as any);
    toast({
      title: `Workflow ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
      description: `The workflow has been ${newStatus === 'active' ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleDeleteWorkflow = async (workflowId: string, workflowName: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflowId));
    await customizationService.deleteWorkflow(workflowId);
    toast({ title: 'Workflow Deleted', description: `${workflowName} has been removed.` });
  };

  const openActionConfig = (action: any, index: number) => {
    setConfiguringAction({ ...action, index });
    setIsConfigOpen(true);
  };

  const saveActionConfig = (config: any) => {
    const updatedActions = [...newWorkflow.actions];
    updatedActions[configuringAction.index] = {
      ...updatedActions[configuringAction.index],
      config
    };
    setNewWorkflow({ ...newWorkflow, actions: updatedActions });
    setIsConfigOpen(false);
    setConfiguringAction(null);
  };

  const getActionConfigComponent = (actionType: string) => {
    switch (actionType) {
      case 'create_object_record':
        return (
          <div className="space-y-4">
            <div>
              <Label>Target Object</Label>
              <Select onValueChange={(value) => saveActionConfig({ target_object: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select object to create record in" />
                </SelectTrigger>
                <SelectContent>
                  {availableObjects.map((obj) => (
                    <SelectItem key={obj.id} value={obj.id}>
                      {obj.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Field Mapping</Label>
              <div className="text-sm text-gray-600 mb-2">
                Map fields from trigger object to target object
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input placeholder="Source field (e.g., name)" className="flex-1" />
                  <span className="text-gray-400">→</span>
                  <Input placeholder="Target field (e.g., customer_name)" className="flex-1" />
                </div>
                <Button size="sm" variant="outline">+ Add Field Mapping</Button>
              </div>
            </div>
          </div>
        );

      case 'send_email':
        return (
          <div className="space-y-4">
            <div>
              <Label>Email Template</Label>
              <Select onValueChange={(value) => saveActionConfig({ template: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select email template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome Email</SelectItem>
                  <SelectItem value="notification">Notification Email</SelectItem>
                  <SelectItem value="followup">Follow-up Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Recipient</Label>
              <Select onValueChange={(value) => saveActionConfig({ recipient: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="agent">Assigned Agent</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="custom">Custom Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {configuringAction?.config?.recipient === 'custom' && (
              <div>
                <Label>Custom Email Address</Label>
                <Input 
                  placeholder="Enter email address"
                  onChange={(e) => saveActionConfig({ custom_email: e.target.value })}
                />
              </div>
            )}
          </div>
        );

      case 'assign_agent':
        return (
          <div className="space-y-4">
            <div>
              <Label>Assignment Method</Label>
              <Select onValueChange={(value) => saveActionConfig({ method: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round_robin">Round Robin</SelectItem>
                  <SelectItem value="least_busy">Least Busy</SelectItem>
                  <SelectItem value="specific">Specific Agent</SelectItem>
                  <SelectItem value="skill_based">Skill Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {configuringAction?.config?.method === 'specific' && (
              <div>
                <Label>Agent</Label>
                <Select onValueChange={(value) => saveActionConfig({ agent_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agent1">John Smith</SelectItem>
                    <SelectItem value="agent2">Sarah Johnson</SelectItem>
                    <SelectItem value="agent3">Mike Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      case 'send_notification':
        return (
          <div className="space-y-4">
            <div>
              <Label>Notification Type</Label>
              <Select onValueChange={(value) => saveActionConfig({ type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_app">In-App Notification</SelectItem>
                  <SelectItem value="email">Email Notification</SelectItem>
                  <SelectItem value="sms">SMS Notification</SelectItem>
                  <SelectItem value="slack">Slack Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Message</Label>
              <Input 
                placeholder="Enter notification message"
                onChange={(e) => saveActionConfig({ message: e.target.value })}
              />
            </div>
            <div>
              <Label>Recipients</Label>
              <Select onValueChange={(value) => saveActionConfig({ recipients: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assigned_agent">Assigned Agent</SelectItem>
                  <SelectItem value="all_agents">All Agents</SelectItem>
                  <SelectItem value="managers">Managers Only</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'update_object_record':
        return (
          <div className="space-y-4">
            <div>
              <Label>Target Object</Label>
              <Select onValueChange={(value) => saveActionConfig({ target_object: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select object to update" />
                </SelectTrigger>
                <SelectContent>
                  {availableObjects.map((obj) => (
                    <SelectItem key={obj.id} value={obj.id}>
                      {obj.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Update Fields</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input placeholder="Field name" className="flex-1" />
                  <Input placeholder="New value" className="flex-1" />
                </div>
                <Button size="sm" variant="outline">+ Add Field Update</Button>
              </div>
            </div>
          </div>
        );

      case 'create_task':
        return (
          <div className="space-y-4">
            <div>
              <Label>Task Type</Label>
              <Select onValueChange={(value) => saveActionConfig({ task_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="follow_up">Follow-up Call</SelectItem>
                  <SelectItem value="review">Review Case</SelectItem>
                  <SelectItem value="escalation">Escalation</SelectItem>
                  <SelectItem value="custom">Custom Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Task Description</Label>
              <Input 
                placeholder="Enter task description"
                onChange={(e) => saveActionConfig({ description: e.target.value })}
              />
            </div>
            <div>
              <Label>Due Date</Label>
              <Select onValueChange={(value) => saveActionConfig({ due_date: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1_hour">1 Hour</SelectItem>
                  <SelectItem value="24_hours">24 Hours</SelectItem>
                  <SelectItem value="3_days">3 Days</SelectItem>
                  <SelectItem value="1_week">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4">
            <p className="text-gray-600">No configuration needed for this action type.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Workflow Automation</h2>
          <p className="text-gray-600">Create automated business processes and rules</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
              <DialogDescription>
                Set up automated rules to streamline your business processes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="workflow-name">Workflow Name</Label>
                  <Input 
                    id="workflow-name" 
                    placeholder="Enter workflow name"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="workflow-description">Description</Label>
                  <Input 
                    id="workflow-description" 
                    placeholder="Describe what this workflow does"
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Trigger</Label>
                <Select value={newWorkflow.trigger} onValueChange={(value) => setNewWorkflow({...newWorkflow, trigger: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map((trigger) => (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        <div className="flex items-center gap-2">
                          <trigger.icon className="w-4 h-4" />
                          {trigger.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Object-specific trigger configuration */}
              {(newWorkflow.trigger === 'object_created' || newWorkflow.trigger === 'object_updated' || newWorkflow.trigger === 'object_deleted' || newWorkflow.trigger === 'field_value_changed') && (
                <div className="space-y-3">
                  <Label>Target Object</Label>
                  <Select value={newWorkflow.triggerObject} onValueChange={(value) => setNewWorkflow({...newWorkflow, triggerObject: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select object" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableObjects.map((obj) => (
                        <SelectItem key={obj.id} value={obj.id}>
                          {obj.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Field-specific trigger configuration */}
              {newWorkflow.trigger === 'field_value_changed' && newWorkflow.triggerObject && (
                <div className="space-y-3">
                  <Label>Target Field</Label>
                  <Select value={newWorkflow.triggerField} onValueChange={(value) => setNewWorkflow({...newWorkflow, triggerField: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Field</SelectItem>
                      <SelectItem value="status">Status Field</SelectItem>
                      <SelectItem value="priority">Priority Field</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              )}
              
              <div className="space-y-3">
                <Label>Actions</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Available Actions</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const action = {
                            id: Date.now().toString(),
                            type: 'send_notification',
                            config: {}
                          };
                          setNewWorkflow({...newWorkflow, actions: [...newWorkflow.actions, action]});
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Action
                      </Button>
                    </div>
                    
                    {newWorkflow.actions.length === 0 ? (
                      <div className="text-center py-4">
                  <Workflow className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                          Click "Add Action" to build your workflow
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {newWorkflow.actions.map((action, index) => (
                          <div key={action.id} className="flex items-center justify-between p-3 border rounded bg-gray-50">
                                                         <div className="flex items-center gap-3">
                               <Select 
                                 value={action.type} 
                                 onValueChange={(value) => {
                                   const updatedActions = [...newWorkflow.actions];
                                   updatedActions[index].type = value;
                                   setNewWorkflow({...newWorkflow, actions: updatedActions});
                                 }}
                               >
                                 <SelectTrigger className="w-48">
                                   <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                   {actionTypes.map((actionType) => (
                                     <SelectItem key={actionType.value} value={actionType.value}>
                                       <div className="flex items-center gap-2">
                                         <actionType.icon className="w-4 h-4" />
                                         {actionType.label}
                                       </div>
                                     </SelectItem>
                                   ))}
                                 </SelectContent>
                               </Select>
                               <Button 
                                 variant="outline" 
                                 size="sm"
                                 onClick={() => openActionConfig(action, index)}
                               >
                                 Configure
                               </Button>
                             </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                const updatedActions = newWorkflow.actions.filter((_, i) => i !== index);
                                setNewWorkflow({...newWorkflow, actions: updatedActions});
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsCreateOpen(false);
                  setNewWorkflow({ name: '', description: '', trigger: '', triggerObject: '', triggerField: '', actions: [] });
                }}>
                  Cancel
                </Button>
                <Button onClick={async () => {
                  if (!newWorkflow.name.trim()) { 
                    toast({ title: 'Workflow name is required', variant: 'destructive' }); 
                    return; 
                  }
                  if (!newWorkflow.trigger) {
                    toast({ title: 'Trigger is required', variant: 'destructive' });
                    return;
                  }
                  
                  try {
                    console.log('Creating workflow with data:', newWorkflow);
                    
                    const created = await customizationService.createWorkflow({ 
                      name: newWorkflow.name, 
                      description: newWorkflow.description, 
                      trigger: newWorkflow.trigger, 
                      actions: newWorkflow.actions
                    });
                    
                    console.log('Workflow created:', created);
                    
                    if (created) {
                      const newWorkflowItem = {
                        id: created.id,
                        name: created.name,
                        description: created.description,
                        trigger: created.trigger,
                        actions: created.actions || [],
                        status: created.status || 'active',
                        executions: created.executions || 0
                      };
                      
                      console.log('Adding workflow to list:', newWorkflowItem);
                      setWorkflows(prev => [newWorkflowItem, ...prev]);
                      
                      toast({ title: 'Workflow Created', description: 'New workflow has been created successfully.' });
                    } else {
                      toast({ title: 'Error', description: 'Failed to create workflow. Please try again.', variant: 'destructive' });
                    }
                  } catch (error) {
                    console.error('Error creating workflow:', error);
                    toast({ 
                      title: 'Error Creating Workflow', 
                      description: error instanceof Error ? error.message : 'Failed to create workflow. Please check the console for details.', 
                      variant: 'destructive' 
                    });
                  }
                  
                  setIsCreateOpen(false);
                  setNewWorkflow({ name: '', description: '', trigger: '', triggerObject: '', triggerField: '', actions: [] });
                }}>
                  Create Workflow
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Workflows</p>
                <p className="text-2xl font-bold">{workflows.length}</p>
              </div>
              <Workflow className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {workflows.filter(w => w.status === 'active').length}
                </p>
              </div>
              <Play className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold">
                  {workflows.reduce((sum, w) => sum + w.executions, 0)}
                </p>
              </div>
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg per Day</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <Bell className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            Active Workflows
          </CardTitle>
          <CardDescription>
            Manage your automated business rules and processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <Input placeholder="Search workflows..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="max-w-sm" />
            <div className="flex items-center gap-2 text-sm">
              <Button variant="outline" size="sm" disabled={page===1} onClick={() => setPage(p => Math.max(1, p-1))}>Prev</Button>
              <span>Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page>=totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>Next</Button>
            </div>
          </div>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${workflow.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {workflow.status === 'active' ? (
                      <Play className="w-5 h-5 text-green-600" />
                    ) : (
                      <Pause className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{workflow.name}</h4>
                      <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                        {workflow.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{workflow.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Trigger: {workflow.trigger}</span>
                      <span>•</span>
                      <span>Actions: {workflow.actions.join(', ')}</span>
                      <span>•</span>
                      <span>{workflow.executions} executions</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleToggleWorkflow(workflow.id, workflow.status)}
                  >
                    {workflow.status === 'active' ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setEditingWorkflow(workflow); setIsEditOpen(true); }}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteWorkflow(workflow.id, workflow.name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Workflow Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Workflow</DialogTitle>
            <DialogDescription>Update name, trigger and actions. Drag-and-drop builder coming below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={editingWorkflow?.name || ''} onChange={(e) => setEditingWorkflow(prev => prev ? { ...prev, name: e.target.value } : prev)} />
              </div>
              <div>
                <Label>Trigger</Label>
                <Input value={editingWorkflow?.trigger || ''} onChange={(e) => setEditingWorkflow(prev => prev ? { ...prev, trigger: e.target.value } : prev)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Actions</Label>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={({ active, over }) => {
                if (!editingWorkflow || !over || active.id === over.id) return;
                const items = [...(editingWorkflow.actions || []).map((a, idx) => ({ id: `${idx}`, label: a }))];
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                const moved = arrayMove(items, oldIndex, newIndex).map(i => i.label);
                setEditingWorkflow(prev => prev ? { ...prev, actions: moved } : prev);
              }}>
                <SortableContext items={(editingWorkflow?.actions || []).map((_, idx) => `${idx}`)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {(editingWorkflow?.actions || []).map((a, idx) => (
                      <SortableActionItem key={`${idx}`} id={`${idx}`} label={a} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <div className="flex gap-2 mt-2">
                {['Assign to Agent', 'Send Email', 'Send Notification', 'Escalate'].map((preset) => (
                  <Button key={preset} variant="outline" size="sm" onClick={() => setEditingWorkflow(prev => prev ? { ...prev, actions: [...(prev.actions || []), preset] } : prev)}>{preset}</Button>
                ))}
              </div>
            </div>
            <div className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-gray-500">
              Drag-and-drop canvas placeholder. You can drop action chips here to build the sequence. (Can be enhanced with react-beautiful-dnd in a follow-up.)
            </div>
            <Button onClick={async () => {
              if (!editingWorkflow) return;
              const updated = await customizationService.updateWorkflow(editingWorkflow.id, { name: editingWorkflow.name, trigger: editingWorkflow.trigger, actions: editingWorkflow.actions });
              if (updated) {
                setWorkflows(prev => prev.map(w => w.id === editingWorkflow.id ? { ...w, name: editingWorkflow.name, trigger: editingWorkflow.trigger, actions: editingWorkflow.actions } : w));
                toast({ title: 'Workflow Updated', description: 'Changes saved successfully.' });
              }
              setIsEditOpen(false);
            }} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
          <CardDescription>
            Quick-start templates for common automation scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Auto-assignment Rules', description: 'Automatically assign tickets based on criteria' },
              { name: 'Escalation Workflows', description: 'Escalate unresolved tickets automatically' },
              { name: 'Customer Onboarding', description: 'Welcome new customers with automated sequences' },
              { name: 'Follow-up Automation', description: 'Schedule follow-ups based on ticket status' }
            ].map((template, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-medium mb-1">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle>Configure Action</DialogTitle>
            <DialogDescription>
              Set up the parameters for this workflow action
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {configuringAction && getActionConfigComponent(configuringAction.type)}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsConfigOpen(false)}>
                Save Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

