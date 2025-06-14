
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from 'lucide-react';
import { WidgetConfig, IntegrationType } from './types';

interface ConfigurationPanelProps {
  widgetConfig: WidgetConfig;
  integrationType: IntegrationType;
  onConfigChange: (config: WidgetConfig) => void;
}

export const ConfigurationPanel = ({ widgetConfig, integrationType, onConfigChange }: ConfigurationPanelProps) => {
  const positions = [
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'top-left', label: 'Top Left' }
  ];

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuration
        </CardTitle>
        <CardDescription>
          Customize your TriChat {integrationType} appearance and behavior
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
