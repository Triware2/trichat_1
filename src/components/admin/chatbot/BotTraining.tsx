
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Brain, 
  MessageSquare, 
  Target,
  Settings,
  Upload
} from 'lucide-react';
import { BotTrainingData, BotConfiguration } from './types';

export const BotTraining = () => {
  const { toast } = useToast();
  const [trainingData, setTrainingData] = useState<BotTrainingData[]>([
    {
      id: '1',
      intent: 'greeting',
      examples: ['hello', 'hi', 'good morning', 'hey there'],
      responses: ['Hello! How can I help you today?', 'Hi there! What can I do for you?'],
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z'
    },
    {
      id: '2',
      intent: 'order_status',
      examples: ['where is my order', 'order status', 'track my order', 'order tracking'],
      responses: ['I can help you track your order. Could you provide your order number?'],
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z'
    }
  ]);

  const [botConfig, setBotConfig] = useState<BotConfiguration>({
    id: '1',
    name: 'Customer Support Bot',
    welcome_message: 'Hello! I\'m here to help you with your questions. How can I assist you today?',
    fallback_message: 'I\'m sorry, I didn\'t quite understand that. Let me connect you with one of our agents who can help you better.',
    escalation_threshold: 0.6,
    max_bot_attempts: 3,
    is_active: true,
    auto_escalate_keywords: ['agent', 'human', 'representative', 'escalate', 'manager'],
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  });

  const [newIntent, setNewIntent] = useState({ intent: '', examples: '', responses: '' });
  const [editingIntent, setEditingIntent] = useState<string | null>(null);

  const handleAddIntent = () => {
    if (!newIntent.intent || !newIntent.examples || !newIntent.responses) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to add a new intent.",
        variant: "destructive"
      });
      return;
    }

    const intent: BotTrainingData = {
      id: Date.now().toString(),
      intent: newIntent.intent,
      examples: newIntent.examples.split('\n').map(e => e.trim()).filter(e => e),
      responses: newIntent.responses.split('\n').map(r => r.trim()).filter(r => r),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setTrainingData([...trainingData, intent]);
    setNewIntent({ intent: '', examples: '', responses: '' });
    
    toast({
      title: "Intent Added",
      description: "New training intent has been added successfully.",
    });
  };

  const handleDeleteIntent = (id: string) => {
    setTrainingData(trainingData.filter(item => item.id !== id));
    toast({
      title: "Intent Deleted",
      description: "Training intent has been removed.",
    });
  };

  const handleUpdateConfig = () => {
    setBotConfig({
      ...botConfig,
      updated_at: new Date().toISOString()
    });
    
    toast({
      title: "Configuration Updated",
      description: "Bot configuration has been saved successfully.",
    });
  };

  const handleTrainBot = () => {
    toast({
      title: "Training Started",
      description: "Bot training has been initiated. This may take a few minutes.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chatbot Training & Configuration</h2>
          <p className="text-gray-600 mt-1">Train your bot to handle customer inquiries automatically</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleTrainBot} className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Brain className="w-4 h-4 mr-2" />
            Train Bot
          </Button>
          <Badge variant={botConfig.is_active ? "default" : "secondary"}>
            {botConfig.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="training">Training Data</TabsTrigger>
          <TabsTrigger value="testing">Test Bot</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Bot Configuration
              </CardTitle>
              <CardDescription>
                Configure bot behavior and escalation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bot Name</label>
                  <Input
                    value={botConfig.name}
                    onChange={(e) => setBotConfig({...botConfig, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Bot Attempts</label>
                  <Input
                    type="number"
                    value={botConfig.max_bot_attempts}
                    onChange={(e) => setBotConfig({...botConfig, max_bot_attempts: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Welcome Message</label>
                <Textarea
                  value={botConfig.welcome_message}
                  onChange={(e) => setBotConfig({...botConfig, welcome_message: e.target.value})}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fallback Message</label>
                <Textarea
                  value={botConfig.fallback_message}
                  onChange={(e) => setBotConfig({...botConfig, fallback_message: e.target.value})}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Auto-Escalate Keywords (one per line)</label>
                <Textarea
                  value={botConfig.auto_escalate_keywords.join('\n')}
                  onChange={(e) => setBotConfig({
                    ...botConfig, 
                    auto_escalate_keywords: e.target.value.split('\n').map(k => k.trim()).filter(k => k)
                  })}
                  rows={3}
                  placeholder="agent&#10;human&#10;representative"
                />
              </div>

              <Button onClick={handleUpdateConfig} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Intent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Intent Name</label>
                  <Input
                    value={newIntent.intent}
                    onChange={(e) => setNewIntent({...newIntent, intent: e.target.value})}
                    placeholder="e.g., greeting, order_status, payment_issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Training Examples (one per line)</label>
                  <Textarea
                    value={newIntent.examples}
                    onChange={(e) => setNewIntent({...newIntent, examples: e.target.value})}
                    rows={4}
                    placeholder="hello&#10;hi there&#10;good morning"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bot Responses (one per line)</label>
                  <Textarea
                    value={newIntent.responses}
                    onChange={(e) => setNewIntent({...newIntent, responses: e.target.value})}
                    rows={3}
                    placeholder="Hello! How can I help you?&#10;Hi there! What can I do for you?"
                  />
                </div>
                <Button onClick={handleAddIntent} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Intent
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Training Data ({trainingData.length} intents)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingData.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-lg">{item.intent}</h4>
                          <p className="text-sm text-gray-500">
                            {item.examples.length} examples • {item.responses.length} responses
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteIntent(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Examples:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.examples.slice(0, 3).map((example, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {example}
                              </Badge>
                            ))}
                            {item.examples.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.examples.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Response:</p>
                          <p className="text-sm text-gray-600">{item.responses[0]}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Test Bot Responses
              </CardTitle>
              <CardDescription>
                Test how your bot responds to different customer messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                  <p className="text-center text-gray-500">Bot testing interface would go here</p>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Type a test message..." className="flex-1" />
                  <Button>Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
