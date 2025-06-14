
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Bell, 
  Mail, 
  MessageSquare,
  Brain,
  Clock,
  Users
} from 'lucide-react';

export const CSATSettings = () => {
  const [settings, setSettings] = useState({
    autoSurveys: true,
    sentimentMonitoring: true,
    realTimeAlerts: true,
    escalationThreshold: 2.0,
    responseRate: 70,
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    surveyDelay: 30,
    reminderFrequency: 7
  });

  const { toast } = useToast();

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "CSAT configuration has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Survey Automation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Survey Automation
          </CardTitle>
          <CardDescription>Configure automated survey triggers and timing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Auto-send surveys</Label>
              <p className="text-sm text-gray-600">Automatically send surveys after interactions</p>
            </div>
            <Switch
              checked={settings.autoSurveys}
              onCheckedChange={(checked) => handleSettingChange('autoSurveys', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="surveyDelay">Survey Delay (minutes)</Label>
              <Input
                id="surveyDelay"
                type="number"
                value={settings.surveyDelay}
                onChange={(e) => handleSettingChange('surveyDelay', parseInt(e.target.value))}
                placeholder="30"
              />
              <p className="text-xs text-gray-500 mt-1">Time to wait before sending survey</p>
            </div>

            <div>
              <Label htmlFor="reminderFrequency">Reminder Frequency (days)</Label>
              <Input
                id="reminderFrequency"
                type="number"
                value={settings.reminderFrequency}
                onChange={(e) => handleSettingChange('reminderFrequency', parseInt(e.target.value))}
                placeholder="7"
              />
              <p className="text-xs text-gray-500 mt-1">Days between survey reminders</p>
            </div>
          </div>

          <div>
            <Label htmlFor="responseRate">Target Response Rate (%)</Label>
            <Input
              id="responseRate"
              type="number"
              value={settings.responseRate}
              onChange={(e) => handleSettingChange('responseRate', parseInt(e.target.value))}
              placeholder="70"
            />
            <p className="text-xs text-gray-500 mt-1">Target survey response rate threshold</p>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Sentiment Monitoring
          </CardTitle>
          <CardDescription>Configure sentiment analysis and escalation rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Real-time sentiment monitoring</Label>
              <p className="text-sm text-gray-600">Analyze customer sentiment during interactions</p>
            </div>
            <Switch
              checked={settings.sentimentMonitoring}
              onCheckedChange={(checked) => handleSettingChange('sentimentMonitoring', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Real-time alerts</Label>
              <p className="text-sm text-gray-600">Send alerts for negative sentiment detection</p>
            </div>
            <Switch
              checked={settings.realTimeAlerts}
              onCheckedChange={(checked) => handleSettingChange('realTimeAlerts', checked)}
            />
          </div>

          <div>
            <Label htmlFor="escalationThreshold">Escalation Threshold</Label>
            <Select
              value={settings.escalationThreshold.toString()}
              onValueChange={(value) => handleSettingChange('escalationThreshold', parseFloat(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.0">1.0 - Very Sensitive</SelectItem>
                <SelectItem value="1.5">1.5 - Sensitive</SelectItem>
                <SelectItem value="2.0">2.0 - Normal</SelectItem>
                <SelectItem value="2.5">2.5 - Moderate</SelectItem>
                <SelectItem value="3.0">3.0 - Conservative</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Sentiment score threshold for automatic escalation</p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure how and when notifications are sent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <div>
                  <Label className="text-base font-medium">Email notifications</Label>
                  <p className="text-sm text-gray-600">Send alerts and reports via email</p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <div>
                  <Label className="text-base font-medium">SMS notifications</Label>
                  <p className="text-sm text-gray-600">Send critical alerts via SMS</p>
                </div>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-600" />
                <div>
                  <Label className="text-base font-medium">In-app notifications</Label>
                  <p className="text-sm text-gray-600">Show notifications within the dashboard</p>
                </div>
              </div>
              <Switch
                checked={settings.inAppNotifications}
                onCheckedChange={(checked) => handleSettingChange('inAppNotifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            Integration Settings
          </CardTitle>
          <CardDescription>Configure integrations with external systems</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              placeholder="https://your-system.com/webhook"
            />
            <p className="text-xs text-gray-500 mt-1">Send CSAT data to external systems</p>
          </div>

          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your API key"
            />
            <p className="text-xs text-gray-500 mt-1">API key for external integrations</p>
          </div>

          <div>
            <Label htmlFor="customFields">Custom Fields Mapping</Label>
            <Textarea
              id="customFields"
              placeholder="Enter JSON mapping for custom fields"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">Map CSAT fields to your external system</p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
          Save Settings
        </Button>
      </div>
    </div>
  );
};
