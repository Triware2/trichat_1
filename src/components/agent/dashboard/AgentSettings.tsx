import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Bell, 
  User, 
  Save,
  Volume2,
  Moon,
  Monitor
} from 'lucide-react';

export const AgentSettings = () => {
  const [notifications, setNotifications] = useState(() => localStorage.getItem('agentNotifications') !== 'false');
  const [soundAlerts, setSoundAlerts] = useState(() => localStorage.getItem('agentSoundAlerts') !== 'false');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [awayTimeout, setAwayTimeout] = useState(() => localStorage.getItem('agentAwayTimeout') || '15');

  // Effect to initialize dark mode from localStorage and apply class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('agentNotifications', notifications ? 'true' : 'false');
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('agentSoundAlerts', soundAlerts ? 'true' : 'false');
  }, [soundAlerts]);
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
  }, [darkMode]);
  useEffect(() => {
    localStorage.setItem('agentAwayTimeout', awayTimeout);
  }, [awayTimeout]);

  const handleSaveSettings = () => {
    // In a real app, this would make an API call to save settings
    // For now, settings are persisted to localStorage and used throughout the app
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-[#11b890]/5 to-[#11b890]/10 overflow-hidden">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#11b890] to-[#0ea373] rounded-xl shadow-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Agent Settings</h1>
              <p className="text-sm text-slate-600 mt-1">Personalize your agent dashboard experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Notifications Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
              <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-slate-900">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="notifications" className="text-base font-medium text-slate-900">
                    Desktop Notifications
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">Get notified about new chats and messages</p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="sound-alerts" className="text-base font-medium text-slate-900">
                    Sound Alerts
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">Play sound for new messages</p>
                </div>
                <Switch
                  id="sound-alerts"
                  checked={soundAlerts}
                  onCheckedChange={setSoundAlerts}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-[#11b890]/10 border-b border-slate-200/60">
              <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-slate-900">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#11b890] to-[#0ea373] rounded-lg">
                  <Monitor className="w-4 h-4 text-white" />
                </div>
                <span>Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="dark-mode" className="text-base font-medium text-slate-900">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">Toggle dark theme for better night viewing</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50/50 border-b border-slate-200/60">
              <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-slate-900">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span>Profile Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="away-timeout" className="text-base font-medium text-slate-900">
                    Auto-Away Timeout (minutes)
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">Set status to away after inactivity</p>
                  <Input
                    id="away-timeout"
                    type="number"
                    value={awayTimeout}
                    onChange={(e) => setAwayTimeout(e.target.value)}
                    className="mt-2 bg-white border-slate-200 focus:border-[#11b890] focus:ring-[#11b890]"
                    min="1"
                    max="60"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-[#11b890]/10 text-[#11b890] border-[#11b890]/30">
                    Status: Online
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    Agent Role
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Settings Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-[#11b890]/10 border-b border-slate-200/60">
              <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-slate-900">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#11b890] to-[#0ea373] rounded-lg">
                  <Save className="w-4 h-4 text-white" />
                </div>
                <span>Save Changes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Your settings are automatically saved. Changes take effect immediately.
                </p>
                <Button 
                  onClick={handleSaveSettings}
                  className="w-full bg-gradient-to-r from-[#11b890] to-[#0ea373] hover:from-[#0ea373] hover:to-[#0d8f65] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save All Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
