import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  ArrowRight,
  ArrowDown
} from 'lucide-react';
import { BotRule, ConversationFlow, FlowStep } from './types';

interface StandardBotTrainingProps {
  selectedBotId?: string | null;
}

export const StandardBotTraining = ({ selectedBotId }: StandardBotTrainingProps) => {
  const [activeBot, setActiveBot] = useState('');
  const [rules, setRules] = useState<BotRule[]>([]);
  const [flows, setFlows] = useState<ConversationFlow[]>([]);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Rule-Based Bot Training</h2>
          <p className="text-gray-600 mt-1">Configure rules, flows, and responses for standard chatbots</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportRules}>
            <Download className="w-4 h-4 mr-2" />
            Export Rules
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Rules
          </Button>
        </div>
      </div>

      {/* Bot Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Bot to Train</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={activeBot} onValueChange={setActiveBot}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Choose a standard bot to configure" />
            </SelectTrigger>
            <SelectContent>
              {standardBots.map(bot => (
                <SelectItem key={bot.id} value={bot.id}>
                  {bot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activeBot && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                Training bot: <span className="font-semibold">{standardBots.find(b => b.id === activeBot)?.name}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {activeBot && (
        <Tabs defaultValue="rules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Rules & Triggers
            </TabsTrigger>
            <TabsTrigger value="flows" className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              Conversation Flows
            </TabsTrigger>
            <TabsTrigger value="conditions" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Advanced Conditions
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Rule Testing
            </TabsTrigger>
          </TabsList>

          {/* Rules Tab */}
          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Rule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trigger">Trigger Keywords</Label>
                    <Input
                      id="trigger"
                      value={newRule.trigger}
                      onChange={(e) => setNewRule({...newRule, trigger: e.target.value})}
                      placeholder="billing, order, support"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority (1-10)</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="1"
                      max="10"
                      value={newRule.priority}
                      onChange={(e) => setNewRule({...newRule, priority: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="response">Bot Response</Label>
                  <Textarea
                    id="response"
                    value={newRule.response}
                    onChange={(e) => setNewRule({...newRule, response: e.target.value})}
                    placeholder="I can help you with billing questions. What specific issue do you have?"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  {editingRule ? (
                    <>
                      <Button onClick={handleSaveRule} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setEditingRule(null);
                        setNewRule({
                          trigger: '',
                          response: '',
                          priority: 1,
                          is_active: true,
                          conditions: []
                        });
                      }}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleAddRule} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Rule
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Existing Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Configured Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(rules.length > 0 ? rules : mockRules).map(rule => (
                    <div key={rule.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{rule.trigger}</Badge>
                            <Badge className={rule.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {rule.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <span className="text-xs text-gray-500">Priority: {rule.priority}</span>
                          </div>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {rule.response}
                          </p>
                          {rule.conditions.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-gray-500">Conditions:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {rule.conditions.map((condition, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {condition.field} {condition.operator} {condition.value}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline" onClick={() => handleEditRule(rule)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteRule(rule.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {rules.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No rules configured yet. Add your first rule above.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flows Tab */}
          <TabsContent value="flows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Flows</CardTitle>
                <p className="text-sm text-gray-600">Design multi-step conversations for complex scenarios</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockFlows.map(flow => (
                    <div key={flow.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">{flow.name}</h3>
                        <Badge className={flow.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {flow.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {flow.steps.map((step, index) => (
                          <div key={step.id} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">{step.type}</Badge>
                              </div>
                              <p className="text-sm">{step.content}</p>
                            </div>
                            {index < flow.steps.length - 1 && (
                              <ArrowDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Flow
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conditions Tab */}
          <TabsContent value="conditions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Condition Builder</CardTitle>
                <p className="text-sm text-gray-600">Create complex conditional logic for your rules</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Advanced condition builder coming soon...</p>
                  <p className="text-sm">Build complex IF-THEN-ELSE logic for sophisticated bot responses</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rule Testing Interface</CardTitle>
                <p className="text-sm text-gray-600">Test your rules with sample inputs</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Rule testing interface coming soon...</p>
                  <p className="text-sm">Test how your bot responds to different user inputs</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
