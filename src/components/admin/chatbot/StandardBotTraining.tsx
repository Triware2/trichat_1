
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConversationFlowBuilder } from './components/ConversationFlowBuilder';
import { AdvancedConditionsBuilder } from './components/AdvancedConditionsBuilder';
import { RuleTestingInterface } from './components/RuleTestingInterface';
import { TrainingHeader } from './components/TrainingHeader';
import { BotSelector } from './components/BotSelector';
import { RuleCreationForm } from './components/RuleCreationForm';
import { RulesList } from './components/RulesList';
import { 
  MessageSquare,
  Settings,
  Workflow,
  TestTube
} from 'lucide-react';
import { BotRule, ConversationFlow } from './types';

interface StandardBotTrainingProps {
  selectedBotId?: string | null;
}

export const StandardBotTraining = ({ selectedBotId }: StandardBotTrainingProps) => {
  const [activeBot, setActiveBot] = useState('');
  const [rules, setRules] = useState<BotRule[]>([]);
  const [newRule, setNewRule] = useState<Partial<BotRule>>({
    trigger: '',
    response: '',
    priority: 1,
    is_active: true,
    conditions: []
  });
  const [editingRule, setEditingRule] = useState<string | null>(null);

  // Update activeBot when selectedBotId changes
  useEffect(() => {
    if (selectedBotId) {
      setActiveBot(selectedBotId);
    }
  }, [selectedBotId]);

  const standardBots = [
    { id: '1', name: 'FAQ Assistant' },
    { id: '2', name: 'Billing Inquiries Bot' },
    { id: '3', name: 'Order Status Bot' }
  ];

  const mockRules: BotRule[] = [
    {
      id: '1',
      trigger: 'billing',
      conditions: [
        { field: 'message', operator: 'contains', value: 'billing' }
      ],
      response: 'I can help you with billing questions. What specific billing issue do you have?',
      priority: 1,
      is_active: true
    },
    {
      id: '2', 
      trigger: 'order_status',
      conditions: [
        { field: 'message', operator: 'contains', value: 'order' }
      ],
      response: 'To check your order status, please provide your order number.',
      priority: 2,
      is_active: true
    }
  ];

  const handleAddRule = () => {
    if (newRule.trigger && newRule.response) {
      const rule: BotRule = {
        id: Date.now().toString(),
        trigger: newRule.trigger,
        conditions: newRule.conditions || [],
        response: newRule.response,
        priority: newRule.priority || 1,
        is_active: true
      };
      setRules([...rules, rule]);
      setNewRule({
        trigger: '',
        response: '',
        priority: 1,
        is_active: true,
        conditions: []
      });
    }
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const handleEditRule = (rule: BotRule) => {
    setEditingRule(rule.id);
    setNewRule(rule);
  };

  const handleSaveRule = () => {
    if (editingRule && newRule.trigger && newRule.response) {
      setRules(rules.map(rule => 
        rule.id === editingRule 
          ? { ...rule, ...newRule }
          : rule
      ));
      setEditingRule(null);
      setNewRule({
        trigger: '',
        response: '',
        priority: 1,
        is_active: true,
        conditions: []
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
    setNewRule({
      trigger: '',
      response: '',
      priority: 1,
      is_active: true,
      conditions: []
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
        <TrainingHeader onExportRules={exportRules} />

        <BotSelector 
          activeBot={activeBot}
          onBotChange={setActiveBot}
          standardBots={standardBots}
        />

        {activeBot && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden">
            <Tabs defaultValue="rules" className="w-full">
              <div className="border-b border-gray-100/70 px-10 pt-8">
                <TabsList className="bg-gray-50/80 rounded-2xl p-2 h-14 shadow-sm">
                  <TabsTrigger 
                    value="rules" 
                    className="flex items-center gap-3 px-8 py-3 text-sm font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Rules & Triggers
                  </TabsTrigger>
                  <TabsTrigger 
                    value="flows" 
                    className="flex items-center gap-3 px-8 py-3 text-sm font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    <Workflow className="w-4 h-4" />
                    Conversation Flows
                  </TabsTrigger>
                  <TabsTrigger 
                    value="conditions" 
                    className="flex items-center gap-3 px-8 py-3 text-sm font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    <Settings className="w-4 h-4" />
                    Advanced Conditions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="testing" 
                    className="flex items-center gap-3 px-8 py-3 text-sm font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
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
                    mockRules={mockRules}
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
      </div>
    </div>
  );
};
