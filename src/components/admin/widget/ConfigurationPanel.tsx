
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Palette, 
  Zap, 
  MessageSquare, 
  Eye, 
  MousePointer,
  Sparkles
} from 'lucide-react';
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
  const getIntegrationIcon = (type: IntegrationType) => {
    switch (type) {
      case 'widget': return <MessageSquare className="w-4 h-4" />;
      case 'button': return <MousePointer className="w-4 h-4" />;
      case 'inline': return <Eye className="w-4 h-4" />;
      case 'popup': return <MessageSquare className="w-4 h-4" />;
      case 'fullscreen': return <Eye className="w-4 h-4" />;
      case 'iframe': return <MessageSquare className="w-4 h-4" />;
      case 'api': return <Zap className="w-4 h-4" />;
      case 'webhook': return <Zap className="w-4 h-4" />;
      case 'react-component': return <Zap className="w-4 h-4" />;
      case 'wordpress': return <MessageSquare className="w-4 h-4" />;
      case 'shopify': return <MessageSquare className="w-4 h-4" />;
      case 'slack': return <MessageSquare className="w-4 h-4" />;
      case 'teams': return <MessageSquare className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'facebook': return <MessageSquare className="w-4 h-4" />;
      case 'telegram': return <MessageSquare className="w-4 h-4" />;
      case 'discord': return <MessageSquare className="w-4 h-4" />;
      case 'mobile-sdk': return <Zap className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getIntegrationColor = (type: IntegrationType) => {
    switch (type) {
      case 'widget': return 'bg-blue-500';
      case 'button': return 'bg-green-500';
      case 'inline': return 'bg-purple-500';
      case 'popup': return 'bg-orange-500';
      case 'fullscreen': return 'bg-red-500';
      case 'iframe': return 'bg-indigo-500';
      case 'api': return 'bg-yellow-500';
      case 'webhook': return 'bg-pink-500';
      case 'react-component': return 'bg-cyan-500';
      case 'wordpress': return 'bg-blue-600';
      case 'shopify': return 'bg-green-600';
      case 'slack': return 'bg-purple-600';
      case 'teams': return 'bg-blue-700';
      case 'whatsapp': return 'bg-green-700';
      case 'facebook': return 'bg-blue-800';
      case 'telegram': return 'bg-blue-500';
      case 'discord': return 'bg-indigo-600';
      case 'mobile-sdk': return 'bg-gray-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${getIntegrationColor(integrationType)} rounded-xl flex items-center justify-center text-white shadow-lg`}>
              {getIntegrationIcon(integrationType)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Widget Configuration
                <Badge variant="outline" className="ml-2 bg-white/80">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Live Preview
                </Badge>
              </h2>
              <p className="text-gray-600 mt-1">
                Customize your TriChat {integrationType} integration with advanced settings
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Zap className="w-3 h-3 mr-1" />
              Real-time Updates
            </Badge>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-sm text-gray-600">Widget Title</div>
            <div className="font-semibold text-gray-900 truncate">{widgetConfig.title}</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-sm text-gray-600">Primary Color</div>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border border-gray-300" 
                style={{ backgroundColor: widgetConfig.primaryColor }}
              />
              <span className="font-semibold text-gray-900">{widgetConfig.primaryColor}</span>
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-sm text-gray-600">Position</div>
            <div className="font-semibold text-gray-900 capitalize">{widgetConfig.position}</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-sm text-gray-600">Department</div>
            <div className="font-semibold text-gray-900 capitalize">{widgetConfig.department}</div>
          </div>
        </div>
      </div>

      {/* Enhanced Configuration Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
        <CardContent className="p-6">
          <Tabs defaultValue="general" className="space-y-6">
            {/* Enhanced Tabs */}
            <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <TabsList className="grid w-full grid-cols-3 bg-transparent">
                <TabsTrigger 
                  value="general" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger 
                  value="appearance" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger 
                  value="behavior" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Behavior
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content with Enhanced Styling */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <TabsContent value="general" className="m-0">
                <GeneralConfigTab
                  widgetConfig={widgetConfig}
                  integrationType={integrationType}
                  onConfigChange={onConfigChange}
                />
              </TabsContent>

              <TabsContent value="appearance" className="m-0">
                <AppearanceConfigTab
                  widgetConfig={widgetConfig}
                  integrationType={integrationType}
                  onConfigChange={onConfigChange}
                />
              </TabsContent>

              <TabsContent value="behavior" className="m-0">
                <BehaviorConfigTab
                  widgetConfig={widgetConfig}
                  integrationType={integrationType}
                  onConfigChange={onConfigChange}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
