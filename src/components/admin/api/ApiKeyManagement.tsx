
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Key, 
  Copy, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2,
  Code,
  Globe,
  Shield
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'revoked';
  permissions: string[];
  createdAt: string;
  lastUsed: string | null;
  domain: string;
}

export const ApiKeyManagement = () => {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyDomain, setNewKeyDomain] = useState('');
  
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production Website',
      key: 'tc_live_4a7c8b2e9f1d3h5k7m9p2q4r6t8v0x2z',
      status: 'active',
      permissions: ['chat.read', 'chat.write', 'users.read'],
      createdAt: '2024-01-15T10:30:00Z',
      lastUsed: '2024-01-20T14:22:00Z',
      domain: 'example.com'
    },
    {
      id: '2',
      name: 'Development Environment',
      key: 'tc_test_9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k',
      status: 'active',
      permissions: ['chat.read', 'chat.write'],
      createdAt: '2024-01-10T09:15:00Z',
      lastUsed: null,
      domain: 'dev.example.com'
    }
  ]);

  const generateApiKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the API key.",
        variant: "destructive"
      });
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `tc_live_${Math.random().toString(36).substring(2, 34)}`,
      status: 'active',
      permissions: ['chat.read', 'chat.write'],
      createdAt: new Date().toISOString(),
      lastUsed: null,
      domain: newKeyDomain || '*'
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    setNewKeyDomain('');
    
    toast({
      title: "API Key Generated",
      description: "New API key has been created successfully.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const revokeKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, status: 'revoked' } : key
    ));
    
    toast({
      title: "API Key Revoked",
      description: "The API key has been revoked and is no longer valid.",
      variant: "destructive"
    });
  };

  const regenerateKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId 
        ? { 
            ...key, 
            key: `tc_live_${Math.random().toString(36).substring(2, 34)}`,
            createdAt: new Date().toISOString(),
            lastUsed: null
          } 
        : key
    ));
    
    toast({
      title: "API Key Regenerated",
      description: "A new API key has been generated. Update your integration.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const maskKey = (key: string) => {
    const prefix = key.substring(0, 12);
    const suffix = key.substring(key.length - 4);
    return `${prefix}${'*'.repeat(16)}${suffix}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">API Key Management</h2>
          <p className="text-gray-600 mt-1">Generate and manage API keys for TriChat integrations</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {apiKeys.filter(k => k.status === 'active').length} Active Keys
        </Badge>
      </div>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keys" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Integration Guide
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Generate New API Key
              </CardTitle>
              <CardDescription>
                Create a new API key for integrating TriChat into your applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production Website"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keyDomain">Domain (Optional)</Label>
                  <Input
                    id="keyDomain"
                    value={newKeyDomain}
                    onChange={(e) => setNewKeyDomain(e.target.value)}
                    placeholder="e.g., yoursite.com"
                  />
                </div>
              </div>
              <Button onClick={generateApiKey} className="w-full">
                <Key className="w-4 h-4 mr-2" />
                Generate API Key
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing API Keys</CardTitle>
              <CardDescription>
                Manage your active API keys and monitor usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-medium text-lg">{apiKey.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={apiKey.status === 'active' ? 'default' : 'destructive'}>
                            {apiKey.status}
                          </Badge>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">
                            Domain: {apiKey.domain}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {showKeys[apiKey.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => regenerateKey(apiKey.id)}
                          disabled={apiKey.status === 'revoked'}
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revokeKey(apiKey.id)}
                          disabled={apiKey.status === 'revoked'}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">API Key:</Label>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Created:</span> {formatDate(apiKey.createdAt)}
                        </div>
                        <div>
                          <span className="font-medium">Last Used:</span> {
                            apiKey.lastUsed ? formatDate(apiKey.lastUsed) : 'Never'
                          }
                        </div>
                        <div>
                          <span className="font-medium">Permissions:</span> {apiKey.permissions.length} permissions
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Integration Documentation
              </CardTitle>
              <CardDescription>
                Learn how to integrate TriChat into your website or application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Quick Start</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-3">Add this script to your website's HTML:</p>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`<script>
  (function() {
    window.TriChatConfig = {
      apiKey: 'YOUR_API_KEY_HERE',
      position: 'bottom-right',
      primaryColor: '#0066cc'
    };
    var script = document.createElement('script');
    script.src = 'https://cdn.trichat.com/widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`}
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-lg">Configuration Options</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm">
{`TriChatConfig = {
  apiKey: 'your_api_key',           // Required
  position: 'bottom-right',         // 'bottom-right', 'bottom-left'
  primaryColor: '#0066cc',          // Hex color code
  welcomeMessage: 'Hi! How can we help?',
  department: 'support',            // Route to specific department
  customFields: {                   // Additional user data
    userId: 'user123',
    plan: 'premium'
  }
}`}
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-lg">API Endpoints</h4>
                <div className="space-y-2">
                  <div className="bg-gray-50 rounded p-3">
                    <code className="text-sm">POST /api/v1/chat/start</code>
                    <p className="text-sm text-gray-600 mt-1">Initialize a new chat session</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <code className="text-sm">POST /api/v1/chat/message</code>
                    <p className="text-sm text-gray-600 mt-1">Send a message to an active chat</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <code className="text-sm">GET /api/v1/chat/history</code>
                    <p className="text-sm text-gray-600 mt-1">Retrieve chat history</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies for API access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require HTTPS</Label>
                    <p className="text-sm text-gray-500">Only allow API calls over HTTPS</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rate Limiting</Label>
                    <p className="text-sm text-gray-500">Limit API requests per minute</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Restrictions</Label>
                    <p className="text-sm text-gray-500">Restrict API access by IP address</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Label>API Rate Limits</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="requests">Requests per minute</Label>
                    <Input id="requests" type="number" defaultValue={100} />
                  </div>
                  <div>
                    <Label htmlFor="burst">Burst limit</Label>
                    <Input id="burst" type="number" defaultValue={200} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
