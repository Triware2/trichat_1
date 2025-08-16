import { useState } from 'react';
import { IntegrationTypeSelector } from './widget/IntegrationTypeSelector';
import { ConfigurationPanel } from './widget/ConfigurationPanel';
import { PreviewPanel } from './widget/PreviewPanel';
import { CodeGenerationPanel } from './widget/CodeGenerationPanel';
import { WidgetConfig, IntegrationType } from './widget/types';
import { MessageSquare } from 'lucide-react';

export const ChatWidgetGenerator = () => {
  const [integrationType, setIntegrationType] = useState<IntegrationType>('widget');
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    title: 'Need Help?',
    subtitle: 'We\'re here to help you',
    primaryColor: '#3B82F6',
    position: 'bottom-right',
    welcomeMessage: 'Hello! How can we help you today?',
    placeholder: 'Type your message...',
    showAvatar: true,
    autoOpen: false,
    department: 'general',
    buttonText: 'Get Help',
    buttonSelector: '#help-button'
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">Chat Widget Generator</h1>
        </div>
        <p className="text-sm text-slate-600">
          Create and customize chat widgets for your website and applications
        </p>
      </div>

      <div className="space-y-6">
        <IntegrationTypeSelector 
          integrationType={integrationType}
          onTypeChange={setIntegrationType}
        />

        <ConfigurationPanel
          widgetConfig={widgetConfig}
          integrationType={integrationType}
          onConfigChange={setWidgetConfig}
        />

        <PreviewPanel
          widgetConfig={widgetConfig}
          integrationType={integrationType}
        />

        <CodeGenerationPanel
          widgetConfig={widgetConfig}
          integrationType={integrationType}
        />
      </div>
    </div>
  );
};
