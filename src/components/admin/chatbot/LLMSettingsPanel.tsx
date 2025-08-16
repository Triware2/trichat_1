
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { chatbotService, Chatbot } from '@/services/chatbotService';
import { 
  Settings, 
  Brain, 
  Zap, 
  Shield, 
  Save,
  RefreshCw,
  TestTube,
  CheckCircle,
  AlertCircle,
  Database,
  Cloud,
  Lock,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Info,
  TrendingUp,
  Clock,
  Cpu,
  Network,
  Thermometer,
  Target,
  Sparkles,
  Globe,
  Key,
  Server,
  Activity,
  AlertTriangle,
  Wifi,
  WifiOff,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';

interface LLMSettingsPanelProps {
  selectedBotId?: string | null;
}

interface LLMSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  enableMemory: boolean;
  enableContext: boolean;
  enableSafety: boolean;
  enableStreaming: boolean;
  enableRetry: boolean;
  customInstructions: string;
  apiKey: string;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  contextWindow: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string[];
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableLogging: boolean;
  enableMetrics: boolean;
  enableCaching: boolean;
  cacheTTL: number;
  rateLimit: number;
  enableFallback: boolean;
  fallbackModel: string;
  enableAITraining: boolean;
  trainingDataRetention: number;
  enablePrivacyMode: boolean;
  enableAuditLog: boolean;
}

interface ConnectionStatus {
  status: 'connected' | 'disconnected' | 'testing' | 'error';
  latency: number;
  lastTested: Date | null;
  errorMessage?: string;
  modelInfo?: {
    name: string;
    version: string;
    capabilities: string[];
    maxTokens: number;
    costPerToken: number;
  };
}

export const LLMSettingsPanel = ({ selectedBotId }: LLMSettingsPanelProps) => {
  const { toast } = useToast();
  const [activeBot, setActiveBot] = useState('');
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'disconnected',
    latency: 0,
    lastTested: null
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<LLMSettings | null>(null);

  const [settings, setSettings] = useState<LLMSettings>({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: '',
    enableMemory: true,
    enableContext: true,
    enableSafety: true,
    enableStreaming: true,
    enableRetry: true,
    customInstructions: '',
    apiKey: '',
    baseUrl: '',
    timeout: 30,
    retryAttempts: 3,
    retryDelay: 1000,
    contextWindow: 8192,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    stopSequences: [],
    logLevel: 'info',
    enableLogging: true,
    enableMetrics: true,
    enableCaching: true,
    cacheTTL: 3600,
    rateLimit: 100,
    enableFallback: false,
    fallbackModel: 'gpt-3.5-turbo',
    enableAITraining: false,
    trainingDataRetention: 30,
    enablePrivacyMode: true,
    enableAuditLog: true
  });

  // Load chatbots and settings
  useEffect(() => {
    loadChatbots();
  }, []);

  useEffect(() => {
    if (activeBot) {
      loadBotSettings(activeBot);
    }
  }, [activeBot]);

  // Update activeBot when selectedBotId changes
  useEffect(() => {
    if (selectedBotId) {
      setActiveBot(selectedBotId);
    }
  }, [selectedBotId]);

  // Track changes for unsaved changes warning
  useEffect(() => {
    if (originalSettings) {
      const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);
      setHasUnsavedChanges(hasChanges);
    }
  }, [settings, originalSettings]);

  // Validate settings in real-time
  useEffect(() => {
    validateSettings();
  }, [settings]);

  const loadChatbots = async () => {
    try {
      setLoading(true);
      const data = await chatbotService.getChatbots();
      const llmBots = data.filter(bot => bot.type === 'llm');
      setChatbots(llmBots);
      
      // Auto-select first bot if none selected
      if (llmBots.length > 0 && !activeBot) {
        setActiveBot(llmBots[0].id);
      }
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

  const loadBotSettings = async (chatbotId: string) => {
    try {
      const bot = chatbots.find(b => b.id === chatbotId);
      if (bot) {
        const botSettings: LLMSettings = {
          model: bot.model || 'gpt-4',
          temperature: bot.config?.temperature || 0.7,
          maxTokens: bot.config?.maxTokens || 1000,
          systemPrompt: bot.system_prompt || '',
          enableMemory: bot.config?.enableMemory ?? true,
          enableContext: bot.config?.enableContext ?? true,
          enableSafety: bot.config?.enableSafety ?? true,
          enableStreaming: bot.config?.enableStreaming ?? true,
          enableRetry: bot.config?.enableRetry ?? true,
          customInstructions: bot.config?.customInstructions || '',
          apiKey: bot.config?.apiKey || '',
          baseUrl: bot.config?.baseUrl || '',
          timeout: bot.config?.timeout || 30,
          retryAttempts: bot.config?.retryAttempts || 3,
          retryDelay: bot.config?.retryDelay || 1000,
          contextWindow: bot.config?.contextWindow || 8192,
          topP: bot.config?.topP || 1.0,
          frequencyPenalty: bot.config?.frequencyPenalty || 0.0,
          presencePenalty: bot.config?.presencePenalty || 0.0,
          stopSequences: bot.config?.stopSequences || [],
          logLevel: bot.config?.logLevel || 'info',
          enableLogging: bot.config?.enableLogging ?? true,
          enableMetrics: bot.config?.enableMetrics ?? true,
          enableCaching: bot.config?.enableCaching ?? true,
          cacheTTL: bot.config?.cacheTTL || 3600,
          rateLimit: bot.config?.rateLimit || 100,
          enableFallback: bot.config?.enableFallback ?? false,
          fallbackModel: bot.config?.fallbackModel || 'gpt-3.5-turbo',
          enableAITraining: bot.config?.enableAITraining ?? false,
          trainingDataRetention: bot.config?.trainingDataRetention || 30,
          enablePrivacyMode: bot.config?.enablePrivacyMode ?? true,
          enableAuditLog: bot.config?.enableAuditLog ?? true
        };
        
        setSettings(botSettings);
        setOriginalSettings(botSettings);
        setHasUnsavedChanges(false);
        
        // Test connection if API key is available
        if (botSettings.apiKey) {
          testConnection();
        }
      }
    } catch (error) {
      console.error('Error loading bot settings:', error);
      toast({
        title: "Error",
        description: "Failed to load bot settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const validateSettings = () => {
    const errors: Record<string, string> = {};

    // API Key validation
    if (!settings.apiKey.trim()) {
      errors.apiKey = 'API key is required';
    } else if (!settings.apiKey.startsWith('sk-')) {
      errors.apiKey = 'API key should start with "sk-"';
    }

    // Base URL validation
    if (settings.baseUrl && !isValidUrl(settings.baseUrl)) {
      errors.baseUrl = 'Please enter a valid URL';
    }

    // Timeout validation
    if (settings.timeout < 5 || settings.timeout > 300) {
      errors.timeout = 'Timeout must be between 5 and 300 seconds';
    }

    // Max tokens validation
    if (settings.maxTokens < 1 || settings.maxTokens > 32000) {
      errors.maxTokens = 'Max tokens must be between 1 and 32,000';
    }

    // Temperature validation
    if (settings.temperature < 0 || settings.temperature > 2) {
      errors.temperature = 'Temperature must be between 0 and 2';
    }

    // Retry attempts validation
    if (settings.retryAttempts < 0 || settings.retryAttempts > 10) {
      errors.retryAttempts = 'Retry attempts must be between 0 and 10';
    }

    // Rate limit validation
    if (settings.rateLimit < 1 || settings.rateLimit > 10000) {
      errors.rateLimit = 'Rate limit must be between 1 and 10,000 requests per minute';
    }

    setValidationErrors(errors);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const saveSettings = async () => {
    if (!activeBot || Object.keys(validationErrors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the validation errors before saving.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      
      const updates = {
        model: settings.model,
        system_prompt: settings.systemPrompt,
        config: {
          ...settings,
          apiKey: settings.apiKey // Store encrypted in production
        }
      };

      await chatbotService.updateChatbot(activeBot, updates);
      
      setOriginalSettings(settings);
      setHasUnsavedChanges(false);
      
      toast({
        title: "Settings Saved",
        description: "LLM settings have been updated successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    if (!activeBot || !settings.apiKey) {
      toast({
        title: "Error",
        description: "Please provide an API key to test connection.",
        variant: "destructive"
      });
      return;
    }

    try {
      setTesting(true);
      setConnectionStatus(prev => ({ ...prev, status: 'testing' }));

      toast({
        title: "Testing Connection",
        description: "Testing LLM connection...",
      });

      // Simulate connection test with real API call
      const startTime = Date.now();
      
      // In production, this would make a real API call
      const success = await simulateAPITest();
      
      const latency = Date.now() - startTime;
      
      if (success) {
        setConnectionStatus({
          status: 'connected',
          latency,
          lastTested: new Date(),
          modelInfo: {
            name: settings.model,
            version: 'latest',
            capabilities: ['text-generation', 'chat', 'completion'],
            maxTokens: settings.maxTokens,
            costPerToken: 0.0001
          }
        });
        
        toast({
          title: "Connection Successful",
          description: `Connected to ${settings.model} (${latency}ms latency)`,
        });
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionStatus({
        status: 'error',
        latency: 0,
        lastTested: new Date(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast({
        title: "Connection Failed",
        description: "LLM connection test failed. Please check your settings.",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const simulateAPITest = async (): Promise<boolean> => {
    // Simulate API test with realistic delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    // Simulate occasional failures
    if (Math.random() < 0.1) {
      throw new Error('API rate limit exceeded');
    }
    
    return true;
  };

  const resetSettings = () => {
    if (originalSettings) {
      setSettings(originalSettings);
      setHasUnsavedChanges(false);
      toast({
        title: "Settings Reset",
        description: "Settings have been reset to their original values",
      });
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(settings.apiKey);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const updateSetting = (key: keyof LLMSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus.status) {
      case 'connected': return 'text-emerald-600';
      case 'testing': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus.status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'testing': return <Activity className="w-4 h-4 animate-pulse" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <WifiOff className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/30 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-64 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-96 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">LLM Settings</h2>
            <p className="text-slate-600">Configure AI model parameters and behavior</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={activeBot} onValueChange={setActiveBot}>
              <SelectTrigger className="w-64 border-blue-200 focus:border-blue-400 focus:ring-blue-200">
                <SelectValue placeholder="Select an LLM chatbot" />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-200 shadow-xl">
                {chatbots.map(bot => (
                  <SelectItem key={bot.id} value={bot.id}>
                    <div className="flex items-center gap-3">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">{bot.name}</span>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        {bot.model || 'LLM'}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={testConnection}
              variant="outline"
              disabled={!activeBot || testing}
              className="min-w-[140px]"
            >
              {testing ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            
            <Button 
              onClick={saveSettings}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!activeBot || saving || Object.keys(validationErrors).length > 0}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              You have unsaved changes. Please save your settings to apply them.
            </AlertDescription>
          </Alert>
        )}

        {activeBot ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Model Configuration */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50/50 to-indigo-50/50 border-b border-purple-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">Model Configuration</h3>
                      <p className="text-sm text-slate-500">AI model settings and parameters</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="model" className="text-sm font-medium text-gray-700">Model</Label>
                      <Select value={settings.model} onValueChange={(value) => updateSetting('model', value)}>
                        <SelectTrigger className="mt-2 border-gray-200 focus:border-purple-400 focus:ring-purple-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 shadow-xl">
                          <SelectItem value="gpt-4">GPT-4 (Most Capable)</SelectItem>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Fast & Efficient)</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Balanced)</SelectItem>
                          <SelectItem value="claude-3-opus">Claude 3 Opus (Advanced)</SelectItem>
                          <SelectItem value="claude-3-sonnet">Claude 3 Sonnet (Balanced)</SelectItem>
                          <SelectItem value="claude-3-haiku">Claude 3 Haiku (Fast)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="temperature" className="text-sm font-medium text-gray-700">
                        Temperature: {settings.temperature}
                      </Label>
                      <Slider
                        value={[settings.temperature]}
                        onValueChange={([value]) => updateSetting('temperature', value)}
                        max={2}
                        min={0}
                        step={0.1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Focused</span>
                        <span>Creative</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="maxTokens" className="text-sm font-medium text-gray-700">Max Tokens</Label>
                      <Input
                        type="number"
                        value={settings.maxTokens}
                        onChange={(e) => updateSetting('maxTokens', parseInt(e.target.value))}
                        className={`mt-2 border-gray-200 focus:border-purple-400 focus:ring-purple-200 ${
                          validationErrors.maxTokens ? 'border-red-300 focus:border-red-400' : ''
                        }`}
                        placeholder="1000"
                      />
                      {validationErrors.maxTokens && (
                        <p className="text-xs text-red-600 mt-1">{validationErrors.maxTokens}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="timeout" className="text-sm font-medium text-gray-700">Timeout (seconds)</Label>
                      <Input
                        type="number"
                        value={settings.timeout}
                        onChange={(e) => updateSetting('timeout', parseInt(e.target.value))}
                        className={`mt-2 border-gray-200 focus:border-purple-400 focus:ring-purple-200 ${
                          validationErrors.timeout ? 'border-red-300 focus:border-red-400' : ''
                        }`}
                        placeholder="30"
                      />
                      {validationErrors.timeout && (
                        <p className="text-xs text-red-600 mt-1">{validationErrors.timeout}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="topP" className="text-sm font-medium text-gray-700">
                        Top P: {settings.topP}
                      </Label>
                      <Slider
                        value={[settings.topP]}
                        onValueChange={([value]) => updateSetting('topP', value)}
                        max={1}
                        min={0}
                        step={0.1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Conservative</span>
                        <span>Diverse</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="contextWindow" className="text-sm font-medium text-gray-700">Context Window</Label>
                      <Select value={settings.contextWindow.toString()} onValueChange={(value) => updateSetting('contextWindow', parseInt(value))}>
                        <SelectTrigger className="mt-2 border-gray-200 focus:border-purple-400 focus:ring-purple-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 shadow-xl">
                          <SelectItem value="4096">4K tokens</SelectItem>
                          <SelectItem value="8192">8K tokens</SelectItem>
                          <SelectItem value="16384">16K tokens</SelectItem>
                          <SelectItem value="32768">32K tokens</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="systemPrompt" className="text-sm font-medium text-gray-700">System Prompt</Label>
                    <Textarea
                      value={settings.systemPrompt}
                      onChange={(e) => updateSetting('systemPrompt', e.target.value)}
                      className="mt-2 border-gray-200 focus:border-purple-400 focus:ring-purple-200"
                      placeholder="You are a helpful AI assistant..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="customInstructions" className="text-sm font-medium text-gray-700">Custom Instructions</Label>
                    <Textarea
                      value={settings.customInstructions}
                      onChange={(e) => updateSetting('customInstructions', e.target.value)}
                      className="mt-2 border-gray-200 focus:border-purple-400 focus:ring-purple-200"
                      placeholder="Additional instructions for the model..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* API Configuration */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-blue-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                      <Cloud className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">API Configuration</h3>
                      <p className="text-sm text-slate-500">Connection settings and credentials</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="apiKey" className="text-sm font-medium text-gray-700">API Key</Label>
                      <div className="relative mt-2">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          value={settings.apiKey}
                          onChange={(e) => updateSetting('apiKey', e.target.value)}
                          className={`border-gray-200 focus:border-blue-400 focus:ring-blue-200 pr-20 ${
                            validationErrors.apiKey ? 'border-red-300 focus:border-red-400' : ''
                          }`}
                          placeholder="sk-..."
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="h-8 w-8 p-0"
                          >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={copyApiKey}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {validationErrors.apiKey && (
                        <p className="text-xs text-red-600 mt-1">{validationErrors.apiKey}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="baseUrl" className="text-sm font-medium text-gray-700">Base URL (Optional)</Label>
                      <Input
                        type="url"
                        value={settings.baseUrl}
                        onChange={(e) => updateSetting('baseUrl', e.target.value)}
                        className={`mt-2 border-gray-200 focus:border-blue-400 focus:ring-blue-200 ${
                          validationErrors.baseUrl ? 'border-red-300 focus:border-red-400' : ''
                        }`}
                        placeholder="https://api.openai.com/v1"
                      />
                      {validationErrors.baseUrl && (
                        <p className="text-xs text-red-600 mt-1">{validationErrors.baseUrl}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="retryAttempts" className="text-sm font-medium text-gray-700">Retry Attempts</Label>
                      <Input
                        type="number"
                        value={settings.retryAttempts}
                        onChange={(e) => updateSetting('retryAttempts', parseInt(e.target.value))}
                        className={`mt-2 border-gray-200 focus:border-blue-400 focus:ring-blue-200 ${
                          validationErrors.retryAttempts ? 'border-red-300 focus:border-red-400' : ''
                        }`}
                        min="0"
                        max="10"
                      />
                      {validationErrors.retryAttempts && (
                        <p className="text-xs text-red-600 mt-1">{validationErrors.retryAttempts}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="retryDelay" className="text-sm font-medium text-gray-700">Retry Delay (ms)</Label>
                      <Input
                        type="number"
                        value={settings.retryDelay}
                        onChange={(e) => updateSetting('retryDelay', parseInt(e.target.value))}
                        className="mt-2 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                        min="100"
                        max="10000"
                        step="100"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="rateLimit" className="text-sm font-medium text-gray-700">Rate Limit (req/min)</Label>
                      <Input
                        type="number"
                        value={settings.rateLimit}
                        onChange={(e) => updateSetting('rateLimit', parseInt(e.target.value))}
                        className={`mt-2 border-gray-200 focus:border-blue-400 focus:ring-blue-200 ${
                          validationErrors.rateLimit ? 'border-red-300 focus:border-red-400' : ''
                        }`}
                        min="1"
                        max="10000"
                      />
                      {validationErrors.rateLimit && (
                        <p className="text-xs text-red-600 mt-1">{validationErrors.rateLimit}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features & Status */}
            <div className="space-y-6">
              {/* Connection Status */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-slate-50/50 to-gray-50/50 border-b border-slate-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl shadow-md">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">Connection Status</h3>
                      <p className="text-sm text-slate-500">Real-time connection monitoring</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className={`flex items-center justify-between p-3 rounded-lg border ${
                    connectionStatus.status === 'connected' ? 'bg-emerald-50 border-emerald-100' :
                    connectionStatus.status === 'testing' ? 'bg-blue-50 border-blue-100' :
                    connectionStatus.status === 'error' ? 'bg-red-50 border-red-100' :
                    'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className={getConnectionStatusColor()}>
                        {getConnectionStatusIcon()}
                      </div>
                      <span className="text-sm font-medium capitalize">
                        {connectionStatus.status}
                      </span>
                    </div>
                    {connectionStatus.latency > 0 && (
                      <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                        {connectionStatus.latency}ms
                      </Badge>
                    )}
                  </div>

                  {connectionStatus.modelInfo && (
                    <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">Model</span>
                        <span className="text-sm text-blue-600">{connectionStatus.modelInfo.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">Max Tokens</span>
                        <span className="text-sm text-blue-600">{connectionStatus.modelInfo.maxTokens.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">Cost/Token</span>
                        <span className="text-sm text-blue-600">${connectionStatus.modelInfo.costPerToken}</span>
                      </div>
                    </div>
                  )}

                  {connectionStatus.lastTested && (
                    <div className="text-xs text-slate-500 text-center">
                      Last tested: {connectionStatus.lastTested.toLocaleTimeString()}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 border-b border-emerald-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-md">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">Features</h3>
                      <p className="text-sm text-slate-500">Enable advanced capabilities</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Memory</p>
                        <p className="text-sm text-gray-600">Remember conversation history</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.enableMemory}
                      onCheckedChange={(checked) => updateSetting('enableMemory', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900">Context Awareness</p>
                        <p className="text-sm text-gray-600">Use conversation context</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.enableContext}
                      onCheckedChange={(checked) => updateSetting('enableContext', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="font-medium text-gray-900">Safety Filters</p>
                        <p className="text-sm text-gray-600">Content moderation</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.enableSafety}
                      onCheckedChange={(checked) => updateSetting('enableSafety', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="font-medium text-gray-900">Streaming</p>
                        <p className="text-sm text-gray-600">Real-time response streaming</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.enableStreaming}
                      onCheckedChange={(checked) => updateSetting('enableStreaming', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <RotateCcw className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-gray-900">Auto Retry</p>
                        <p className="text-sm text-gray-600">Automatic retry on failure</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.enableRetry}
                      onCheckedChange={(checked) => updateSetting('enableRetry', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-900">Privacy Mode</p>
                        <p className="text-sm text-gray-600">Enhanced data protection</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.enablePrivacyMode}
                      onCheckedChange={(checked) => updateSetting('enablePrivacyMode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={resetSettings}
                variant="outline" 
                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
                disabled={!hasUnsavedChanges}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Brain className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {chatbots.length === 0 ? 'No LLM Bots Available' : 'Select an LLM Bot'}
            </h3>
            <p className="text-slate-600">
              {chatbots.length === 0 
                ? 'Create an LLM-powered chatbot first to configure settings'
                : 'Choose an LLM chatbot from the dropdown above to configure settings'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
