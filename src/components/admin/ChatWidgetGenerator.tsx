
import { useState } from 'react';
import { IntegrationTypeSelector } from './widget/IntegrationTypeSelector';
import { ConfigurationPanel } from './widget/ConfigurationPanel';
import { PreviewPanel } from './widget/PreviewPanel';
import { CodeGenerationPanel } from './widget/CodeGenerationPanel';
import { WidgetConfig, IntegrationType } from './widget/types';

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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">TriChat Integration Generator</h2>
        <p className="text-gray-600">Create and customize your embeddable chat widget or button integration</p>
      </div>

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
  );
};
