
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StandardBotTraining } from './StandardBotTraining';
import { LLMSettingsPanel } from './LLMSettingsPanel';
import { SecurityPanel } from './SecurityPanel';
import { TestChatInterface } from './TestChatInterface';
import { ChatbotAnalytics } from './ChatbotAnalytics';
import ChatbotList from './ChatbotList';
import { SOPUploadManager } from './SOPUploadManager';
import TrainingPresetTab from './TrainingPresetTab';
import CreateBotModal from './CreateBotModal';
import { QuickTrainModal } from './QuickTrainModal';
import { ConversationFlowBuilder } from './components/ConversationFlowBuilder';
import { AdvancedConditionsBuilder } from './components/AdvancedConditionsBuilder';
import { Chatbot } from '@/services/chatbotService';
import { 
  Bot, Brain, Zap, TrendingUp, Target, Shield, TestTube, BarChart3, 
  Settings, Play, Pause, RotateCcw, Download, Upload, Star, Clock,
  MessageSquare, Users, CheckCircle, AlertCircle, ArrowRight, Plus, Workflow
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { chatbotService } from '@/services/chatbotService';

export const BotTraining = () => {
  const [activeTab, setActiveTab] = useState('management');
  const [trainingSection, setTrainingSection] = useState('bot-training');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isQuickTrainModalOpen, setIsQuickTrainModalOpen] = useState(false);
  const [botToEdit, setBotToEdit] = useState(null);
  const [reloadList, setReloadList] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Handler functions for ChatbotList
  const handleSelectChatbot = (chatbot: any) => {
    console.log('Selected chatbot:', chatbot);
    setSelectedChatbot(chatbot);
    // Update the training section to show the selected bot's data
    setTrainingSection('bot-training');
  };

  const handleEditChatbot = (chatbot) => {
    setBotToEdit(chatbot);
    setIsCreateModalOpen(true);
  };

  const handleDeleteChatbot = async (chatbotId: string) => {
    if (!confirm('Are you sure you want to delete this chatbot? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const success = await chatbotService.deleteChatbot(chatbotId);
      if (success) {
        toast({
          title: "Chatbot Deleted",
          description: "The chatbot has been successfully deleted.",
        });
        setReloadList(r => !r); // Trigger reload
        if (selectedChatbot?.id === chatbotId) {
          setSelectedChatbot(null);
        }
      } else {
        throw new Error('Failed to delete chatbot');
      }
    } catch (error) {
      console.error('Error deleting chatbot:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the chatbot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateNewBot = () => {
    setIsCreateModalOpen(true);
  };

  const handleQuickTrain = () => {
    setIsQuickTrainModalOpen(true);
  };

  const handleBotCreated = (bot) => {
    setReloadList(r => !r); // Toggle to trigger reload
    setBotToEdit(null);
    setIsCreateModalOpen(false);
    setSelectedChatbot(bot); // Select the newly created bot
    toast({
      title: "Chatbot Created",
      description: `${bot.name} has been created successfully.`,
    });
  };

  const handleBotUpdated = (bot) => {
    setReloadList(r => !r); // Toggle to trigger reload
    setBotToEdit(null);
    setIsCreateModalOpen(false);
    setSelectedChatbot(bot); // Update the selected bot
    toast({
      title: "Chatbot Updated",
      description: `${bot.name} has been updated successfully.`,
    });
  };

  const handleFlowSaved = (flowData) => {
    toast({
      title: "Flow Saved",
      description: "Conversation flow has been saved successfully.",
    });
  };

  const handleConditionsSaved = (conditions) => {
    toast({
      title: "Conditions Saved",
      description: "Advanced conditions have been saved successfully.",
    });
  };

  // Training stats for the analytics tab
  const trainingStats = [
    {
      title: 'Training Sessions',
      value: '156',
      change: '+12.5%',
      trend: 'up',
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50/80',
      description: 'Total training sessions completed'
    },
    {
      title: 'Accuracy Rate',
      value: '94.2%',
      change: '+2.3%',
      trend: 'up',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50/80',
      description: 'Current model accuracy'
    },
    {
      title: 'Response Time',
      value: '1.8s',
      change: '-15.7%',
      trend: 'down',
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50/80',
      description: 'Average response time'
    },
    {
      title: 'Active Models',
      value: '3',
      change: '+1',
      trend: 'up',
      icon: Bot,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50/80',
      description: 'Deployed AI models'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Modern Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-purple-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl shadow-blue-500/5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                      AI Training Studio
                    </h1>
                    <p className="text-slate-600">Train and optimize your AI chatbots for exceptional customer support</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleCreateNewBot}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Bot
                </Button>
                <Button 
                  onClick={handleQuickTrain}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Quick Train
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Training Interface - Azure-inspired Design */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/3 to-purple-600/5 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden">
            {/* Modern Tab Header */}
            <div className="bg-gradient-to-r from-slate-50/80 via-blue-50/50 to-indigo-50/80 backdrop-blur-sm border-b border-white/30">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Training Interface</CardTitle>
                    <CardDescription className="text-slate-600">Configure and train your AI models with advanced settings</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-100/80 text-green-700 border-green-200/50">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                </div>
              </div>
            </div>

            {/* Modern Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-white/30 bg-gradient-to-r from-slate-50/50 to-blue-50/30">
                <TabsList className="h-auto bg-transparent p-0 space-x-0">
                  <div className="flex overflow-x-auto scrollbar-hide px-6">
                    <TabsTrigger 
                      value="management" 
                      className="flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-300 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-white/60 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-sm backdrop-blur-sm"
                    >
                      <Bot className="w-4 h-4" />
                      Bot Management
                    </TabsTrigger>
                    <TabsTrigger 
                      value="training" 
                      className="flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-300 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-white/60 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-sm backdrop-blur-sm"
                    >
                      <Brain className="w-4 h-4" />
                      Training
                    </TabsTrigger>
                    <TabsTrigger 
                      value="presets" 
                      className="flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-300 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-white/60 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-sm backdrop-blur-sm"
                    >
                      <Star className="w-4 h-4" />
                      Presets
                    </TabsTrigger>
                    <TabsTrigger 
                      value="settings" 
                      className="flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-300 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-white/60 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-sm backdrop-blur-sm"
                    >
                      <Settings className="w-4 h-4" />
                      LLM Settings
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-300 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-white/60 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-sm backdrop-blur-sm"
                    >
                      <Shield className="w-4 h-4" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger 
                      value="testing" 
                      className="flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-300 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-white/60 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-sm backdrop-blur-sm"
                    >
                      <TestTube className="w-4 h-4" />
                      Testing
                    </TabsTrigger>
                    <TabsTrigger 
                      value="analytics" 
                      className="flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-300 border-b-2 bg-transparent rounded-none whitespace-nowrap border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-white/60 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-sm backdrop-blur-sm"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Analytics
                    </TabsTrigger>
                  </div>
                </TabsList>
              </div>

              {/* Tab Content with Glass Morphism */}
              <div className="p-8 bg-gradient-to-br from-white/40 to-slate-50/30 backdrop-blur-sm">
                <TabsContent value="management" className="mt-0">
                  <div className="space-y-6">
                    {/* Bot Management Content */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl shadow-blue-500/5 p-6">
                      <ChatbotList 
                        onSelectChatbot={handleSelectChatbot}
                        onEditChatbot={handleEditChatbot}
                        onDeleteChatbot={handleDeleteChatbot}
                        onCreateNew={handleCreateNewBot}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="training" className="mt-0 space-y-8">
                  {/* Toggle Buttons for Section Selection */}
                  <div className="flex items-center justify-center">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl shadow-blue-500/5 p-2">
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          onClick={() => setTrainingSection('bot-training')}
                          variant={trainingSection === 'bot-training' ? 'default' : 'ghost'}
                          className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                            trainingSection === 'bot-training'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                              : 'bg-white/50 backdrop-blur-sm hover:bg-white/80 border border-white/30 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <Brain className="w-5 h-5 mr-2" />
                          Bot Training Studio
                        </Button>
                        <Button
                          onClick={() => setTrainingSection('sop-upload')}
                          variant={trainingSection === 'sop-upload' ? 'default' : 'ghost'}
                          className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                            trainingSection === 'sop-upload'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                              : 'bg-white/50 backdrop-blur-sm hover:bg-white/80 border border-white/30 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <Upload className="w-5 h-5 mr-2" />
                          SOP Upload & Training
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl shadow-blue-500/5 p-6">
                    {trainingSection === 'bot-training' ? (
                      <StandardBotTraining />
                    ) : trainingSection === 'sop-upload' ? (
                      <SOPUploadManager />
                    ) : (
                      <StandardBotTraining />
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="presets" className="mt-0">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl shadow-blue-500/5 p-6">
                    <TrainingPresetTab />
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl shadow-blue-500/5 p-6">
                    <LLMSettingsPanel />
                  </div>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl shadow-blue-500/5 p-6">
                    <SecurityPanel />
                  </div>
                </TabsContent>

                <TabsContent value="testing" className="mt-0">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl shadow-blue-500/5 p-6">
                    <TestChatInterface />
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-0">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl shadow-blue-500/5 p-6">
                    <ChatbotAnalytics />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateBotModal 
        isOpen={isCreateModalOpen} 
        onClose={() => { setIsCreateModalOpen(false); setBotToEdit(null); }}
        onBotCreated={handleBotCreated}
        botToEdit={botToEdit}
      />
      
      <QuickTrainModal 
        open={isQuickTrainModalOpen} 
        onOpenChange={setIsQuickTrainModalOpen}
      />
    </div>
  );
};
