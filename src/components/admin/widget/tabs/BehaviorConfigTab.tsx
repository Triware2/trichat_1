
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WidgetConfig, IntegrationType, AutoResponder } from '../types';
import { 
  Clock, 
  MessageSquare, 
  Settings, 
  Zap,
  Timer,
  Eye,
  Bell,
  Users,
  Calendar,
  Plus,
  Trash2
} from 'lucide-react';
import { useState } from 'react';

interface BehaviorConfigTabProps {
  widgetConfig: WidgetConfig;
  integrationType: IntegrationType;
  onConfigChange: (config: WidgetConfig) => void;
}

export const BehaviorConfigTab = ({ widgetConfig, integrationType, onConfigChange }: BehaviorConfigTabProps) => {
  const [newAutoResponder, setNewAutoResponder] = useState<Partial<AutoResponder>>({
    trigger: '',
    response: '',
    enabled: true
  });

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    onConfigChange({ ...widgetConfig, ...updates });
  };

  const updateWorkingHours = (updates: Partial<WidgetConfig['workingHours']>) => {
    onConfigChange({
      ...widgetConfig,
      workingHours: { ...widgetConfig.workingHours, ...updates }
    });
  };

  const updateSchedule = (day: string, updates: Partial<{ start: string; end: string; enabled: boolean }>) => {
    const currentSchedule = widgetConfig.workingHours?.schedule || {};
    updateWorkingHours({
      schedule: {
        ...currentSchedule,
        [day]: { ...currentSchedule[day], ...updates }
      }
    });
  };

  const addAutoResponder = () => {
    if (!newAutoResponder.trigger || !newAutoResponder.response) return;
    
    const autoResponders = widgetConfig.autoResponders || [];
    const newResponder: AutoResponder = {
      id: Date.now().toString(),
      trigger: newAutoResponder.trigger,
      response: newAutoResponder.response,
      enabled: newAutoResponder.enabled || true
    };
    
    updateConfig({ autoResponders: [...autoResponders, newResponder] });
    setNewAutoResponder({ trigger: '', response: '', enabled: true });
  };

  const removeAutoResponder = (id: string) => {
    const autoResponders = widgetConfig.autoResponders?.filter(ar => ar.id !== id) || [];
    updateConfig({ autoResponders });
  };

  const toggleAutoResponder = (id: string) => {
    const autoResponders = widgetConfig.autoResponders?.map(ar => 
      ar.id === id ? { ...ar, enabled: !ar.enabled } : ar
    ) || [];
    updateConfig({ autoResponders });
  };

  const triggerTypes = [
    { value: 'welcome', label: 'Welcome Message' },
    { value: 'offline', label: 'Offline Hours' },
    { value: 'after_hours', label: 'After Hours' },
    { value: 'no_response', label: 'No Response (5 min)' },
    { value: 'custom', label: 'Custom Trigger' }
  ];

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Auto-Open Triggers */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Auto-Open Triggers</h3>
            <p className="text-sm text-gray-600">Configure when the widget automatically opens</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-500" />
                Show on Scroll
              </Label>
              <p className="text-xs text-gray-500">Open when user scrolls down the page</p>
            </div>
            <Switch
              checked={widgetConfig.behavior?.showOnScroll || false}
              onCheckedChange={(checked) => updateConfig({ behavior: { ...widgetConfig.behavior, showOnScroll: checked } })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-500" />
                Show on Exit Intent
              </Label>
              <p className="text-xs text-gray-500">Open when user moves mouse to leave page</p>
            </div>
            <Switch
              checked={widgetConfig.behavior?.showOnExitIntent || false}
              onCheckedChange={(checked) => updateConfig({ behavior: { ...widgetConfig.behavior, showOnExitIntent: checked } })}
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Timer className="w-4 h-4 text-blue-500" />
            Show After Delay
          </Label>
          <div className="flex items-center gap-4">
            <Switch
              checked={widgetConfig.behavior?.showAfterDelay || false}
              onCheckedChange={(checked) => updateConfig({ behavior: { ...widgetConfig.behavior, showAfterDelay: checked } })}
            />
            {widgetConfig.behavior?.showAfterDelay && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={widgetConfig.behavior?.delaySeconds || 5}
                  onChange={(e) => updateConfig({ behavior: { ...widgetConfig.behavior, delaySeconds: parseInt(e.target.value) } })}
                  min="1"
                  max="60"
                  className="w-20 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">seconds</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">Automatically open widget after specified delay</p>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-600">Configure notification settings and alerts</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Bell className="w-4 h-4 text-green-500" />
                Sound Notifications
              </Label>
              <p className="text-xs text-gray-500">Play sound when new messages arrive</p>
            </div>
            <Switch
              checked={widgetConfig.behavior?.soundNotifications || false}
              onCheckedChange={(checked) => updateConfig({ behavior: { ...widgetConfig.behavior, soundNotifications: checked } })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-500" />
                Desktop Notifications
              </Label>
              <p className="text-xs text-gray-500">Show browser notifications for new messages</p>
            </div>
            <Switch
              checked={widgetConfig.behavior?.desktopNotifications || false}
              onCheckedChange={(checked) => updateConfig({ behavior: { ...widgetConfig.behavior, desktopNotifications: checked } })}
            />
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Working Hours</h3>
            <p className="text-sm text-gray-600">Configure when your team is available for support</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                Enable Working Hours
              </Label>
              <p className="text-xs text-gray-500">Show offline message outside working hours</p>
            </div>
            <Switch
              checked={widgetConfig.workingHours?.enabled || false}
              onCheckedChange={(checked) => updateWorkingHours({ enabled: checked })}
            />
          </div>

          {widgetConfig.workingHours?.enabled && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Daily Schedule</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {daysOfWeek.map((day) => (
                  <div key={day.value} className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">{day.label}</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={widgetConfig.workingHours?.schedule?.[day.value]?.enabled || false}
                        onCheckedChange={(checked) => updateSchedule(day.value, { enabled: checked })}
                      />
                      {widgetConfig.workingHours?.schedule?.[day.value]?.enabled && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={widgetConfig.workingHours?.schedule?.[day.value]?.start || '09:00'}
                            onChange={(e) => updateSchedule(day.value, { start: e.target.value })}
                            className="w-24 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-500">to</span>
                          <Input
                            type="time"
                            value={widgetConfig.workingHours?.schedule?.[day.value]?.end || '17:00'}
                            onChange={(e) => updateSchedule(day.value, { end: e.target.value })}
                            className="w-24 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auto-Responders */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Auto-Responders</h3>
            <p className="text-sm text-gray-600">Set up automatic responses for common scenarios</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Add New Auto-Responder */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Auto-Responder</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Trigger</Label>
                <Select value={newAutoResponder.trigger} onValueChange={(value) => setNewAutoResponder({ ...newAutoResponder, trigger: value })}>
                  <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map((trigger) => (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        {trigger.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Response</Label>
                <Input
                  value={newAutoResponder.response}
                  onChange={(e) => setNewAutoResponder({ ...newAutoResponder, response: e.target.value })}
                  placeholder="Enter automatic response..."
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            <Button onClick={addAutoResponder} className="mt-3 bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Auto-Responder
            </Button>
          </div>

          {/* Existing Auto-Responders */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Active Auto-Responders</h4>
            {widgetConfig.autoResponders?.map((responder) => (
              <div key={responder.id} className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {triggerTypes.find(t => t.value === responder.trigger)?.label || responder.trigger}
                      </Badge>
                      <Switch
                        checked={responder.enabled}
                        onCheckedChange={() => toggleAutoResponder(responder.id)}
                        size="sm"
                      />
                    </div>
                    <p className="text-sm text-gray-600">{responder.response}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAutoResponder(responder.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {(!widgetConfig.autoResponders || widgetConfig.autoResponders.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No auto-responders configured</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
