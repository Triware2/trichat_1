
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from 'lucide-react';
import { WidgetConfig, IntegrationType } from './types';
import { GeneralConfigTab } from './tabs/GeneralConfigTab';
import { AppearanceConfigTab } from './tabs/AppearanceConfigTab';
import { BehaviorConfigTab } from './tabs/BehaviorConfigTab';

interface ConfigurationPanelProps {
  widgetConfig: WidgetConfig;
  integrationType: IntegrationType;
  onConfigChange: (config: WidgetConfig) => void;
}

export const ConfigurationPanel = ({ widgetConfig, integrationType, onConfigChange }: ConfigurationPanelProps) => {
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
            <GeneralConfigTab
              widgetConfig={widgetConfig}
              integrationType={integrationType}
              onConfigChange={onConfigChange}
            />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <AppearanceConfigTab
              widgetConfig={widgetConfig}
              integrationType={integrationType}
              onConfigChange={onConfigChange}
            />
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <BehaviorConfigTab
              widgetConfig={widgetConfig}
              integrationType={integrationType}
              onConfigChange={onConfigChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
