
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Settings, 
  Zap, 
  Shield,
  Database,
  MessageSquare,
  Sliders,
  Save,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface LLMSettingsPanelProps {
  selectedBotId?: string | null;
}

interface LLMConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  systemPrompt: string;
  contextWindow: number;
  responseFormat: string;
  enableFunctionCalling: boolean;
  enableStreaming: boolean;
  safetyLevel: string;
}

export const LLMSettingsPanel = ({ selectedBotId }: LLMSettingsPanelProps) => {
  const { toast } = useToast();
  const [activeBot, setActiveBot] = useState('');
  const [config, setConfig] = useState<LLMConfig>({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1.0,
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemPrompt: 'You are a helpful customer support assistant. Always be polite, professional, and helpful.',
    contextWindow: 8192,
    responseFormat: 'text',
    enableFunctionCalling: true,
    enableStreaming: true,
    safetyLevel: 'medium'
  });

  // Update activeBot when selectedBotId changes
  useEffect(() => {
    if (selectedBotId) {
      setActiveBot(selectedBotId);
    }
  }, [selectedBotId]);

  const llmBots = [
    { id: '1', name: 'Customer Support Bot', model: 'GPT-4' },
    { id: '3', name: 'Technical Support AI', model: 'Claude-3' }
  ];

  const availableModels = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', contextWindow: 8192 },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', contextWindow: 4096 },
    { id: 'claude-3', name: 'Claude-3', provider: 'Anthropic', contextWindow: 200000 },
    { id: 'claude-3-haiku', name: 'Claude-3 Haiku', provider: 'Anthropic', contextWindow: 200000 }
  ];

  const handleSaveConfig = () => {
    toast({
      title: "Configuration Saved",
      description: "LLM settings have been updated successfully",
    });
  };

  const handleTestModel = () => {
    toast({
      title: "Testing Model",
      description: "Sending test prompt to validate configuration...",
    });
  };

  const resetToDefaults = () => {
    setConfig({
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
      topP: 1.0,
      frequencyPenalty: 0,
      presencePenalty: 0,
      systemPrompt: 'You are a helpful customer support assistant. Always be polite, professional, and helpful.',
      contextWindow: 8192,
      responseFormat: 'text',
      enableFunctionCalling: true,
      enableStreaming: true,
      safetyLevel: 'medium'
    });
    toast({
      title: "Reset to Defaults",
      description: "Configuration has been reset to default values",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">LLM Configuration</h2>
          <p className="text-gray-600 mt-1">Configure AI model settings and behavior for your chatbots</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Defaults
          </Button>
          <Button onClick={handleSaveConfig} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>

      {/* Bot Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select LLM Bot</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={activeBot} onValueChange={setActiveBot}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Choose an LLM bot to configure" />
            </SelectTrigger>
            <SelectContent>
              {llmBots.map(bot => (
                <SelectItem key={bot.id} value={bot.id}>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    {bot.name} ({bot.model})
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activeBot && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800">
                Configuring: <span className="font-semibold">{llmBots.find(b => b.id === activeBot)?.name}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {activeBot && (
        <Tabs defaultValue="model" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="model" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Model Selection
            </TabsTrigger>
            <TabsTrigger value="parameters" className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              Parameters
            </TabsTrigger>
            <TabsTrigger value="prompt" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              System Prompt
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Safety & Limits
            </TabsTrigger>
          </TabsList>

          {/* Model Selection Tab */}
          <TabsContent value="model" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="model">AI Model</Label>
                  <Select value={config.model} onValueChange={(value) => setConfig({...config, model: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex justify-between items-center w-full">
                            <span>{model.name}</span>
                            <Badge variant="outline" className="ml-2">{model.provider}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contextWindow">Context Window</Label>
                    <Input
                      id="contextWindow"
                      type="number"
                      value={config.contextWindow}
                      onChange={(e) => setConfig({...config, contextWindow: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="responseFormat">Response Format</Label>
                    <Select value={config.responseFormat} onValueChange={(value) => setConfig({...config, responseFormat: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="markdown">Markdown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="functionCalling"
                      checked={config.enableFunctionCalling}
                      onCheckedChange={(checked) => setConfig({...config, enableFunctionCalling: checked})}
                    />
                    <Label htmlFor="functionCalling">Enable Function Calling</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="streaming"
                      checked={config.enableStreaming}
                      onCheckedChange={(checked) => setConfig({...config, enableStreaming: checked})}
                    />
                    <Label htmlFor="streaming">Enable Streaming</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parameters Tab */}
          <TabsContent value="parameters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Parameters</CardTitle>
                <p className="text-sm text-gray-600">Fine-tune the AI's response behavior</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="temperature">Temperature: {config.temperature}</Label>
                  <Slider
                    id="temperature"
                    min={0}
                    max={2}
                    step={0.1}
                    value={[config.temperature]}
                    onValueChange={(value) => setConfig({...config, temperature: value[0]})}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Controls randomness. Lower = more focused, Higher = more creative</p>
                </div>

                <div>
                  <Label htmlFor="maxTokens">Max Tokens: {config.maxTokens}</Label>
                  <Slider
                    id="maxTokens"
                    min={1}
                    max={4096}
                    step={1}
                    value={[config.maxTokens]}
                    onValueChange={(value) => setConfig({...config, maxTokens: value[0]})}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum length of the response</p>
                </div>

                <div>
                  <Label htmlFor="topP">Top P: {config.topP}</Label>
                  <Slider
                    id="topP"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[config.topP]}
                    onValueChange={(value) => setConfig({...config, topP: value[0]})}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Controls diversity via nucleus sampling</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frequencyPenalty">Frequency Penalty: {config.frequencyPenalty}</Label>
                    <Slider
                      id="frequencyPenalty"
                      min={-2}
                      max={2}
                      step={0.1}
                      value={[config.frequencyPenalty]}
                      onValueChange={(value) => setConfig({...config, frequencyPenalty: value[0]})}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="presencePenalty">Presence Penalty: {config.presencePenalty}</Label>
                    <Slider
                      id="presencePenalty"
                      min={-2}
                      max={2}
                      step={0.1}
                      value={[config.presencePenalty]}
                      onValueChange={(value) => setConfig({...config, presencePenalty: value[0]})}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Prompt Tab */}
          <TabsContent value="prompt" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Prompt Configuration</CardTitle>
                <p className="text-sm text-gray-600">Define the AI's personality and behavior</p>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    value={config.systemPrompt}
                    onChange={(e) => setConfig({...config, systemPrompt: e.target.value})}
                    rows={8}
                    className="mt-2"
                    placeholder="Enter the system prompt that defines how the AI should behave..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This prompt sets the context and personality for the AI. Be specific about tone, style, and limitations.
                  </p>
                </div>
                <Button onClick={handleTestModel} className="mt-4">
                  <Zap className="w-4 h-4 mr-2" />
                  Test Prompt
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Safety & Limits Tab */}
          <TabsContent value="safety" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Safety & Content Filtering</CardTitle>
                <p className="text-sm text-gray-600">Configure safety measures and content policies</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="safetyLevel">Safety Level</Label>
                  <Select value={config.safetyLevel} onValueChange={(value) => setConfig({...config, safetyLevel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minimal filtering</SelectItem>
                      <SelectItem value="medium">Medium - Balanced approach</SelectItem>
                      <SelectItem value="high">High - Strict filtering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Content Policy Notice</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        All AI responses are subject to content filtering. Inappropriate content will be automatically blocked.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
