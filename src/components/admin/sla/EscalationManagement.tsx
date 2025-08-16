
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  ArrowUp,
  Clock,
  AlertTriangle,
  Bell,
  Mail,
  Smartphone
} from 'lucide-react';
import { EscalationRule } from './types';
import { slaService } from '@/services/slaService';
import { useEffect } from 'react';

export const EscalationManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [rules, setRules] = useState<EscalationRule[]>([]);

  useEffect(() => {
    const load = async () => {
      const r = await slaService.listEscalationRules();
      setRules(r);
    };
    load();
  }, []);

  const getNotificationIcon = (method: string) => {
    switch (method) {
      case 'email': return <Mail className="w-3 h-3" />;
      case 'sms': return <Smartphone className="w-3 h-3" />;
      case 'in-app': return <Bell className="w-3 h-3" />;
      default: return <Bell className="w-3 h-3" />;
    }
  };

  const getTriggerTypeColor = (type: string) => {
    switch (type) {
      case 'time-based': return 'bg-blue-100 text-blue-800';
      case 'priority-based': return 'bg-orange-100 text-orange-800';
      case 'breach-imminent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Escalation Management</h2>
          <p className="text-sm text-slate-600 mt-1">Configure automated escalation rules and notification pathways</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Escalation Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Escalation Rule</DialogTitle>
              <DialogDescription>
                Define when and how cases should be escalated
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input id="rule-name" placeholder="e.g., Critical Issue Escalation" />
                </div>
                <div>
                  <Label htmlFor="sla-tier">SLA Tier</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select SLA tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enterprise">Enterprise VIP</SelectItem>
                      <SelectItem value="business">Business Standard</SelectItem>
                      <SelectItem value="basic">Basic Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trigger-type">Trigger Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time-based">Time-based</SelectItem>
                      <SelectItem value="priority-based">Priority-based</SelectItem>
                      <SelectItem value="breach-imminent">Breach Imminent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="escalation-level">Escalation Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Level 1 - Senior Agents</SelectItem>
                      <SelectItem value="2">Level 2 - Supervisors</SelectItem>
                      <SelectItem value="3">Level 3 - Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="trigger-condition">Trigger Condition</Label>
                <Textarea 
                  id="trigger-condition" 
                  placeholder="e.g., priority = critical AND no_response > 15m"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="escalate-to">Escalate To</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select escalation target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="senior-agents">Senior Agents Team</SelectItem>
                    <SelectItem value="supervisors">Supervisors Team</SelectItem>
                    <SelectItem value="management">Management Team</SelectItem>
                    <SelectItem value="specific-user">Specific User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Notification Methods</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="email" />
                    <Label htmlFor="email" className="text-sm">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="sms" />
                    <Label htmlFor="sms" className="text-sm">SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="in-app" defaultChecked />
                    <Label htmlFor="in-app" className="text-sm">In-App</Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="active" defaultChecked />
                <Label htmlFor="active" className="text-sm">Activate rule immediately</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={async () => {
                const created = await slaService.createEscalationRule({
                  slaId: '1',
                  name: 'New Rule',
                  triggerType: 'time-based',
                  triggerCondition: 'time_remaining < 15m',
                  escalationLevel: 1,
                  escalateTo: 'supervisor-team',
                  notificationMethods: ['in-app'],
                  isActive: true
                });
                setRules(prev => [created, ...prev]);
                setIsCreateModalOpen(false);
              }}>Create Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Escalation Rules */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <ArrowUp className="w-5 h-5 text-blue-600" />
            Escalation Rules
          </CardTitle>
          <CardDescription>
            Automated rules for escalating cases based on various conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Trigger Type</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Escalation Level</TableHead>
                <TableHead>Escalate To</TableHead>
                <TableHead>Notifications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    <Badge className={getTriggerTypeColor(rule.triggerType)}>
                      {rule.triggerType.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 max-w-xs">
                    <div className="truncate" title={rule.triggerCondition}>
                      {rule.triggerCondition}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Level {rule.escalationLevel}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{rule.escalateTo?.replace?.('-', ' ') || rule.escalateTo}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {rule.notificationMethods.map((method, index) => (
                        <div key={index} className="p-1 bg-gray-100 rounded" title={method}>
                          {getNotificationIcon(method)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={async () => {
                        await slaService.updateEscalationRule(rule.id, { isActive: !rule.isActive });
                        setRules(prev => prev.map(r => r.id === rule.id ? { ...r, isActive: !r.isActive } : r));
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={async () => {
                        await slaService.deleteEscalationRule(rule.id);
                        setRules(prev => prev.filter(r => r.id !== rule.id));
                      }}>
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

      {/* Escalation Paths Visualization */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Users className="w-5 h-5 text-blue-600" />
            Escalation Paths
          </CardTitle>
          <CardDescription>
            Visual representation of escalation hierarchies for different SLA tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Enterprise VIP Path */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3">Enterprise VIP Escalation Path</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                  <span className="text-sm">Agent</span>
                </div>
                <ArrowUp className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
                  <span className="text-sm">Senior Agent</span>
                </div>
                <ArrowUp className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-medium">3</div>
                  <span className="text-sm">Supervisor</span>
                </div>
                <ArrowUp className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">4</div>
                  <span className="text-sm">Management</span>
                </div>
              </div>
            </div>

            {/* Business Standard Path */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-3">Business Standard Escalation Path</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                  <span className="text-sm">Agent</span>
                </div>
                <ArrowUp className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
                  <span className="text-sm">Senior Agent</span>
                </div>
                <ArrowUp className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-medium">3</div>
                  <span className="text-sm">Supervisor</span>
                </div>
              </div>
            </div>

            {/* Basic Support Path */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Basic Support Escalation Path</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                  <span className="text-sm">Agent</span>
                </div>
                <ArrowUp className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
                  <span className="text-sm">Senior Agent</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
