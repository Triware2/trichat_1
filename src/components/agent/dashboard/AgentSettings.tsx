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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Agent Settings
        </h1>
        <p className="text-gray-600 mt-1">Personalize your agent dashboard experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="font-medium">
                  Desktop Notifications
                </Label>
                <p className="text-sm text-gray-600">Get notified about new chats</p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound-alerts" className="font-medium">
                  Sound Alerts
                </Label>
                <p className="text-sm text-gray-600">Play sound for new messages</p>
              </div>
              <Switch
                id="sound-alerts"
                checked={soundAlerts}
                onCheckedChange={setSoundAlerts}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="font-medium">
                  Dark Mode
                </Label>
                <p className="text-sm text-gray-600">Switch to dark theme</p>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            <div className="pt-2">
              <Badge variant="outline" className="text-xs">
                Theme changes apply immediately
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Status Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Status Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="away-timeout" className="font-medium">
                Auto-Away Timeout (minutes)
              </Label>
              <Input
                id="away-timeout"
                type="number"
                min="5"
                max="60"
                value={awayTimeout}
                onChange={e => setAwayTimeout(e.target.value)}
                className="w-24"
              />
              <p className="text-xs text-gray-600">Set between 5-60 minutes</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};
