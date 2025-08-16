import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Key, 
  Shield, 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw, 
  Trash2, 
  Plus,
  Activity,
  Users,
  Lock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  BarChart3,
  ShieldCheck,
  KeyRound,
  Database,
  Network,
  Globe,
  Smartphone,
  Monitor,
  Server
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { chatbotService } from '@/services/chatbotService';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'inactive' | 'expired';
  permissions: string[];
  lastUsed: string;
  createdAt: string;
  expiresAt?: string;
  usageCount: number;
  ipWhitelist?: string[];
  rateLimit?: number;
}

interface SecuritySettings {
  mfaEnabled: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
  encryptionLevel: 'standard' | 'enhanced' | 'enterprise';
  auditLogging: boolean;
  dataRetention: number;
}

interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userEmail: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function SecurityPanel() {
  const [activeTab, setActiveTab] = useState('api-keys');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    mfaEnabled: false,
    sessionTimeout: 30,
    ipWhitelist: [],
    encryptionLevel: 'standard',
    auditLogging: true,
    dataRetention: 90
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Available permissions
  const availablePermissions = [
    { id: 'chat:read', label: 'Read Chat Data', description: 'Access to read chat conversations' },
    { id: 'chat:write', label: 'Write Chat Data', description: 'Ability to send messages' },
    { id: 'analytics:read', label: 'Read Analytics', description: 'Access to analytics data' },
    { id: 'settings:read', label: 'Read Settings', description: 'View system settings' },
    { id: 'settings:write', label: 'Write Settings', description: 'Modify system settings' },
    { id: 'users:read', label: 'Read Users', description: 'View user information' },
    { id: 'users:write', label: 'Write Users', description: 'Manage users' },
    { id: 'admin:full', label: 'Full Admin Access', description: 'Complete system access' }
  ];

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      // Load API keys
      const keys = await chatbotService.getApiKeys();
      setApiKeys(keys || []);

      // Load security settings
      const settings = await chatbotService.getSecuritySettings();
      if (settings) {
        setSecuritySettings({
          mfaEnabled: settings.mfa_enabled || false,
          sessionTimeout: settings.session_timeout || 30,
          ipWhitelist: settings.ip_whitelist || [],
          encryptionLevel: settings.encryption_level || 'standard',
          auditLogging: settings.audit_logging !== false,
          dataRetention: settings.data_retention || 90
        });
      }

      // Load audit logs
      const logs = await chatbotService.getAuditLogs();
      setAuditLogs(logs || []);
    } catch (error) {
      console.error('Error loading security data:', error);
      toast({
        title: "Error",
        description: "Failed to load security data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a key name",
        variant: "destructive"
      });
      return;
    }

    try {
      const newKey = await chatbotService.generateApiKey({
        name: newKeyName,
        permissions: newKeyPermissions
      });
      
      setApiKeys(prev => [newKey, ...prev]);
      setNewKeyName('');
      setNewKeyPermissions([]);
      
      toast({
        title: "Success",
        description: "API key generated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive"
      });
    }
  };

  const revokeApiKey = async (keyId: string) => {
    try {
      await chatbotService.revokeApiKey(keyId);
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      
      toast({
        title: "Success",
        description: "API key revoked successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard"
    });
  };

  const updateSecuritySettings = async (settings: Partial<SecuritySettings>) => {
    try {
      const updated = await chatbotService.updateSecuritySettings({
        ...securitySettings,
        ...settings
      });
      setSecuritySettings(updated);
      
      toast({
        title: "Success",
        description: "Security settings updated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings",
        variant: "destructive"
      });
    }
  };

  const filteredApiKeys = (apiKeys || []).filter(key => {
    if (!key) return false;
    const matchesSearch = key.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = filterStatus === 'all' || key.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Security Center</h2>
          <p className="text-slate-600 mt-1">Manage API keys, access control, and security settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadSecurityData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-slate-600">Loading security data...</p>
          </div>
        </div>
      )}

      {!loading && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="sticky top-0 z-10">
            <TabsList className="flex w-full justify-start gap-2 bg-gradient-to-r from-slate-50/90 to-blue-50/80 shadow-md rounded-full px-2 py-2 mb-4">
              <TabsTrigger
                value="api-keys"
                className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium data-[state=active]:font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:ring-2 data-[state=active]:ring-blue-200 data-[state=active]:ring-inset text-slate-600 hover:bg-white/70 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              >
                <Key className="h-5 w-5 transition-colors duration-200 data-[state=active]:text-blue-600 text-slate-400" />
                <span>API Keys</span>
              </TabsTrigger>
              <TabsTrigger
                value="access-control"
                className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium data-[state=active]:font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:ring-2 data-[state=active]:ring-blue-200 data-[state=active]:ring-inset text-slate-600 hover:bg-white/70 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              >
                <Users className="h-5 w-5 transition-colors duration-200 data-[state=active]:text-blue-600 text-slate-400" />
                <span>Access Control</span>
              </TabsTrigger>
              <TabsTrigger
                value="data-security"
                className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium data-[state=active]:font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:ring-2 data-[state=active]:ring-blue-200 data-[state=active]:ring-inset text-slate-600 hover:bg-white/70 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              >
                <Shield className="h-5 w-5 transition-colors duration-200 data-[state=active]:text-blue-600 text-slate-400" />
                <span>Data Security</span>
              </TabsTrigger>
              <TabsTrigger
                value="audit-logs"
                className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium data-[state=active]:font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:ring-2 data-[state=active]:ring-blue-200 data-[state=active]:ring-inset text-slate-600 hover:bg-white/70 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              >
                <FileText className="h-5 w-5 transition-colors duration-200 data-[state=active]:text-blue-600 text-slate-400" />
                <span>Audit Logs</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  <Key className="h-5 w-5" />
                  <span>API Key Management</span>
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Generate and manage API keys for secure access to your chatbot services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Generate New Key */}
                <div className="border rounded-2xl p-6 bg-slate-50">
                  <h3 className="font-semibold text-slate-900 mb-4 text-lg">Generate New API Key</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="keyName" className="text-sm font-medium text-slate-700">Key Name</Label>
                      <Input
                        id="keyName"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Enter a descriptive name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700">Permissions</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {availablePermissions.map(permission => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={permission.id}
                              checked={newKeyPermissions.includes(permission.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewKeyPermissions(prev => [...prev, permission.id]);
                                } else {
                                  setNewKeyPermissions(prev => prev.filter(p => p !== permission.id));
                                }
                              }}
                              className="rounded"
                            />
                            <Label htmlFor={permission.id} className="text-sm text-slate-700">
                              {permission.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button onClick={generateApiKey} className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate API Key
                  </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search API keys..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                {/* API Keys List */}
                <div className="space-y-4">
                  {filteredApiKeys.map(key => {
                    if (!key) return null;
                    return (
                      <Card key={key.id || Math.random()} className="border-l-4 border-l-blue-500 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm rounded-2xl">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h4 className="font-semibold text-slate-900">{key.name || 'Unnamed Key'}</h4>
                                <Badge className={getStatusColor(key.status || 'inactive')}>
                                  {key.status || 'inactive'}
                                </Badge>
                              </div>
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-slate-600">Key:</span>
                                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                    {showKey === key.id ? (key.key || 'No key') : `${(key.key || '').substring(0, 8)}...`}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                                  >
                                    {showKey === key.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(key.key || '')}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="text-sm text-slate-600">
                                  Created: {key.createdAt ? new Date(key.createdAt).toLocaleDateString() : 'Unknown'} | 
                                  Last used: {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'} |
                                  Usage: {key.usageCount || 0} times
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {(key.permissions || []).map(permission => (
                                    <Badge key={permission} variant="outline" className="text-xs">
                                      {permission}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => revokeApiKey(key.id || '')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Control Tab */}
          <TabsContent value="access-control" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  <Users className="h-5 w-5" />
                  <span>Access Control</span>
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Configure role-based access control and user permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 text-lg">Multi-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Enable MFA</p>
                        <p className="text-sm text-slate-600">Require two-factor authentication for all users</p>
                      </div>
                      <Switch
                        checked={securitySettings.mfaEnabled}
                        onCheckedChange={(checked) => updateSecuritySettings({ mfaEnabled: checked })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 text-lg">Session Management</h3>
                    <div>
                      <Label htmlFor="sessionTimeout" className="text-sm font-medium text-slate-700">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => updateSecuritySettings({ sessionTimeout: parseInt(e.target.value) })}
                        min="5"
                        max="480"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 text-lg">IP Whitelist</h3>
                  <div className="space-y-2">
                    {securitySettings.ipWhitelist.map((ip, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input value={ip} readOnly className="bg-white/80 border border-slate-200" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newList = securitySettings.ipWhitelist.filter((_, i) => i !== index);
                            updateSecuritySettings({ ipWhitelist: newList });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add IP Address
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Security Tab */}
          <TabsContent value="data-security" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  <Shield className="h-5 w-5" />
                  <span>Data Security</span>
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Configure encryption, data retention, and security policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 text-lg">Encryption Level</h3>
                    <select
                      value={securitySettings.encryptionLevel}
                      onChange={(e) => updateSecuritySettings({ encryptionLevel: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="standard">Standard (AES-256)</option>
                      <option value="enhanced">Enhanced (AES-256 + Key Rotation)</option>
                      <option value="enterprise">Enterprise (AES-256 + Hardware Security)</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 text-lg">Data Retention</h3>
                    <div>
                      <Label htmlFor="dataRetention" className="text-sm font-medium text-slate-700">Retention Period (days)</Label>
                      <Input
                        id="dataRetention"
                        type="number"
                        value={securitySettings.dataRetention}
                        onChange={(e) => updateSecuritySettings({ dataRetention: parseInt(e.target.value) })}
                        min="30"
                        max="3650"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 text-lg">Audit Logging</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Enable Audit Logs</p>
                      <p className="text-sm text-slate-600">Log all security-related activities</p>
                    </div>
                    <Switch
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) => updateSecuritySettings({ auditLogging: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit-logs" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  <FileText className="h-5 w-5" />
                  <span>Audit Logs</span>
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Monitor and review security events and user activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(auditLogs || []).map(log => {
                    if (!log) return null;
                    return (
                      <div key={log.id || Math.random()} className="border rounded-lg p-4 bg-white/70">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge className={getSeverityColor(log.severity || 'low')}>
                              {log.severity || 'low'}
                            </Badge>
                            <span className="font-medium text-slate-900">{log.action || 'Unknown Action'}</span>
                          </div>
                          <span className="text-sm text-slate-600">
                            {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Unknown Time'}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-slate-600">
                          <p>User: {log.userEmail || 'Unknown User'}</p>
                          <p>IP: {log.ipAddress || 'Unknown IP'}</p>
                          <p>Details: {log.details ? JSON.stringify(log.details) : 'No details'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 