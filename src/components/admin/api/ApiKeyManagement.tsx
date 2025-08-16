
import { useEffect, useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { SystemSettingsService } from '@/services/systemSettingsService';

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

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  createdAt: string;
}

export const ApiKeyManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyDomain, setNewKeyDomain] = useState('');
  
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>(['message.created']);
  const [newWebhookSecret, setNewWebhookSecret] = useState('');
  const [showSecrets, setShowSecrets] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('api_keys' as any)
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        const mapped: ApiKey[] = ((data as any[]) || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          key: row.key,
          status: row.status,
          permissions: row.permissions || [],
          createdAt: row.created_at,
          lastUsed: row.last_used || null,
          domain: row.domain || '*'
        }));
        setApiKeys(mapped);

        const setting = await SystemSettingsService.getSetting('integrations', 'webhooks_config');
        let endpoints: WebhookEndpoint[] = [];
        if (setting && (setting as any).value) {
          const raw = (setting as any).value as any;
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          endpoints = parsed?.endpoints || [];
        }
        setWebhooks(endpoints);
      } catch (e) {
        setApiKeys([]);
      }
    };
    load();
  }, [user?.id]);

  const generateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the API key.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!user?.id) {
        toast({ title: "Not signed in", description: "Please sign in to create API keys.", variant: 'destructive' });
        return;
      }

      const generateToken = () => {
        try {
          const bytes = new Uint8Array(24);
          (window as any).crypto?.getRandomValues?.(bytes);
          const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
          return `tc_${hex}`.slice(0, 40);
        } catch {
          return `tc_${Math.random().toString(36).slice(2, 18)}${Math.random().toString(36).slice(2, 18)}`.slice(0, 40);
        }
      };

      const generated = generateToken();
      const { data, error } = await supabase
        .from('api_keys' as any)
        .insert({
      name: newKeyName,
          key: generated,
      status: 'active',
          permissions: ['chat.read','chat.write'],
          domain: newKeyDomain || '*',
          created_by: user?.id
        })
        .select()
        .single();
      if (error) throw error;
      const row: any = data as any;
      const inserted: ApiKey = {
        id: row.id,
        name: row.name,
        key: row.key,
        status: row.status,
        permissions: row.permissions || [],
        createdAt: row.created_at,
        lastUsed: row.last_used || null,
        domain: row.domain || '*'
      };
      setApiKeys(prev => [inserted, ...prev]);
    setNewKeyName('');
    setNewKeyDomain('');
      toast({ title: "API Key Generated", description: "New API key has been created successfully." });
    } catch (e) {
      const err: any = e;
      toast({ title: "Error", description: err?.message || err?.error?.message || 'Failed to create API key.', variant: 'destructive' });
    }
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

  const revokeKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys' as any)
        .update({ status: 'revoked' })
        .eq('id', keyId);
      if (error) throw error;
      setApiKeys(prev => prev.map(key => key.id === keyId ? { ...key, status: 'revoked' } : key));
      toast({ title: "API Key Revoked", description: "The API key has been revoked and is no longer valid.", variant: 'destructive' });
    } catch (e) {
      toast({ title: "Error", description: "Failed to revoke key.", variant: 'destructive' });
    }
  };

  const regenerateKey = async (keyId: string) => {
    try {
      const regenerated = `tc_${Math.random().toString(36).substring(2, 10)}_${crypto.getRandomValues(new Uint32Array(4)).join('')}`.slice(0, 40);
      const { data, error } = await supabase
        .from('api_keys' as any)
        .update({ key: regenerated, last_used: null })
        .eq('id', keyId)
        .select()
        .single();
      if (error) throw error;
      const row: any = data as any;
      setApiKeys(prev => prev.map(k => k.id === keyId ? { ...k, key: row.key, createdAt: k.createdAt, lastUsed: null } : k));
      toast({ title: "API Key Regenerated", description: "A new API key has been generated. Update your integration." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to regenerate key.", variant: 'destructive' });
    }
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

  // Webhooks helpers
  const generateSecret = () => {
    try {
      const bytes = new Uint8Array(24);
      (window as any).crypto?.getRandomValues?.(bytes);
      return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    }
  };

  const persistWebhooks = async (endpoints: WebhookEndpoint[]) => {
    await SystemSettingsService.updateSetting('integrations', 'webhooks_config', { endpoints });
    setWebhooks(endpoints);
  };

  const addWebhook = async () => {
    if (!newWebhookUrl) {
      toast({ title: 'URL required', description: 'Please enter a webhook URL.', variant: 'destructive' });
      return;
    }
    const endpoint: WebhookEndpoint = {
      id: Date.now().toString(),
      url: newWebhookUrl,
      events: newWebhookEvents.length ? newWebhookEvents : ['message.created'],
      secret: newWebhookSecret || generateSecret(),
      enabled: true,
      createdAt: new Date().toISOString()
    };
    await persistWebhooks([endpoint, ...webhooks]);
    setNewWebhookUrl('');
    setNewWebhookEvents(['message.created']);
    setNewWebhookSecret('');
    toast({ title: 'Webhook Added', description: 'Endpoint saved successfully.' });
  };

  const removeWebhook = async (id: string) => {
    const next = webhooks.filter(w => w.id !== id);
    await persistWebhooks(next);
    toast({ title: 'Webhook Removed', description: 'Endpoint deleted successfully.' });
  };

  const toggleWebhook = async (id: string) => {
    const next = webhooks.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w);
    await persistWebhooks(next);
  };

  const regenerateWebhookSecret = async (id: string) => {
    const next = webhooks.map(w => w.id === id ? { ...w, secret: generateSecret() } : w);
    await persistWebhooks(next);
    toast({ title: 'Secret Regenerated', description: 'New signing secret generated.' });
  };

  const sendTestEvent = async (id: string) => {
    const endpoint = webhooks.find(w => w.id === id);
    if (!endpoint) return;
    const payload = {
      id: `evt_${Math.random().toString(36).slice(2, 10)}`,
      type: 'message.created',
      created_at: new Date().toISOString(),
      data: { message: 'Test event from TriChat', chat_id: 'demo_chat_123' }
    };
    try {
      const res = await fetch(endpoint.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-TriChat-Signature': endpoint.secret },
        body: JSON.stringify(payload)
      });
      toast({ title: 'Test Sent', description: `Response: ${res.status}` });
    } catch (e: any) {
      toast({ title: 'Test Failed', description: e?.message || 'Request failed (CORS may block browser calls).', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Key className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">API Key Management</h1>
        </div>
        <p className="text-sm text-slate-600">
          Manage API keys and access tokens for external integrations
        </p>
      </div>

      {/* API Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{apiKeys.length}</p>
                <p className="text-sm font-medium text-slate-600">Total Keys</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{apiKeys.filter(k => k.status === 'active').length}</p>
                <p className="text-sm font-medium text-slate-600">Active Keys</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">2.4K</p>
                <p className="text-sm font-medium text-slate-600">Monthly Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">99.9%</p>
                <p className="text-sm font-medium text-slate-600">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border border-slate-200 shadow-sm">
        <Tabs defaultValue="keys" className="w-full">
          <div className="border-b border-slate-200">
            <TabsList className="h-auto bg-transparent p-0 space-x-0">
              <div className="flex">
                <TabsTrigger 
                  value="keys" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <Key className="w-4 h-4" />
                  API Keys
                </TabsTrigger>
                <TabsTrigger 
                  value="documentation" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <Code className="w-4 h-4" />
                  Documentation
                </TabsTrigger>
                <TabsTrigger 
                  value="webhooks" 
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
                >
                  <Globe className="w-4 h-4" />
                  Webhooks
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <TabsContent value="keys" className="mt-0 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">API Keys</h3>
                  <p className="text-sm text-slate-600 mt-1">Manage your API keys and access tokens</p>
                </div>
                <Button onClick={generateApiKey} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Key
                </Button>
              </div>

              {/* Create New Key Form */}
              <Card className="border border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-base font-bold text-slate-900">Generate New API Key</CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Create a new API key for your application
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyName" className="text-sm font-medium text-slate-700">Key Name</Label>
                      <Input
                        id="keyName"
                        placeholder="e.g., Production Website"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keyDomain" className="text-sm font-medium text-slate-700">Domain</Label>
                      <Input
                        id="keyDomain"
                        placeholder="example.com"
                        value={newKeyDomain}
                        onChange={(e) => setNewKeyDomain(e.target.value)}
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Existing API Keys */}
              <div className="space-y-4">
                <h4 className="text-base font-bold text-slate-900">Existing API Keys</h4>
                {apiKeys.map((key) => (
                  <Card key={key.id} className="border border-slate-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-base font-semibold text-slate-900">{key.name}</h4>
                            <Badge 
                              variant={key.status === 'active' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {key.status}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium text-slate-600">API Key:</Label>
                              <div className="flex items-center gap-2">
                                <code className="text-sm bg-slate-100 px-2 py-1 rounded border font-mono">
                                  {showKeys[key.id] ? key.key : '•'.repeat(32)}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleKeyVisibility(key.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  {showKeys[key.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(key.key)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span>Domain: <span className="font-medium">{key.domain}</span></span>
                              <span>Created: <span className="font-medium">{formatDate(key.createdAt)}</span></span>
                              <span>Last used: <span className="font-medium">{key.lastUsed ? formatDate(key.lastUsed) : 'Never'}</span></span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => regenerateKey(key.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Regenerate
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => revokeKey(key.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Revoke
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documentation" className="mt-0 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Getting Started</h3>
                <p className="text-sm text-slate-600 mt-1">Authenticate using an API key and call REST endpoints.</p>
              </div>
              <Card className="border border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-base font-bold text-slate-900">Base URL & Authentication</CardTitle>
                  <CardDescription className="text-sm text-slate-600">Include your API key in the Authorization header</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Base URL</p>
                      <code className="block text-sm bg-slate-100 px-3 py-2 rounded border">{import.meta.env.VITE_API_BASE_URL || 'https://api.trichat.com/v1'}</code>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Auth Header</p>
                      <code className="block text-sm bg-slate-100 px-3 py-2 rounded border">Authorization: Bearer YOUR_API_KEY</code>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Example (cURL)</p>
                    <pre className="bg-slate-900 text-slate-100 rounded p-4 text-sm overflow-auto"><code>{`curl -X POST \
  '${(import.meta.env.VITE_API_BASE_URL || 'https://api.trichat.com/v1')}/messages' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"chat_id":"chat_123","text":"Hello from API"}'`}</code></pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-base font-bold text-slate-900">Endpoints</CardTitle>
                  <CardDescription className="text-sm text-slate-600">Common REST endpoints</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4 text-sm text-slate-800">
                  <div>
                    <p className="font-semibold">POST /messages</p>
                    <p className="text-slate-600">Send a message into a chat</p>
                    <pre className="bg-slate-900 text-slate-100 rounded p-4 text-xs overflow-auto"><code>{`Request Body:
{ "chat_id": "chat_123", "text": "Hello" }

Response:
{ "id": "msg_123", "status": "sent" }`}</code></pre>
                  </div>
                  <div>
                    <p className="font-semibold">GET /chats/:id</p>
                    <p className="text-slate-600">Fetch chat details</p>
                    <pre className="bg-slate-900 text-slate-100 rounded p-4 text-xs overflow-auto"><code>{`Response:
{ "id": "chat_123", "status": "open", "participants": ["agent_1", "customer_42"] }`}</code></pre>
                  </div>
                  <div>
                    <p className="font-semibold">POST /webhooks/test</p>
                    <p className="text-slate-600">Send a test event to a configured endpoint</p>
              </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-base font-bold text-slate-900">Errors & Rate Limits</CardTitle>
                  <CardDescription className="text-sm text-slate-600">Standard HTTP status codes and JSON error structure</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-2 text-sm">
                  <p className="text-slate-700">429 Too Many Requests — backoff and retry after the Retry-After header value.</p>
                  <pre className="bg-slate-900 text-slate-100 rounded p-4 text-xs overflow-auto"><code>{`{
  "error": {
    "code": "invalid_request",
    "message": "Missing parameter: chat_id"
  }
}`}</code></pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="mt-0 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Webhook Configuration</h3>
                <p className="text-sm text-slate-600 mt-1">Add endpoints to receive events. A secret is used to sign requests.</p>
              </div>

              <Card className="border border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-base font-bold text-slate-900">Add Endpoint</CardTitle>
                  <CardDescription className="text-sm text-slate-600">Specify URL, events, and signing secret</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-medium text-slate-700">Endpoint URL</Label>
                      <Input placeholder="https://example.com/webhooks/trichat" value={newWebhookUrl} onChange={(e) => setNewWebhookUrl(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Signing Secret</Label>
                      <div className="flex gap-2">
                        <Input placeholder="auto-generate" value={newWebhookSecret} onChange={(e) => setNewWebhookSecret(e.target.value)} />
                        <Button type="button" variant="outline" onClick={() => setNewWebhookSecret(generateSecret())}>Generate</Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Events</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {['message.created','chat.resolved','csat.submitted','key.revoked','key.created'].map(evt => (
                        <label key={evt} className="flex items-center gap-2 text-sm text-slate-700">
                          <input type="checkbox" checked={newWebhookEvents.includes(evt)} onChange={(e) => {
                            setNewWebhookEvents(prev => e.target.checked ? [...prev, evt] : prev.filter(x => x !== evt));
                          }} />
                          {evt}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={addWebhook} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Endpoint
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-base font-bold text-slate-900">Configured Endpoints</CardTitle>
                  <CardDescription className="text-sm text-slate-600">Manage, test and rotate secrets</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {webhooks.length === 0 ? (
                    <div className="text-center text-sm text-slate-500 py-6">No webhook endpoints yet</div>
                  ) : (
                    <div className="space-y-4">
                      {webhooks.map(w => (
                        <div key={w.id} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Globe className="w-4 h-4 text-blue-600" />
                                <p className="font-medium text-slate-900 truncate">{w.url}</p>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {w.events.map(evt => (
                                  <Badge key={evt} variant="secondary" className="bg-slate-100 border-slate-200 text-slate-700">{evt}</Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>Status:</span>
                                <Badge variant={w.enabled ? 'default' : 'secondary'} className={w.enabled ? 'bg-green-600' : ''}>{w.enabled ? 'enabled' : 'disabled'}</Badge>
                                <span className="ml-2">Created: {new Date(w.createdAt).toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-xs text-slate-600">Secret</Label>
                                <code className="text-xs bg-slate-100 px-2 py-1 rounded border font-mono">
                                  {showSecrets[w.id] ? w.secret : '•'.repeat(24)}
                                </code>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowSecrets(prev => ({ ...prev, [w.id]: !prev[w.id] }))}>
                                  {showSecrets[w.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => navigator.clipboard.writeText(w.secret)}>
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={() => sendTestEvent(w.id)}>
                                  <RefreshCw className="w-4 h-4 mr-1" />
                                  Send Test
                                </Button>
                                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700" onClick={() => regenerateWebhookSecret(w.id)}>
                                  <RefreshCw className="w-4 h-4 mr-1" />
                                  Rotate Secret
                                </Button>
                                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700" onClick={() => toggleWebhook(w.id)}>
                                  {w.enabled ? 'Disable' : 'Enable'}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => removeWebhook(w.id)}>
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
              </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
