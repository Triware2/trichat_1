
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { customizationService } from '@/services/customizationService';
import { 
  Link, 
  Plus, 
  Settings, 
  Play,
  Pause,
  Activity,
  Zap,
  Globe,
  Database,
  Mail,
  MessageSquare,
  Calendar,
  CreditCard,
  Users
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Integration {
  id: string;
  name: string;
  provider: string;
  category: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  syncCount: number;
  icon: any;
  color: string;
}

export const IntegrationManager = () => {
  const { toast } = useToast();
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState('');
  const [integrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Salesforce CRM',
      provider: 'Salesforce',
      category: 'CRM',
      description: 'Sync customer data and sales pipelines',
      status: 'connected',
      lastSync: '2 minutes ago',
      syncCount: 1247,
      icon: Database,
      color: 'blue'
    },
    {
      id: '2',
      name: 'Slack Notifications',
      provider: 'Slack',
      category: 'Communication',
      description: 'Send notifications to Slack channels',
      status: 'connected',
      lastSync: '15 minutes ago',
      syncCount: 892,
      icon: MessageSquare,
      color: 'green'
    },
    {
      id: '3',
      name: 'Google Calendar',
      provider: 'Google',
      category: 'Productivity',
      description: 'Sync appointments and meetings',
      status: 'connected',
      lastSync: '1 hour ago',
      syncCount: 234,
      icon: Calendar,
      color: 'purple'
    },
    {
      id: '4',
      name: 'Stripe Payments',
      provider: 'Stripe',
      category: 'Finance',
      description: 'Process payments and manage billing',
      status: 'error',
      lastSync: '3 hours ago',
      syncCount: 567,
      icon: CreditCard,
      color: 'red'
    },
    {
      id: '5',
      name: 'HubSpot Marketing',
      provider: 'HubSpot',
      category: 'Marketing',
      description: 'Sync marketing campaigns and leads',
      status: 'disconnected',
      lastSync: 'Never',
      syncCount: 0,
      icon: Users,
      color: 'orange'
    }
  ]);
  const total = integrations.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const availableIntegrations = [
    { name: 'Microsoft Dynamics', category: 'CRM', icon: Database },
    { name: 'Zoom Meetings', category: 'Communication', icon: MessageSquare },
    { name: 'Zapier', category: 'Automation', icon: Zap },
    { name: 'SendGrid Email', category: 'Communication', icon: Mail },
    { name: 'Oracle Database', category: 'Database', icon: Database },
    { name: 'AWS Services', category: 'Cloud', icon: Globe }
  ];

  const handleToggleIntegration = async (integrationId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'connected' ? 'disconnected' : 'connected';
    await customizationService.toggleIntegration(integrationId, newStatus as any);
    toast({
      title: `Integration ${newStatus === 'connected' ? 'Connected' : 'Disconnected'}`,
      description: `The integration has been ${newStatus === 'connected' ? 'enabled' : 'disabled'}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'disconnected': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Activity className="w-4 h-4" />;
      case 'error': return <Pause className="w-4 h-4" />;
      case 'disconnected': return <Pause className="w-4 h-4" />;
      default: return <Pause className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Integration Manager</h2>
          <p className="text-gray-600">Connect with external services and manage data synchronization</p>
        </div>
        <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Available Integrations</DialogTitle>
              <DialogDescription>
                Connect with popular services to extend your platform capabilities
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableIntegrations.map((integration, index) => {
                const Icon = integration.icon;
                return (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-gray-600">{integration.category}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Integrations</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
              <Link className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connected</p>
                <p className="text-2xl font-bold text-green-600">
                  {integrations.filter(i => i.status === 'connected').length}
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
                <p className="text-sm text-gray-600">Total Syncs</p>
                <p className="text-2xl font-bold">
                  {integrations.reduce((sum, i) => sum + i.syncCount, 0)}
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
                <p className="text-sm text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-red-600">
                  {integrations.filter(i => i.status === 'error').length}
                </p>
              </div>
              <Pause className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Active Integrations
          </CardTitle>
          <CardDescription>
            Manage your connected services and data synchronization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <Input placeholder="Search integrations..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="max-w-sm" />
            <div className="flex items-center gap-2 text-sm">
              <Button variant="outline" size="sm" disabled={page===1} onClick={() => setPage(p => Math.max(1, p-1))}>Prev</Button>
              <span>Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page>=totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>Next</Button>
            </div>
          </div>
          <div className="space-y-4">
            {integrations
              .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.provider.toLowerCase().includes(search.toLowerCase()))
              .slice((page-1)*pageSize, page*pageSize)
              .map((integration) => {
              const Icon = integration.icon;
              return (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-${integration.color}-100`}>
                      <Icon className={`w-5 h-5 text-${integration.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{integration.name}</h4>
                        <Badge className={getStatusColor(integration.status)}>
                          {getStatusIcon(integration.status)}
                          <span className="ml-1">{integration.status}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {integration.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{integration.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Provider: {integration.provider}</span>
                        <span>•</span>
                        <span>{integration.syncCount} syncs</span>
                        <span>•</span>
                        <span>Last sync: {integration.lastSync}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleToggleIntegration(integration.id, integration.status)}
                    >
                      {integration.status === 'connected' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(integration); setIsEditOpen(true); }}>
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Integration Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">CRM & Sales</CardTitle>
            <CardDescription>Customer relationship management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['Salesforce', 'HubSpot', 'Microsoft Dynamics', 'Pipedrive'].map((crm, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{crm}</span>
                  <Badge variant="outline" className="text-xs">Available</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Communication</CardTitle>
            <CardDescription>Messaging and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['Slack', 'Microsoft Teams', 'Discord', 'Telegram'].map((comm, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{comm}</span>
                  <Badge variant="outline" className="text-xs">Available</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Productivity</CardTitle>
            <CardDescription>Calendars and task management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['Google Calendar', 'Outlook', 'Trello', 'Asana'].map((prod, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{prod}</span>
                  <Badge variant="outline" className="text-xs">Available</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Integration Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Integration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={editing?.name || ''} onChange={(e) => setEditing((prev: any) => prev ? { ...prev, name: e.target.value } : prev)} />
            </div>
            <div>
              <Label>Provider</Label>
              <Input value={editing?.provider || ''} onChange={(e) => setEditing((prev: any) => prev ? { ...prev, provider: e.target.value } : prev)} />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={editing?.category || ''} onChange={(e) => setEditing((prev: any) => prev ? { ...prev, category: e.target.value } : prev)} />
            </div>
            <Button onClick={async () => { if (!editing) return; await customizationService.updateIntegration(editing.id, { name: editing.name, provider: editing.provider, category: editing.category }); toast({ title: 'Integration Updated', description: 'Changes saved successfully.' }); setIsEditOpen(false); }} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
