
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SecuritySettings } from './types';

interface SecuritySettingsTabProps {
  settings: SecuritySettings;
  onUpdate: (updates: Partial<SecuritySettings>) => void;
}

export const SecuritySettingsTab = ({ settings, onUpdate }: SecuritySettingsTabProps) => {
  return (
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
              value={settings.sessionTimeout}
              onChange={(e) => onUpdate({ sessionTimeout: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordPolicy">Password Policy</Label>
            <Select 
              value={settings.passwordPolicy}
              onValueChange={(value) => onUpdate({ passwordPolicy: value })}
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
            checked={settings.twoFactorAuth}
            onChange={(e) => onUpdate({ twoFactorAuth: e.target.checked })}
            className="w-4 h-4"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ipWhitelist">IP Whitelist</Label>
          <Textarea
            id="ipWhitelist"
            value={settings.ipWhitelist}
            onChange={(e) => onUpdate({ ipWhitelist: e.target.value })}
            placeholder="192.168.1.0/24&#10;10.0.0.0/8"
            rows={3}
          />
          <p className="text-sm text-gray-500">Enter IP addresses or ranges (one per line)</p>
        </div>
      </CardContent>
    </Card>
  );
};
