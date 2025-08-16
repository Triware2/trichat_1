import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { 
  Settings, 
  Bell, 
  Shield, 
  Monitor, 
  Save, 
  RefreshCw,
  Volume2,
  Mail,
  Smartphone,
  Clock,
  Users,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Eye,
  Lock,
  Key,
  Palette,
  Globe,
  Zap,
  Target,
  BarChart3,
  Activity,
  Download,
  Upload
} from 'lucide-react';

interface NotificationSettings {
  email_notifications: boolean;
  desktop_notifications: boolean;
  sound_notifications: boolean;
  escalation_alerts: boolean;
  team_performance_alerts: boolean;
  daily_digest: boolean;
  instant_chat_notifications: boolean;
  offline_message_notifications: boolean;
  weekly_reports: boolean;
  critical_alerts: boolean;
}

interface SupervisorPreferences {
  dashboard_refresh_interval: number;
  auto_assign_chats: boolean;
  escalation_threshold_minutes: number;
  show_agent_performance_metrics: boolean;
  require_escalation_notes: boolean;
  enable_chat_monitoring: boolean;
  default_chat_priority: string;
  team_view_mode: string;
  theme_preference: string;
  language: string;
  timezone: string;
  max_concurrent_supervisions: number;
}

export const SupervisorSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    desktop_notifications: true,
    sound_notifications: false,
    escalation_alerts: true,
    team_performance_alerts: true,
    daily_digest: true,
    instant_chat_notifications: true,
    offline_message_notifications: false,
    weekly_reports: true,
    critical_alerts: true
  });
  const [preferences, setPreferences] = useState<SupervisorPreferences>({
    dashboard_refresh_interval: 30,
    auto_assign_chats: false,
    escalation_threshold_minutes: 10,
    show_agent_performance_metrics: true,
    require_escalation_notes: true,
    enable_chat_monitoring: true,
    default_chat_priority: 'medium',
    team_view_mode: 'grid',
    theme_preference: 'system',
    language: 'en',
    timezone: 'America/New_York',
    max_concurrent_supervisions: 10
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [user?.id]);

  const loadSettings = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .eq('updated_by', user.id)
        .in('key', [
          'supervisor_notifications',
          'supervisor_preferences'
        ]);

      if (error) throw error;

      data?.forEach(setting => {
        if (setting.key === 'supervisor_notifications') {
          setNotifications({ ...notifications, ...setting.value });
        } else if (setting.key === 'supervisor_preferences') {
          setPreferences({ ...preferences, ...setting.value });
        }
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const settingsToSave = [
        {
          key: 'supervisor_notifications',
          value: notifications,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
          description: 'Supervisor notification preferences'
        },
        {
          key: 'supervisor_preferences',
          value: preferences,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
          description: 'Supervisor dashboard preferences'
        }
      ];

      for (const setting of settingsToSave) {
        // First, try to find existing setting
        const { data: existingSetting } = await supabase
          .from('system_settings')
          .select('id')
          .eq('key', setting.key)
          .eq('updated_by', user.id)
          .single();

        let error;
        if (existingSetting) {
          // Update existing record
          ({ error } = await supabase
            .from('system_settings')
            .update({
              value: setting.value,
              updated_at: setting.updated_at
            })
            .eq('id', existingSetting.id));
        } else {
          // Insert new record
          ({ error } = await supabase
            .from('system_settings')
            .insert(setting));
        }

        if (error) throw error;
      }

      setHasUnsavedChanges(false);
      toast({
        title: 'Settings Saved',
        description: 'Your supervisor settings have been updated successfully',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const updatePreference = (key: keyof SupervisorPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const exportSettings = () => {
    const settingsData = {
      notifications,
      preferences,
      exported_at: new Date().toISOString(),
      user_id: user?.id
    };

    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `supervisor-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Settings Exported',
      description: 'Your settings have been exported successfully',
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-20">
        <div className="max-w-full mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Supervisor Settings</h1>
                <p className="text-slate-600 mt-1">Configure your dashboard preferences and notifications</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
                  Unsaved Changes
                </Badge>
              )}
              <Button 
                variant="outline" 
                onClick={exportSettings}
                className="bg-white hover:bg-slate-50 border-slate-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                onClick={saveSettings} 
                disabled={saving || !hasUnsavedChanges}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="notifications" className="space-y-6">
          {/* Modern Tab Navigation */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-2xl p-2">
            <TabsList className="grid w-full grid-cols-4 bg-transparent gap-1">
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="preferences" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl"
              >
                <Monitor className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl"
              >
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="advanced" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl"
              >
                <Zap className="w-4 h-4 mr-2" />
                Advanced
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Core Notifications */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <span>Core Notifications</span>
                  </CardTitle>
                  <CardDescription>Essential notification settings</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {[
                    { key: 'email_notifications' as keyof NotificationSettings, label: 'Email Notifications', desc: 'Receive notifications via email', icon: Mail },
                    { key: 'desktop_notifications' as keyof NotificationSettings, label: 'Desktop Notifications', desc: 'Show browser notifications', icon: Monitor },
                    { key: 'sound_notifications' as keyof NotificationSettings, label: 'Sound Notifications', desc: 'Play sound for alerts', icon: Volume2 },
                    { key: 'critical_alerts' as keyof NotificationSettings, label: 'Critical Alerts', desc: 'High priority system alerts', icon: AlertTriangle }
                  ].map(({ key, label, desc, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{label}</p>
                          <p className="text-sm text-slate-600">{desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications[key]}
                        onCheckedChange={(checked) => updateNotification(key, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Supervisor Alerts */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-orange-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span>Supervisor Alerts</span>
                  </CardTitle>
                  <CardDescription>Team and escalation notifications</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {[
                    { key: 'escalation_alerts' as keyof NotificationSettings, label: 'Escalation Alerts', desc: 'Chats escalated to you', icon: AlertTriangle },
                    { key: 'team_performance_alerts' as keyof NotificationSettings, label: 'Team Performance', desc: 'Performance threshold alerts', icon: BarChart3 },
                    { key: 'instant_chat_notifications' as keyof NotificationSettings, label: 'Instant Chat Updates', desc: 'Real-time chat activity', icon: MessageSquare },
                    { key: 'offline_message_notifications' as keyof NotificationSettings, label: 'Offline Messages', desc: 'Messages while offline', icon: Smartphone }
                  ].map(({ key, label, desc, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{label}</p>
                          <p className="text-sm text-slate-600">{desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications[key]}
                        onCheckedChange={(checked) => updateNotification(key, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Reports & Digest */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden lg:col-span-2">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <span>Reports & Digest</span>
                  </CardTitle>
                  <CardDescription>Scheduled reports and summaries</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { key: 'daily_digest' as keyof NotificationSettings, label: 'Daily Digest', desc: 'Daily team performance summary', icon: Mail },
                      { key: 'weekly_reports' as keyof NotificationSettings, label: 'Weekly Reports', desc: 'Comprehensive weekly analytics', icon: BarChart3 }
                    ].map(({ key, label, desc, icon: Icon }) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{label}</p>
                            <p className="text-sm text-slate-600">{desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications[key]}
                          onCheckedChange={(checked) => updateNotification(key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Dashboard Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Display Settings */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-2">
                    <Monitor className="w-5 h-5 text-blue-600" />
                    <span>Display Settings</span>
                  </CardTitle>
                  <CardDescription>Customize your dashboard appearance</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 flex items-center space-x-2 mb-3">
                        <RefreshCw className="w-4 h-4" />
                        <span>Auto-refresh Interval</span>
                      </Label>
                      <div className="space-y-3">
                        <Slider
                          value={[preferences.dashboard_refresh_interval]}
                          onValueChange={(value) => updatePreference('dashboard_refresh_interval', value[0])}
                          max={300}
                          min={5}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>5s</span>
                          <span className="font-medium">{preferences.dashboard_refresh_interval}s</span>
                          <span>5m</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">Team View Mode</Label>
                      <Select 
                        value={preferences.team_view_mode} 
                        onValueChange={(value) => updatePreference('team_view_mode', value)}
                      >
                        <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid View</SelectItem>
                          <SelectItem value="list">List View</SelectItem>
                          <SelectItem value="compact">Compact View</SelectItem>
                          <SelectItem value="detailed">Detailed View</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">Theme Preference</Label>
                      <Select 
                        value={preferences.theme_preference} 
                        onValueChange={(value) => updatePreference('theme_preference', value)}
                      >
                        <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light Theme</SelectItem>
                          <SelectItem value="dark">Dark Theme</SelectItem>
                          <SelectItem value="system">System Default</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chat Management */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <span>Chat Management</span>
                  </CardTitle>
                  <CardDescription>Configure chat handling preferences</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-6">
                    {[
                      { key: 'auto_assign_chats' as keyof SupervisorPreferences, label: 'Auto-assign Chats', desc: 'Automatically assign incoming chats' },
                      { key: 'enable_chat_monitoring' as keyof SupervisorPreferences, label: 'Chat Monitoring', desc: 'Monitor and take over agent chats' },
                      { key: 'require_escalation_notes' as keyof SupervisorPreferences, label: 'Escalation Notes', desc: 'Require notes when escalating' },
                      { key: 'show_agent_performance_metrics' as keyof SupervisorPreferences, label: 'Performance Metrics', desc: 'Show detailed agent metrics' }
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div>
                          <p className="font-medium text-slate-900">{label}</p>
                          <p className="text-sm text-slate-600">{desc}</p>
                        </div>
                        <Switch
                          checked={preferences[key] as boolean}
                          onCheckedChange={(checked) => updatePreference(key, checked)}
                        />
                      </div>
                    ))}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Escalation Threshold</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={preferences.escalation_threshold_minutes}
                            onChange={(e) => updatePreference('escalation_threshold_minutes', parseInt(e.target.value))}
                            className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                            min="1"
                            max="60"
                          />
                          <span className="text-sm text-slate-600">minutes</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Default Priority</Label>
                        <Select 
                          value={preferences.default_chat_priority} 
                          onValueChange={(value) => updatePreference('default_chat_priority', value)}
                        >
                          <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Regional Settings */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden lg:col-span-2">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    <span>Regional & Language Settings</span>
                  </CardTitle>
                  <CardDescription>Configure locale and regional preferences</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Language</Label>
                      <Select 
                        value={preferences.language} 
                        onValueChange={(value) => updatePreference('language', value)}
                      >
                        <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="it">Italian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Timezone</Label>
                      <Select 
                        value={preferences.timezone} 
                        onValueChange={(value) => updatePreference('timezone', value)}
                      >
                        <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (EST)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CST)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MST)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PST)</SelectItem>
                          <SelectItem value="Europe/London">GMT (London)</SelectItem>
                          <SelectItem value="Europe/Berlin">CET (Berlin)</SelectItem>
                          <SelectItem value="Asia/Tokyo">JST (Tokyo)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Max Supervisions</Label>
                      <Input
                        type="number"
                        value={preferences.max_concurrent_supervisions}
                        onChange={(e) => updatePreference('max_concurrent_supervisions', parseInt(e.target.value))}
                        className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                        min="1"
                        max="50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Security */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-red-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-red-600" />
                    <span>Account Security</span>
                  </CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div>
                          <h4 className="font-medium text-green-800">Account Protected</h4>
                          <p className="text-green-700 text-sm">Your supervisor account has enhanced security</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        <div>
                          <h4 className="font-medium text-yellow-800">Password Management</h4>
                          <p className="text-yellow-700 text-sm">Password changes are handled by your authentication provider</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-6 h-6 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-blue-800">Session Monitoring</h4>
                          <p className="text-blue-700 text-sm">All supervisor sessions are monitored for security</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Access Permissions */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="w-5 h-5 text-blue-600" />
                    <span>Access Permissions</span>
                  </CardTitle>
                  <CardDescription>Your current access levels and permissions</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { permission: 'Team Management', status: 'Enabled', icon: Users, color: 'green' },
                      { permission: 'Chat Supervision', status: 'Enabled', icon: MessageSquare, color: 'green' },
                      { permission: 'Queue Management', status: 'Enabled', icon: Activity, color: 'green' },
                      { permission: 'Reports & Analytics', status: 'Enabled', icon: BarChart3, color: 'green' },
                      { permission: 'Settings Management', status: 'Enabled', icon: Settings, color: 'green' },
                      { permission: 'System Administration', status: 'Limited', icon: Lock, color: 'yellow' }
                    ].map(({ permission, status, icon: Icon, color }) => (
                      <div key={permission} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            color === 'green' ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              color === 'green' ? 'text-green-600' : 'text-yellow-600'
                            }`} />
                          </div>
                          <span className="font-medium text-slate-900">{permission}</span>
                        </div>
                        <Badge className={`${
                          color === 'green' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50/50 border-b border-slate-200/60">
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span>Advanced Settings</span>
                </CardTitle>
                <CardDescription>Advanced configuration options and data management</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Data Management */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-900 flex items-center space-x-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span>Data Management</span>
                    </h3>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
                      onClick={exportSettings}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export All Settings
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-white hover:bg-green-50 border-green-200 text-green-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import Settings
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-white hover:bg-orange-50 border-orange-200 text-orange-700"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset to Defaults
                    </Button>
                  </div>

                  {/* Performance Optimization */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-900 flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      <span>Performance</span>
                    </h3>
                    
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">Cache Usage</span>
                        <span className="text-sm text-slate-600">2.3 MB</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">Memory Usage</span>
                        <span className="text-sm text-slate-600">45 MB</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-white hover:bg-red-50 border-red-200 text-red-700"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 