
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Globe, Smartphone, MessageSquare } from 'lucide-react';
import { WidgetConfig, IntegrationType } from './types';

interface PreviewPanelProps {
  widgetConfig: WidgetConfig;
  integrationType: IntegrationType;
}

export const PreviewPanel = ({ widgetConfig, integrationType }: PreviewPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Live Preview
        </CardTitle>
        <CardDescription>
          See how your {integrationType} will look on different devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="desktop" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="desktop" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Desktop
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Mobile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="desktop">
            <div className="relative bg-gray-100 rounded-lg p-4 h-96 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
              
              {integrationType === 'widget' ? (
                <div 
                  className={`absolute ${
                    widgetConfig.position.includes('bottom') ? 'bottom-4' : 'top-4'
                  } ${
                    widgetConfig.position.includes('right') ? 'right-4' : 'left-4'
                  } w-80 bg-white rounded-lg shadow-xl border`}
                >
                  <div 
                    className="p-4 rounded-t-lg text-white"
                    style={{ backgroundColor: widgetConfig.primaryColor }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{widgetConfig.title}</h3>
                        <p className="text-sm opacity-90">{widgetConfig.subtitle}</p>
                      </div>
                      {widgetConfig.showAvatar && (
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{widgetConfig.welcomeMessage}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input 
                        placeholder={widgetConfig.placeholder}
                        className="flex-1 text-sm"
                        disabled
                      />
                      <Button 
                        size="sm" 
                        style={{ backgroundColor: widgetConfig.primaryColor }}
                        disabled
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <button 
                      className="px-6 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all"
                      style={{ backgroundColor: widgetConfig.primaryColor }}
                    >
                      {widgetConfig.buttonText}
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-2xl border max-w-md mx-auto">
                    <div 
                      className="p-4 rounded-t-lg text-white"
                      style={{ backgroundColor: widgetConfig.primaryColor }}
                    >
                      <h3 className="font-semibold">{widgetConfig.title}</h3>
                      <p className="text-sm opacity-90">{widgetConfig.subtitle}</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{widgetConfig.welcomeMessage}</p>
                      </div>
                      <Input 
                        placeholder={widgetConfig.placeholder}
                        className="text-sm"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mobile">
            <div className="relative bg-gray-900 rounded-xl p-2 h-96 w-48 mx-auto">
              <div className="bg-white rounded-lg h-full overflow-hidden">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 opacity-50 h-full relative">
                  {integrationType === 'widget' ? (
                    <div 
                      className={`absolute ${
                        widgetConfig.position.includes('bottom') ? 'bottom-2' : 'top-2'
                      } ${
                        widgetConfig.position.includes('right') ? 'right-2' : 'left-2'
                      } w-40 bg-white rounded-lg shadow-xl border`}
                    >
                      <div 
                        className="p-3 rounded-t-lg text-white"
                        style={{ backgroundColor: widgetConfig.primaryColor }}
                      >
                        <h3 className="font-semibold text-sm">{widgetConfig.title}</h3>
                        <p className="text-xs opacity-90">{widgetConfig.subtitle}</p>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="bg-gray-100 rounded-lg p-2">
                          <p className="text-xs text-gray-700">{widgetConfig.welcomeMessage}</p>
                        </div>
                        <Input 
                          placeholder={widgetConfig.placeholder}
                          className="text-xs h-8"
                          disabled
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-4">
                      <button 
                        className="w-full py-2 rounded text-white text-sm font-medium"
                        style={{ backgroundColor: widgetConfig.primaryColor }}
                      >
                        {widgetConfig.buttonText}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
