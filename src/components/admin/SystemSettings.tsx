import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Database,
  Mail,
  Key,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    general: {
      companyName: 'SupportPro',
      supportEmail: 'support@supportpro.com',
      timeZone: 'UTC',
      language: 'en',
      maxAgents: 50
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      smsAlerts: false,
      webhookUrl: ''
    },
    security: {
      sessionTimeout: 30,
      passwordPolicy: 'strong',
      twoFactorAuth: true,
      ipWhitelist: ''
    },
    integrations: {
      emailProvider: 'sendgrid',
      apiKey: '',
      webhookSecret: '',
      crmIntegration: 'none'
    }
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);

  const handleSaveSettings = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Your system settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const testEmailConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Connection Successful",
        description: "Email provider connection is working correctly.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to email provider. Please check your settings.",
        variant: "destructive"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const createBackup = async () => {
    setBackupInProgress(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "Backup Created",
        description: "System backup completed successfully. Download link sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "Failed to create system backup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setBackupInProgress(false);
    }
  };

  const resetToDefaults = () => {
    setSettings({
      general: {
        companyName: 'TriChat',
        supportEmail: 'support@trichat.com',
        timeZone: 'UTC',
        language: 'en',
        maxAgents: 50
      },
      notifications: {
        emailAlerts: true,
        pushNotifications: true,
        smsAlerts: false,
        webhookUrl: ''
      },
      security: {
        sessionTimeout: 30,
        passwordPolicy: 'strong',
        twoFactorAuth: true,
        ipWhitelist: ''
      },
      integrations: {
        emailProvider: 'sendgrid',
        apiKey: '',
        webhookSecret: '',
        crmIntegration: 'none'
      }
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="text-gray-600">Configure your system preferences and integrations</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic system configuration and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.general.companyName}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, companyName: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, supportEmail: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeZone">Time Zone</Label>
                  <Select 
                    value={settings.general.timeZone}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      general: { ...settings.general, timeZone: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select 
                    value={settings.general.language}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      general: { ...settings.general, language: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAgents">Maximum Concurrent Agents</Label>
                <Input
                  id="maxAgents"
                  type="number"
                  value={settings.general.maxAgents}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, maxAgents: parseInt(e.target.value) }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailAlerts">Email Alerts</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <input
                    id="emailAlerts"
                    type="checkbox"
                    checked={settings.notifications.emailAlerts}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailAlerts: e.target.checked }
                    })}
                    className="w-4 h-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Browser push notifications</p>
                  </div>
                  <input
                    id="pushNotifications"
                    type="checkbox"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, pushNotifications: e.target.checked }
                    })}
                    className="w-4 h-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsAlerts">SMS Alerts</Label>
                    <p className="text-sm text-gray-500">Text message notifications</p>
                  </div>
                  <input
                    id="smsAlerts"
                    type="checkbox"
                    checked={settings.notifications.smsAlerts}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, smsAlerts: e.target.checked }
                    })}
                    className="w-4 h-4"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={settings.notifications.webhookUrl}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, webhookUrl: e.target.value }
                  })}
                  placeholder="https://your-webhook-url.com"
                />
                <p className="text-sm text-gray-500">Optional: URL to receive webhook notifications</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordPolicy">Password Policy</Label>
                  <Select 
                    value={settings.security.passwordPolicy}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      security: { ...settings.security, passwordPolicy: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (6+ characters)</SelectItem>
                      <SelectItem value="strong">Strong (8+ chars, mixed case, numbers)</SelectItem>
                      <SelectItem value="complex">Complex (12+ chars, special chars)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Require 2FA for all users</p>
                </div>
                <input
                  id="twoFactorAuth"
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, twoFactorAuth: e.target.checked }
                  })}
                  className="w-4 h-4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Textarea
                  id="ipWhitelist"
                  value={settings.security.ipWhitelist}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, ipWhitelist: e.target.value }
                  })}
                  placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                  rows={3}
                />
                <p className="text-sm text-gray-500">Enter IP addresses or ranges (one per line)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>
                Connect with external services and APIs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailProvider">Email Provider</Label>
                  <Select 
                    value={settings.integrations.emailProvider}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      integrations: { ...settings.integrations, emailProvider: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                      <SelectItem value="smtp">Custom SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crmIntegration">CRM Integration</Label>
                  <Select 
                    value={settings.integrations.crmIntegration}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      integrations: { ...settings.integrations, crmIntegration: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select CRM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="salesforce">Salesforce</SelectItem>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="pipedrive">Pipedrive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={settings.integrations.apiKey}
                  onChange={(e) => setSettings({
                    ...settings,
                    integrations: { ...settings.integrations, apiKey: e.target.value }
                  })}
                  placeholder="Enter your API key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhookSecret">Webhook Secret</Label>
                <Input
                  id="webhookSecret"
                  type="password"
                  value={settings.integrations.webhookSecret}
                  onChange={(e) => setSettings({
                    ...settings,
                    integrations: { ...settings.integrations, webhookSecret: e.target.value }
                  })}
                  placeholder="Enter webhook secret"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={resetToDefaults} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};
