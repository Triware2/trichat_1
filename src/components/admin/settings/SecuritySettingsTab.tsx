
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { SecuritySettings } from './types';
import { Shield, Lock, Key, Eye, AlertTriangle, Clock, Users } from 'lucide-react';

interface SecuritySettingsTabProps {
  settings: SecuritySettings;
  onUpdate: (updates: Partial<SecuritySettings>) => void;
}

export const SecuritySettingsTab = ({ settings, onUpdate }: SecuritySettingsTabProps) => {
  return (
    <div className="space-y-8">
      {/* Authentication Settings */}
      <Card className="border border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            Authentication Settings
          </CardTitle>
          <CardDescription className="text-sm">Configure user authentication and session management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="sessionTimeout" className="text-sm font-semibold text-slate-900">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => onUpdate({ sessionTimeout: parseInt(e.target.value) || 0 })}
                placeholder="30"
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500">Auto-logout after inactivity period</p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="maxLoginAttempts" className="text-sm font-semibold text-slate-900">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => onUpdate({ maxLoginAttempts: parseInt(e.target.value) || 0 })}
                placeholder="5"
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500">Maximum failed login attempts before lockout</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="lockoutDuration" className="text-sm font-semibold text-slate-900">Lockout Duration (minutes)</Label>
            <Input
              id="lockoutDuration"
              type="number"
              value={settings.lockoutDuration}
              onChange={(e) => onUpdate({ lockoutDuration: parseInt(e.target.value) || 0 })}
              placeholder="15"
              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500">Account lockout duration after max login attempts</p>
          </div>
        </CardContent>
      </Card>

      {/* Password Policy */}
      <Card className="border border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-green-50 rounded-lg">
              <Key className="w-5 h-5 text-green-600" />
            </div>
            Password Policy
          </CardTitle>
          <CardDescription className="text-sm">Configure password requirements and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="minPasswordLength" className="text-sm font-semibold text-slate-900">Minimum Length</Label>
              <Input
                id="minPasswordLength"
                type="number"
                value={settings.minPasswordLength}
                onChange={(e) => onUpdate({ minPasswordLength: parseInt(e.target.value) || 0 })}
                placeholder="8"
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500">Minimum password length requirement</p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="passwordExpiryDays" className="text-sm font-semibold text-slate-900">Password Expiry (days)</Label>
              <Input
                id="passwordExpiryDays"
                type="number"
                value={settings.passwordExpiryDays}
                onChange={(e) => onUpdate({ passwordExpiryDays: parseInt(e.target.value) || 0 })}
                placeholder="90"
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500">Days before password expires</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">Require Uppercase</Label>
                <p className="text-xs text-slate-600">Password must contain uppercase letters</p>
              </div>
              <Switch 
                checked={settings.requireUppercase}
                onCheckedChange={(checked) => onUpdate({ requireUppercase: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">Require Lowercase</Label>
                <p className="text-xs text-slate-600">Password must contain lowercase letters</p>
              </div>
              <Switch 
                checked={settings.requireLowercase}
                onCheckedChange={(checked) => onUpdate({ requireLowercase: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">Require Numbers</Label>
                <p className="text-xs text-slate-600">Password must contain numbers</p>
              </div>
              <Switch 
                checked={settings.requireNumbers}
                onCheckedChange={(checked) => onUpdate({ requireNumbers: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">Require Special Characters</Label>
                <p className="text-xs text-slate-600">Password must contain special characters</p>
              </div>
              <Switch 
                checked={settings.requireSpecialChars}
                onCheckedChange={(checked) => onUpdate({ requireSpecialChars: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="border border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            Two-Factor Authentication
          </CardTitle>
          <CardDescription className="text-sm">Configure multi-factor authentication settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">Enable 2FA</Label>
                <p className="text-xs text-slate-600">Require two-factor authentication for all users</p>
              </div>
              <Switch 
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => onUpdate({ twoFactorAuth: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">SMS 2FA</Label>
                <p className="text-xs text-slate-600">Allow SMS-based two-factor authentication</p>
              </div>
              <Switch 
                checked={settings.smsTwoFactor}
                onCheckedChange={(checked) => onUpdate({ smsTwoFactor: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">App 2FA</Label>
                <p className="text-xs text-slate-600">Allow authenticator app-based 2FA</p>
              </div>
              <Switch 
                checked={settings.appTwoFactor}
                onCheckedChange={(checked) => onUpdate({ appTwoFactor: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IP Security */}
      <Card className="border border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            IP Security
          </CardTitle>
          <CardDescription className="text-sm">Configure IP-based security restrictions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">IP Whitelist</Label>
                <p className="text-xs text-slate-600">Restrict access to specific IP addresses</p>
              </div>
              <Switch 
                checked={settings.ipWhitelist}
                onCheckedChange={(checked) => onUpdate({ ipWhitelist: checked })}
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="allowedIPs" className="text-sm font-semibold text-slate-900">Allowed IP Addresses</Label>
              <Input
                id="allowedIPs"
                value={settings.allowedIPs}
                onChange={(e) => onUpdate({ allowedIPs: e.target.value })}
                placeholder="192.168.1.0/24, 10.0.0.0/8"
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500">Comma-separated list of IP addresses or ranges (CIDR notation)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card className="border border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            Session Management
          </CardTitle>
          <CardDescription className="text-sm">Configure session and user management settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">Single Session</Label>
                <p className="text-xs text-slate-600">Allow only one active session per user</p>
              </div>
              <Switch 
                checked={settings.singleSession}
                onCheckedChange={(checked) => onUpdate({ singleSession: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">Session Logging</Label>
                <p className="text-xs text-slate-600">Log all user sessions for audit purposes</p>
              </div>
              <Switch 
                checked={settings.sessionLogging}
                onCheckedChange={(checked) => onUpdate({ sessionLogging: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">Force Logout</Label>
                <p className="text-xs text-slate-600">Force logout all users on security changes</p>
              </div>
              <Switch 
                checked={settings.forceLogout}
                onCheckedChange={(checked) => onUpdate({ forceLogout: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
