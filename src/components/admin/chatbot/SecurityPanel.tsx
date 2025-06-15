
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Key, 
  Users, 
  Lock, 
  Eye, 
  EyeOff,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const SecurityPanel = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'OpenAI Production', provider: 'OpenAI', masked: 'sk-...x7j9', created: '2024-06-01', status: 'active' },
    { id: '2', name: 'Anthropic Dev', provider: 'Anthropic', masked: 'sk-ant-...k8m2', created: '2024-06-05', status: 'active' }
  ]);

  const [accessRoles] = useState([
    { id: '1', name: 'Bot Administrator', permissions: ['create', 'edit', 'delete', 'view_keys'], users: 3 },
    { id: '2', name: 'Bot Editor', permissions: ['edit', 'view'], users: 7 },
    { id: '3', name: 'Bot Viewer', permissions: ['view'], users: 12 }
  ]);

  const [securitySettings, setSecuritySettings] = useState({
    encryptSOPs: true,
    auditLogging: true,
    mfaRequired: false,
    sessionTimeout: 30,
    ipWhitelist: false
  });

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const updateSecuritySetting = (key: string, value: boolean | number) => {
    setSecuritySettings({
      ...securitySettings,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Security & Access Controls</h2>
          <p className="text-gray-600 mt-1">Manage API keys, SOP access, and role-based permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm text-green-600 font-medium">Security Status: Good</span>
        </div>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="access-control" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Access Control
          </TabsTrigger>
          <TabsTrigger value="data-security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Data Security
          </TabsTrigger>
          <TabsTrigger value="audit-logs" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>LLM Provider API Keys</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add API Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map(key => (
                  <div key={key.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Key className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{key.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{key.provider}</Badge>
                          <span className="text-sm text-gray-500">{key.masked}</span>
                          <Badge className={key.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {key.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Created: {key.created}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteApiKey(key.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Key Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Rotate Keys Automatically</Label>
                  <p className="text-sm text-gray-600">Auto-rotate API keys every 90 days</p>
                </div>
                <Switch 
                  checked={securitySettings.encryptSOPs}
                  onCheckedChange={(checked) => updateSecuritySetting('encryptSOPs', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Key Usage Monitoring</Label>
                  <p className="text-sm text-gray-600">Monitor and alert on unusual API usage</p>
                </div>
                <Switch 
                  checked={securitySettings.auditLogging}
                  onCheckedChange={(checked) => updateSecuritySetting('auditLogging', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Control Tab */}
        <TabsContent value="access-control" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Role-Based Access Control</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessRoles.map(role => (
                  <div key={role.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">{role.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {role.permissions.map(permission => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{role.users} users assigned</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Security Tab */}
        <TabsContent value="data-security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Protection Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Encrypt SOP Documents</Label>
                  <p className="text-sm text-gray-600">Encrypt all uploaded SOP files at rest</p>
                </div>
                <Switch 
                  checked={securitySettings.encryptSOPs}
                  onCheckedChange={(checked) => updateSecuritySetting('encryptSOPs', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Audit Logging</Label>
                  <p className="text-sm text-gray-600">Log all chatbot interactions and admin actions</p>
                </div>
                <Switch 
                  checked={securitySettings.auditLogging}
                  onCheckedChange={(checked) => updateSecuritySetting('auditLogging', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Multi-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Require MFA for all admin users</p>
                </div>
                <Switch 
                  checked={securitySettings.mfaRequired}
                  onCheckedChange={(checked) => updateSecuritySetting('mfaRequired', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
                  className="w-32"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>IP Whitelist</Label>
                  <p className="text-sm text-gray-600">Restrict access to specific IP addresses</p>
                </div>
                <Switch 
                  checked={securitySettings.ipWhitelist}
                  onCheckedChange={(checked) => updateSecuritySetting('ipWhitelist', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance & Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-green-800">SOC 2</p>
                  <p className="text-xs text-green-600">Compliant</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-green-800">GDPR</p>
                  <p className="text-xs text-green-600">Compliant</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-green-800">HIPAA</p>
                  <p className="text-xs text-green-600">Ready</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium text-blue-800">ISO 27001</p>
                  <p className="text-xs text-blue-600">Certified</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit-logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: '2024-06-15 14:30:25', action: 'API Key Created', user: 'admin@company.com', severity: 'info' },
                  { time: '2024-06-15 13:45:12', action: 'SOP Document Uploaded', user: 'manager@company.com', severity: 'info' },
                  { time: '2024-06-15 12:20:33', action: 'Failed Login Attempt', user: 'unknown@domain.com', severity: 'warning' },
                  { time: '2024-06-15 11:15:45', action: 'Chatbot Configuration Modified', user: 'admin@company.com', severity: 'info' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {log.severity === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-gray-500">{log.user} • {log.time}</p>
                      </div>
                    </div>
                    <Badge className={log.severity === 'warning' ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                      {log.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
