
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Terminal, 
  Play, 
  Save, 
  Plus, 
  FileCode,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  Copy,
  Download
} from 'lucide-react';

interface CustomScript {
  id: string;
  name: string;
  description: string;
  language: 'javascript' | 'python' | 'typescript';
  trigger: 'manual' | 'webhook' | 'scheduled' | 'event';
  code: string;
  status: 'active' | 'inactive' | 'testing';
  lastRun: string;
  executions: number;
  environment: 'production' | 'sandbox' | 'development';
}

export const CodeEditor = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<CustomScript | null>(null);
  const [newScript, setNewScript] = useState({
    name: '',
    description: '',
    language: 'javascript' as const,
    trigger: 'manual' as const,
    code: ''
  });

  const [customScripts] = useState<CustomScript[]>([
    {
      id: '1',
      name: 'Customer Data Validator',
      description: 'Validates customer data on form submission',
      language: 'javascript',
      trigger: 'event',
      code: `function validateCustomer(data) {
  if (!data.email || !data.email.includes('@')) {
    throw new Error('Invalid email address');
  }
  
  if (!data.phone || data.phone.length < 10) {
    throw new Error('Invalid phone number');
  }
  
  return { valid: true, data };
}`,
      status: 'active',
      lastRun: '2 hours ago',
      executions: 234,
      environment: 'production'
    },
    {
      id: '2',
      name: 'Daily Report Generator',
      description: 'Generates daily performance reports',
      language: 'python',
      trigger: 'scheduled',
      code: `import json
from datetime import datetime

def generate_daily_report():
    report = {
        'date': datetime.now().isoformat(),
        'total_tickets': get_ticket_count(),
        'resolved_tickets': get_resolved_count(),
        'satisfaction_score': calculate_csat()
    }
    
    return json.dumps(report, indent=2)`,
      status: 'active',
      lastRun: '1 day ago',
      executions: 45,
      environment: 'production'
    },
    {
      id: '3',
      name: 'Webhook Data Processor',
      description: 'Processes incoming webhook data from external systems',
      language: 'typescript',
      trigger: 'webhook',
      code: `interface WebhookPayload {
  event: string;
  data: any;
  timestamp: number;
}

export async function processWebhook(payload: WebhookPayload) {
  console.log('Processing webhook:', payload.event);
  
  switch (payload.event) {
    case 'customer.created':
      await handleNewCustomer(payload.data);
      break;
    case 'ticket.updated':
      await handleTicketUpdate(payload.data);
      break;
    default:
      console.warn('Unknown event type:', payload.event);
  }
}`,
      status: 'testing',
      lastRun: '30 minutes ago',
      executions: 12,
      environment: 'sandbox'
    }
  ]);

  const handleCreateScript = () => {
    if (!newScript.name || !newScript.code) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Script Created",
      description: `${newScript.name} has been created successfully.`,
    });

    setIsCreateOpen(false);
    setNewScript({
      name: '',
      description: '',
      language: 'javascript',
      trigger: 'manual',
      code: ''
    });
  };

  const handleRunScript = (scriptId: string, scriptName: string) => {
    toast({
      title: "Script Executed",
      description: `${scriptName} is running in the background.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'testing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'javascript': return 'bg-yellow-100 text-yellow-800';
      case 'typescript': return 'bg-blue-100 text-blue-800';
      case 'python': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Code Editor & Script Management</h2>
          <p className="text-gray-600">Create and manage custom scripts for advanced automation</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Script
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Custom Script</DialogTitle>
                <DialogDescription>
                  Write custom code to extend platform functionality
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="script-name">Script Name</Label>
                    <Input
                      id="script-name"
                      value={newScript.name}
                      onChange={(e) => setNewScript({...newScript, name: e.target.value})}
                      placeholder="e.g., Data Validator"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="script-language">Language</Label>
                    <Select value={newScript.language} onValueChange={(value: any) => setNewScript({...newScript, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="script-description">Description</Label>
                  <Input
                    id="script-description"
                    value={newScript.description}
                    onChange={(e) => setNewScript({...newScript, description: e.target.value})}
                    placeholder="Brief description of the script functionality"
                  />
                </div>

                <div>
                  <Label htmlFor="script-trigger">Trigger Type</Label>
                  <Select value={newScript.trigger} onValueChange={(value: any) => setNewScript({...newScript, trigger: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="event">Event-driven</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="script-code">Code</Label>
                  <Textarea
                    id="script-code"
                    value={newScript.code}
                    onChange={(e) => setNewScript({...newScript, code: e.target.value})}
                    placeholder="// Write your custom code here..."
                    className="font-mono text-sm h-64"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateScript} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Create Script
                  </Button>
                  <Button variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Test Run
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Script Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Scripts</p>
                <p className="text-2xl font-bold">{customScripts.length}</p>
              </div>
              <FileCode className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Scripts</p>
                <p className="text-2xl font-bold text-green-600">
                  {customScripts.filter(s => s.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold">
                  {customScripts.reduce((sum, s) => sum + s.executions, 0)}
                </p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Testing Scripts</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {customScripts.filter(s => s.status === 'testing').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scripts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Custom Scripts
          </CardTitle>
          <CardDescription>
            Manage your custom code and automation scripts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customScripts.map((script) => (
              <div key={script.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <FileCode className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{script.name}</h4>
                      <Badge className={getStatusColor(script.status)}>
                        {script.status}
                      </Badge>
                      <Badge variant="outline" className={getLanguageColor(script.language)}>
                        {script.language}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {script.trigger}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {script.environment}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{script.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{script.executions} executions</span>
                      <span>•</span>
                      <span>Last run {script.lastRun}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRunScript(script.id, script.name)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Play className="w-4 h-4" />
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
