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
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-semibold text-gray-900 font-segoe">System Settings</h1>
          </div>
          <p className="text-base text-gray-600 leading-relaxed">
            Configure your system preferences, security settings, and integrations
          </p>
        </div>

        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <Tabs defaultValue="general" className="space-y-0">
            <div className="border-b border-gray-200">
              <TabsList className="h-auto bg-transparent p-0 space-x-0">
                <div className="flex overflow-x-auto scrollbar-hide">
                  <TabsTrigger value="general" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                    <Settings className="w-4 h-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                    <Shield className="w-4 h-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="integrations" className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                    <Globe className="w-4 h-4" />
                    Integrations
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            <div className="p-8">
              <TabsContent value="general" className="mt-0">
                <GeneralSettingsTab 
                  settings={settings.general}
                  onUpdate={(updates) => updateSettings('general', updates)}
                />
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <NotificationSettingsTab 
                  settings={settings.notifications}
                  onUpdate={(updates) => updateSettings('notifications', updates)}
                />
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <SecuritySettingsTab 
                  settings={settings.security}
                  onUpdate={(updates) => updateSettings('security', updates)}
                />
              </TabsContent>

              <TabsContent value="integrations" className="mt-0">
                <IntegrationSettingsTab 
                  settings={settings.integrations}
                  onUpdate={(updates) => updateSettings('integrations', updates)}
                />
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-end space-x-4 p-8 border-t border-gray-100">
            <Button variant="outline" onClick={resetToDefaults} className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" />
              Reset to Defaults
            </Button>
            <Button onClick={handleSaveSettings} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
