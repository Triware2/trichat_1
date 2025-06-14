
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GeneralSettings } from './types';

interface GeneralSettingsTabProps {
  settings: GeneralSettings;
  onUpdate: (updates: Partial<GeneralSettings>) => void;
}

export const GeneralSettingsTab = ({ settings, onUpdate }: GeneralSettingsTabProps) => {
  return (
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
              value={settings.companyName}
              onChange={(e) => onUpdate({ companyName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => onUpdate({ supportEmail: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeZone">Time Zone</Label>
            <Select 
              value={settings.timeZone}
              onValueChange={(value) => onUpdate({ timeZone: value })}
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
              value={settings.language}
              onValueChange={(value) => onUpdate({ language: value })}
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
            value={settings.maxAgents}
            onChange={(e) => onUpdate({ maxAgents: parseInt(e.target.value) })}
          />
        </div>
      </CardContent>
    </Card>
  );
};
