
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IntegrationSettings } from './types';

interface IntegrationSettingsTabProps {
  settings: IntegrationSettings;
  onUpdate: (updates: Partial<IntegrationSettings>) => void;
}

export const IntegrationSettingsTab = ({ settings, onUpdate }: IntegrationSettingsTabProps) => {
  return (
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
              value={settings.emailProvider}
              onValueChange={(value) => onUpdate({ emailProvider: value })}
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
              value={settings.crmIntegration}
              onValueChange={(value) => onUpdate({ crmIntegration: value })}
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
            value={settings.apiKey}
            onChange={(e) => onUpdate({ apiKey: e.target.value })}
            placeholder="Enter your API key"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="webhookSecret">Webhook Secret</Label>
          <Input
            id="webhookSecret"
            type="password"
            value={settings.webhookSecret}
            onChange={(e) => onUpdate({ webhookSecret: e.target.value })}
            placeholder="Enter webhook secret"
          />
        </div>
      </CardContent>
    </Card>
  );
};
