
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Brain, 
  Settings, 
  Upload,
  TestTube,
  BarChart3,
  Shield
} from 'lucide-react';
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
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-7 bg-white border shadow-sm rounded-xl p-1 h-auto">
        <TabsTrigger 
          value="overview" 
          className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
        >
          <Bot className="w-4 h-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger 
          value="training" 
          className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Training</span>
        </TabsTrigger>
        <TabsTrigger 
          value="sop-upload" 
          className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">SOP Upload</span>
        </TabsTrigger>
        <TabsTrigger 
          value="llm-settings" 
          className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
        >
          <Brain className="w-4 h-4" />
          <span className="hidden sm:inline">LLM Config</span>
        </TabsTrigger>
        <TabsTrigger 
          value="test-chat" 
          className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
        >
          <TestTube className="w-4 h-4" />
          <span className="hidden sm:inline">Test Chat</span>
        </TabsTrigger>
        <TabsTrigger 
          value="analytics" 
          className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Analytics</span>
        </TabsTrigger>
        <TabsTrigger 
          value="security" 
          className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-2"
        >
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <ChatbotList 
          onOpenTraining={onOpenTraining}
          onOpenConfiguration={onOpenConfiguration}
        />
      </TabsContent>

      <TabsContent value="training">
        <StandardBotTraining selectedBotId={selectedBotId} />
      </TabsContent>

      <TabsContent value="sop-upload">
        <SOPUploadManager selectedBotId={selectedBotId} />
      </TabsContent>

      <TabsContent value="llm-settings">
        <LLMSettingsPanel selectedBotId={selectedBotId} />
      </TabsContent>

      <TabsContent value="test-chat">
        <TestChatInterface />
      </TabsContent>

      <TabsContent value="analytics">
        <ChatbotAnalytics />
      </TabsContent>

      <TabsContent value="security">
        <SecurityPanel />
      </TabsContent>
    </Tabs>
  );
};
