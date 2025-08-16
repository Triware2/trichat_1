
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { GeneralSettings } from './types';
import { Building2, Mail, Globe, Languages, Users, Clock, Wrench } from 'lucide-react';

interface GeneralSettingsTabProps {
  settings: GeneralSettings;
  onUpdate: (updates: Partial<GeneralSettings>) => void;
}

export const GeneralSettingsTab = ({ settings, onUpdate }: GeneralSettingsTabProps) => {
  const timeZones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'zh', label: 'Chinese' }
  ];

  return (
    <div className="space-y-8">
      {/* Company Information */}
      <Card className="border border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            Company Information
          </CardTitle>
          <CardDescription className="text-sm">Basic company details and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="companyName" className="text-sm font-semibold text-slate-900">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => onUpdate({ companyName: e.target.value })}
                placeholder="Enter company name"
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="supportEmail" className="text-sm font-semibold text-slate-900">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => onUpdate({ supportEmail: e.target.value })}
                placeholder="support@company.com"
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card className="border border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-green-50 rounded-lg">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            Regional Settings
          </CardTitle>
          <CardDescription className="text-sm">Configure timezone and language preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="timeZone" className="text-sm font-semibold text-slate-900">Time Zone</Label>
              <Select value={settings.timeZone} onValueChange={(value) => onUpdate({ timeZone: value })}>
                <SelectTrigger className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeZones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value} className="py-3">
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="language" className="text-sm font-semibold text-slate-900">Language</Label>
              <Select value={settings.language} onValueChange={(value) => onUpdate({ language: value })}>
                <SelectTrigger className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} className="py-3">
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card className="border border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Wrench className="w-5 h-5 text-purple-600" />
            </div>
            System Configuration
          </CardTitle>
          <CardDescription className="text-sm">Advanced system settings and limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="maxAgents" className="text-sm font-semibold text-slate-900">Maximum Agents</Label>
              <Input
                id="maxAgents"
                type="number"
                value={settings.maxAgents}
                onChange={(e) => onUpdate({ maxAgents: parseInt(e.target.value) || 0 })}
                placeholder="Enter maximum number of agents"
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500">Maximum number of concurrent agents allowed</p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="sessionTimeout" className="text-sm font-semibold text-slate-900">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => onUpdate({ sessionTimeout: parseInt(e.target.value) || 0 })}
                placeholder="Enter session timeout in minutes"
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500">Auto-logout after inactivity period</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-slate-900">Maintenance Mode</Label>
              <p className="text-xs text-slate-600">Enable maintenance mode for system updates</p>
            </div>
            <Switch 
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => onUpdate({ maintenanceMode: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
