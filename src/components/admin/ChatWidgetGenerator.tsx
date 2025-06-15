
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
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-semibold text-gray-900 font-segoe">TriChat Integration Generator</h1>
          </div>
          <p className="text-base text-gray-600 leading-relaxed">
            Create and customize your embeddable chat widget or button integration with live preview
          </p>
        </div>

        <div className="space-y-8">
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
    </div>
  );
};
