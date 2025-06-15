
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useCRMIntegrations } from '@/components/agent/tickets/useCRMIntegrations';
import { CRMIntegration } from '@/components/agent/tickets/types';
import { 
  Building2, 
  Settings, 
  Plus, 
  Eye, 
  EyeOff,
  Check,
  X,
  ExternalLink
} from 'lucide-react';

export const CRMIntegrationsManagement = () => {
  const { integrations } = useCRMIntegrations();
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<CRMIntegration | null>(null);
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: 'salesforce' as CRMIntegration['type'],
    apiEndpoint: '',
    apiKey: '',
    token: '',
    domain: ''
  });

  const handleToggleActive = (integrationId: string) => {
    console.log(`Toggling integration ${integrationId}`);
    toast({
      title: "Integration Updated",
      description: "CRM integration status has been updated.",
    });
  };

  const handleTestConnection = async (integration: CRMIntegration) => {
    console.log(`Testing connection for ${integration.name}`);
    toast({
      title: "Connection Test",
      description: `Testing connection to ${integration.name}...`,
    });
    
    // Simulate connection test
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${integration.name}`,
      });
    }, 2000);
  };

  const handleAddIntegration = () => {
    console.log('Adding new integration:', newIntegration);
    toast({
      title: "Integration Added",
      description: `${newIntegration.name} has been configured successfully.`,
    });
    setShowAddModal(false);
    setNewIntegration({
      name: '',
      type: 'salesforce',
      apiEndpoint: '',
      apiKey: '',
      token: '',
      domain: ''
    });
  };

  const getCRMIcon = (type: CRMIntegration['type']) => {
    return <Building2 className="w-5 h-5" />;
  };

  const getCRMColor = (type: CRMIntegration['type']) => {
    const colors = {
      salesforce: 'text-blue-600 bg-blue-50 border-blue-200',
      hubspot: 'text-orange-600 bg-orange-50 border-orange-200',
      freshdesk: 'text-green-600 bg-green-50 border-green-200',
      zendesk: 'text-purple-600 bg-purple-50 border-purple-200',
      other: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[type];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CRM Integrations</h2>
          <p className="text-gray-600 mt-1">Manage connections to external CRM systems for ticket management</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add CRM Integration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Integration Name</Label>
                  <Input
                    value={newIntegration.name}
                    onChange={(e) => setNewIntegration(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Salesforce"
                  />
                </div>
                <div>
                  <Label>CRM Type</Label>
                  <Select 
                    value={newIntegration.type} 
                    onValueChange={(value) => setNewIntegration(prev => ({ ...prev, type: value as CRMIntegration['type'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salesforce">Salesforce</SelectItem>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="freshdesk">Freshdesk</SelectItem>
                      <SelectItem value="zendesk">Zendesk</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>API Endpoint</Label>
                <Input
                  value={newIntegration.apiEndpoint}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                  placeholder="https://api.salesforce.com"
                />
              </div>
              <div>
                <Label>API Key / Token</Label>
                <Input
                  type="password"
                  value={newIntegration.apiKey}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter API key or token"
                />
              </div>
              {newIntegration.type === 'freshdesk' && (
                <div>
                  <Label>Domain</Label>
                  <Input
                    value={newIntegration.domain}
                    onChange={(e) => setNewIntegration(prev => ({ ...prev, domain: e.target.value }))}
                    placeholder="yourcompany"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleAddIntegration}>Add Integration</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className={`border-2 ${integration.isActive ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getCRMColor(integration.type)}`}>
                    {getCRMIcon(integration.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{integration.name}</h3>
                    <Badge variant="outline" className="text-xs mt-1">
                      {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {integration.isActive ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Active</Label>
                <Switch
                  checked={integration.isActive}
                  onCheckedChange={() => handleToggleActive(integration.id)}
                />
              </div>
              
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Endpoint:</span>
                  <span className="font-mono text-xs">{integration.apiEndpoint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credentials:</span>
                  <span className="text-xs text-green-600">Configured</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestConnection(integration)}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedIntegration(integration)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {integrations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No CRM Integrations</h3>
            <p className="text-gray-600 mb-4">Add your first CRM integration to enable ticket escalation</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
