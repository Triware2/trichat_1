
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetConfig, IntegrationType } from '../types';

interface BehaviorConfigTabProps {
  widgetConfig: WidgetConfig;
  integrationType: IntegrationType;
  onConfigChange: (config: WidgetConfig) => void;
}

export const BehaviorConfigTab = ({ widgetConfig, integrationType, onConfigChange }: BehaviorConfigTabProps) => {
  const departments = [
    { value: 'general', label: 'General Support' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'sales', label: 'Sales' },
    { value: 'billing', label: 'Billing' }
  ];

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    onConfigChange({ ...widgetConfig, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="department">Default Department</Label>
        <Select 
          value={widgetConfig.department} 
          onValueChange={(value) => updateConfig({ department: value })}
        >
          <SelectTrigger>
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
      </div>

      {integrationType === 'widget' && (
        <div className="flex items-center justify-between">
          <Label htmlFor="autoOpen">Auto-open on page load</Label>
          <input
            id="autoOpen"
            type="checkbox"
            checked={widgetConfig.autoOpen}
            onChange={(e) => updateConfig({ autoOpen: e.target.checked })}
            className="w-4 h-4"
          />
        </div>
      )}
    </div>
  );
};
