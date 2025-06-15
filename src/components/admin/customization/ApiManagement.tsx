
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Key, 
  Plus, 
  Copy, 
  Eye,
  EyeOff,
  Trash2,
  Settings,
  Globe,
  Shield,
  Activity,
  Clock,
  BarChart3,
  AlertCircle
} from 'lucide-react';

interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  isPublic: boolean;
  requiresAuth: boolean;
  rateLimit: number;
  status: 'active' | 'inactive' | 'deprecated';
  requests24h: number;
  avgResponseTime: number;
  lastCalled: string;
  version: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  environment: 'production' | 'sandbox' | 'development';
  createdDate: string;
  lastUsed: string;
  requestCount: number;
  status: 'active' | 'revoked' | 'expired';
}

export const ApiManagement = () => {
  const { toast } = useToast();
  const [isCreateEndpointOpen, setIsCreateEndpointOpen] = useState(false);
  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<{[key: string]: boolean}>({});
  const [newEndpoint, setNewEndpoint] = useState({
    name: '',
    path: '',
    method: 'GET' as const,
    description: '',
    isPublic: false,
    requiresAuth: true
  });
  const [newApiKey, setNewApiKey] = useState({
    name: '',
    environment: 'development' as const,
    permissions: [] as string[]
  });

  const [endpoints] = useState<ApiEndpoint[]>([
    {
      id: '1',
      name: 'Get Customer Data',
      path: '/api/v1/customers/{id}',
      method: 'GET',
      description: 'Retrieve detailed customer information by ID',
      isPublic: false,
      requiresAuth: true,
      rateLimit: 100,
      status: 'active',
      requests24h: 1247,
      avgResponseTime: 145,
      lastCalled: '2 minutes ago',
      version: 'v1'
    },
    {
      id: '2',
      name: 'Create Ticket',
      path: '/api/v1/tickets',
      method: 'POST',
      description: 'Create a new support ticket',
      isPublic: true,
      requiresAuth: false,
      rateLimit: 50,
      status: 'active',
      requests24h: 89,
      avgResponseTime: 234,
      lastCalled: '15 minutes ago',
      version: 'v1'
    },
    {
      id: '3',
      name: 'Update User Profile',
      path: '/api/v1/users/{id}',
      method: 'PUT',
      description: 'Update user profile information',
      isPublic: false,
      requiresAuth: true,
      rateLimit: 25,
      status: 'active',
      requests24h: 342,
      avgResponseTime: 189,
      lastCalled: '1 hour ago',
      version: 'v1'
    },
    {
      id: '4',
      name: 'Legacy User Endpoint',
      path: '/api/v0/users',
      method: 'GET',
      description: 'Legacy endpoint for user data (deprecated)',
      isPublic: false,
      requiresAuth: true,
      rateLimit: 10,
      status: 'deprecated',
      requests24h: 12,
      avgResponseTime: 456,
      lastCalled: '1 day ago',
      version: 'v0'
    }
  ]);

  const [apiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production Mobile App',
      key: 'pk_live_51H7***************',
      permissions: ['read:customers', 'write:tickets', 'read:analytics'],
      environment: 'production',
      createdDate: '2024-01-15',
      lastUsed: '5 minutes ago',
      requestCount: 15247,
      status: 'active'
    },
    {
      id: '2',
      name: 'Development Testing',
      key: 'pk_test_51H7***************',
      permissions: ['read:*', 'write:*', 'delete:*'],
      environment: 'development',
      createdDate: '2024-02-01',
      lastUsed: '2 hours ago',
      requestCount: 892,
      status: 'active'
    },
    {
      id: '3',
      name: 'Partner Integration',
      key: 'pk_live_62K9***************',
      permissions: ['read:customers', 'read:tickets'],
      environment: 'production',
      createdDate: '2024-01-20',
      lastUsed: '1 week ago',
      requestCount: 3456,
      status: 'revoked'
    }
  ]);

  const handleCreateEndpoint = () => {
    if (!newEndpoint.name || !newEndpoint.path) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "API Endpoint Created",
      description: `${newEndpoint.name} has been created successfully.`,
    });

    setIsCreateEndpointOpen(false);
    setNewEndpoint({
      name: '',
      path: '',
      method: 'GET',
      description: '',
      isPublic: false,
      requiresAuth: true
    });
  };

  const handleCreateApiKey = () => {
    if (!newApiKey.name) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for the API key.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "API Key Created",
      description: `${newApiKey.name} has been created successfully.`,
    });

    setIsCreateKeyOpen(false);
    setNewApiKey({
      name: '',
      environment: 'development',
      permissions: []
    });
  };

  const toggleApiKeyVisibility = (keyId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'deprecated': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'revoked': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'PATCH': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">API Management</h2>
          <p className="text-gray-600">Manage API endpoints, keys, and access controls</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateEndpointOpen} onOpenChange={setIsCreateEndpointOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Endpoint
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create API Endpoint</DialogTitle>
                <DialogDescription>
                  Define a new API endpoint for external access
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="endpoint-name">Endpoint Name</Label>
                    <Input
                      id="endpoint-name"
                      value={newEndpoint.name}
                      onChange={(e) => setNewEndpoint({...newEndpoint, name: e.target.value})}
                      placeholder="e.g., Get Customer Data"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endpoint-method">HTTP Method</Label>
                    <Select value={newEndpoint.method} onValueChange={(value: any) => setNewEndpoint({...newEndpoint, method: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="endpoint-path">API Path</Label>
                  <Input
                    id="endpoint-path"
                    value={newEndpoint.path}
                    onChange={(e) => setNewEndpoint({...newEndpoint, path: e.target.value})}
                    placeholder="/api/v1/resource/{id}"
                  />
                </div>

                <div>
                  <Label htmlFor="endpoint-description">Description</Label>
                  <Textarea
                    id="endpoint-description"
                    value={newEndpoint.description}
                    onChange={(e) => setNewEndpoint({...newEndpoint, description: e.target.value})}
                    placeholder="Brief description of the endpoint functionality"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public-endpoint"
                      checked={newEndpoint.isPublic}
                      onCheckedChange={(checked) => setNewEndpoint({...newEndpoint, isPublic: checked})}
                    />
                    <Label htmlFor="public-endpoint">Public Endpoint</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requires-auth"
                      checked={newEndpoint.requiresAuth}
                      onCheckedChange={(checked) => setNewEndpoint({...newEndpoint, requiresAuth: checked})}
                    />
                    <Label htmlFor="requires-auth">Requires Authentication</Label>
                  </div>
                </div>

                <Button onClick={handleCreateEndpoint} className="w-full">
                  Create Endpoint
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateKeyOpen} onOpenChange={setIsCreateKeyOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-md">
              <DialogHeader>
                <DialogTitle>Create API Key</DialogTitle>
                <DialogDescription>
                  Generate a new API key for external access
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input
                    id="key-name"
                    value={newApiKey.name}
                    onChange={(e) => setNewApiKey({...newApiKey, name: e.target.value})}
                    placeholder="e.g., Mobile App Production"
                  />
                </div>

                <div>
                  <Label htmlFor="key-environment">Environment</Label>
                  <Select value={newApiKey.environment} onValueChange={(value: any) => setNewApiKey({...newApiKey, environment: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleCreateApiKey} className="w-full">
                  Generate API Key
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* API Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Endpoints</p>
                <p className="text-2xl font-bold">{endpoints.length}</p>
              </div>
              <Globe className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Keys</p>
                <p className="text-2xl font-bold text-green-600">
                  {apiKeys.filter(k => k.status === 'active').length}
                </p>
              </div>
              <Key className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Requests (24h)</p>
                <p className="text-2xl font-bold">
                  {endpoints.reduce((sum, e) => sum + e.requests24h, 0)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold">
                  {Math.round(endpoints.reduce((sum, e) => sum + e.avgResponseTime, 0) / endpoints.length)}ms
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              API Endpoints
            </CardTitle>
            <CardDescription>
              Manage your API endpoints and their configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {endpoints.map((endpoint) => (
                <div key={endpoint.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <h4 className="font-medium">{endpoint.name}</h4>
                    </div>
                    <Badge className={getStatusColor(endpoint.status)}>
                      {endpoint.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                  <p className="text-sm font-mono bg-gray-100 p-1 rounded mb-2">{endpoint.path}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>{endpoint.requests24h} requests/24h</span>
                      <span>{endpoint.avgResponseTime}ms avg</span>
                      {endpoint.isPublic ? (
                        <Badge variant="outline" className="text-xs">Public</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Private</Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Keys
            </CardTitle>
            <CardDescription>
              Manage API keys and access permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{apiKey.name}</h4>
                    <Badge className={getStatusColor(apiKey.status)}>
                      {apiKey.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      value={showApiKeys[apiKey.id] ? apiKey.key : '•'.repeat(24)}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleApiKeyVisibility(apiKey.id)}
                    >
                      {showApiKeys[apiKey.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyApiKey(apiKey.key)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {apiKey.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>{apiKey.requestCount} requests</span>
                      <span>Last used {apiKey.lastUsed}</span>
                      <Badge variant="outline" className="text-xs">
                        {apiKey.environment}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
