import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe,
  Save,
  RefreshCw,
  Link,
  Wrench,
  Download,
  Upload,
  Database,
  Server,
  AlertTriangle,
  Activity,
  Clock,
  Trash2,
  FileText,
  HardDrive
} from 'lucide-react';
import { useSystemSettings } from './settings/useSystemSettings';
import { GeneralSettingsTab } from './settings/GeneralSettingsTab';
import { NotificationSettingsTab } from './settings/NotificationSettingsTab';
import { SecuritySettingsTab } from './settings/SecuritySettingsTab';
import { IntegrationSettingsTab } from './settings/IntegrationSettingsTab';

export const SystemSettings = () => {
  const {
    settings,
    systemHealth,
    backups,
    maintenanceMode,
    systemLogs,
    systemStats,
    loading,
    saving,
    isTestingConnection,
    backupInProgress,
    updateSettings,
    handleSaveSettings,
    testEmailConnection,
    testWebhookUrl,
    createBackup,
    updateMaintenanceMode,
    clearSystemLogs,
    resetToDefaults
  } = useSystemSettings();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="space-y-8">
            <div className="h-10 bg-slate-200 rounded-lg w-64 animate-pulse"></div>
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-8">
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-40 bg-slate-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="space-y-3 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Settings className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
              <p className="text-base text-slate-600 mt-1 leading-relaxed">
                Configure your system preferences, security settings, and integrations with precision
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <Tabs defaultValue="general" className="space-y-0">
            <div className="border-b border-slate-200/60 bg-slate-50/50">
              <TabsList className="h-auto bg-transparent p-0 space-x-0">
                <div className="flex overflow-x-auto">
                  <TabsTrigger 
                    value="general" 
                    className="flex items-center gap-3 px-8 py-5 text-sm font-semibold transition-all duration-300 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/80 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-sm"
                  >
                    <Settings className="w-4 h-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="flex items-center gap-3 px-8 py-5 text-sm font-semibold transition-all duration-300 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/80 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-sm"
                  >
                    <Bell className="w-4 h-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="flex items-center gap-3 px-8 py-5 text-sm font-semibold transition-all duration-300 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/80 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger 
                    value="integrations" 
                    className="flex items-center gap-3 px-8 py-5 text-sm font-semibold transition-all duration-300 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/80 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-sm"
                  >
                    <Link className="w-4 h-4" />
                    Integrations
                  </TabsTrigger>
                  <TabsTrigger 
                    value="maintenance" 
                    className="flex items-center gap-3 px-8 py-5 text-sm font-semibold transition-all duration-300 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/80 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-sm"
                  >
                    <Wrench className="w-4 h-4" />
                    Maintenance
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            <div className="p-8">
              <TabsContent value="general" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">General Settings</h3>
                    <p className="text-base text-slate-600 mt-2 leading-relaxed">Basic system configuration and preferences</p>
                  </div>
                  <GeneralSettingsTab 
                    settings={settings.general} 
                    onUpdate={(updates) => updateSettings('general', updates)} 
                  />
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Notification Settings</h3>
                    <p className="text-base text-slate-600 mt-2 leading-relaxed">Configure how and when to receive notifications</p>
                  </div>
                  <NotificationSettingsTab 
                    settings={settings.notifications} 
                    onUpdate={(updates) => updateSettings('notifications', updates)}
                    onTestWebhook={testWebhookUrl}
                  />
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Security Settings</h3>
                    <p className="text-base text-slate-600 mt-2 leading-relaxed">Configure security policies and authentication</p>
                  </div>
                  <SecuritySettingsTab 
                    settings={settings.security} 
                    onUpdate={(updates) => updateSettings('security', updates)} 
                  />
                </div>
              </TabsContent>

              <TabsContent value="integrations" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Integration Settings</h3>
                    <p className="text-base text-slate-600 mt-2 leading-relaxed">Configure external service integrations</p>
                  </div>
                  <IntegrationSettingsTab 
                    settings={settings.integrations} 
                    onUpdate={(updates) => updateSettings('integrations', updates)}
                    onTestConnection={testEmailConnection}
                    isTestingConnection={isTestingConnection}
                  />
                </div>
              </TabsContent>

              <TabsContent value="maintenance" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">System Maintenance</h3>
                    <p className="text-base text-slate-600 mt-2 leading-relaxed">Backup, restore, and maintenance operations</p>
                  </div>
                  
                  {/* System Status */}
                  {systemHealth && (
                    <Card className="border border-slate-200/60 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <div className="p-2 bg-green-50 rounded-lg">
                            <Activity className="w-5 h-5 text-green-600" />
                          </div>
                          System Status
                        </CardTitle>
                        <CardDescription className="text-sm">Current system health and performance metrics</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium text-slate-700">CPU Usage</Label>
                              <span className="text-sm font-semibold text-slate-900">{systemHealth.cpuUsage}%</span>
                            </div>
                            <Progress value={systemHealth.cpuUsage} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium text-slate-700">Memory Usage</Label>
                              <span className="text-sm font-semibold text-slate-900">{systemHealth.memoryUsage}%</span>
                            </div>
                            <Progress value={systemHealth.memoryUsage} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium text-slate-700">Disk Usage</Label>
                              <span className="text-sm font-semibold text-slate-900">{systemHealth.diskUsage}%</span>
                            </div>
                            <Progress value={systemHealth.diskUsage} className="h-2" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <span className="text-sm font-medium text-slate-700">Database Status</span>
                              <Badge variant={systemHealth.databaseStatus === 'healthy' ? 'default' : 'destructive'}>
                                {systemHealth.databaseStatus}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <span className="text-sm font-medium text-slate-700">API Status</span>
                              <Badge variant={systemHealth.apiStatus === 'healthy' ? 'default' : 'destructive'}>
                                {systemHealth.apiStatus}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <span className="text-sm font-medium text-slate-700">Uptime</span>
                              <span className="text-sm font-semibold text-slate-900">{systemHealth.uptime}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <span className="text-sm font-medium text-slate-700">Last Backup</span>
                              <span className="text-sm font-semibold text-slate-900">{systemHealth.lastBackup}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Backup & Restore */}
                  <Card className="border border-slate-200/60 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Database className="w-5 h-5 text-blue-600" />
                        </div>
                        Backup & Restore
                      </CardTitle>
                      <CardDescription className="text-sm">Create and manage system backups</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Button 
                          onClick={createBackup} 
                          disabled={backupInProgress}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5"
                        >
                          {backupInProgress ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Creating Backup...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Create Backup
                            </>
                          )}
                        </Button>
                        <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2.5">
                          <Upload className="w-4 h-4 mr-2" />
                          Restore Backup
                        </Button>
                      </div>

                      {backups && backups.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-slate-900">Recent Backups</h4>
                          <div className="space-y-2">
                            {backups.slice(0, 5).map((backup) => (
                              <div key={backup.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-4 h-4 text-slate-500" />
                                  <div>
                                    <p className="text-sm font-medium text-slate-900">{backup.name}</p>
                                    <p className="text-xs text-slate-500">{backup.createdAt}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {backup.size}
                                  </Badge>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Download className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Maintenance Mode */}
                  <Card className="border border-slate-200/60 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <Wrench className="w-5 h-5 text-orange-600" />
                        </div>
                        Maintenance Mode
                      </CardTitle>
                      <CardDescription className="text-sm">Enable maintenance mode to perform system updates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="space-y-1">
                          <Label className="text-sm font-semibold text-slate-900">Maintenance Mode</Label>
                          <p className="text-xs text-slate-600">Temporarily disable user access for maintenance</p>
                        </div>
                        <Switch 
                          checked={maintenanceMode?.enabled || false}
                          onCheckedChange={(checked) => updateMaintenanceMode({ enabled: checked })}
                        />
                      </div>
                      
                      {maintenanceMode?.enabled && (
                        <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-orange-900">Maintenance Message</Label>
                            <Textarea
                              value={maintenanceMode.message || ''}
                              onChange={(e) => updateMaintenanceMode({ message: e.target.value })}
                              placeholder="Enter maintenance message for users..."
                              className="border-orange-200 focus:border-orange-400"
                            />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-orange-700">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Users will see this message when accessing the system</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* System Logs */}
                  {systemLogs && systemLogs.length > 0 && (
                    <Card className="border border-slate-200/60 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <div className="p-2 bg-slate-50 rounded-lg">
                            <FileText className="w-5 h-5 text-slate-600" />
                          </div>
                          System Logs
                        </CardTitle>
                        <CardDescription className="text-sm">Recent system events and activities</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {systemLogs.slice(0, 10).map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  log.level === 'error' ? 'bg-red-500' : 
                                  log.level === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                                }`} />
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{log.message}</p>
                                  <p className="text-xs text-slate-500">{log.timestamp}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {log.level}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                          <Button variant="outline" size="sm" className="text-xs">
                            View All Logs
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={clearSystemLogs}
                            className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Clear Logs
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 p-6 bg-white rounded-xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={resetToDefaults}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Reset to Defaults
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSettings} 
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
