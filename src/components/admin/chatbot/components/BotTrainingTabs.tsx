
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { HorizontalTabs } from '../../dashboard/HorizontalTabs';
import { ChatbotList } from '../ChatbotList';
import { StandardBotTraining } from '../StandardBotTraining';
import { SOPUploadManager } from '../SOPUploadManager';
import { LLMSettingsPanel } from '../LLMSettingsPanel';
import { TestChatInterface } from '../TestChatInterface';
import { ChatbotAnalytics } from '../ChatbotAnalytics';
import { SecurityPanel } from '../SecurityPanel';

interface BotTrainingTabsProps {
  activeTab: string;
  selectedBotId: string | null;
  onTabChange: (value: string) => void;
  onOpenTraining: (botId: string, botType: 'standard' | 'llm') => void;
  onOpenConfiguration: (botId: string) => void;
}

export const BotTrainingTabs = ({ 
  activeTab, 
  selectedBotId, 
  onTabChange, 
  onOpenTraining, 
  onOpenConfiguration 
}: BotTrainingTabsProps) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'training', label: 'Training' },
    { id: 'sop-upload', label: 'SOP Upload' },
    { id: 'llm-settings', label: 'LLM Config' },
    { id: 'test-chat', label: 'Test Chat' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'security', label: 'Security' }
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-0">
      <HorizontalTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />

      <div className="p-6">
        <TabsContent value="overview" className="mt-0">
          <ChatbotList 
            onOpenTraining={onOpenTraining}
            onOpenConfiguration={onOpenConfiguration}
          />
        </TabsContent>

        <TabsContent value="training" className="mt-0">
          <StandardBotTraining selectedBotId={selectedBotId} />
        </TabsContent>

        <TabsContent value="sop-upload" className="mt-0">
          <SOPUploadManager selectedBotId={selectedBotId} />
        </TabsContent>

        <TabsContent value="llm-settings" className="mt-0">
          <LLMSettingsPanel selectedBotId={selectedBotId} />
        </TabsContent>

        <TabsContent value="test-chat" className="mt-0">
          <TestChatInterface />
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <ChatbotAnalytics />
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <SecurityPanel />
        </TabsContent>
      </div>
    </Tabs>
  );
};
