
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { IntegrationSettings } from './types';
import { Mail, Link, Database, MessageSquare, Zap, TestTube, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface IntegrationSettingsTabProps {
  settings: IntegrationSettings;
  onUpdate: (updates: Partial<IntegrationSettings>) => void;
  onTestConnection?: () => void;
  isTestingConnection?: boolean;
}

export const IntegrationSettingsTab = ({ 
  settings, 
  onUpdate, 
  onTestConnection, 
  isTestingConnection 
}: IntegrationSettingsTabProps) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [showCrmCredentials, setShowCrmCredentials] = useState(false);

  const emailProviders = [
    { value: 'sendgrid', label: 'SendGrid' },
    { value: 'mailgun', label: 'Mailgun' },
    { value: 'smtp', label: 'Custom SMTP' },
    { value: 'none', label: 'None' }
  ];

  const crmIntegrations = [
    { value: 'none', label: 'None' },
    { value: 'salesforce', label: 'Salesforce' },
    { value: 'hubspot', label: 'HubSpot' },
    { value: 'zoho', label: 'Zoho CRM' },
    { value: 'freshdesk', label: 'Freshdesk' },
    { value: 'zendesk', label: 'Zendesk' },
    { value: 'intercom', label: 'Intercom' },
    { value: 'pipedrive', label: 'Pipedrive' },
    { value: 'monday', label: 'Monday.com' },
    { value: 'asana', label: 'Asana' },
    { value: 'trello', label: 'Trello' },
    { value: 'jira', label: 'Jira' },
    { value: 'notion', label: 'Notion' },
    { value: 'slack', label: 'Slack' },
    { value: 'microsoft_dynamics', label: 'Microsoft Dynamics' },
    { value: 'oracle_crm', label: 'Oracle CRM' },
    { value: 'sap_crm', label: 'SAP CRM' },
    { value: 'sugar_crm', label: 'SugarCRM' },
    { value: 'insightly', label: 'Insightly' },
    { value: 'nimble', label: 'Nimble' },
    { value: 'agile_crm', label: 'Agile CRM' },
    { value: 'capsule_crm', label: 'Capsule CRM' },
    { value: 'streak_crm', label: 'Streak CRM' },
    { value: 'copper_crm', label: 'Copper CRM' }
  ];

  const getCrmConfigFields = (crmType: string) => {
    switch (crmType) {
      case 'salesforce':
        return {
          fields: [
            { key: 'instance_url', label: 'Instance URL', type: 'url', placeholder: 'https://yourcompany.salesforce.com' },
            { key: 'client_id', label: 'Client ID', type: 'text', placeholder: 'Enter your Salesforce Client ID' },
            { key: 'client_secret', label: 'Client Secret', type: 'password', placeholder: 'Enter your Salesforce Client Secret' },
            { key: 'username', label: 'Username', type: 'text', placeholder: 'your-email@company.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
            { key: 'security_token', label: 'Security Token', type: 'password', placeholder: 'Enter your security token' }
          ],
          description: 'Configure Salesforce integration with your instance credentials'
        };
      
      case 'hubspot':
        return {
          fields: [
            { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'Enter your HubSpot API key' },
            { key: 'portal_id', label: 'Portal ID', type: 'text', placeholder: 'Enter your HubSpot Portal ID' },
            { key: 'contact_properties', label: 'Contact Properties', type: 'textarea', placeholder: 'email,firstname,lastname,phone' },
            { key: 'deal_pipeline', label: 'Deal Pipeline ID', type: 'text', placeholder: 'Enter your deal pipeline ID' }
          ],
          description: 'Configure HubSpot integration with your API credentials'
        };
      
      case 'freshdesk':
        return {
          fields: [
            { key: 'domain', label: 'Domain', type: 'text', placeholder: 'yourcompany.freshdesk.com' },
            { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'Enter your Freshdesk API key' },
            { key: 'ticket_fields', label: 'Ticket Fields', type: 'textarea', placeholder: 'subject,description,priority,status' },
            { key: 'contact_fields', label: 'Contact Fields', type: 'textarea', placeholder: 'name,email,phone,company' }
          ],
          description: 'Configure Freshdesk integration for ticket management'
        };
      
      case 'zendesk':
        return {
          fields: [
            { key: 'subdomain', label: 'Subdomain', type: 'text', placeholder: 'yourcompany' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'admin@yourcompany.com' },
            { key: 'api_token', label: 'API Token', type: 'password', placeholder: 'Enter your Zendesk API token' },
            { key: 'ticket_fields', label: 'Ticket Fields', type: 'textarea', placeholder: 'subject,description,priority,status' }
          ],
          description: 'Configure Zendesk integration for support ticket management'
        };
      
      case 'intercom':
        return {
          fields: [
            { key: 'access_token', label: 'Access Token', type: 'password', placeholder: 'Enter your Intercom access token' },
            { key: 'workspace_id', label: 'Workspace ID', type: 'text', placeholder: 'Enter your workspace ID' },
            { key: 'conversation_fields', label: 'Conversation Fields', type: 'textarea', placeholder: 'subject,body,priority,status' }
          ],
          description: 'Configure Intercom integration for customer messaging'
        };
      
      case 'pipedrive':
        return {
          fields: [
            { key: 'api_token', label: 'API Token', type: 'password', placeholder: 'Enter your Pipedrive API token' },
            { key: 'domain', label: 'Domain', type: 'text', placeholder: 'yourcompany.pipedrive.com' },
            { key: 'deal_fields', label: 'Deal Fields', type: 'textarea', placeholder: 'title,value,stage,person_name' }
          ],
          description: 'Configure Pipedrive integration for deal management'
        };
      
      case 'zoho':
        return {
          fields: [
            { key: 'client_id', label: 'Client ID', type: 'text', placeholder: 'Enter your Zoho Client ID' },
            { key: 'client_secret', label: 'Client Secret', type: 'password', placeholder: 'Enter your Zoho Client Secret' },
            { key: 'refresh_token', label: 'Refresh Token', type: 'password', placeholder: 'Enter your refresh token' },
            { key: 'data_center', label: 'Data Center', type: 'text', placeholder: 'US, EU, IN, AU, JP' }
          ],
          description: 'Configure Zoho CRM integration with OAuth credentials'
        };
      
      default:
        return {
          fields: [
            { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'Enter your API key' },
            { key: 'base_url', label: 'Base URL', type: 'url', placeholder: 'https://api.example.com' }
          ],
          description: 'Configure integration with your API credentials'
        };
    }
  };

  const crmConfig = getCrmConfigFields(settings.crmIntegration);

  return (
    <div className="space-y-8">
      {/* Email Provider Integration */}
      <Card className="backdrop-blur-md bg-white/70 border border-white/20 shadow-xl shadow-blue-500/10 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/20 to-indigo-50/20 pointer-events-none"></div>
        <CardHeader className="pb-4 relative z-10">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-blue-500/10 backdrop-blur-sm rounded-xl border border-blue-200/30">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            Email Provider Integration
          </CardTitle>
          <CardDescription className="text-sm">Configure email service for notifications and communications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <div className="space-y-3">
            <Label htmlFor="emailProvider" className="text-sm font-semibold text-slate-900">Email Provider</Label>
            <Select 
              value={settings.emailProvider} 
              onValueChange={(value) => onUpdate({ emailProvider: value as any })}
            >
              <SelectTrigger className="h-11 border-slate-300/50 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50 backdrop-blur-sm">
                <SelectValue placeholder="Select email provider" />
              </SelectTrigger>
              <SelectContent className="backdrop-blur-md bg-white/90 border border-white/20 shadow-xl">
                {emailProviders.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value} className="py-3 hover:bg-blue-50/50">
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">Choose your preferred email service provider</p>
          </div>
          
          {settings.emailProvider !== 'none' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="apiKey" className="text-sm font-semibold text-slate-900">API Key</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.apiKey}
                    onChange={(e) => onUpdate({ apiKey: e.target.value })}
                    placeholder="Enter your API key"
                    className="h-11 border-slate-300/50 focus:border-blue-500 focus:ring-blue-500/20 pr-12 bg-white/50 backdrop-blur-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-blue-50/50 backdrop-blur-sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-slate-500">Your API key will be encrypted and stored securely</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={onTestConnection}
                  disabled={!settings.apiKey || isTestingConnection}
                  className="border-blue-300/50 text-blue-700 hover:bg-blue-50/50 backdrop-blur-sm"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  {isTestingConnection ? 'Testing...' : 'Test Connection'}
                </Button>
                <Button variant="outline" className="border-slate-300/50 text-slate-700 hover:bg-slate-50/50 backdrop-blur-sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Test Email
                </Button>
              </div>
              
              {settings.emailProvider === 'smtp' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="smtpHost" className="text-sm font-semibold text-slate-900">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      placeholder="smtp.gmail.com"
                      className="h-11 border-slate-300/50 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="smtpPort" className="text-sm font-semibold text-slate-900">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      placeholder="587"
                      className="h-11 border-slate-300/50 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CRM Integration */}
      <Card className="backdrop-blur-md bg-white/70 border border-white/20 shadow-xl shadow-green-500/10 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-white/20 to-emerald-50/20 pointer-events-none"></div>
        <CardHeader className="pb-4 relative z-10">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-green-500/10 backdrop-blur-sm rounded-xl border border-green-200/30">
              <Database className="w-5 h-5 text-green-600" />
            </div>
            CRM Integration
          </CardTitle>
          <CardDescription className="text-sm">Connect with customer relationship management systems</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <div className="space-y-3">
            <Label htmlFor="crmIntegration" className="text-sm font-semibold text-slate-900">CRM System</Label>
            <Select 
              value={settings.crmIntegration} 
              onValueChange={(value) => onUpdate({ crmIntegration: value as any })}
            >
              <SelectTrigger className="h-11 border-slate-300/50 focus:border-green-500 focus:ring-green-500/20 bg-white/50 backdrop-blur-sm">
                <SelectValue placeholder="Choose a CRM system to integrate..." />
              </SelectTrigger>
              <SelectContent className="backdrop-blur-md bg-white/90 border border-white/20 shadow-xl max-h-96 w-full min-w-[400px]">
                <div className="p-2">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 px-2">
                    Select CRM Integration
                  </div>
                  {crmIntegrations.map((crm) => (
                    <SelectItem 
                      key={crm.value} 
                      value={crm.value} 
                      className="py-3 px-3 rounded-lg hover:bg-green-50/50 focus:bg-green-50/50 cursor-pointer"
                    >
                      {crm.label}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">Choose a CRM system to enable integration and configure connection settings</p>
          </div>
          
          {settings.crmIntegration !== 'none' && (
            <div className="space-y-6 p-4 bg-green-500/5 backdrop-blur-sm rounded-xl border border-green-200/30">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">{crmConfig.description}</h4>
              </div>
              
              <div className="space-y-4">
                {crmConfig.fields.map((field) => (
                  <div key={field.key} className="space-y-3">
                    <Label htmlFor={field.key} className="text-sm font-semibold text-slate-900">{field.label}</Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        id={field.key}
                        placeholder={field.placeholder}
                        className="border-slate-300/50 focus:border-green-500 focus:ring-green-500/20 bg-white/50 backdrop-blur-sm"
                        rows={3}
                      />
                    ) : (
                      <div className="relative">
                        <Input
                          id={field.key}
                          type={field.type === 'password' ? (showCrmCredentials ? 'text' : 'password') : field.type}
                          placeholder={field.placeholder}
                          className="h-11 border-slate-300/50 focus:border-green-500 focus:ring-green-500/20 pr-12 bg-white/50 backdrop-blur-sm"
                        />
                        {field.type === 'password' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-green-50/50 backdrop-blur-sm"
                            onClick={() => setShowCrmCredentials(!showCrmCredentials)}
                          >
                            {showCrmCredentials ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/25">
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
                <Button variant="outline" className="border-green-300/50 text-green-700 hover:bg-green-50/50 backdrop-blur-sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Sync Data
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Webhook Integration */}
      <Card className="backdrop-blur-md bg-white/70 border border-white/20 shadow-xl shadow-purple-500/10 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-white/20 to-violet-50/20 pointer-events-none"></div>
        <CardHeader className="pb-4 relative z-10">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-purple-500/10 backdrop-blur-sm rounded-xl border border-purple-200/30">
              <Link className="w-5 h-5 text-purple-600" />
            </div>
            Webhook Integration
          </CardTitle>
          <CardDescription className="text-sm">Configure webhook endpoints for external integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <div className="space-y-3">
            <Label htmlFor="webhookUrl" className="text-sm font-semibold text-slate-900">Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={settings.webhookUrl}
              onChange={(e) => onUpdate({ webhookUrl: e.target.value })}
              placeholder="https://your-webhook-endpoint.com/notifications"
              className="h-11 border-slate-300/50 focus:border-purple-500 focus:ring-purple-500/20 bg-white/50 backdrop-blur-sm"
            />
            <p className="text-xs text-slate-500">Endpoint URL for receiving notification webhooks</p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="webhookSecret" className="text-sm font-semibold text-slate-900">Webhook Secret</Label>
            <div className="relative">
              <Input
                id="webhookSecret"
                type={showWebhookSecret ? 'text' : 'password'}
                value={settings.webhookSecret}
                onChange={(e) => onUpdate({ webhookSecret: e.target.value })}
                placeholder="Enter webhook secret for security"
                className="h-11 border-slate-300/50 focus:border-purple-500 focus:ring-purple-500/20 pr-12 bg-white/50 backdrop-blur-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-purple-50/50 backdrop-blur-sm"
                onClick={() => setShowWebhookSecret(!showWebhookSecret)}
              >
                {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-slate-500">Secret key to verify webhook authenticity</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-purple-300/50 text-purple-700 hover:bg-purple-50/50 backdrop-blur-sm">
              <TestTube className="w-4 h-4 mr-2" />
              Test Webhook
            </Button>
            <Button variant="outline" className="border-slate-300/50 text-slate-700 hover:bg-slate-50/50 backdrop-blur-sm">
              <Zap className="w-4 h-4 mr-2" />
              View Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Management */}
      <Card className="backdrop-blur-md bg-white/70 border border-white/20 shadow-xl shadow-orange-500/10 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-white/20 to-amber-50/20 pointer-events-none"></div>
        <CardHeader className="pb-4 relative z-10">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-orange-500/10 backdrop-blur-sm rounded-xl border border-orange-200/30">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            API Management
          </CardTitle>
          <CardDescription className="text-sm">Manage API keys and access controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-orange-500/5 backdrop-blur-sm rounded-xl border border-orange-200/30">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">API Access</Label>
                <p className="text-xs text-slate-600">Enable API access for external integrations</p>
              </div>
              <Switch 
                checked={settings.apiEnabled}
                onCheckedChange={(checked) => onUpdate({ apiEnabled: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-orange-500/5 backdrop-blur-sm rounded-xl border border-orange-200/30">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">Rate Limiting</Label>
                <p className="text-xs text-slate-600">Enable rate limiting for API requests</p>
              </div>
              <Switch 
                checked={settings.rateLimiting}
                onCheckedChange={(checked) => onUpdate({ rateLimiting: checked })}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="rateLimit" className="text-sm font-semibold text-slate-900">Rate Limit (requests per minute)</Label>
            <Input
              id="rateLimit"
              type="number"
              value={settings.rateLimit}
              onChange={(e) => onUpdate({ rateLimit: parseInt(e.target.value) || 0 })}
              placeholder="100"
              className="h-11 border-slate-300/50 focus:border-orange-500 focus:ring-orange-500/20 bg-white/50 backdrop-blur-sm"
            />
            <p className="text-xs text-slate-500">Maximum API requests allowed per minute per key</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
