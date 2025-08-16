
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConversationFlowBuilder } from './components/ConversationFlowBuilder';
import { AdvancedConditionsBuilder } from './components/AdvancedConditionsBuilder';
import { RuleTestingInterface } from './components/RuleTestingInterface';
import { BotSelector } from './components/BotSelector';
import { RuleCreationForm } from './components/RuleCreationForm';
import { RulesList } from './components/RulesList';
import { chatbotService, Chatbot, ChatbotRule } from '@/services/chatbotService';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare,
  Settings,
  Workflow,
  TestTube
} from 'lucide-react';
import { QuickTrainModal } from './QuickTrainModal';

interface StandardBotTrainingProps {
  selectedBotId?: string | null;
}

export const StandardBotTraining = ({ selectedBotId }: StandardBotTrainingProps) => {
  const { toast } = useToast();
  const [activeBot, setActiveBot] = useState('');
  const [rules, setRules] = useState<ChatbotRule[]>([]);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRule, setNewRule] = useState<Partial<ChatbotRule>>({
    rule_name: '',
    rule_description: '',
    rule_content: '',
    rule_type: 'response',
    is_active: true
  });
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [isQuickTrainModalOpen, setIsQuickTrainModalOpen] = useState(false);

  // Load chatbots and rules
  useEffect(() => {
    loadChatbots();
  }, []);

  useEffect(() => {
    if (activeBot) {
      loadRules(activeBot);
    }
  }, [activeBot]);

  // Update activeBot when selectedBotId changes
  useEffect(() => {
    if (selectedBotId) {
      setActiveBot(selectedBotId);
    }
  }, [selectedBotId]);

  const loadChatbots = async () => {
    try {
      setLoading(true);
      const data = await chatbotService.getChatbots();
      // Filter for bots that can be trained (all bots for now)
      setChatbots(data);
    } catch (error) {
      console.error('Error loading chatbots:', error);
      toast({
        title: "Error",
        description: "Failed to load chatbots. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRules = async (chatbotId: string) => {
    try {
      const data = await chatbotService.getChatbotRules(chatbotId);
      setRules(data);
    } catch (error) {
      console.error('Error loading rules:', error);
      toast({
        title: "Error",
        description: "Failed to load rules. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddRule = async () => {
    if (!newRule.rule_name || !newRule.rule_content || !activeBot) return;

    try {
      const rule: Omit<ChatbotRule, 'id' | 'created_at'> = {
        chatbot_id: activeBot,
        rule_name: newRule.rule_name,
        rule_description: newRule.rule_description || '',
        rule_content: newRule.rule_content,
        rule_type: newRule.rule_type || 'response',
        is_active: newRule.is_active || true
      };

      const createdRule = await chatbotService.createChatbotRule(rule);
      if (createdRule) {
        setRules([...rules, createdRule]);
        setNewRule({
          rule_name: '',
          rule_description: '',
          rule_content: '',
          rule_type: 'response',
          is_active: true
        });

        toast({
          title: "Rule Created",
          description: "New rule has been created successfully",
        });
      }
    } catch (error) {
      console.error('Error creating rule:', error);
      toast({
        title: "Error",
        description: "Failed to create rule. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      const success = await chatbotService.deleteChatbotRule(id);
      if (success) {
        setRules(rules.filter(rule => rule.id !== id));
        
        toast({
          title: "Rule Deleted",
          description: "Rule has been deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast({
        title: "Error",
        description: "Failed to delete rule. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditRule = (rule: ChatbotRule) => {
    setEditingRule(rule.id);
    setNewRule(rule);
  };

  const handleSaveRule = async () => {
    if (!editingRule || !newRule.rule_name || !newRule.rule_content) return;

    try {
      const updatedRule = await chatbotService.updateChatbotRule(editingRule, newRule);
      if (updatedRule) {
        setRules(rules.map(rule => 
          rule.id === editingRule ? updatedRule : rule
        ));
        setEditingRule(null);
        setNewRule({
          rule_name: '',
          rule_description: '',
          rule_content: '',
          rule_type: 'response',
          is_active: true
        });

        toast({
          title: "Rule Updated",
          description: "Rule has been updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating rule:', error);
      toast({
        title: "Error",
        description: "Failed to update rule. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
    setNewRule({
      rule_name: '',
      rule_description: '',
      rule_content: '',
      rule_type: 'response',
      is_active: true
    });
  };

  const exportRules = () => {
    const dataStr = JSON.stringify(rules, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'chatbot-rules.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Rules Exported",
      description: "Chatbot rules have been exported successfully",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
          <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-64 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-96 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
        <BotSelector 
          activeBot={activeBot}
          onBotChange={setActiveBot}
          standardBots={chatbots}
        />

        {activeBot && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <Tabs defaultValue="rules" className="w-full">
              <div className="border-b border-slate-200 px-10 pt-8">
                <TabsList className="bg-slate-50 rounded-2xl p-2 h-14 shadow-sm">
                  <TabsTrigger 
                    value="rules" 
                    className="flex items-center gap-3 px-8 py-3 text-sm font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300 data-[state=active]:border-blue-600"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Rules & Triggers
                  </TabsTrigger>
                  <TabsTrigger 
                    value="flows" 
                    className="flex items-center gap-3 px-8 py-3 text-sm font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300 data-[state=active]:border-blue-600"
                  >
                    <Workflow className="w-4 h-4" />
                    Conversation Flows
                  </TabsTrigger>
                  <TabsTrigger 
                    value="conditions" 
                    className="flex items-center gap-3 px-8 py-3 text-sm font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300 data-[state=active]:border-blue-600"
                  >
                    <Settings className="w-4 h-4" />
                    Advanced Conditions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="testing" 
                    className="flex items-center gap-3 px-8 py-3 text-sm font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300 data-[state=active]:border-blue-600"
                  >
                    <TestTube className="w-4 h-4" />
                    Test & Validate
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-10">
                <TabsContent value="rules" className="mt-0 space-y-10">
                  <RuleCreationForm
                    newRule={newRule}
                    editingRule={editingRule}
                    onRuleChange={setNewRule}
                    onAddRule={handleAddRule}
                    onSaveRule={handleSaveRule}
                    onCancelEdit={handleCancelEdit}
                  />

                  <RulesList
                    rules={rules}
                    mockRules={[]}
                    onEditRule={handleEditRule}
                    onDeleteRule={handleDeleteRule}
                  />
                </TabsContent>

                <TabsContent value="flows" className="mt-0">
                  <ConversationFlowBuilder />
                </TabsContent>

                <TabsContent value="conditions" className="mt-0">
                  <AdvancedConditionsBuilder />
                </TabsContent>

                <TabsContent value="testing" className="mt-0">
                  <RuleTestingInterface />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}

        {!activeBot && chatbots.length > 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Settings className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a Bot to Train</h3>
            <p className="text-slate-600">Choose a bot from the dropdown above to start configuring rules and training.</p>
          </div>
        )}

        {!activeBot && chatbots.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Settings className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Bots Available</h3>
            <p className="text-slate-600">Create a bot first to start training with rules and triggers.</p>
          </div>
        )}
      </div>
      <QuickTrainModal open={isQuickTrainModalOpen} onOpenChange={setIsQuickTrainModalOpen} />
    </div>
  );
};
