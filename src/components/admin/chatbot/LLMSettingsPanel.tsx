
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Settings, 
  Zap, 
  Shield,
  TestTube,
  Save,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface LLMConfiguration {
  id: string;
  name: string;
  provider: string;
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  systemPrompt: string;
  isActive: boolean;
}

export const LLMSettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('configurations');
  const [selectedConfig, setSelectedConfig] = useState<string>('');
  
  const [llmConfigurations, setLlmConfigurations] = useState<LLMConfiguration[]>([
    {
      id: '1',
      name: 'Primary Support Bot',
      provider: 'openai',
      model: 'gpt-4',
      apiKey: 'sk-****...****',
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      systemPrompt: 'You are a helpful customer support assistant. Always be professional, empathetic, and provide accurate information based on the company SOPs.',
      isActive: true
    },
    {
      id: '2',
      name: 'Technical Support AI',
      provider: 'anthropic',
      model: 'claude-3-sonnet',
      apiKey: 'sk-ant-****...****',
      temperature: 0.3,
      maxTokens: 1500,
      topP: 0.95,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
      systemPrompt: 'You are a technical support specialist. Focus on providing step-by-step troubleshooting guidance and technical solutions.',
      isActive: false
    }
  ]);

  const [currentConfig, setCurrentConfig] = useState<Partial<LLMConfiguration>>({
    name: '',
    provider: '',
    model: '',
    apiKey: '',
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.9,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    systemPrompt: '',
    isActive: true
  });

  const handleSaveConfiguration = () => {
    if (selectedConfig) {
      // Update existing configuration
      setLlmConfigurations(prev => 
        prev.map(config => 
          config.id === selectedConfig 
            ? { ...config, ...currentConfig }
            : config
        )
      );
    } else {
      // Create new configuration
      const newConfig: LLMConfiguration = {
        id: Date.now().toString(),
        ...currentConfig as LLMConfiguration
      };
      setLlmConfigurations(prev => [...prev, newConfig]);
    }
    
    // Reset form
    setCurrentConfig({
      name: '',
      provider: '',
      model: '',
      apiKey: '',
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      systemPrompt: '',
      isActive: true
    });
    setSelectedConfig('');
  };

  const handleEditConfiguration = (config: LLMConfiguration) => {
    setCurrentConfig(config);
    setSelectedConfig(config.id);
  };

  const getProviderModels = (provider: string) => {
    switch (provider) {
      case 'openai':
        return ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'];
      case 'anthropic':
        return ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'];
      case 'mistral':
        return ['mistral-large', 'mistral-medium', 'mistral-small'];
      case 'custom':
        return ['custom-model'];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">LLM Configuration & Settings</h2>
          <p className="text-gray-600 mt-1">Configure LLM providers, models, and runtime parameters</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-white border shadow-sm rounded-xl p-1 h-auto">
          <TabsTrigger 
            value="configurations" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3"
          >
            <Brain className="w-4 h-4" />
            Configurations
          </TabsTrigger>
          <TabsTrigger 
            value="create-edit" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3"
          >
            <Settings className="w-4 h-4" />
            Create/Edit
          </TabsTrigger>
          <TabsTrigger 
            value="testing" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3"
          >
            <TestTube className="w-4 h-4" />
            A/B Testing
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3"
          >
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configurations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {llmConfigurations.map((config) => (
              <Card key={config.id} className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium">{config.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {config.provider.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {config.model}
                        </Badge>
                        {config.isActive && (
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Temperature:</span>
                      <p className="font-medium">{config.temperature}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Tokens:</span>
                      <p className="font-medium">{config.maxTokens}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Top P:</span>
                      <p className="font-medium">{config.topP}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">API Key:</span>
                      <p className="font-medium text-gray-400">{config.apiKey}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">System Prompt:</span>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1 line-clamp-2">
                      {config.systemPrompt}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditConfiguration(config)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create-edit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{selectedConfig ? 'Edit Configuration' : 'Create New LLM Configuration'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="config-name">Configuration Name</Label>
                  <Input
                    id="config-name"
                    value={currentConfig.name}
                    onChange={(e) => setCurrentConfig({...currentConfig, name: e.target.value})}
                    placeholder="Support Bot Configuration"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="provider">LLM Provider</Label>
                  <Select 
                    value={currentConfig.provider} 
                    onValueChange={(value) => setCurrentConfig({...currentConfig, provider: value, model: ''})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="mistral">Mistral AI</SelectItem>
                      <SelectItem value="custom">Custom Endpoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {currentConfig.provider && (
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Select 
                      value={currentConfig.model} 
                      onValueChange={(value) => setCurrentConfig({...currentConfig, model: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {getProviderModels(currentConfig.provider).map((model) => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={currentConfig.apiKey}
                    onChange={(e) => setCurrentConfig({...currentConfig, apiKey: e.target.value})}
                    placeholder="sk-..."
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value={currentConfig.systemPrompt}
                  onChange={(e) => setCurrentConfig({...currentConfig, systemPrompt: e.target.value})}
                  placeholder="You are a helpful customer support assistant..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Temperature: {currentConfig.temperature}</Label>
                  <Slider
                    value={[currentConfig.temperature || 0.7]}
                    onValueChange={(value) => setCurrentConfig({...currentConfig, temperature: value[0]})}
                    max={2}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Controls randomness in responses</p>
                </div>

                <div>
                  <Label>Max Tokens: {currentConfig.maxTokens}</Label>
                  <Slider
                    value={[currentConfig.maxTokens || 1000]}
                    onValueChange={(value) => setCurrentConfig({...currentConfig, maxTokens: value[0]})}
                    max={4000}
                    min={100}
                    step={100}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum response length</p>
                </div>

                <div>
                  <Label>Top P: {currentConfig.topP}</Label>
                  <Slider
                    value={[currentConfig.topP || 0.9]}
                    onValueChange={(value) => setCurrentConfig({...currentConfig, topP: value[0]})}
                    max={1}
                    min={0}
                    step={0.05}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Controls diversity of responses</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={currentConfig.isActive}
                    onCheckedChange={(checked) => setCurrentConfig({...currentConfig, isActive: checked})}
                  />
                  <Label>Set as Active Configuration</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSaveConfiguration}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {selectedConfig ? 'Update Configuration' : 'Save Configuration'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCurrentConfig({
                      name: '',
                      provider: '',
                      model: '',
                      apiKey: '',
                      temperature: 0.7,
                      maxTokens: 1000,
                      topP: 0.9,
                      frequencyPenalty: 0.0,
                      presencePenalty: 0.0,
                      systemPrompt: '',
                      isActive: true
                    });
                    setSelectedConfig('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                A/B Testing Framework
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">A/B Testing Coming Soon</h3>
                <p className="text-gray-600 mb-4">
                  Compare different LLM configurations and models to optimize performance
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Set Up A/B Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Access Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Security Settings</h3>
                <p className="text-gray-600 mb-4">
                  Manage API key encryption, access controls, and audit logs
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Configure Security
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
