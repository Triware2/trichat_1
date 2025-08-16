import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Code, 
  Download, 
  Copy, 
  Eye, 
  Settings, 
  Save,
  Share2,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Clock
} from 'lucide-react';
import { IntegrationTypeSelector } from '../widget/IntegrationTypeSelector';
import { ConfigurationPanel } from '../widget/ConfigurationPanel';
import { CodeGenerationPanel } from '../widget/CodeGenerationPanel';
import { PreviewPanel } from '../widget/PreviewPanel';
import { WidgetConfig, IntegrationType } from '../widget/types';
import { widgetService } from '@/services/widgetService';

// Default widget configuration
const defaultWidgetConfig: WidgetConfig = {
  title: 'Chat with us',
  subtitle: 'We\'re here to help!',
  primaryColor: '#3B82F6',
  position: 'bottom-right',
  welcomeMessage: 'Hello! How can we help you today?',
  placeholder: 'Type your message...',
  showAvatar: true,
  autoOpen: false,
  department: 'general',
  buttonText: 'Chat with us',
  buttonSelector: '#chat-button',
  apiEndpoint: '',
  webhookUrl: '',
  customCSS: '',
  allowFileUpload: true,
  showTypingIndicator: true,
  enableRating: true,
  maxFileSize: 10,
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  customFields: [],
  branding: {
    logo: '',
    companyName: '',
    hideTriChatBranding: false,
    customFavicon: ''
  },
  language: 'en',
  timezone: 'UTC',
  workingHours: {
    enabled: false,
    timezone: 'UTC',
    schedule: {
      monday: { start: '09:00', end: '17:00', enabled: true },
      tuesday: { start: '09:00', end: '17:00', enabled: true },
      wednesday: { start: '09:00', end: '17:00', enabled: true },
      thursday: { start: '09:00', end: '17:00', enabled: true },
      friday: { start: '09:00', end: '17:00', enabled: true },
      saturday: { start: '09:00', end: '17:00', enabled: false },
      sunday: { start: '09:00', end: '17:00', enabled: false }
    }
  },
  autoResponders: [
    {
      id: '1',
      trigger: 'welcome',
      response: 'Welcome! How can we assist you today?',
      enabled: true
    },
    {
      id: '2',
      trigger: 'offline',
      response: 'We\'re currently offline. Please leave a message and we\'ll get back to you soon.',
      enabled: true
    }
  ]
};

export const ChatWidgetGenerator = () => {
  const [integrationType, setIntegrationType] = useState<IntegrationType>('widget');
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>(defaultWidgetConfig);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [widgetId, setWidgetId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  // Load existing widget configuration on component mount
  useEffect(() => {
    loadWidgetConfiguration();
  }, []);

  const loadWidgetConfiguration = async () => {
    try {
      const savedConfig = await widgetService.getWidgetConfiguration();
      if (savedConfig) {
        setWidgetConfig(savedConfig);
        setWidgetId(savedConfig.id || '');
      }
    } catch (error) {
      console.log('No saved configuration found, using defaults');
    }
  };

  const handleConfigChange = (newConfig: WidgetConfig) => {
    setWidgetConfig(newConfig);
  };

  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    try {
      const savedWidget = await widgetService.saveWidgetConfiguration({
        ...widgetConfig,
        integrationType,
        updatedAt: new Date().toISOString()
      });
      
      setWidgetId(savedWidget.id);
      
      toast({
        title: 'Configuration Saved',
        description: 'Your widget configuration has been saved successfully.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save widget configuration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      // Generate code immediately using the local function
      const code = generateIntegrationCode(integrationType, widgetConfig);
      setGeneratedCode(code);
      
      toast({
        title: 'Code Generated',
        description: 'Widget code has been generated successfully.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate widget code. Please check your configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Local function to generate integration code
  const generateIntegrationCode = (type: IntegrationType, config: WidgetConfig) => {
    const configData = {
      widgetId: config.id || 'default',
      title: config.title,
      subtitle: config.subtitle,
      primaryColor: config.primaryColor,
      position: config.position,
      welcomeMessage: config.welcomeMessage,
      placeholder: config.placeholder,
      showAvatar: config.showAvatar,
      autoOpen: config.autoOpen,
      department: config.department,
      buttonText: config.buttonText,
      buttonSelector: config.buttonSelector,
      allowFileUpload: config.allowFileUpload,
      showTypingIndicator: config.showTypingIndicator,
      enableRating: config.enableRating,
      maxFileSize: config.maxFileSize,
      allowedFileTypes: config.allowedFileTypes,
      language: config.language,
      timezone: config.timezone,
      workingHours: config.workingHours,
      autoResponders: config.autoResponders,
      branding: config.branding,
      appearance: config.appearance,
      behavior: config.behavior,
      customCSS: config.customCSS
    };

    const baseUrl = window.location.origin;
    const apiKey = 'YOUR_API_KEY_HERE';

    switch (type) {
      case 'widget':
        return `<!-- TriChat Floating Widget Integration -->
<script>
(function() {
  window.TriChatConfig = {
    ...${JSON.stringify(configData, null, 2)},
    apiKey: '${apiKey}', // API key for authentication
    baseUrl: '${baseUrl}'
  };
  
  var script = document.createElement('script');
  script.src = '${baseUrl}/widget.js';
  script.async = true;
  script.onload = function() {
    console.log('TriChat widget loaded successfully');
  };
  document.head.appendChild(script);
})();
</script>

<style>
.trichat-widget {
  --primary-color: ${configData.primaryColor};
  --widget-position: ${configData.position};
  ${configData.customCSS || ''}
}
</style>`;

      case 'button':
        return `<!-- TriChat Button Integration -->
<script>
(function() {
  window.TriChatConfig = {
    ...${JSON.stringify(configData, null, 2)},
    mode: 'button',
    buttonSelector: '${configData.buttonSelector}'
  };
  
  var script = document.createElement('script');
  script.src = '${baseUrl}/widget.js';
  script.async = true;
  script.onload = function() {
    TriChat.initButtonMode('${configData.buttonSelector}');
  };
  document.head.appendChild(script);
})();
</script>

<button id="help-button" class="trichat-trigger">
  ${configData.buttonText}
</button>

<style>
.trichat-trigger {
  background-color: ${configData.primaryColor};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
</style>`;

      case 'popup':
        return `<!-- TriChat Popup Modal Integration -->
<script>
(function() {
  window.TriChatConfig = {
    ...${JSON.stringify(configData, null, 2)},
    mode: 'popup'
  };
  
  var script = document.createElement('script');
  script.src = '${baseUrl}/popup-widget.js';
  script.async = true;
  script.onload = function() {
    TriChat.initPopupMode();
  };
  document.head.appendChild(script);
})();
</script>

<button id="chat-popup-trigger" class="trichat-popup-trigger">
  ${configData.buttonText || 'Open Chat'}
</button>

<script>
document.getElementById('chat-popup-trigger').addEventListener('click', () => {
  TriChat.openPopup();
});
</script>`;

      case 'fullscreen':
        return `<!-- TriChat Fullscreen Integration -->
<script>
(function() {
  window.TriChatConfig = {
    ...${JSON.stringify(configData, null, 2)},
    mode: 'fullscreen',
    apiKey: '${apiKey}', // API key for authentication
    baseUrl: '${baseUrl}'
  };
  
  var script = document.createElement('script');
  script.src = '${baseUrl}/fullscreen-widget.js';
  script.async = true;
  script.onload = function() {
    TriChat.initFullscreenMode();
  };
  document.head.appendChild(script);
})();
</script>

<button id="fullscreen-chat-trigger" class="trichat-fullscreen-trigger">
  ${configData.buttonText || 'Fullscreen Chat'}
</button>

<script>
document.getElementById('fullscreen-chat-trigger').addEventListener('click', () => {
  TriChat.openFullscreen();
});
</script>`;

      case 'iframe':
        return `<!-- TriChat iFrame Integration -->
<iframe 
  id="trichat-iframe-${configData.widgetId}"
  src="${baseUrl}/widget/iframe?widgetId=${configData.widgetId}&apiKey=${apiKey}&config=${encodeURIComponent(JSON.stringify({
    ...configData,
    apiKey: apiKey,
    baseUrl: baseUrl
  }))}"
  width="100%"
  height="600px"
  frameborder="0"
  allow="microphone; camera"
  style="border: 1px solid #e5e7eb; border-radius: 8px;"
>
  <p>Your browser does not support iframes.</p>
</iframe>

<script>
// Handle iframe communication with authentication
window.addEventListener('message', function(event) {
  if (event.origin !== '${baseUrl}') return;
  
  const data = event.data;
  
  switch (data.type) {
    case 'trichat:message':
      console.log('New message from iframe:', data.message);
      break;
    case 'trichat:session_start':
      console.log('Chat session started:', data.session);
      break;
    case 'trichat:session_end':
      console.log('Chat session ended:', data.session);
      break;
  }
});

// Initialize iframe with authentication
function initIframeWidget() {
  const iframe = document.getElementById('trichat-iframe-${configData.widgetId}');
  iframe.contentWindow.postMessage({
    type: 'trichat:init',
    config: {
      ...${JSON.stringify(configData, null, 2)},
      apiKey: '${apiKey}',
      baseUrl: '${baseUrl}'
    }
  }, '${baseUrl}');
}

// Initialize when iframe loads
document.getElementById('trichat-iframe-${configData.widgetId}').onload = function() {
  initIframeWidget();
};
</script>`;

      default:
        return `// Integration code for ${type} will be generated here
// Configuration:
${JSON.stringify(configData, null, 2)}

// Please refer to the Setup Instructions tab for detailed installation steps.`;
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: 'Code Copied',
        description: 'Widget code has been copied to clipboard.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy code to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trichat-widget-${integrationType}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Code Downloaded',
      description: 'Widget code has been downloaded successfully.',
      variant: 'default',
    });
  };

  const handleShareWidget = async () => {
    try {
      const shareUrl = await widgetService.generateShareUrl(widgetId);
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: 'Share URL Copied',
        description: 'Widget share URL has been copied to clipboard.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Share Failed',
        description: 'Failed to generate share URL.',
        variant: 'destructive',
      });
    }
  };

  const getIntegrationTypeLabel = (type: IntegrationType) => {
    const labels: Record<IntegrationType, string> = {
      widget: 'Floating Widget',
      button: 'Button Trigger',
      inline: 'Inline Chat',
      popup: 'Popup Modal',
      fullscreen: 'Fullscreen Chat',
      iframe: 'iFrame Embed',
      api: 'REST API',
      webhook: 'Webhooks',
      'react-component': 'React Component',
      wordpress: 'WordPress Integration',
      shopify: 'Shopify Integration',
      slack: 'Slack Bot',
      teams: 'Microsoft Teams',
      whatsapp: 'WhatsApp Business',
      facebook: 'Facebook Messenger',
      telegram: 'Telegram Bot',
      discord: 'Discord Bot',
      'mobile-sdk': 'Mobile SDK'
    };
    return labels[type];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 rounded-xl p-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              
              {/* Title and Description */}
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900">
                  Chat Widget Generator
                </h1>
                <p className="text-slate-600 text-base">
                  Create and customize chat widgets for your website and applications
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveConfiguration}
                disabled={isSaving}
                className="bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Config
                  </>
                )}
              </Button>
              
              <Button
                size="sm"
                onClick={handleGenerateCode}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4 mr-2" />
                    Generate Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Integration Type</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Configuration</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Code className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Code Generation</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveConfiguration}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewOpen(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Type Selector */}
      <IntegrationTypeSelector
        integrationType={integrationType}
        onTypeChange={setIntegrationType}
      />

      {/* Configuration Panel */}
      <ConfigurationPanel
        widgetConfig={widgetConfig}
        integrationType={integrationType}
        onConfigChange={handleConfigChange}
      />

      {/* Code Generation Panel */}
      <CodeGenerationPanel
        integrationType={integrationType}
        widgetConfig={widgetConfig}
        generatedCode={generatedCode}
        isGenerating={isGenerating}
        onGenerateCode={handleGenerateCode}
        onCopyCode={handleCopyCode}
        onDownloadCode={handleDownloadCode}
      />

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Selected: {getIntegrationTypeLabel(integrationType)}</span>
              </div>
              {widgetId && (
                <Badge variant="secondary">ID: {widgetId}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleShareWidget}
                disabled={!widgetId}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Widget
              </Button>
              <Button
                onClick={handleGenerateCode}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4 mr-2" />
                    Generate Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Panel */}
      {isPreviewOpen && (
        <PreviewPanel
          widgetConfig={widgetConfig}
          integrationType={integrationType}
        />
      )}
    </div>
  );
}; 