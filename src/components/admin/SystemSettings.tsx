
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe,
  Save,
  RefreshCw
} from 'lucide-react';
import { useSystemSettings } from './settings/useSystemSettings';
import { GeneralSettingsTab } from './settings/GeneralSettingsTab';
import { NotificationSettingsTab } from './settings/NotificationSettingsTab';
import { SecuritySettingsTab } from './settings/SecuritySettingsTab';
import { IntegrationSettingsTab } from './settings/IntegrationSettingsTab';

export const SystemSettings = () => {
  const {
    settings,
    updateSettings,
    handleSaveSettings,
    resetToDefaults
  } = useSystemSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="text-gray-600">Configure your system preferences and integrations</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <GeneralSettingsTab 
            settings={settings.general}
            onUpdate={(updates) => updateSettings('general', updates)}
          />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettingsTab 
            settings={settings.notifications}
            onUpdate={(updates) => updateSettings('notifications', updates)}
          />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettingsTab 
            settings={settings.security}
            onUpdate={(updates) => updateSettings('security', updates)}
          />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <IntegrationSettingsTab 
            settings={settings.integrations}
            onUpdate={(updates) => updateSettings('integrations', updates)}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={resetToDefaults} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};
