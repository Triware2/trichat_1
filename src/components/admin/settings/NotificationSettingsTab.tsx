
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { NotificationSettings } from './types';
import { Bell, Mail, Smartphone, Webhook, Clock, Volume2 } from 'lucide-react';

interface NotificationSettingsTabProps {
  settings: NotificationSettings;
  onUpdate: (updates: Partial<NotificationSettings>) => void;
  onTestWebhook?: () => void;
}

export const NotificationSettingsTab = ({ settings, onUpdate, onTestWebhook }: NotificationSettingsTabProps) => {
  const notificationFrequencies = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ];

  return (
    <div className="space-y-8">
      {/* Email Notifications */}
      <Card className="border border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            Email Notifications
          </CardTitle>
          <CardDescription className="text-sm">Configure email-based notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">Email Alerts</Label>
                <p className="text-xs text-slate-600">Receive notifications via email</p>
              </div>
              <Switch 
                checked={settings.emailAlerts}
                onCheckedChange={(checked) => onUpdate({ emailAlerts: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">System Notifications</Label>
                <p className="text-xs text-slate-600">Receive system status and maintenance alerts</p>
              </div>
              <Switch 
                checked={settings.systemNotifications}
                onCheckedChange={(checked) => onUpdate({ systemNotifications: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">Security Alerts</Label>
                <p className="text-xs text-slate-600">Receive security and authentication alerts</p>
              </div>
              <Switch 
                checked={settings.securityAlerts}
                onCheckedChange={(checked) => onUpdate({ securityAlerts: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="border border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-green-50 rounded-lg">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            Push Notifications
          </CardTitle>
          <CardDescription className="text-sm">Configure in-app and browser push notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">Push Notifications</Label>
                <p className="text-xs text-slate-600">Enable browser push notifications</p>
              </div>
              <Switch 
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => onUpdate({ pushNotifications: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">In-App Notifications</Label>
                <p className="text-xs text-slate-600">Show notifications within the application</p>
              </div>
              <Switch 
                checked={settings.inAppNotifications}
                onCheckedChange={(checked) => onUpdate({ inAppNotifications: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card className="border border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Smartphone className="w-5 h-5 text-purple-600" />
            </div>
            SMS Notifications
          </CardTitle>
          <CardDescription className="text-sm">Configure SMS-based notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">SMS Alerts</Label>
                <p className="text-xs text-slate-600">Receive critical notifications via SMS</p>
              </div>
              <Switch 
                checked={settings.smsAlerts}
                onCheckedChange={(checked) => onUpdate({ smsAlerts: checked })}
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="smsNumber" className="text-sm font-semibold text-slate-900">SMS Number</Label>
              <Input
                id="smsNumber"
                value={settings.smsNumber}
                onChange={(e) => onUpdate({ smsNumber: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500">Primary phone number for SMS notifications</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Integration */}
      <Card className="border border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Webhook className="w-5 h-5 text-orange-600" />
            </div>
            Webhook Integration
          </CardTitle>
          <CardDescription className="text-sm">Configure webhook endpoints for external integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="webhookUrl" className="text-sm font-semibold text-slate-900">Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={settings.webhookUrl}
              onChange={(e) => onUpdate({ webhookUrl: e.target.value })}
              placeholder="https://your-webhook-endpoint.com/notifications"
              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500">Endpoint URL for receiving notification webhooks</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={onTestWebhook}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Webhook className="w-4 h-4 mr-2" />
              Test Webhook
            </Button>
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
              <Volume2 className="w-4 h-4 mr-2" />
              View Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Frequency */}
      <Card className="border border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            Notification Frequency
          </CardTitle>
          <CardDescription className="text-sm">Configure how often notifications are sent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="notificationFrequency" className="text-sm font-semibold text-slate-900">Frequency</Label>
            <Select value={settings.notificationFrequency} onValueChange={(value) => onUpdate({ notificationFrequency: value })}>
              <SelectTrigger className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select notification frequency" />
              </SelectTrigger>
              <SelectContent>
                {notificationFrequencies.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value} className="py-3">
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">How often to send batched notifications</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
