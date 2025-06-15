
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Plus, 
  Play, 
  Pause,
  Edit,
  Trash2,
  Filter,
  ArrowRight,
  Bell,
  Settings,
  Target,
  Activity
} from 'lucide-react';

interface BusinessRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  status: 'active' | 'inactive';
  priority: 'low' | 'medium' | 'high';
  executions: number;
  lastTriggered: string;
}

export const RuleEngine = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [businessRules] = useState<BusinessRule[]>([
    {
      id: '1',
      name: 'VIP Customer Auto-Priority',
      description: 'Automatically prioritize tickets from VIP customers',
      trigger: 'Ticket Created',
      conditions: ['Customer Tier = VIP'],
      actions: ['Set Priority to High', 'Assign to Senior Agent'],
      status: 'active',
      priority: 'high',
      executions: 89,
      lastTriggered: '2 hours ago'
    },
    {
      id: '2',
      name: 'After Hours Escalation',
      description: 'Escalate urgent tickets created outside business hours',
      trigger: 'Time-based',
      conditions: ['Time = After Hours', 'Priority = Urgent'],
      actions: ['Send Manager Alert', 'Create Emergency Task'],
      status: 'active',
      priority: 'high',
      executions: 23,
      lastTriggered: '5 hours ago'
    },
    {
      id: '3',
      name: 'Customer Follow-up Reminder',
      description: 'Remind agents to follow up with customers after resolution',
      trigger: 'Ticket Resolved',
      conditions: ['Resolution Time > 24 hours'],
      actions: ['Create Follow-up Task', 'Send Agent Reminder'],
      status: 'active',
      priority: 'medium',
      executions: 156,
      lastTriggered: '1 day ago'
    },
    {
      id: '4',
      name: 'Duplicate Ticket Prevention',
      description: 'Prevent duplicate tickets from the same customer',
      trigger: 'Ticket Created',
      conditions: ['Same Customer', 'Similar Subject', 'Within 24 hours'],
      actions: ['Merge with Existing', 'Notify Agent'],
      status: 'inactive',
      priority: 'low',
      executions: 12,
      lastTriggered: '3 days ago'
    }
  ]);

  const handleToggleRule = (ruleId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    toast({
      title: `Rule ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
      description: `The business rule has been ${newStatus === 'active' ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleDeleteRule = (ruleId: string, ruleName: string) => {
    toast({
      title: "Rule Deleted",
      description: `${ruleName} has been removed.`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Business Rules Engine</h2>
          <p className="text-gray-600">Create intelligent automation rules to streamline your operations</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Business Rule</DialogTitle>
              <DialogDescription>
                Define automated business logic and decision rules
              </DialogDescription>
            </DialogHeader>
            <div className="text-center py-8">
              <Zap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                Advanced Rule Builder coming soon
              </p>
              <p className="text-sm text-gray-500">
                Visual rule designer with condition builder and action configurator
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rule Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Rules</p>
                <p className="text-2xl font-bold">{businessRules.length}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Rules</p>
                <p className="text-2xl font-bold text-green-600">
                  {businessRules.filter(r => r.status === 'active').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold">
                  {businessRules.reduce((sum, r) => sum + r.executions, 0)}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {businessRules.filter(r => r.priority === 'high').length}
                </p>
              </div>
              <Bell className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Business Rules
          </CardTitle>
          <CardDescription>
            Manage your automated business logic and decision rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessRules.map((rule) => (
              <div key={rule.id} className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${getPriorityColor(rule.priority)}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${rule.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {rule.status === 'active' ? (
                      <Play className="w-5 h-5 text-green-600" />
                    ) : (
                      <Pause className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                        {rule.status}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          rule.priority === 'high' ? 'border-red-500 text-red-700' :
                          rule.priority === 'medium' ? 'border-yellow-500 text-yellow-700' :
                          'border-green-500 text-green-700'
                        }`}
                      >
                        {rule.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                    
                    {/* Rule Logic Preview */}
                    <div className="flex items-center gap-2 text-xs bg-white/50 p-2 rounded border">
                      <span className="font-medium text-blue-600">WHEN</span>
                      <span>{rule.trigger}</span>
                      <Filter className="w-3 h-3 text-gray-400" />
                      <span className="font-medium text-green-600">IF</span>
                      <span>{rule.conditions.join(', ')}</span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span className="font-medium text-purple-600">THEN</span>
                      <span>{rule.actions.join(', ')}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span>{rule.executions} executions</span>
                      <span>•</span>
                      <span>Last triggered {rule.lastTriggered}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleToggleRule(rule.id, rule.status)}
                  >
                    {rule.status === 'active' ? (
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
                    onClick={() => handleDeleteRule(rule.id, rule.name)}
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
    </div>
  );
};
