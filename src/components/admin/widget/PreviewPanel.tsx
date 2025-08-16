
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Eye, Globe, Smartphone, MessageSquare, Monitor, Sparkles, Zap } from 'lucide-react';
import { WidgetConfig, IntegrationType } from './types';

interface PreviewPanelProps {
  widgetConfig: WidgetConfig;
  integrationType: IntegrationType;
}

export const PreviewPanel = ({ widgetConfig, integrationType }: PreviewPanelProps) => {
  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Live Preview
                <Badge variant="outline" className="ml-2 bg-white/80">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Real-time
                </Badge>
              </h2>
              <p className="text-gray-600 mt-1">
                See how your {integrationType} will look on different devices
              </p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Zap className="w-3 h-3 mr-1" />
            Live Updates
          </Badge>
        </div>
      </div>

      {/* Enhanced Preview Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
        <CardContent className="p-6">
          <Tabs defaultValue="desktop" className="space-y-6">
            {/* Enhanced Tabs */}
            <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <TabsList className="grid w-full grid-cols-2 bg-transparent">
                <TabsTrigger 
                  value="desktop" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Desktop
                </TabsTrigger>
                <TabsTrigger 
                  value="mobile" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Desktop Preview */}
            <TabsContent value="desktop" className="m-0">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Monitor className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Desktop Preview</h3>
                    <p className="text-sm text-gray-600">How your widget appears on desktop screens</p>
                  </div>
                </div>
                
                <div className="relative bg-white rounded-xl p-8 h-[500px] overflow-hidden shadow-lg border border-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
                  
                  {integrationType === 'widget' ? (
                    <div 
                      className={`absolute transition-all duration-300 ${
                        widgetConfig.position.includes('bottom') ? 'bottom-6' : 'top-6'
                      } ${
                        widgetConfig.position.includes('right') ? 'right-6' : 'left-6'
                      } w-80 bg-white rounded-xl shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300`}
                    >
                      <div 
                        className="p-4 rounded-t-xl text-white relative overflow-hidden"
                        style={{ backgroundColor: widgetConfig.primaryColor }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                        <div className="relative flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{widgetConfig.title}</h3>
                            <p className="text-sm opacity-90">{widgetConfig.subtitle}</p>
                          </div>
                          {widgetConfig.showAvatar && (
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <MessageSquare className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-sm text-gray-700">{widgetConfig.welcomeMessage}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Input 
                            placeholder={widgetConfig.placeholder}
                            className="flex-1 text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            disabled
                          />
                          <Button 
                            size="sm" 
                            className="px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                            style={{ backgroundColor: widgetConfig.primaryColor }}
                            disabled
                          >
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <button 
                          className="px-8 py-4 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          style={{ backgroundColor: widgetConfig.primaryColor }}
                        >
                          {widgetConfig.buttonText || 'Get Help'}
                        </button>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md mx-auto">
                        <div 
                          className="p-4 rounded-t-xl text-white relative overflow-hidden"
                          style={{ backgroundColor: widgetConfig.primaryColor }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                          <div className="relative flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{widgetConfig.title}</h3>
                              <p className="text-sm opacity-90">{widgetConfig.subtitle}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-sm text-gray-700">{widgetConfig.welcomeMessage}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Input 
                              placeholder={widgetConfig.placeholder}
                              className="flex-1 text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              disabled
                            />
                            <Button 
                              size="sm" 
                              className="px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                              style={{ backgroundColor: widgetConfig.primaryColor }}
                              disabled
                            >
                              Send
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Mobile Preview */}
            <TabsContent value="mobile" className="m-0">
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Mobile Preview</h3>
                    <p className="text-sm text-gray-600">How your widget appears on mobile devices</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Phone Frame */}
                    <div className="w-80 h-[600px] bg-gray-900 rounded-3xl p-2 shadow-2xl">
                      <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-pink-50/30"></div>
                        
                        {integrationType === 'widget' ? (
                          <div className="absolute bottom-4 right-4 w-72 bg-white rounded-xl shadow-xl border border-gray-200">
                            <div 
                              className="p-3 rounded-t-xl text-white relative overflow-hidden"
                              style={{ backgroundColor: widgetConfig.primaryColor }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                              <div className="relative flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-sm">{widgetConfig.title}</h3>
                                  <p className="text-xs opacity-90">{widgetConfig.subtitle}</p>
                                </div>
                                {widgetConfig.showAvatar && (
                                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <MessageSquare className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="p-3 space-y-3">
                              <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                                <p className="text-xs text-gray-700">{widgetConfig.welcomeMessage}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input 
                                  placeholder={widgetConfig.placeholder}
                                  className="flex-1 text-xs border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                  disabled
                                />
                                <Button 
                                  size="sm" 
                                  className="px-3 py-1 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all"
                                  style={{ backgroundColor: widgetConfig.primaryColor }}
                                  disabled
                                >
                                  Send
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute bottom-4 right-4 w-72 bg-white rounded-xl shadow-xl border border-gray-200">
                            <div 
                              className="p-3 rounded-t-xl text-white relative overflow-hidden"
                              style={{ backgroundColor: widgetConfig.primaryColor }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                              <div className="relative flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-sm">{widgetConfig.title}</h3>
                                  <p className="text-xs opacity-90">{widgetConfig.subtitle}</p>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 space-y-3">
                              <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                                <p className="text-xs text-gray-700">{widgetConfig.welcomeMessage}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input 
                                  placeholder={widgetConfig.placeholder}
                                  className="flex-1 text-xs border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                  disabled
                                />
                                <Button 
                                  size="sm" 
                                  className="px-3 py-1 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all"
                                  style={{ backgroundColor: widgetConfig.primaryColor }}
                                  disabled
                                >
                                  Send
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
