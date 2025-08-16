
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Mouse, 
  Code, 
  Webhook, 
  Globe, 
  Smartphone, 
  Zap,
  FileText,
  Monitor,
  MessageCircle,
  Send,
  Users,
  Bot,
  Database,
  Layers,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { IntegrationType, IntegrationTypeOption } from './types';

interface IntegrationTypeSelectorProps {
  integrationType: IntegrationType;
  onTypeChange: (type: IntegrationType) => void;
}

export const IntegrationTypeSelector = ({ integrationType, onTypeChange }: IntegrationTypeSelectorProps) => {
  const integrationTypes: IntegrationTypeOption[] = [
    // Web Integrations
    {
      value: 'widget',
      label: 'Floating Widget',
      description: 'Always visible chat widget on your website',
      icon: MessageSquare,
      category: 'web',
      complexity: 'easy',
      features: ['Real-time chat', 'Customizable position', 'Auto-open options']
    },
    {
      value: 'button',
      label: 'Button Trigger',
      description: 'Opens when users click your help button',
      icon: Mouse,
      category: 'web',
      complexity: 'easy',
      features: ['Custom button styling', 'Modal popup', 'Seamless integration']
    },
    {
      value: 'inline',
      label: 'Inline Chat',
      description: 'Embed chat directly in your page content',
      icon: FileText,
      category: 'web',
      complexity: 'easy',
      features: ['Page integration', 'Custom sizing', 'Responsive design']
    },
    {
      value: 'popup',
      label: 'Popup Modal',
      description: 'Chat opens in a centered modal window',
      icon: Monitor,
      category: 'web',
      complexity: 'easy',
      features: ['Modal overlay', 'Custom triggers', 'Mobile optimized']
    },
    {
      value: 'fullscreen',
      label: 'Fullscreen Chat',
      description: 'Chat takes over the entire browser window',
      icon: Layers,
      category: 'web',
      complexity: 'medium',
      features: ['Immersive experience', 'Mobile app feel', 'Custom branding']
    },
    {
      value: 'iframe',
      label: 'iFrame Embed',
      description: 'Embed chat using an iframe',
      icon: Globe,
      category: 'web',
      complexity: 'medium',
      features: ['Cross-domain support', 'Sandbox security', 'Easy integration']
    },
    
    // API Integrations
    {
      value: 'api',
      label: 'REST API',
      description: 'Integrate via RESTful API endpoints',
      icon: Code,
      category: 'api',
      complexity: 'advanced',
      features: ['Full control', 'Custom UI', 'Server-side integration']
    },
    {
      value: 'webhook',
      label: 'Webhooks',
      description: 'Real-time events via webhook notifications',
      icon: Webhook,
      category: 'api',
      complexity: 'advanced',
      features: ['Event-driven', 'Real-time updates', 'Custom workflows']
    },
    {
      value: 'react-component',
      label: 'React Component',
      description: 'Use as a React component in your app',
      icon: Code,
      category: 'api',
      complexity: 'medium',
      features: ['React integration', 'TypeScript support', 'Custom props']
    },
    
    // Platform Integrations
    {
      value: 'wordpress',
      label: 'WordPress',
      description: 'Direct integration without plugins',
      icon: Database,
      category: 'platform',
      complexity: 'easy',
      features: ['Theme file editing', 'Code snippet integration', 'Custom styling', 'No plugin required']
    },
    {
      value: 'shopify',
      label: 'Shopify',
      description: 'Direct integration without apps',
      icon: Database,
      category: 'platform',
      complexity: 'easy',
      features: ['Theme customization', 'Liquid template editing', 'Script tag integration', 'No app required']
    },
    
    // Messaging Apps
    {
      value: 'slack',
      label: 'Slack',
      description: 'Integrate with Slack workspace',
      icon: MessageCircle,
      category: 'messaging',
      complexity: 'medium',
      features: ['Channel integration', 'Team collaboration', 'File sharing']
    },
    {
      value: 'teams',
      label: 'Microsoft Teams',
      description: 'Connect with Microsoft Teams',
      icon: Users,
      category: 'messaging',
      complexity: 'medium',
      features: ['Teams integration', 'Enterprise features', 'SSO support']
    },
    {
      value: 'whatsapp',
      label: 'WhatsApp Business',
      description: 'Connect to WhatsApp Business API',
      icon: Send,
      category: 'messaging',
      complexity: 'advanced',
      features: ['WhatsApp API', 'Business features', 'Media support']
    },
    {
      value: 'facebook',
      label: 'Facebook Messenger',
      description: 'Integrate with Facebook Messenger',
      icon: MessageCircle,
      category: 'messaging',
      complexity: 'medium',
      features: ['Messenger API', 'Page integration', 'Rich messages']
    },
    {
      value: 'telegram',
      label: 'Telegram',
      description: 'Connect to Telegram Bot API',
      icon: Send,
      category: 'messaging',
      complexity: 'medium',
      features: ['Bot API', 'Channel support', 'Custom commands']
    },
    {
      value: 'discord',
      label: 'Discord',
      description: 'Integrate with Discord server',
      icon: Users,
      category: 'messaging',
      complexity: 'medium',
      features: ['Server integration', 'Role management', 'Voice channels']
    },
    
    // Mobile Apps
    {
      value: 'mobile-sdk',
      label: 'Mobile SDK',
      description: 'Native mobile app integration',
      icon: Smartphone,
      category: 'mobile',
      complexity: 'advanced',
      features: ['iOS & Android', 'Native UI', 'Push notifications']
    }
  ];

  const categories = [
    { value: 'web', label: 'Web Integration', icon: Globe },
    { value: 'api', label: 'API & Custom', icon: Code },
    { value: 'platform', label: 'Platforms', icon: Database },
    { value: 'messaging', label: 'Messaging Apps', icon: MessageCircle },
    { value: 'mobile', label: 'Mobile Apps', icon: Smartphone }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'web': return 'from-blue-50 to-indigo-50';
      case 'api': return 'from-purple-50 to-pink-50';
      case 'platform': return 'from-green-50 to-emerald-50';
      case 'messaging': return 'from-orange-50 to-red-50';
      case 'mobile': return 'from-cyan-50 to-blue-50';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  const getCategoryBorder = (category: string) => {
    switch (category) {
      case 'web': return 'border-blue-200';
      case 'api': return 'border-purple-200';
      case 'platform': return 'border-green-200';
      case 'messaging': return 'border-orange-200';
      case 'mobile': return 'border-cyan-200';
      default: return 'border-gray-200';
    }
  };

  const getCategoryIconColor = (category: string) => {
    switch (category) {
      case 'web': return 'text-blue-600';
      case 'api': return 'text-purple-600';
      case 'platform': return 'text-green-600';
      case 'messaging': return 'text-orange-600';
      case 'mobile': return 'text-cyan-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'web': return 'bg-blue-100';
      case 'api': return 'bg-purple-100';
      case 'platform': return 'bg-green-100';
      case 'messaging': return 'bg-orange-100';
      case 'mobile': return 'bg-cyan-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Integration Type
              <Badge variant="outline" className="ml-2 bg-white/80">
                <Sparkles className="w-3 h-3 mr-1" />
                Choose Wisely
              </Badge>
            </h2>
            <p className="text-gray-600 mt-1">
              Choose how you want to integrate TriChat into your platform
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
        <Tabs defaultValue="web" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-transparent">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.value} 
                value={category.value}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.value} value={category.value} className="mt-6">
              <div className={`bg-gradient-to-br ${getCategoryGradient(category.value)} border ${getCategoryBorder(category.value)} rounded-xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 ${getCategoryBgColor(category.value)} rounded-lg flex items-center justify-center`}>
                    <category.icon className={`w-5 h-5 ${getCategoryIconColor(category.value)}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.label}</h3>
                    <p className="text-sm text-gray-600">Select the best integration method for your needs</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {integrationTypes
                    .filter(type => type.category === category.value)
                    .map((type) => (
                      <Card 
                        key={type.value}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                          integrationType === type.value 
                            ? 'ring-2 ring-blue-500 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300' 
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => onTypeChange(type.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 ${getCategoryBgColor(category.value)} rounded-lg flex items-center justify-center`}>
                                <type.icon className={`w-5 h-5 ${getCategoryIconColor(category.value)}`} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                  {type.label}
                                  <Badge className={`text-xs ${getComplexityColor(type.complexity)}`}>
                                    {type.complexity}
                                  </Badge>
                                </h4>
                              </div>
                            </div>
                            {integrationType === type.value && (
                              <CheckCircle className="w-5 h-5 text-blue-500" />
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                          
                          <div className="space-y-2">
                            {type.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span className="text-xs text-gray-600">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
