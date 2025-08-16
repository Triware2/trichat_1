
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WidgetConfig, IntegrationType } from '../types';
import { 
  Globe, 
  Clock, 
  MessageSquare, 
  Settings, 
  Languages,
  Building2,
  User,
  FileText,
  Zap
} from 'lucide-react';

interface GeneralConfigTabProps {
  widgetConfig: WidgetConfig;
  integrationType: IntegrationType;
  onConfigChange: (config: WidgetConfig) => void;
}

export const GeneralConfigTab = ({ widgetConfig, integrationType, onConfigChange }: GeneralConfigTabProps) => {
  const updateConfig = (updates: Partial<WidgetConfig>) => {
    onConfigChange({ ...widgetConfig, ...updates });
  };

  const updateBranding = (updates: Partial<WidgetConfig['branding']>) => {
    onConfigChange({
      ...widgetConfig,
      branding: { ...widgetConfig.branding, ...updates }
    });
  };

  const departments = [
    { value: 'general', label: 'General Support' },
    { value: 'sales', label: 'Sales' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing' },
    { value: 'product', label: 'Product Support' },
    { value: 'custom', label: 'Custom Department' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' }
  ];

  const timezones = [
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

  return (
    <div className="p-6 space-y-8">
      {/* Basic Settings */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Basic Settings</h3>
            <p className="text-sm text-gray-600">Configure the core appearance and behavior of your chat widget</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              Chat Title
            </Label>
        <Input
          id="title"
          value={widgetConfig.title}
          onChange={(e) => updateConfig({ title: e.target.value })}
          placeholder="Need Help?"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
            <p className="text-xs text-gray-500">The main title displayed in your chat widget</p>
      </div>

          <div className="space-y-3">
            <Label htmlFor="subtitle" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-500" />
              Subtitle
            </Label>
        <Input
          id="subtitle"
          value={widgetConfig.subtitle}
          onChange={(e) => updateConfig({ subtitle: e.target.value })}
          placeholder="We're here to help you"
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
        />
            <p className="text-xs text-gray-500">A brief description shown below the title</p>
          </div>
      </div>

        <div className="mt-6 space-y-3">
          <Label htmlFor="welcomeMessage" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-500" />
            Welcome Message
          </Label>
        <Textarea
          id="welcomeMessage"
          value={widgetConfig.welcomeMessage}
          onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
          placeholder="Hello! How can we help you today?"
            className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 min-h-[80px]"
          />
          <p className="text-xs text-gray-500">The first message visitors see when they open the chat</p>
        </div>

        <div className="mt-6 space-y-3">
          <Label htmlFor="placeholder" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-500" />
            Message Placeholder
          </Label>
          <Input
            id="placeholder"
            value={widgetConfig.placeholder}
            onChange={(e) => updateConfig({ placeholder: e.target.value })}
            placeholder="Type your message..."
            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
          />
          <p className="text-xs text-gray-500">Placeholder text in the message input field</p>
        </div>
      </div>

      {/* Department & Routing */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Department & Routing</h3>
            <p className="text-sm text-gray-600">Configure how conversations are routed and managed</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="department" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-green-500" />
            Department
          </Label>
          <Select value={widgetConfig.department} onValueChange={(value) => updateConfig({ department: value })}>
            <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">The department that will handle conversations from this widget</p>
        </div>
      </div>

      {/* Language & Localization */}
      <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Languages className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Language & Localization</h3>
            <p className="text-sm text-gray-600">Configure language and timezone settings</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="language" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Languages className="w-4 h-4 text-purple-500" />
              Language
            </Label>
            <Select value={widgetConfig.language} onValueChange={(value) => updateConfig({ language: value })}>
              <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Primary language for the widget interface</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="timezone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              Timezone
            </Label>
            <Select value={widgetConfig.timezone} onValueChange={(value) => updateConfig({ timezone: value })}>
              <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Timezone for displaying working hours and timestamps</p>
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Advanced Features</h3>
            <p className="text-sm text-gray-600">Enable additional functionality and customization options</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-500" />
                  Show Avatar
                </Label>
                <p className="text-xs text-gray-500">Display agent avatars in conversations</p>
              </div>
              <Switch
                checked={widgetConfig.showAvatar}
                onCheckedChange={(checked) => updateConfig({ showAvatar: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  Auto Open
                </Label>
                <p className="text-xs text-gray-500">Automatically open chat when page loads</p>
              </div>
              <Switch
                checked={widgetConfig.autoOpen}
                onCheckedChange={(checked) => updateConfig({ autoOpen: checked })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-500" />
                  Allow File Upload
                </Label>
                <p className="text-xs text-gray-500">Enable file sharing in conversations</p>
              </div>
              <Switch
                checked={widgetConfig.allowFileUpload}
                onCheckedChange={(checked) => updateConfig({ allowFileUpload: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-orange-500" />
                  Show Typing Indicator
                </Label>
                <p className="text-xs text-gray-500">Display typing indicators during conversations</p>
              </div>
              <Switch
                checked={widgetConfig.showTypingIndicator}
                onCheckedChange={(checked) => updateConfig({ showTypingIndicator: checked })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
