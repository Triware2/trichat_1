import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Brain, 
  Settings, 
  Upload,
  TestTube,
  BarChart3,
  Plus,
  Zap,
  MessageSquare,
  Database,
  Shield
} from 'lucide-react';
import { ChatbotCreationWizard } from './ChatbotCreationWizard';
import { SOPUploadManager } from './SOPUploadManager';
import { LLMSettingsPanel } from './LLMSettingsPanel';
import { TestChatInterface } from './TestChatInterface';
import { ChatbotAnalytics } from './ChatbotAnalytics';
import { ChatbotList } from './ChatbotList';
import { StandardBotTraining } from './StandardBotTraining';
import { SecurityPanel } from './SecurityPanel';

export const BotTraining = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  // Mock data for demonstration
  const [stats] = useState({
    totalBots: 8,
    activeBots: 6,
    llmBots: 4,
    standardBots: 4,
    avgResolution: '94%',
    totalSOPs: 12
  });

  const handleCreateBot = () => {
    setIsWizardOpen(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleOpenTraining = useCallback((botId: string, botType: 'standard' | 'llm') => {
    setSelectedBotId(botId);
    if (botType === 'standard') {
      setActiveTab('training');
    } else {
      setActiveTab('sop-upload');
    }
  }, []);

  const handleOpenConfiguration = useCallback((botId: string) => {
    setSelectedBotId(botId);
    setActiveTab('llm-settings');
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 font-segoe">Chatbot Framework</h1>
          <p className="text-gray-600 mt-1">
            Build and manage intelligent chatbots with LLM integration and custom SOP training
          </p>
        </div>
        <Button 
          onClick={handleCreateBot}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Chatbot
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bots</p>
                <p className="text-2xl font-bold">{stats.totalBots}</p>
              </div>
              <Bot className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeBots}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">LLM Powered</p>
                <p className="text-2xl font-bold text-purple-600">{stats.llmBots}</p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Standard</p>
                <p className="text-2xl font-bold text-orange-600">{stats.standardBots}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolution Rate</p>
                <p className="text-2xl font-bold">{stats.avgResolution}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">SOPs Loaded</p>
                <p className="text-2xl font-bold">{stats.totalSOPs}</p>
              </div>
              <Database className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
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
            onOpenTraining={handleOpenTraining}
            onOpenConfiguration={handleOpenConfiguration}
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

      {/* Creation Wizard Modal */}
      <ChatbotCreationWizard 
        open={isWizardOpen} 
        onOpenChange={setIsWizardOpen}
      />
    </div>
  );
};
