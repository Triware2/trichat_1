
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
  Layers
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
      features: ['Real-time updates', 'Event-driven', 'Server notifications']
    },
    {
      value: 'react-component',
      label: 'React Component',
      description: 'Pre-built React component for React apps',
      icon: Code,
      category: 'api',
      complexity: 'medium',
      features: ['React hooks', 'TypeScript support', 'Custom styling']
    },
    
    // Platform Integrations
    {
      value: 'wordpress',
      label: 'WordPress Plugin',
      description: 'Easy installation via WordPress plugin',
      icon: Globe,
      category: 'platform',
      complexity: 'easy',
      features: ['One-click install', 'Admin panel', 'Theme compatibility']
    },
    {
      value: 'shopify',
      label: 'Shopify App',
      description: 'Native Shopify store integration',
      icon: Bot,
      category: 'platform',
      complexity: 'easy',
      features: ['Product support', 'Order tracking', 'Customer data sync']
    },
    
    // Messaging Platforms
    {
      value: 'slack',
      label: 'Slack Bot',
      description: 'Integrate as a Slack bot or app',
      icon: MessageCircle,
      category: 'messaging',
      complexity: 'medium',
      features: ['Slack commands', 'Direct messages', 'Channel integration']
    },
    {
      value: 'teams',
      label: 'Microsoft Teams',
      description: 'Teams bot and app integration',
      icon: Users,
      category: 'messaging',
      complexity: 'medium',
      features: ['Teams commands', 'Meeting integration', 'File sharing']
    },
    {
      value: 'whatsapp',
      label: 'WhatsApp Business',
      description: 'WhatsApp Business API integration',
      icon: MessageSquare,
      category: 'messaging',
      complexity: 'advanced',
      features: ['Rich media', 'Templates', 'Business profiles']
    },
    {
      value: 'facebook',
      label: 'Facebook Messenger',
      description: 'Facebook Messenger bot integration',
      icon: Send,
      category: 'messaging',
      complexity: 'medium',
      features: ['Messenger UI', 'Rich interactions', 'Social integration']
    },
    {
      value: 'telegram',
      label: 'Telegram Bot',
      description: 'Telegram bot API integration',
      icon: Send,
      category: 'messaging',
      complexity: 'medium',
      features: ['Bot commands', 'Inline keyboards', 'File uploads']
    },
    {
      value: 'discord',
      label: 'Discord Bot',
      description: 'Discord server bot integration',
      icon: Users,
      category: 'messaging',
      complexity: 'medium',
      features: ['Server commands', 'Voice integration', 'Rich embeds']
    },
    
    // Mobile
    {
      value: 'mobile-sdk',
      label: 'Mobile SDK',
      description: 'Native mobile app integration',
      icon: Smartphone,
      category: 'mobile',
      complexity: 'advanced',
      features: ['iOS & Android', 'Push notifications', 'Offline support']
    }
  ];

  const categories = [
    { id: 'web', label: 'Web Integration', icon: Globe },
    { id: 'api', label: 'API & Custom', icon: Code },
    { id: 'platform', label: 'Platforms', icon: Database },
    { id: 'messaging', label: 'Messaging Apps', icon: MessageCircle },
    { id: 'mobile', label: 'Mobile Apps', icon: Smartphone }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Type</CardTitle>
        <CardDescription>
          Choose how you want to integrate TriChat into your platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="web" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrationTypes
                  .filter(type => type.category === category.id)
                  .map((type) => {
                    const Icon = type.icon;
                    const isSelected = integrationType === type.value;
                    
                    return (
                      <div
                        key={type.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => onTypeChange(type.value)}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-sm">{type.label}</h3>
                              <Badge className={`text-xs ${getComplexityColor(type.complexity)}`}>
                                {type.complexity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                            <div className="space-y-1">
                              {type.features.slice(0, 3).map((feature, index) => (
                                <div key={index} className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                  <span className="text-xs text-gray-500">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
