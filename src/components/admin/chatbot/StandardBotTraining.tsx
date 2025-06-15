import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConversationFlowBuilder } from './components/ConversationFlowBuilder';
import { AdvancedConditionsBuilder } from './components/AdvancedConditionsBuilder';
import { RuleTestingInterface } from './components/RuleTestingInterface';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Download, 
  Upload,
  MessageSquare,
  Settings,
  Brain,
  Workflow,
  TestTube,
  Bot,
  Zap
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

  const mockFlows: ConversationFlow[] = [
    {
      id: '1',
      name: 'Order Status Flow',
      trigger_intent: 'order_status',
      is_active: true,
      steps: [
        {
          id: '1',
          type: 'message',
          content: 'I can help you check your order status.',
          next_step: '2'
        },
        {
          id: '2',
          type: 'question',
          content: 'Please provide your order number:',
          next_step: '3'
        },
        {
          id: '3',
          type: 'action',
          content: 'Looking up order...',
          next_step: '4'
        }
      ]
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-900 mb-2">Bot Training Studio</h1>
                <p className="text-gray-600 text-lg font-light">Configure intelligent responses and conversation flows</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={exportRules}
                className="border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </div>

        {/* Bot Selection */}
        <Card className="bg-white shadow-sm border-gray-100 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-light text-gray-900 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              Select Training Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={activeBot} onValueChange={setActiveBot}>
              <SelectTrigger className="w-full max-w-md border-gray-200 rounded-xl focus:border-blue-500 transition-colors">
                <SelectValue placeholder="Choose a bot to configure" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200">
                {standardBots.map(bot => (
                  <SelectItem key={bot.id} value={bot.id} className="rounded-lg">
                    {bot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activeBot && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-blue-900 font-medium">
                    Training: <span className="font-light">{standardBots.find(b => b.id === activeBot)?.name}</span>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {activeBot && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <Tabs defaultValue="rules" className="w-full">
              <div className="border-b border-gray-100 px-8 pt-6">
                <TabsList className="bg-gray-50 rounded-xl p-1 h-12">
                  <TabsTrigger 
                    value="rules" 
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Rules & Triggers
                  </TabsTrigger>
                  <TabsTrigger 
                    value="flows" 
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                  >
                    <Workflow className="w-4 h-4" />
                    Conversation Flows
                  </TabsTrigger>
                  <TabsTrigger 
                    value="conditions" 
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    Advanced Conditions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="testing" 
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                  >
                    <TestTube className="w-4 h-4" />
                    Test & Validate
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-8">
                {/* Rules Tab */}
                <TabsContent value="rules" className="mt-0 space-y-8">
                  <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-light text-gray-900">Create New Rule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="trigger" className="text-sm font-medium text-gray-700">Trigger Keywords</Label>
                          <Input
                            id="trigger"
                            value={newRule.trigger}
                            onChange={(e) => setNewRule({...newRule, trigger: e.target.value})}
                            placeholder="billing, order, support"
                            className="border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority Level</Label>
                          <Input
                            id="priority"
                            type="number"
                            min="1"
                            max="10"
                            value={newRule.priority}
                            onChange={(e) => setNewRule({...newRule, priority: parseInt(e.target.value)})}
                            className="border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="response" className="text-sm font-medium text-gray-700">Bot Response</Label>
                        <Textarea
                          id="response"
                          value={newRule.response}
                          onChange={(e) => setNewRule({...newRule, response: e.target.value})}
                          placeholder="I can help you with billing questions. What specific issue do you have?"
                          rows={4}
                          className="border-gray-200 rounded-xl focus:border-blue-500 transition-colors resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        {editingRule ? (
                          <>
                            <Button 
                              onClick={handleSaveRule} 
                              className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 transition-all duration-200"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setEditingRule(null);
                                setNewRule({
                                  trigger: '',
                                  response: '',
                                  priority: 1,
                                  is_active: true,
                                  conditions: []
                                });
                              }}
                              className="border-gray-200 rounded-xl px-6 transition-all duration-200"
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={handleAddRule} 
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 transition-all duration-200"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Rule
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Existing Rules */}
                  <Card className="border-gray-200 rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-light text-gray-900">Active Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(rules.length > 0 ? rules : mockRules).map(rule => (
                          <div key={rule.id} className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 rounded-lg px-3 py-1">
                                    {rule.trigger}
                                  </Badge>
                                  <Badge className={`rounded-lg px-3 py-1 ${rule.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                                    {rule.is_active ? 'Active' : 'Inactive'}
                                  </Badge>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                    Priority: {rule.priority}
                                  </span>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-100">
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {rule.response}
                                  </p>
                                </div>
                                {rule.conditions.length > 0 && (
                                  <div className="mt-3">
                                    <span className="text-xs font-medium text-gray-500 mb-2 block">Conditions:</span>
                                    <div className="flex flex-wrap gap-2">
                                      {rule.conditions.map((condition, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 rounded-md">
                                          {condition.field} {condition.operator} {condition.value}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2 ml-6">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleEditRule(rule)}
                                  className="border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleDeleteRule(rule.id)}
                                  className="border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all duration-200"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {rules.length === 0 && (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <MessageSquare className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-light">No rules configured yet. Create your first rule above.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Other Tabs */}
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
