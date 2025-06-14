
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NotificationSettings } from './types';

interface NotificationSettingsTabProps {
  settings: NotificationSettings;
  onUpdate: (updates: Partial<NotificationSettings>) => void;
}

export const NotificationSettingsTab = ({ settings, onUpdate }: NotificationSettingsTabProps) => {
  return (
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
              checked={settings.emailAlerts}
              onChange={(e) => onUpdate({ emailAlerts: e.target.checked })}
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
              checked={settings.pushNotifications}
              onChange={(e) => onUpdate({ pushNotifications: e.target.checked })}
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
              checked={settings.smsAlerts}
              onChange={(e) => onUpdate({ smsAlerts: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="webhookUrl">Webhook URL</Label>
          <Input
            id="webhookUrl"
            value={settings.webhookUrl}
            onChange={(e) => onUpdate({ webhookUrl: e.target.value })}
            placeholder="https://your-webhook-url.com"
          />
          <p className="text-sm text-gray-500">Optional: URL to receive webhook notifications</p>
        </div>
      </CardContent>
    </Card>
  );
};
