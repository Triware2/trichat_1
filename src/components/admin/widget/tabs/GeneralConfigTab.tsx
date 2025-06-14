
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WidgetConfig, IntegrationType } from '../types';

interface GeneralConfigTabProps {
  widgetConfig: WidgetConfig;
  integrationType: IntegrationType;
  onConfigChange: (config: WidgetConfig) => void;
}

export const GeneralConfigTab = ({ widgetConfig, integrationType, onConfigChange }: GeneralConfigTabProps) => {
  const updateConfig = (updates: Partial<WidgetConfig>) => {
    onConfigChange({ ...widgetConfig, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Chat Title</Label>
        <Input
          id="title"
          value={widgetConfig.title}
          onChange={(e) => updateConfig({ title: e.target.value })}
          placeholder="Need Help?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={widgetConfig.subtitle}
          onChange={(e) => updateConfig({ subtitle: e.target.value })}
          placeholder="We're here to help you"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="welcomeMessage">Welcome Message</Label>
        <Textarea
          id="welcomeMessage"
          value={widgetConfig.welcomeMessage}
          onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
          placeholder="Hello! How can we help you today?"
          rows={3}
        />
      </div>

      {integrationType === 'button' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={widgetConfig.buttonText}
              onChange={(e) => updateConfig({ buttonText: e.target.value })}
              placeholder="Get Help"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buttonSelector">Button CSS Selector</Label>
            <Input
              id="buttonSelector"
              value={widgetConfig.buttonSelector}
              onChange={(e) => updateConfig({ buttonSelector: e.target.value })}
              placeholder="#help-button"
            />
            <p className="text-xs text-gray-500">
              CSS selector for your existing button (e.g., #help-button, .help-btn)
            </p>
          </div>
        </>
      )}
    </div>
  );
};
