
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetConfig, IntegrationType } from '../types';

interface AppearanceConfigTabProps {
  widgetConfig: WidgetConfig;
  integrationType: IntegrationType;
  onConfigChange: (config: WidgetConfig) => void;
}

export const AppearanceConfigTab = ({ widgetConfig, integrationType, onConfigChange }: AppearanceConfigTabProps) => {
  const positions = [
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'top-left', label: 'Top Left' }
  ];

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    onConfigChange({ ...widgetConfig, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="primaryColor">Primary Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="primaryColor"
            type="color"
            value={widgetConfig.primaryColor}
            onChange={(e) => updateConfig({ primaryColor: e.target.value })}
            className="w-20 h-10"
          />
          <Input
            value={widgetConfig.primaryColor}
            onChange={(e) => updateConfig({ primaryColor: e.target.value })}
            placeholder="#3B82F6"
            className="flex-1"
          />
        </div>
      </div>

      {integrationType === 'widget' && (
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Select 
            value={widgetConfig.position} 
            onValueChange={(value) => updateConfig({ position: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos.value} value={pos.value}>
                  {pos.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Label htmlFor="showAvatar">Show Avatar</Label>
        <input
          id="showAvatar"
          type="checkbox"
          checked={widgetConfig.showAvatar}
          onChange={(e) => updateConfig({ showAvatar: e.target.checked })}
          className="w-4 h-4"
        />
      </div>
    </div>
  );
};
