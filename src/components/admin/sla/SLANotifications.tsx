import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CreateTemplateDialog } from './CreateTemplateDialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Settings,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

export const SLANotifications = () => {
  const [selectedTab, setSelectedTab] = useState('templates');
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);

  const [notificationTemplates, setNotificationTemplates] = useState([
    {
      id: '1',
      name: 'SLA Breach Alert - Agent',
      type: 'breach-alert',
      recipients: 'agent',
      channels: ['email', 'in-app'],
      isActive: true,
      template: 'Case #{case_id} has breached its SLA target. Please take immediate action.'
    },
    {
      id: '2',
      name: 'SLA Warning - Customer',
      type: 'sla-warning',
      recipients: 'customer',
      channels: ['email', 'sms'],
      isActive: true,
      template: 'Your case #{case_id} is being prioritized and will be resolved soon.'
    },
    {
      id: '3',
      name: 'Escalation Notice - Management',
      type: 'escalation',
      recipients: 'management',
      channels: ['email', 'in-app'],
      isActive: true,
      template: 'Case #{case_id} has been escalated due to SLA breach.'
    }
  ]);

  const handleCreateTemplate = () => {
    setIsCreateTemplateOpen(true);
  };

  const handleTemplateCreated = (newTemplate: any) => {
    setNotificationTemplates([...notificationTemplates, newTemplate]);
  };

  const notificationSettings = [
    {
      category: 'Agent Notifications',
      settings: [
        { name: 'Case Assignment', enabled: true, channels: ['in-app', 'email'] },
        { name: 'SLA Breach Warning', enabled: true, channels: ['in-app', 'email', 'sms'] },
        { name: 'Escalation Received', enabled: true, channels: ['in-app', 'email'] },
        { name: 'Customer Response', enabled: true, channels: ['in-app'] }
      ]
    },
    {
      category: 'Customer Notifications',
      settings: [
        { name: 'Case Status Updates', enabled: true, channels: ['email'] },
        { name: 'Escalation Notice', enabled: true, channels: ['email', 'sms'] },
        { name: 'Resolution Delay', enabled: true, channels: ['email'] },
        { name: 'Case Resolved', enabled: true, channels: ['email', 'sms'] }
      ]
    },
    {
      category: 'Management Alerts',
      settings: [
        { name: 'SLA Breach Patterns', enabled: true, channels: ['email'] },
        { name: 'High Priority Escalations', enabled: true, channels: ['email', 'sms'] },
        { name: 'Daily SLA Summary', enabled: true, channels: ['email'] },
        { name: 'Team Performance Alerts', enabled: true, channels: ['email'] }
      ]
    }
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-3 h-3" />;
      case 'sms': return <Smartphone className="w-3 h-3" />;
      case 'in-app': return <Bell className="w-3 h-3" />;
      default: return <Bell className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'breach-alert': return 'bg-red-100 text-red-800';
      case 'sla-warning': return 'bg-yellow-100 text-yellow-800';
      case 'escalation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">SLA Notifications</h2>
          <p className="text-sm text-slate-600 mt-1">Configure notification templates and delivery settings for SLA events</p>
        </div>
        <Button onClick={handleCreateTemplate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setSelectedTab('templates')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            selectedTab === 'templates'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setSelectedTab('settings')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            selectedTab === 'settings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Settings
        </button>
        <button
          onClick={() => setSelectedTab('channels')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            selectedTab === 'channels'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Channels
        </button>
      </div>

      {/* Templates Tab */}
      {selectedTab === 'templates' && (
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Mail className="w-5 h-5 text-blue-600" />
              Notification Templates
            </CardTitle>
            <CardDescription>
              Customize message templates for different SLA notification types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Channels</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notificationTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(template.type)}>
                        {template.type.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{template.recipients}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {template.channels.map((channel, index) => (
                          <div key={index} className="p-1 bg-gray-100 rounded" title={channel}>
                            {getChannelIcon(channel)}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Settings Tab */}
      {selectedTab === 'settings' && (
        <div className="space-y-6">
          {notificationSettings.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <Settings className="w-5 h-5 text-blue-600" />
                  {category.category}
                </CardTitle>
                <CardDescription>
                  Configure notification preferences for {category.category.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Switch checked={setting.enabled} />
                        <div>
                          <p className="font-medium text-gray-900">{setting.name}</p>
                          <div className="flex gap-1 mt-1">
                            {setting.channels.map((channel, channelIndex) => (
                              <div key={channelIndex} className="p-1 bg-white rounded border" title={channel}>
                                {getChannelIcon(channel)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Channels Tab */}
      {selectedTab === 'channels' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email Configuration */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Mail className="w-5 h-5 text-blue-600" />
                Email Settings
              </CardTitle>
              <CardDescription>Configure email delivery settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="smtp-server">SMTP Server</Label>
                <Input id="smtp-server" value="smtp.trichat.com" readOnly />
              </div>
              <div>
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" value="notifications@trichat.com" />
              </div>
              <div>
                <Label htmlFor="reply-to">Reply To</Label>
                <Input id="reply-to" value="support@trichat.com" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="email-enabled" defaultChecked />
                <Label htmlFor="email-enabled">Enable Email Notifications</Label>
              </div>
            </CardContent>
          </Card>

          {/* SMS Configuration */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Smartphone className="w-5 h-5 text-green-600" />
                SMS Settings
              </CardTitle>
              <CardDescription>Configure SMS delivery settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sms-provider">SMS Provider</Label>
                <Select defaultValue="twilio">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="aws-sns">AWS SNS</SelectItem>
                    <SelectItem value="nexmo">Nexmo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sender-id">Sender ID</Label>
                <Input id="sender-id" value="TRICHAT" />
              </div>
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" value="••••••••••••" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="sms-enabled" defaultChecked />
                <Label htmlFor="sms-enabled">Enable SMS Notifications</Label>
              </div>
            </CardContent>
          </Card>

          {/* In-App Configuration */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Bell className="w-5 h-5 text-purple-600" />
                In-App Settings
              </CardTitle>
              <CardDescription>Configure in-app notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="retention-days">Retention (Days)</Label>
                <Input id="retention-days" type="number" value="30" />
              </div>
              <div>
                <Label htmlFor="sound-alerts">Sound Alerts</Label>
                <Select defaultValue="enabled">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                    <SelectItem value="urgent-only">Urgent Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="browser-notifications" defaultChecked />
                <Label htmlFor="browser-notifications">Browser Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="desktop-alerts" defaultChecked />
                <Label htmlFor="desktop-alerts">Desktop Alerts</Label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <CreateTemplateDialog
        open={isCreateTemplateOpen}
        onOpenChange={setIsCreateTemplateOpen}
        onTemplateCreated={handleTemplateCreated}
      />
    </div>
  );
};
