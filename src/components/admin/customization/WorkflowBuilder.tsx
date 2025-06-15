
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
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
  ArrowRight
} from 'lucide-react';

interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  status: 'active' | 'inactive';
  executions: number;
}

export const WorkflowBuilder = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [workflows] = useState<WorkflowRule[]>([
    {
      id: '1',
      name: 'Auto-assign High Priority Tickets',
      description: 'Automatically assigns critical priority tickets to senior agents',
      trigger: 'Ticket Created',
      actions: ['Assign to Senior Agent', 'Send Notification'],
      status: 'active',
      executions: 342
    },
    {
      id: '2',
      name: 'Welcome New Customers',
      description: 'Send welcome email to new customer registrations',
      trigger: 'Customer Registered',
      actions: ['Send Welcome Email', 'Create Follow-up Task'],
      status: 'active',
      executions: 156
    },
    {
      id: '3',
      name: 'Escalate Unresolved Tickets',
      description: 'Escalate tickets that remain unresolved for 24+ hours',
      trigger: 'Time-based',
      actions: ['Escalate to Supervisor', 'Send Alert'],
      status: 'active',
      executions: 89
    },
    {
      id: '4',
      name: 'CSAT Follow-up',
      description: 'Send satisfaction survey after ticket resolution',
      trigger: 'Ticket Resolved',
      actions: ['Send CSAT Survey', 'Schedule Follow-up'],
      status: 'inactive',
      executions: 234
    }
  ]);

  const triggerTypes = [
    { value: 'ticket_created', label: 'Ticket Created', icon: Plus },
    { value: 'ticket_resolved', label: 'Ticket Resolved', icon: Zap },
    { value: 'customer_registered', label: 'Customer Registered', icon: UserPlus },
    { value: 'time_based', label: 'Time-based', icon: Bell }
  ];

  const actionTypes = [
    { value: 'assign_agent', label: 'Assign to Agent', icon: UserPlus },
    { value: 'send_email', label: 'Send Email', icon: Mail },
    { value: 'send_notification', label: 'Send Notification', icon: Bell },
    { value: 'escalate', label: 'Escalate', icon: ArrowRight }
  ];

  const handleToggleWorkflow = (workflowId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    toast({
      title: `Workflow ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
      description: `The workflow has been ${newStatus === 'active' ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleDeleteWorkflow = (workflowId: string, workflowName: string) => {
    toast({
      title: "Workflow Deleted",
      description: `${workflowName} has been removed.`,
    });
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
            <div className="text-center py-8">
              <Workflow className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                Workflow Builder coming in Phase 2
              </p>
              <p className="text-sm text-gray-500">
                Advanced drag-and-drop workflow designer with visual rule builder
              </p>
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
                  <Button variant="ghost" size="sm">
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
    </div>
  );
};
