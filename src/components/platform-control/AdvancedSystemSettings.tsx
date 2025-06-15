
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Database, 
  Cloud, 
  Shield, 
  Zap, 
  Globe, 
  Bell,
  Code,
  Server,
  Lock,
  Activity,
  Mail
} from 'lucide-react';

export const AdvancedSystemSettings = () => {
  const [settings, setSettings] = useState({
    // System Configuration
    maxConcurrentChats: [500],
    autoScaling: true,
    loadBalancing: true,
    cacheEnabled: true,
    
    // Security Settings
    twoFactorRequired: false,
    sessionTimeout: [30],
    passwordPolicy: 'strict',
    
    // Performance Settings
    responseTimeout: [5000],
    maxFileSize: [10],
    compressionEnabled: true,
    
    // Email Configuration
    emailProvider: 'sendgrid',
    smtpSettings: {
      host: '',
      port: '',
      username: '',
      password: ''
    },
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: [30],
    
    // Feature Flags
    features: {
      aiChatbot: true,
      voiceSupport: false,
      videoCall: true,
      fileSharing: true,
      analytics: true
    }
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateFeature = (feature, enabled) => {
    setSettings(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: enabled }
    }));
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50/30 to-white min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Advanced System Configuration</h1>
          </div>
          <p className="text-gray-600 ml-12">Fine-tune every aspect of your platform</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            Reset to Defaults
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
            Save All Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Performance Tuning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Concurrent Chats: {settings.maxConcurrentChats[0]}
                  </label>
                  <Slider
                    value={settings.maxConcurrentChats}
                    onValueChange={(value) => updateSetting('maxConcurrentChats', value)}
                    max={2000}
                    min={100}
                    step={50}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Timeout (ms): {settings.responseTimeout[0]}
                  </label>
                  <Slider
                    value={settings.responseTimeout}
                    onValueChange={(value) => updateSetting('responseTimeout', value)}
                    max={30000}
                    min={1000}
                    step={1000}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max File Size (MB): {settings.maxFileSize[0]}
                  </label>
                  <Slider
                    value={settings.maxFileSize}
                    onValueChange={(value) => updateSetting('maxFileSize', value)}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-600" />
                  System Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Auto Scaling</label>
                  <Switch
                    checked={settings.autoScaling}
                    onCheckedChange={(checked) => updateSetting('autoScaling', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Load Balancing</label>
                  <Switch
                    checked={settings.loadBalancing}
                    onCheckedChange={(checked) => updateSetting('loadBalancing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Cache Enabled</label>
                  <Switch
                    checked={settings.cacheEnabled}
                    onCheckedChange={(checked) => updateSetting('cacheEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Compression</label>
                  <Switch
                    checked={settings.compressionEnabled}
                    onCheckedChange={(checked) => updateSetting('compressionEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Security Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Require 2FA</label>
                  <Switch
                    checked={settings.twoFactorRequired}
                    onCheckedChange={(checked) => updateSetting('twoFactorRequired', checked)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes): {settings.sessionTimeout[0]}
                  </label>
                  <Slider
                    value={settings.sessionTimeout}
                    onValueChange={(value) => updateSetting('sessionTimeout', value)}
                    max={480}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
                  <Select 
                    value={settings.passwordPolicy} 
                    onValueChange={(value) => updateSetting('passwordPolicy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                      <SelectItem value="standard">Standard (8+ chars, mixed case)</SelectItem>
                      <SelectItem value="strict">Strict (12+ chars, symbols, numbers)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gray-600" />
                  Access Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IP Whitelist</label>
                    <Textarea 
                      placeholder="Enter IP addresses (one per line)"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Rate Limits</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Requests per minute" />
                      <Input placeholder="Burst limit" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-600" />
                Feature Toggles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(settings.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">
                        {feature.replace(/([A-Z])/g, ' $1')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getFeatureDescription(feature)}
                      </p>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => updateFeature(feature, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Provider</label>
                  <Select 
                    value={settings.emailProvider} 
                    onValueChange={(value) => updateSetting('emailProvider', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                      <SelectItem value="smtp">Custom SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                    <Input placeholder="smtp.example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
                    <Input placeholder="587" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <Input placeholder="username" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <Input type="password" placeholder="password" />
                  </div>
                </div>

                <Button>Test Email Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-600" />
                Backup & Recovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Auto Backup</label>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => updateSetting('autoBackup', checked)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                  <Select 
                    value={settings.backupFrequency} 
                    onValueChange={(value) => updateSetting('backupFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retention Period (days): {settings.retentionPeriod[0]}
                  </label>
                  <Slider
                    value={settings.retentionPeriod}
                    onValueChange={(value) => updateSetting('retentionPeriod', value)}
                    max={365}
                    min={7}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <Button>Create Backup Now</Button>
                  <Button variant="outline">Restore from Backup</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom API Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Define custom API endpoints (JSON format)"
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <Button>Deploy Custom APIs</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CPU Usage</span>
                    <Badge variant="secondary">45%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Memory Usage</span>
                    <Badge variant="secondary">62%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Disk Usage</span>
                    <Badge variant="secondary">38%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Network I/O</span>
                    <Badge variant="secondary">Normal</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const getFeatureDescription = (feature) => {
  const descriptions = {
    aiChatbot: 'AI-powered chat responses',
    voiceSupport: 'Voice call functionality',
    videoCall: 'Video conferencing support',
    fileSharing: 'File upload and sharing',
    analytics: 'Advanced analytics dashboard'
  };
  return descriptions[feature] || 'Feature description';
};
