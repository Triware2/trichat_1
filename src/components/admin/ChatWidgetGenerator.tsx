
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, 
  Code, 
  Eye, 
  Settings, 
  MessageSquare, 
  Palette,
  Globe,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ChatWidgetGenerator = () => {
  const { toast } = useToast();
  const [widgetConfig, setWidgetConfig] = useState({
    title: 'Need Help?',
    subtitle: 'We\'re here to help you',
    primaryColor: '#3B82F6',
    position: 'bottom-right',
    welcomeMessage: 'Hello! How can we help you today?',
    placeholder: 'Type your message...',
    showAvatar: true,
    autoOpen: false,
    department: 'general'
  });

  const generateCode = () => {
    return `<!-- SupportPro Chat Widget -->
<script>
  (function() {
    window.SupportProConfig = {
      title: "${widgetConfig.title}",
      subtitle: "${widgetConfig.subtitle}",
      primaryColor: "${widgetConfig.primaryColor}",
      position: "${widgetConfig.position}",
      welcomeMessage: "${widgetConfig.welcomeMessage}",
      placeholder: "${widgetConfig.placeholder}",
      showAvatar: ${widgetConfig.showAvatar},
      autoOpen: ${widgetConfig.autoOpen},
      department: "${widgetConfig.department}",
      apiKey: "YOUR_API_KEY_HERE"
    };
    
    var script = document.createElement('script');
    script.src = 'https://widget.supportpro.com/widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>

<!-- Optional: Custom CSS -->
<style>
  .supportpro-widget {
    --primary-color: ${widgetConfig.primaryColor};
    --widget-position: ${widgetConfig.position};
  }
</style>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCode());
    toast({
      title: "Code Copied!",
      description: "The widget code has been copied to your clipboard.",
    });
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Chat Widget Generator</h2>
        <p className="text-gray-600">Create and customize your embeddable chat widget</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Widget Configuration
            </CardTitle>
            <CardDescription>
              Customize your chat widget appearance and behavior
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
                  <Label htmlFor="title">Widget Title</Label>
                  <Input
                    id="title"
                    value={widgetConfig.title}
                    onChange={(e) => setWidgetConfig({...widgetConfig, title: e.target.value})}
                    placeholder="Need Help?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={widgetConfig.subtitle}
                    onChange={(e) => setWidgetConfig({...widgetConfig, subtitle: e.target.value})}
                    placeholder="We're here to help you"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={widgetConfig.welcomeMessage}
                    onChange={(e) => setWidgetConfig({...widgetConfig, welcomeMessage: e.target.value})}
                    placeholder="Hello! How can we help you today?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placeholder">Message Placeholder</Label>
                  <Input
                    id="placeholder"
                    value={widgetConfig.placeholder}
                    onChange={(e) => setWidgetConfig({...widgetConfig, placeholder: e.target.value})}
                    placeholder="Type your message..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={widgetConfig.primaryColor}
                      onChange={(e) => setWidgetConfig({...widgetConfig, primaryColor: e.target.value})}
                      className="w-20 h-10"
                    />
                    <Input
                      value={widgetConfig.primaryColor}
                      onChange={(e) => setWidgetConfig({...widgetConfig, primaryColor: e.target.value})}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select 
                    value={widgetConfig.position} 
                    onValueChange={(value) => setWidgetConfig({...widgetConfig, position: value})}
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

                <div className="flex items-center justify-between">
                  <Label htmlFor="showAvatar">Show Avatar</Label>
                  <input
                    id="showAvatar"
                    type="checkbox"
                    checked={widgetConfig.showAvatar}
                    onChange={(e) => setWidgetConfig({...widgetConfig, showAvatar: e.target.checked})}
                    className="w-4 h-4"
                  />
                </div>
              </TabsContent>

              <TabsContent value="behavior" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Default Department</Label>
                  <Select 
                    value={widgetConfig.department} 
                    onValueChange={(value) => setWidgetConfig({...widgetConfig, department: value})}
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

                <div className="flex items-center justify-between">
                  <Label htmlFor="autoOpen">Auto-open on page load</Label>
                  <input
                    id="autoOpen"
                    type="checkbox"
                    checked={widgetConfig.autoOpen}
                    onChange={(e) => setWidgetConfig({...widgetConfig, autoOpen: e.target.checked})}
                    className="w-4 h-4"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Live Preview
            </CardTitle>
            <CardDescription>
              See how your widget will look on different devices
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
                </div>
              </TabsContent>

              <TabsContent value="mobile">
                <div className="relative bg-gray-900 rounded-xl p-2 h-96 w-48 mx-auto">
                  <div className="bg-white rounded-lg h-full overflow-hidden">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 opacity-50 h-full relative">
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
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Code Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Generated Code
          </CardTitle>
          <CardDescription>
            Copy this code and paste it into your website's HTML
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">Ready to use</Badge>
                <Badge className="bg-blue-100 text-blue-800">JavaScript</Badge>
              </div>
              <Button onClick={copyToClipboard} className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy Code
              </Button>
            </div>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{generateCode()}</code>
              </pre>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Installation Instructions:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Copy the code above</li>
                <li>Paste it before the closing &lt;/body&gt; tag in your HTML</li>
                <li>Replace "YOUR_API_KEY_HERE" with your actual API key</li>
                <li>The widget will automatically appear on your website</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
