import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, Edit, Trash2, Copy, Play, Settings, Brain, Target,
  Clock, Star, Users, CheckCircle, AlertCircle, ArrowRight,
  TrendingUp, Zap, Shield, TestTube, BarChart3, Download, Upload,
  Share2, GitBranch, Lightbulb, Award, Rocket, Crown, Smile, Sparkle, Bot
} from 'lucide-react';
import { AdvancedPresetCreator } from './components/AdvancedPresetCreator';
import { PresetAnalytics } from './components/PresetAnalytics';
import { ABTestingPanel } from './components/ABTestingPanel';
import { TemplateLibrary } from './components/TemplateLibrary';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { useToast } from '@/hooks/use-toast';
import { chatbotService } from '@/services/chatbotService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EnhancedTrainingPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  modelType: string;
  version: string;
  author: string;
  rating: number;
  usageCount: number;
  lastUsed: string;
  createdAt: string;
  isActive: boolean;
  isPublic: boolean;
  tags: string[];
  performance: {
    accuracy: number;
    responseTime: number;
    userSatisfaction: number;
    trainingTime: number;
    costPerRequest: number;
  };
  advancedParams: {
    epochs: number;
    learningRate: number;
    batchSize: number;
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    validationSplit: number;
    earlyStopping: boolean;
    dataAugmentation: boolean;
    crossValidation: boolean;
    optimizer: string;
    lossFunction: string;
    regularization: number;
    dropoutRate: number;
    gradientClipping: number;
    warmupSteps: number;
    scheduler: string;
    mixedPrecision: boolean;
  };
  validationResults: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix: number[][];
    testCases: Array<{
      input: string;
      expectedOutput: string;
      actualOutput: string;
      passed: boolean;
    }>;
  };
  recommendations: string[];
  collaborators: string[];
  changeHistory: Array<{
    version: string;
    date: string;
    author: string;
    changes: string[];
  }>;
}

export const EnhancedTrainingPresetsManager = () => {
  const { toast } = useToast();
  const [presets, setPresets] = useState<EnhancedTrainingPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<EnhancedTrainingPreset | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreating, setIsCreating] = useState(false);
  const [isABTesting, setIsABTesting] = useState(false);
  // Add loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPreset, setEditingPreset] = useState<EnhancedTrainingPreset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingPresetId, setDeletingPresetId] = useState<string | null>(null);

  // Add state for team collaboration
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: 'You (Trichat Team)', email: 'you@trichat.com', role: 'Owner' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'Editor' },
    { id: 3, name: 'John Smith', email: 'john@example.com', role: 'Viewer' },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLink] = useState('https://trichat.com/invite/abc123');

  const [bots, setBots] = useState<any[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string>('');
  const [applyingPresetId, setApplyingPresetId] = useState<string>('');

  // Fetch bots for selector
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const data = await chatbotService.getChatbots();
        setBots(data);
        if (data.length > 0 && !selectedBotId) setSelectedBotId(data[0].id);
      } catch (err) {
        setBots([]);
      }
    };
    fetchBots();
  }, []);

  useEffect(() => {
    const fetchPresets = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await chatbotService.getChatbots();
        // Map Supabase chatbots to the expected preset structure
        const mapped = (data || []).map((bot: any) => ({
          id: bot.id,
          name: bot.name || 'Untitled',
          description: bot.system_prompt || 'No description',
          category: bot.type || 'general',
          modelType: bot.model || 'gpt-4',
          version: bot.version || '1.0.0',
          author: bot.created_by || 'Unknown',
          rating: bot.rating || 0,
          usageCount: bot.total_chats || 0,
          lastUsed: bot.last_updated || '',
          createdAt: bot.created_at || '',
          isActive: bot.is_active !== false,
          isPublic: true,
          tags: bot.tags || [],
          performance: {
            accuracy: bot.resolution_rate || 0,
            responseTime: bot.avg_response_time || 0,
            userSatisfaction: bot.avg_satisfaction || 0,
            trainingTime: bot.training_time || 0,
            costPerRequest: bot.cost_per_request || 0,
          },
          advancedParams: bot.config?.advancedParams || {},
          validationResults: bot.config?.validationResults || {},
          recommendations: bot.config?.recommendations || [],
          collaborators: bot.config?.collaborators || [],
          changeHistory: bot.config?.changeHistory || [],
        }));
        setPresets(mapped);
      } catch (err: any) {
        setError('Failed to load presets.');
        setPresets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPresets();
  }, []);

  // CRUD Handlers
  const handleCreatePreset = () => setIsCreating(true);
  const handleEditPreset = (preset: EnhancedTrainingPreset) => {
    setEditingPreset(preset);
    setIsEditing(true);
  };
  const handleSaveEdit = (updatedPreset: EnhancedTrainingPreset) => {
    setPresets(presets.map(p => p.id === updatedPreset.id ? updatedPreset : p));
    setIsEditing(false);
    setEditingPreset(null);
    toast({ title: 'Preset Updated!', description: 'Your changes have been saved.' });
  };
  const handleDuplicatePreset = (preset: EnhancedTrainingPreset) => {
    const duplicated = { ...preset, id: Date.now().toString(), name: `${preset.name} (Copy)`, usageCount: 0, lastUsed: '', createdAt: new Date().toISOString().split('T')[0] };
    setPresets([...presets, duplicated]);
    toast({ title: 'Preset Duplicated!', description: 'A copy of the preset has been created.' });
  };
  const handleDeletePreset = (id: string) => {
    setIsDeleting(true);
    setDeletingPresetId(id);
    setTimeout(() => {
      setPresets(presets.filter(p => p.id !== id));
      setIsDeleting(false);
      setDeletingPresetId(null);
      toast({ title: 'Preset Deleted!', description: 'The preset has been removed.' });
    }, 600);
  };

  const handleABTesting = () => {
    setIsABTesting(true);
  };

  const getPerformanceColor = (value: number, type: 'accuracy' | 'responseTime' | 'satisfaction') => {
    if (type === 'responseTime') {
      return value < 1.5 ? 'text-green-600' : value < 3 ? 'text-yellow-600' : 'text-red-600';
    }
    return value >= 90 ? 'text-green-600' : value >= 80 ? 'text-yellow-600' : 'text-red-600';
  };

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      setCollaborators([...collaborators, { id: Date.now(), name: inviteEmail.split('@')[0], email: inviteEmail, role: 'Viewer' }]);
      setInviteEmail('');
      toast({ title: 'Invitation Sent', description: `Invite sent to ${inviteEmail}` });
    }
  };
  const handleRoleChange = (id: number, role: string) => {
    setCollaborators(collaborators.map(c => c.id === id ? { ...c, role } : c));
  };
  const handleRemove = (id: number) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
    toast({ title: 'Removed', description: 'Collaborator removed.' });
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({ title: 'Invite Link Copied', description: inviteLink });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl px-6 py-4 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {/* Use Sparkle if available, else Award */}
              <Award className="w-5 h-5 text-yellow-500 stroke-1" />
              <span className="font-semibold text-xl text-slate-900">Advanced Training Presets</span>
            </div>
            <div className="text-sm text-slate-500 mb-2">World-class training configurations with AI-powered optimization</div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">↗ 2 Presets</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" />AI Optimized</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1"><Zap className="w-3 h-3" />Real-time Analytics</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleABTesting}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <TestTube className="w-4 h-4 mr-2" />
              A/B Testing
            </Button>
            <Button
              onClick={handleCreatePreset}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Advanced Preset
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border border-white/30">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Testing
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-lg text-blue-600 font-semibold">Loading presets...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-10">{error}</div>
          ) : !presets || presets.length === 0 ? (
            <div className="text-center text-slate-500 py-10">No presets found. Create a new one!</div>
          ) : (
            <div className="space-y-6">
              <div className="mb-6 flex items-center gap-4">
                <Bot className="w-6 h-6 text-blue-600" />
                <Select value={selectedBotId} onValueChange={setSelectedBotId}>
                  <SelectTrigger className="w-72 bg-white/80 border border-blue-100">
                    <SelectValue placeholder="Select a bot to apply preset" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-100 shadow-xl">
                    {bots.map(bot => (
                      <SelectItem key={bot.id} value={bot.id}>
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-blue-600" />
                          <span>{bot.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {presets.map((preset) => (
                  preset && preset.id ? (
                    <Card
                      key={preset.id}
                      className="group border border-slate-200 bg-white/90 hover:shadow-lg transition-all duration-200 rounded-xl p-0 overflow-hidden relative"
                      tabIndex={0}
                      aria-label={`Preset: ${preset.name}`}
                    >
                      <div className="flex flex-col gap-2 p-5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Brain className="w-5 h-5 text-blue-500 stroke-1" />
                              <span className="font-semibold text-base text-slate-900 truncate">{preset.name}</span>
                              <span className="text-xs text-slate-400">v{preset.version}</span>
                              {preset.isPublic && (
                                <span className="ml-1 px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs border border-green-100">Public</span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 truncate mb-1">{preset.description}</div>
                            <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                              <Star className="w-3 h-3 text-yellow-400" />
                              <span className="text-slate-700 font-medium">{preset.rating}</span>
                              <span>·</span>
                              <span>{preset.usageCount} uses</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button title="Edit" aria-label="Edit preset" onClick={() => handleEditPreset(preset)} className="p-1 hover:bg-slate-100 rounded">
                              <Edit className="w-4 h-4 text-slate-500" />
                            </button>
                            <button title="Duplicate" aria-label="Duplicate preset" onClick={() => handleDuplicatePreset(preset)} className="p-1 hover:bg-slate-100 rounded">
                              <Copy className="w-4 h-4 text-slate-500" />
                            </button>
                            <button title="Delete" aria-label="Delete preset" disabled={isDeleting && deletingPresetId === preset.id} onClick={() => handleDeletePreset(preset.id)} className="p-1 hover:bg-red-50 rounded">
                              <Trash2 className={`w-4 h-4 ${isDeleting && deletingPresetId === preset.id ? 'animate-pulse text-red-400' : 'text-red-600'}`} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {preset.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">{tag}</span>
                          ))}
                          {preset.tags.length > 3 && (
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">+{preset.tags.length - 3} more</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
                          <div className="flex items-center gap-1">
                            <BarChart3 className="w-3 h-3 text-blue-400" />
                            <span>{preset.performance.accuracy}%</span>
                            <span className="text-slate-400">Acc</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-green-400" />
                            <span>{preset.performance.responseTime}s</span>
                            <span className="text-slate-400">Resp</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Smile className="w-3 h-3 text-pink-400" />
                            <span>{preset.performance.userSatisfaction}/5</span>
                            <span className="text-slate-400">Sat</span>
                          </div>
                          <span className="ml-auto text-xs text-slate-400">{preset.createdAt}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={async () => {
                            setApplyingPresetId(preset.id);
                            try {
                              await chatbotService.updateChatbot(selectedBotId, { config: preset.config, preset_id: preset.id });
                              toast({ title: 'Preset Applied!', description: `${preset.name} has been applied to ${bots.find(b => b.id === selectedBotId)?.name}.` });
                            } catch (err) {
                              toast({ title: 'Error', description: 'Failed to apply preset.', variant: 'destructive' });
                            } finally {
                              setApplyingPresetId('');
                            }
                          }}
                          className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                          aria-label={`Use preset ${preset.name}`}
                          disabled={!selectedBotId || applyingPresetId === preset.id}
                        >
                          {applyingPresetId === preset.id ? (
                            <span className="flex items-center justify-center"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>Applying...</span>
                          ) : (
                            <><Play className="w-4 h-4 mr-1" />Use</>
                          )}
                        </Button>
                      </div>
                    </Card>
                  ) : null
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <TemplateLibrary />
        </TabsContent>

        <TabsContent value="analytics">
          <PresetAnalytics presets={presets} />
        </TabsContent>

        <TabsContent value="testing">
          <ABTestingPanel presets={presets} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceMetrics presets={presets} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {isCreating && (
        <AdvancedPresetCreator
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
          onCreated={(preset) => {
            setPresets([...presets, preset]);
            setIsCreating(false);
            toast({ title: 'Preset Created!', description: 'Your advanced training preset has been created successfully.' });
          }}
        />
      )}
      {isEditing && editingPreset && (
        <AdvancedPresetCreator
          isOpen={isEditing}
          onClose={() => { setIsEditing(false); setEditingPreset(null); }}
          onCreated={handleSaveEdit}
          preset={editingPreset}
          isEditMode
        />
      )}
      {isABTesting && (
        <ABTestingPanel isOpen={isABTesting} onClose={() => setIsABTesting(false)} presets={presets} />
      )}
    </div>
  );

  function handleUsePreset(preset: EnhancedTrainingPreset) {
    // Update usage count and last used date
    setPresets(presets.map(p => 
      p.id === preset.id 
        ? { ...p, usageCount: p.usageCount + 1, lastUsed: new Date().toISOString().split('T')[0] }
        : p
    ));
    
    toast({
      title: "Preset Applied!",
      description: `${preset.name} has been applied to your training configuration.`,
    });
  }
}; 