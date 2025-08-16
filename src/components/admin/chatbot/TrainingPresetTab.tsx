import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { chatbotService } from '@/services/chatbotService';
import {
  Search, Filter, Plus, Settings, Play, Copy, Edit, Trash2, MoreHorizontal,
  Brain, Bot, Star, Clock, TrendingUp, Download, Upload, Eye, EyeOff,
  CheckCircle, AlertCircle, XCircle, Loader2, ArrowRight, ChevronDown,
  FileText, Database, Zap, Shield, Users, Globe, Lock, Unlock,
  BarChart3, Activity, Target, Award, Rocket, GitBranch, History, DollarSign, MessageSquare, X, FolderOpen, Save,
  Key, Fingerprint, AlertTriangle, LineChart
} from 'lucide-react';

interface TrainingPreset {
  id: string;
  slug: string;
  name: string;
  type: 'rule-based' | 'llm';
  description: string;
  created_by: string;
  created_at: string;
  is_archived: boolean;
  is_favorite: boolean;
  visibility: 'public' | 'private' | 'team';
  tags: string[];
  version: string;
  status: 'draft' | 'active' | 'deprecated';
  metrics: {
    success_rate: number;
    training_duration: number;
    cost_usd: number;
    last_trained: string;
    usage_count: number;
  };
  config: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    epochs?: number;
    learning_rate?: number;
    batch_size?: number;
    validation_split?: number;
    safety_filters?: boolean;
    custom_instructions?: string;
  };
  dataset: {
    id: string;
    name: string;
    row_count: number;
    schema_hash: string;
  };
}

interface TrainingRun {
  id: string;
  preset_id: string;
  version: string;
  started_at: string;
  finished_at?: string;
  status: 'queued' | 'downloading' | 'training' | 'evaluating' | 'completed' | 'failed';
  cost_usd: number;
  metrics: {
    accuracy: number;
    f1_score: number;
    bleu_score?: number;
    rouge_score?: number;
  };
  artifacts_uri?: string;
  logs_uri?: string;
}

// Utility functions for status color and type icon
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 border-green-200';
    case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'deprecated': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTypeIcon = (type: string) => {
  return type === 'llm' ? <Brain className="w-4 h-4" /> : <Bot className="w-4 h-4" />;
};

export const TrainingPresetTab: React.FC = () => {
  const { toast } = useToast();
  const [presets, setPresets] = useState<TrainingPreset[]>([]);
  const [filteredPresets, setFilteredPresets] = useState<TrainingPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'rule-based' | 'llm'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'draft' | 'active' | 'deprecated'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'success_rate' | 'usage_count'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPreset, setSelectedPreset] = useState<TrainingPreset | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  // Load presets from Supabase
  useEffect(() => {
    loadPresets();
  }, []);

  // Filter and sort presets
  useEffect(() => {
    let filtered = presets.filter(preset => {
      if (!showArchived && preset.is_archived) return false;
      if (selectedType !== 'all' && preset.type !== selectedType) return false;
      if (selectedStatus !== 'all' && preset.status !== selectedStatus) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          preset.name.toLowerCase().includes(searchLower) ||
          preset.description.toLowerCase().includes(searchLower) ||
          preset.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          preset.created_by.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'success_rate':
          aValue = a.metrics.success_rate;
          bValue = b.metrics.success_rate;
          break;
        case 'usage_count':
          aValue = a.metrics.usage_count;
          bValue = b.metrics.usage_count;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPresets(filtered);
  }, [presets, searchTerm, selectedType, selectedStatus, sortBy, sortOrder, showArchived]);

  const loadPresets = async () => {
    try {
      setLoading(true);
      // For now, we'll create mock data based on existing chatbots
      const chatbots = await chatbotService.getChatbots();
      const mockPresets: TrainingPreset[] = chatbots.map((bot: any, index: number) => ({
        id: bot.id,
        slug: bot.name.toLowerCase().replace(/\s+/g, '-'),
        name: bot.name,
        type: bot.type === 'llm' ? 'llm' : 'rule-based',
        description: bot.system_prompt || 'No description available',
        created_by: bot.created_by || 'Unknown',
        created_at: bot.created_at || new Date().toISOString(),
        is_archived: false,
        is_favorite: index % 3 === 0,
        visibility: index % 4 === 0 ? 'private' : 'public',
        tags: ['customer-support', 'ai-powered'],
        version: '1.0.0',
        status: 'active',
        metrics: {
          success_rate: 85 + Math.random() * 15,
          training_duration: 120 + Math.random() * 300,
          cost_usd: 2.5 + Math.random() * 10,
          last_trained: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          usage_count: 100 + Math.random() * 1000
        },
        config: {
          model: bot.model || 'gpt-4',
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 0.9,
          epochs: 3,
          learning_rate: 0.001,
          batch_size: 32,
          validation_split: 0.2,
          safety_filters: true,
          custom_instructions: bot.system_prompt || ''
        },
        dataset: {
          id: `dataset-${bot.id}`,
          name: `${bot.name} Dataset`,
          row_count: 500 + Math.random() * 2000,
          schema_hash: 'abc123'
        }
      }));
      setPresets(mockPresets);
    } catch (error) {
      console.error('Error loading presets:', error);
      toast({
        title: "Error",
        description: "Failed to load training presets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePreset = () => {
    setIsCreateModalOpen(true);
  };

  const handlePresetClick = (preset: TrainingPreset) => {
    setSelectedPreset(preset);
    setIsDetailsModalOpen(true);
  };

  const handleBulkAction = (action: 'archive' | 'delete' | 'duplicate') => {
    // Implement bulk actions
    toast({
      title: "Bulk Action",
      description: `${action} action performed on ${bulkSelected.length} presets`
    });
    setBulkSelected([]);
  };

  const toggleFavorite = (presetId: string) => {
    setPresets(prev => prev.map(preset => 
      preset.id === presetId 
        ? { ...preset, is_favorite: !preset.is_favorite }
        : preset
    ));
  };

  const handleEditPreset = (preset: TrainingPreset) => {
    setSelectedPreset(preset);
    setIsDetailsModalOpen(true);
    toast({
      title: "Edit Mode",
      description: `Editing preset: ${preset.name}`,
    });
  };

  const handleDuplicatePreset = (preset: TrainingPreset) => {
    const duplicated: TrainingPreset = {
      ...preset,
      id: `preset-${Date.now()}`,
      name: `${preset.name} (Copy)`,
      slug: `${preset.slug}-copy`,
      created_at: new Date().toISOString(),
      is_favorite: false,
      metrics: {
        ...preset.metrics,
        usage_count: 0,
        last_trained: ''
      }
    };
    setPresets(prev => [duplicated, ...prev]);
    toast({
      title: "Preset Duplicated",
      description: `Created copy of ${preset.name}`,
    });
  };

  const handleArchivePreset = (preset: TrainingPreset) => {
    setPresets(prev => prev.map(p => 
      p.id === preset.id 
        ? { ...p, is_archived: true, status: 'deprecated' as const }
        : p
    ));
    toast({
      title: "Preset Archived",
      description: `${preset.name} has been archived`,
    });
  };

  const handleDeletePreset = (preset: TrainingPreset) => {
    setPresets(prev => prev.filter(p => p.id !== preset.id));
    toast({
      title: "Preset Deleted",
      description: `${preset.name} has been deleted`,
      variant: "destructive"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Training Presets</h2>
          <p className="text-base text-slate-600">Create, manage, and monitor reusable training configurations.</p>
        </div>
        <div className="flex items-center gap-3">
          {bulkSelected.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{bulkSelected.length} selected</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('archive')}
              >
                Archive
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('duplicate')}
              >
                Duplicate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkSelected([])}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          )}
          <Button onClick={handleCreatePreset} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Preset
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search presets by name, description, tags, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="rule-based">Rule-based</SelectItem>
                  <SelectItem value="llm">LLM</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Last Created</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="success_rate">Success Rate</SelectItem>
                  <SelectItem value="usage_count">Usage Count</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Switch
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <Label className="text-sm">Show archived presets</Label>
          </div>
        </CardContent>
      </Card>

      {/* Preset Grid */}
      {filteredPresets.length === 0 ? (
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No training presets found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by creating your first training preset or importing a template.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={handleCreatePreset} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Preset
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Import Template
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPresets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isSelected={bulkSelected.includes(preset.id)}
              onSelect={(selected) => {
                if (selected) {
                  setBulkSelected(prev => [...prev, preset.id]);
                } else {
                  setBulkSelected(prev => prev.filter(id => id !== preset.id));
                }
              }}
              onClick={() => handlePresetClick(preset)}
              onFavorite={() => toggleFavorite(preset.id)}
              onEdit={() => handleEditPreset(preset)}
              onDuplicate={() => handleDuplicatePreset(preset)}
              onArchive={() => handleArchivePreset(preset)}
              onDelete={() => handleDeletePreset(preset)}
            />
          ))}
        </div>
      )}

      {/* Create Preset Modal */}
      <CreatePresetModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onPresetCreated={(preset) => {
          setPresets(prev => [preset, ...prev]);
          setIsCreateModalOpen(false);
          toast({
            title: "Success",
            description: "Training preset created successfully"
          });
        }}
      />

      {/* Preset Details Modal */}
      <PresetDetailsModal
        preset={selectedPreset}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
      />
    </div>
  );
};

// Preset Card Component
interface PresetCardProps {
  preset: TrainingPreset;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onClick: () => void;
  onFavorite: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

const PresetCard: React.FC<PresetCardProps> = ({
  preset,
  isSelected,
  onSelect,
  onClick,
  onFavorite,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate();
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Card 
      className={`group relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border-blue-200' 
          : 'bg-white/90 backdrop-blur-sm border border-slate-200/60 hover:border-blue-300/60'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
            />
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${
                preset.type === 'llm' 
                  ? 'bg-gradient-to-br from-purple-100 to-indigo-100' 
                  : 'bg-gradient-to-br from-blue-100 to-cyan-100'
              }`}>
                {getTypeIcon(preset.type)}
              </div>
              <Badge 
                variant="outline" 
                className={`text-xs font-medium px-2 py-1 ${
                  preset.status === 'active' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : preset.status === 'draft'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {preset.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              className="h-8 w-8 p-0 hover:bg-yellow-50 hover:text-yellow-600"
            >
              <Star className={`w-4 h-4 ${preset.is_favorite ? 'text-yellow-500 fill-current' : 'text-slate-400'}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-500" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div onClick={onClick} className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {preset.name}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {preset.description}
            </p>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {preset.tags.slice(0, 2).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs bg-slate-100 text-slate-700 border-0 px-2 py-1 font-normal"
              >
                {tag}
              </Badge>
            ))}
            {preset.tags.length > 2 && (
              <Badge 
                variant="secondary" 
                className="text-xs bg-slate-100 text-slate-700 border-0 px-2 py-1 font-normal"
              >
                +{preset.tags.length - 2}
              </Badge>
            )}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 py-3">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-lg border border-blue-100/50">
              <div className="text-xl font-bold text-blue-600 mb-1">
                {preset.metrics.success_rate.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-600 font-medium">Success Rate</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-50/50 to-emerald-50/30 rounded-lg border border-green-100/50">
              <div className="text-xl font-bold text-green-600 mb-1">
                {Math.round(preset.metrics.usage_count)}
              </div>
              <div className="text-xs text-slate-600 font-medium">Usage Count</div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                <Users className="w-3 h-3 text-slate-500" />
              </div>
              <span className="font-medium">{preset.created_by}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{new Date(preset.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action Menu */}
        {showActions && (
          <div className="absolute top-12 right-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl py-2 z-20 min-w-[160px]">
            <button
              onClick={handleEdit}
              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <Edit className="w-4 h-4 text-slate-600" />
              <span className="font-medium">Edit Preset</span>
            </button>
            <button
              onClick={handleDuplicate}
              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <Copy className="w-4 h-4 text-slate-600" />
              <span className="font-medium">Duplicate</span>
            </button>
            <button
              onClick={handleArchive}
              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <EyeOff className="w-4 h-4 text-slate-600" />
              <span className="font-medium">Archive</span>
            </button>
            <div className="border-t border-slate-100 my-1"></div>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-3 transition-colors text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-medium">Delete</span>
            </button>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </CardContent>
    </Card>
  );
};

// Create Preset Modal Component
interface CreatePresetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPresetCreated: (preset: TrainingPreset) => void;
}

const CreatePresetModal: React.FC<CreatePresetModalProps> = ({
  open,
  onOpenChange,
  onPresetCreated
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'llm' as 'rule-based' | 'llm',
    visibility: 'public' as 'public' | 'private' | 'team',
    tags: [] as string[],
    model: 'gpt-4',
    temperature: 0.7,
    max_tokens: 1000,
    epochs: 3,
    learning_rate: 0.001,
    batch_size: 32,
    validation_split: 0.2,
    safety_filters: true,
    custom_instructions: '',
    // Dataset fields
    dataset: {
      id: '',
      name: '',
      type: 'existing' as 'existing' | 'upload' | 'create',
      selectedDatasetId: '',
      uploadedFile: null as File | null,
      newDatasetData: {
        name: '',
        description: '',
        format: 'csv' as 'csv' | 'json' | 'excel',
        data: ''
      }
    }
  });

  // Dataset management states
  const [availableDatasets, setAvailableDatasets] = useState<any[]>([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Load available datasets when modal opens
  useEffect(() => {
    if (open) {
      loadAvailableDatasets();
    }
  }, [open]);

  const loadAvailableDatasets = async () => {
    setIsLoadingDatasets(true);
    try {
      // Load saved datasets from localStorage
      const savedDatasets = JSON.parse(localStorage.getItem('uploadedDatasets') || '{}');
      const savedDatasetList = Object.values(savedDatasets).map((dataset: any) => ({
        id: dataset.id,
        name: dataset.name,
        row_count: dataset.row_count,
        format: dataset.format,
        created_at: dataset.created_at,
        last_modified: dataset.last_modified,
        size_mb: dataset.size_mb,
        status: dataset.status
      }));
      
      // Combine with mock datasets
      const mockDatasets = [
        { id: 'dataset-1', name: 'Customer Support Q&A', row_count: 1250, format: 'csv', created_at: '2024-01-15', last_modified: '2024-01-15', size_mb: '2.5', status: 'active' },
        { id: 'dataset-2', name: 'Product Knowledge Base', row_count: 890, format: 'json', created_at: '2024-01-10', last_modified: '2024-01-10', size_mb: '1.8', status: 'active' },
        { id: 'dataset-3', name: 'FAQ Database', row_count: 567, format: 'csv', created_at: '2024-01-05', last_modified: '2024-01-05', size_mb: '1.2', status: 'active' },
        { id: 'dataset-4', name: 'Technical Documentation', row_count: 2340, format: 'excel', created_at: '2024-01-01', last_modified: '2024-01-01', size_mb: '4.1', status: 'active' }
      ];
      
      const allDatasets = [...savedDatasetList, ...mockDatasets];
      setAvailableDatasets(allDatasets);
      
      // Load first dataset by default
      if (allDatasets.length > 0 && !selectedDatasetId) {
        await loadSpecificDatasetData(allDatasets[0].id);
      }
    } catch (error) {
      console.error('Error loading datasets:', error);
    } finally {
      setIsLoadingDatasets(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setFormData(prev => ({
      ...prev,
      dataset: { ...prev.dataset, uploadedFile: file }
    }));

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }
    
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleSubmit = () => {
    const newPreset: TrainingPreset = {
      id: `preset-${Date.now()}`,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name,
      type: formData.type,
      description: formData.description,
      created_by: 'Current User',
      created_at: new Date().toISOString(),
      is_archived: false,
      is_favorite: false,
      visibility: formData.visibility,
      tags: formData.tags,
      version: '1.0.0',
      status: 'draft',
      metrics: {
        success_rate: 0,
        training_duration: 0,
        cost_usd: 0,
        last_trained: '',
        usage_count: 0
      },
      config: {
        model: formData.model,
        temperature: formData.temperature,
        max_tokens: formData.max_tokens,
        epochs: formData.epochs,
        learning_rate: formData.learning_rate,
        batch_size: formData.batch_size,
        validation_split: formData.validation_split,
        safety_filters: formData.safety_filters,
        custom_instructions: formData.custom_instructions
      },
      dataset: {
        id: formData.dataset.selectedDatasetId || `dataset-${Date.now()}`,
        name: formData.dataset.name || `${formData.name} Dataset`,
        row_count: availableDatasets.find(d => d.id === formData.dataset.selectedDatasetId)?.row_count || 0,
        schema_hash: 'abc123'
      }
    };
    onPresetCreated(newPreset);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Plus className="w-6 h-6 text-blue-600" />
            Create Training Preset
          </DialogTitle>
          <DialogDescription>
            Set up a new training configuration for your chatbot
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of 5</span>
            <span className="text-sm text-gray-500">{Math.round((step / 5) * 100)}% Complete</span>
          </div>
          <Progress value={(step / 5) * 100} className="h-2" />
        </div>

        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Preset Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Customer Support Bot v2.0"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe what this preset is designed to accomplish..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Bot Type *</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Card
                    className={`cursor-pointer transition-all ${
                      formData.type === 'rule-based' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => setFormData({...formData, type: 'rule-based'})}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Bot className="w-6 h-6 text-blue-600" />
                        <div>
                          <h3 className="font-medium">Rule-based</h3>
                          <p className="text-sm text-gray-600">Pre-defined responses & flows</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer transition-all ${
                      formData.type === 'llm' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => setFormData({...formData, type: 'llm'})}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Brain className="w-6 h-6 text-purple-600" />
                        <div>
                          <h3 className="font-medium">LLM-powered</h3>
                          <p className="text-sm text-gray-600">AI-driven intelligent responses</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Model Configuration</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Select value={formData.model} onValueChange={(value) => setFormData({...formData, model: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                        <SelectItem value="llama-3">Llama 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="temperature">Temperature: {formData.temperature}</Label>
                    <Slider
                      value={[formData.temperature]}
                      onValueChange={([value]) => setFormData({...formData, temperature: value})}
                      max={2}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="custom_instructions">Custom Instructions</Label>
                <Textarea
                  id="custom_instructions"
                  value={formData.custom_instructions}
                  onChange={(e) => setFormData({...formData, custom_instructions: e.target.value})}
                  placeholder="Provide specific instructions for the AI model..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Training Parameters</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="epochs">Epochs: {formData.epochs}</Label>
                    <Slider
                      value={[formData.epochs]}
                      onValueChange={([value]) => setFormData({...formData, epochs: value})}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="learning_rate">Learning Rate: {formData.learning_rate}</Label>
                    <Slider
                      value={[formData.learning_rate]}
                      onValueChange={([value]) => setFormData({...formData, learning_rate: value})}
                      max={0.01}
                      min={0.0001}
                      step={0.0001}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.safety_filters}
                  onCheckedChange={(checked) => setFormData({...formData, safety_filters: checked})}
                />
                <Label>Enable Safety Filters</Label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <Label className="text-xl font-bold text-slate-900 mb-4 block">Dataset Management</Label>
                                  <p className="text-base text-slate-600 mb-6">Choose how you want to provide training data for your preset.</p>
                
                {/* Dataset Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card
                    className={`cursor-pointer transition-all ${
                      formData.dataset.type === 'existing' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => setFormData({
                      ...formData, 
                      dataset: { ...formData.dataset, type: 'existing' }
                    })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Database className="w-6 h-6 text-blue-600" />
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Use Existing Dataset</h3>
                                                      <p className="text-base text-slate-600">Select from your datasets.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card
                    className={`cursor-pointer transition-all ${
                      formData.dataset.type === 'upload' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => setFormData({
                      ...formData, 
                      dataset: { ...formData.dataset, type: 'upload' }
                    })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Upload className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Upload New File</h3>
                                                      <p className="text-base text-slate-600">Upload CSV, JSON, or Excel.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card
                    className={`cursor-pointer transition-all ${
                      formData.dataset.type === 'create' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => setFormData({
                      ...formData, 
                      dataset: { ...formData.dataset, type: 'create' }
                    })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Plus className="w-6 h-6 text-purple-600" />
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Create New Dataset</h3>
                                                      <p className="text-base text-slate-600">Build from scratch.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Existing Dataset Selection */}
                {formData.dataset.type === 'existing' && (
                  <div className="space-y-4">
                    <Label className="text-lg font-bold text-slate-900">Select Dataset</Label>
                    {isLoadingDatasets ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading datasets...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableDatasets.map((dataset) => (
                          <Card
                            key={dataset.id}
                            className={`cursor-pointer transition-all ${
                              formData.dataset.selectedDatasetId === dataset.id 
                                ? 'ring-2 ring-blue-500 bg-blue-50' 
                                : 'hover:shadow-md'
                            }`}
                            onClick={() => setFormData({
                              ...formData,
                              dataset: { 
                                ...formData.dataset, 
                                selectedDatasetId: dataset.id,
                                name: dataset.name
                              }
                            })}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{dataset.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    {dataset.row_count.toLocaleString()} rows • {dataset.format.toUpperCase()}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Created {new Date(dataset.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className="text-xs">
                                    {dataset.format}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* File Upload */}
                {formData.dataset.type === 'upload' && (
                  <div className="space-y-4">
                    <Label>Upload Dataset File</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      {formData.dataset.uploadedFile ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-center gap-2">
                            <FileText className="w-8 h-8 text-green-600" />
                            <div>
                              <p className="font-medium">{formData.dataset.uploadedFile.name}</p>
                              <p className="text-sm text-gray-600">
                                {(formData.dataset.uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          {isUploading && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                              </div>
                              <Progress value={uploadProgress} className="h-2" />
                            </div>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => setFormData({
                              ...formData,
                              dataset: { ...formData.dataset, uploadedFile: null }
                            })}
                          >
                            Remove File
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-lg font-medium mb-2">Drop your file here, or click to browse</p>
                          <p className="text-sm text-gray-600 mb-4">
                            Supports CSV, JSON, and Excel files up to 50MB
                          </p>
                          <input
                            type="file"
                            accept=".csv,.json,.xlsx,.xls"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file);
                              }
                            }}
                            className="hidden"
                            id="dataset-upload"
                          />
                          <label htmlFor="dataset-upload">
                            <Button variant="outline" className="cursor-pointer">
                              Choose File
                            </Button>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Create New Dataset */}
                {formData.dataset.type === 'create' && (
                  <div className="space-y-4">
                    <Label>Create New Dataset</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="new-dataset-name">Dataset Name</Label>
                        <Input
                          id="new-dataset-name"
                          value={formData.dataset.newDatasetData.name}
                          onChange={(e) => setFormData({
                            ...formData,
                            dataset: {
                              ...formData.dataset,
                              newDatasetData: {
                                ...formData.dataset.newDatasetData,
                                name: e.target.value
                              }
                            }
                          })}
                          placeholder="My Custom Dataset"
                        />
                      </div>
                      <div>
                        <Label>Format</Label>
                        <Select 
                          value={formData.dataset.newDatasetData.format}
                          onValueChange={(value: any) => setFormData({
                            ...formData,
                            dataset: {
                              ...formData.dataset,
                              newDatasetData: {
                                ...formData.dataset.newDatasetData,
                                format: value
                              }
                            }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="new-dataset-description">Description</Label>
                      <Textarea
                        id="new-dataset-description"
                        value={formData.dataset.newDatasetData.description}
                        onChange={(e) => setFormData({
                          ...formData,
                          dataset: {
                            ...formData.dataset,
                            newDatasetData: {
                              ...formData.dataset.newDatasetData,
                              description: e.target.value
                            }
                          }
                        })}
                        placeholder="Describe your dataset..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-dataset-data">Sample Data</Label>
                      <Textarea
                        id="new-dataset-data"
                        value={formData.dataset.newDatasetData.data}
                        onChange={(e) => setFormData({
                          ...formData,
                          dataset: {
                            ...formData.dataset,
                            newDatasetData: {
                              ...formData.dataset.newDatasetData,
                              data: e.target.value
                            }
                          }
                        })}
                        placeholder="Enter sample data in the selected format..."
                        rows={6}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter sample data to define the structure of your dataset
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <Label>Visibility</Label>
                <Select value={formData.visibility} onValueChange={(value: any) => setFormData({...formData, visibility: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tags</Label>
                <Input
                  placeholder="Enter tags separated by commas..."
                  onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Preset Summary</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {formData.name}</div>
                  <div><strong>Type:</strong> {formData.type}</div>
                  <div><strong>Model:</strong> {formData.model}</div>
                  <div><strong>Temperature:</strong> {formData.temperature}</div>
                  <div><strong>Epochs:</strong> {formData.epochs}</div>
                  <div><strong>Dataset:</strong> {
                    formData.dataset.type === 'existing' && formData.dataset.selectedDatasetId 
                      ? availableDatasets.find(d => d.id === formData.dataset.selectedDatasetId)?.name || 'Not selected'
                      : formData.dataset.type === 'upload' && formData.dataset.uploadedFile
                      ? formData.dataset.uploadedFile.name
                      : formData.dataset.type === 'create' && formData.dataset.newDatasetData.name
                      ? formData.dataset.newDatasetData.name
                      : 'Not configured'
                  }</div>
                  <div><strong>Dataset Type:</strong> {formData.dataset.type}</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            {step < 5 ? (
              <Button onClick={() => setStep(step + 1)}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                Create Preset
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Inline JobProgressBar Component
interface JobProgressBarProps {
  status: 'queued' | 'downloading' | 'training' | 'evaluating' | 'completed' | 'failed';
}

const JobProgressBar: React.FC<JobProgressBarProps> = ({ status }) => {
  const steps = [
    { key: 'queued', label: 'Queued', icon: Clock },
    { key: 'downloading', label: 'Downloading', icon: Loader2 },
    { key: 'training', label: 'Training', icon: Loader2 },
    { key: 'evaluating', label: 'Evaluating', icon: Loader2 },
    { key: 'completed', label: 'Completed', icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === status);
  const progress = status === 'completed' ? 100 : (currentStepIndex / (steps.length - 1)) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="relative">
        <Progress value={progress} className="h-3" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.key === status;
          const isCompleted = index < currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div key={step.key} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                isCompleted 
                  ? 'bg-green-100 text-green-600' 
                  : isActive 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-400'
              }`}>
                {isActive && step.key !== 'completed' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span className={`text-xs font-medium ${
                isCompleted 
                  ? 'text-green-600' 
                  : isActive 
                    ? 'text-blue-600' 
                    : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Preset Details Modal Component
interface PresetDetailsModalProps {
  preset: TrainingPreset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PresetDetailsModal: React.FC<PresetDetailsModalProps> = ({
  preset,
  open,
  onOpenChange
}) => {
  const [trainingRuns, setTrainingRuns] = useState<TrainingRun[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [currentTrainingRun, setCurrentTrainingRun] = useState<TrainingRun | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateDatasetModalOpen, setIsCreateDatasetModalOpen] = useState(false);
  const [isModifyDatasetModalOpen, setIsModifyDatasetModalOpen] = useState(false);
  const [isGovernanceModalOpen, setIsGovernanceModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColumn, setFilterColumn] = useState('all');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editingCell, setEditingCell] = useState<{row: number, col: string, value: string} | null>(null);
  const [datasetData, setDatasetData] = useState<any[]>([]);
  
  // Enhanced dataset management states
  const [availableDatasets, setAvailableDatasets] = useState<any[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);
  const [datasetView, setDatasetView] = useState<'overview' | 'management' | 'editor'>('overview');
  
  // Real data states
  const [realMetrics, setRealMetrics] = useState({
    successRate: 0,
    trainingDuration: 0,
    totalCost: 0,
    usageCount: 0
  });
  const [realConfig, setRealConfig] = useState({
    model: '',
    temperature: 0,
    maxTokens: 0,
    epochs: 0
  });
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [editableConfig, setEditableConfig] = useState({
    model: '',
    temperature: 0,
    maxTokens: 0,
    epochs: 0
  });
  
  const { toast } = useToast();

  // Load real data when modal opens
  useEffect(() => {
    if (open && preset) {
      loadRealData();
      loadAvailableDatasets();
    }
  }, [open, preset]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...datasetData];
    
    // Apply search filter
    if (searchTerm) {
      data = data.filter(row => 
        Object.values(row).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply column filter
    if (filterColumn !== 'all') {
      data = data.filter(row => row[filterColumn]);
    }
    
    // Apply sorting
    if (sortColumn) {
      data.sort((a, b) => {
        const aVal = a[sortColumn] || '';
        const bVal = b[sortColumn] || '';
        const comparison = aVal.toString().localeCompare(bVal.toString());
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    return data;
  }, [datasetData, searchTerm, filterColumn, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    return filteredData.slice(startIndex, startIndex + 10);
  }, [filteredData, currentPage]);

  // Define columns for the data table
  const columns = [
    { key: 'question', label: 'Question' },
    { key: 'answer', label: 'Answer' },
    { key: 'category', label: 'Category' }
  ];

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const loadRealData = async () => {
    if (!preset) return;
    
    setIsLoadingMetrics(true);
    try {
      // Load conversations for this chatbot
      const conversationsData = await chatbotService.getChatbotConversations(preset.id);
      setConversations(conversationsData || []);

      // Load analytics for this chatbot
      const analyticsData = await chatbotService.getChatbotAnalytics(preset.id);
      setAnalytics(analyticsData);

      // Calculate real metrics from conversations and analytics
      const totalConversations = conversationsData?.length || 0;
      const resolvedConversations = conversationsData?.filter(c => c.status === 'resolved').length || 0;
      const successRate = totalConversations > 0 ? (resolvedConversations / totalConversations) * 100 : 0;
      
      // Calculate average resolution time (convert to minutes)
      const avgResolutionTime = conversationsData?.reduce((acc, conv) => {
        return acc + (conv.resolution_time || 0);
      }, 0) / (conversationsData?.length || 1);

      // Calculate total cost (simplified calculation)
      const totalCost = totalConversations * 0.01; // $0.01 per conversation

      // Get usage count from total chats
      const usageCount = analyticsData?.total_conversations || totalConversations;

      setRealMetrics({
        successRate: Math.round(successRate * 100) / 100, // Round to 2 decimal places
        trainingDuration: Math.round(avgResolutionTime * 100) / 100, // Convert to minutes
        totalCost: Math.round(totalCost * 100) / 100, // Round to 2 decimal places
        usageCount: usageCount
      });

      // Load real configuration from preset config
      if (preset.config) {
        setRealConfig({
          model: preset.config.model || 'gpt-4',
          temperature: preset.config.temperature || 0.7,
          maxTokens: preset.config.max_tokens || 1000,
          epochs: preset.config.epochs || 3
        });
        
        // Set editable config to match real config
        setEditableConfig({
          model: preset.config.model || 'gpt-4',
          temperature: preset.config.temperature || 0.7,
          maxTokens: preset.config.max_tokens || 1000,
          epochs: preset.config.epochs || 3
        });
      }

    } catch (error) {
      console.error('Error loading real data:', error);
      toast({
        title: "Error",
        description: "Failed to load real metrics data",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const handleStartEditConfig = () => {
    setIsEditingConfig(true);
  };

  const handleCancelEditConfig = () => {
    setEditableConfig({
      model: realConfig.model,
      temperature: realConfig.temperature,
      maxTokens: realConfig.maxTokens,
      epochs: realConfig.epochs
    });
    setIsEditingConfig(false);
  };

  const handleSaveConfig = async () => {
    try {
      // Update the real config
      setRealConfig(editableConfig);
      
      // Here you would typically save to the database
      // await chatbotService.updateChatbot(preset.id, { config: editableConfig });
      
      setIsEditingConfig(false);
      
      toast({
        title: "Configuration Updated",
        description: "Model configuration has been successfully updated.",
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive"
      });
    }
  };

  // Load real dataset data when modal opens
  const loadDatasetData = async () => {
    try {
      // Fetch real dataset data from the backend
      // For now, we'll simulate loading real data based on the preset's dataset
      if (preset?.dataset) {
        // Simulate API call to get dataset content
        const mockRealData = [
          {
            question: "What is the return policy?",
            answer: "You can return items within 30 days of purchase with original receipt.",
            category: "Returns"
          },
          {
            question: "How do I track my order?",
            answer: "Use your order number to track delivery status on our website.",
            category: "Shipping"
          },
          {
            question: "What payment methods do you accept?",
            answer: "We accept credit cards, PayPal, and bank transfers.",
            category: "Payment"
          }
        ];
        
        setDatasetData(mockRealData);
      } else {
        setDatasetData([]);
      }
    } catch (error) {
      console.error('Error loading dataset data:', error);
      setDatasetData([]);
    }
  };

  // Load all available datasets for this preset
  const loadAvailableDatasets = async () => {
    setIsLoadingDatasets(true);
    try {
      // Load saved datasets from localStorage
      const savedDatasets = JSON.parse(localStorage.getItem('uploadedDatasets') || '{}');
      const savedDatasetList = Object.values(savedDatasets).map((dataset: any) => ({
        id: dataset.id,
        name: dataset.name,
        row_count: dataset.row_count,
        format: dataset.format,
        created_at: dataset.created_at,
        last_modified: dataset.last_modified,
        size_mb: dataset.size_mb,
        status: dataset.status
      }));
      
      // Combine with mock datasets
      const mockDatasets = [
        { id: 'dataset-1', name: 'Customer Support Q&A', row_count: 1250, format: 'csv', created_at: '2024-01-15', last_modified: '2024-01-15', size_mb: '2.5', status: 'active' },
        { id: 'dataset-2', name: 'Product Knowledge Base', row_count: 890, format: 'json', created_at: '2024-01-10', last_modified: '2024-01-10', size_mb: '1.8', status: 'active' },
        { id: 'dataset-3', name: 'FAQ Database', row_count: 567, format: 'csv', created_at: '2024-01-05', last_modified: '2024-01-05', size_mb: '1.2', status: 'active' },
        { id: 'dataset-4', name: 'Technical Documentation', row_count: 2340, format: 'excel', created_at: '2024-01-01', last_modified: '2024-01-01', size_mb: '4.1', status: 'active' }
      ];
      
      const allDatasets = [...savedDatasetList, ...mockDatasets];
      setAvailableDatasets(allDatasets);
      
      // Load first dataset by default
      if (allDatasets.length > 0 && !selectedDatasetId) {
        await loadSpecificDatasetData(allDatasets[0].id);
      }
    } catch (error) {
      console.error('Error loading datasets:', error);
    } finally {
      setIsLoadingDatasets(false);
    }
  };

  // Load data for a specific dataset
  const loadSpecificDatasetData = async (datasetId: string) => {
    try {
      // Simulate loading data for specific dataset
      const datasetDataMap: { [key: string]: any[] } = {
        'dataset-1': [
          { question: "What is the return policy?", answer: "You can return items within 30 days of purchase with original receipt.", category: "Returns" },
          { question: "How do I track my order?", answer: "Use your order number to track delivery status on our website.", category: "Shipping" },
          { question: "What payment methods do you accept?", answer: "We accept credit cards, PayPal, and bank transfers.", category: "Payment" }
        ],
        'dataset-2': [
          { question: "What are the product features?", answer: "Our product includes advanced AI capabilities, real-time processing, and cloud integration.", category: "Features" },
          { question: "What are the system requirements?", answer: "Minimum 8GB RAM, 4-core processor, and stable internet connection.", category: "Technical" },
          { question: "How do I install the software?", answer: "Download the installer from our website and follow the setup wizard.", category: "Installation" }
        ],
        'dataset-3': [
          { question: "How do I reset my password?", answer: "Click 'Forgot Password' on the login page and follow the email instructions.", category: "Account" },
          { question: "Can I change my email address?", answer: "Yes, go to Account Settings > Profile to update your email address.", category: "Account" },
          { question: "How do I contact support?", answer: "Use the chat widget, email support@company.com, or call 1-800-SUPPORT.", category: "Support" }
        ],
        'dataset-4': [
          { question: "What is the API documentation?", answer: "Complete API documentation is available at docs.company.com/api.", category: "Technical" },
          { question: "How do I integrate with third-party services?", answer: "Use our webhook system or REST API endpoints for integration.", category: "Integration" },
          { question: "What are the rate limits?", answer: "Standard tier: 1000 requests/hour, Premium tier: 10000 requests/hour.", category: "Technical" }
        ]
      };
      
      // First check if this is an uploaded dataset saved in localStorage
      const savedDatasets = JSON.parse(localStorage.getItem('uploadedDatasets') || '{}');
      if (savedDatasets[datasetId]) {
        setDatasetData(savedDatasets[datasetId].data || []);
        setSelectedDatasetId(datasetId);
        return;
      }
      
      const data = datasetDataMap[datasetId] || [];
      setDatasetData(data);
      setSelectedDatasetId(datasetId);
    } catch (error) {
      console.error('Error loading specific dataset data:', error);
      setDatasetData([]);
    }
  };

  // Generate mock data for uploaded files
  const generateMockDataForFile = (file: File, rowCount: number) => {
    const fileName = file.name.toLowerCase();
    const data = [];
    
    // Generate data based on file type and name
    for (let i = 1; i <= rowCount; i++) {
      if (fileName.includes('tech') || fileName.includes('summit')) {
        data.push({
          question: `Tech Summit Question ${i}`,
          answer: `This is a detailed technical answer for question ${i} related to the tech summit.`,
          category: i % 3 === 0 ? 'Technical' : i % 2 === 0 ? 'General' : 'Advanced'
        });
      } else if (fileName.includes('customer') || fileName.includes('support')) {
        data.push({
          question: `Customer Support Question ${i}`,
          answer: `Here's how to resolve customer support issue ${i}.`,
          category: i % 3 === 0 ? 'Billing' : i % 2 === 0 ? 'Technical' : 'General'
        });
      } else if (fileName.includes('product') || fileName.includes('knowledge')) {
        data.push({
          question: `Product Knowledge Question ${i}`,
          answer: `Product knowledge answer for question ${i}.`,
          category: i % 3 === 0 ? 'Features' : i % 2 === 0 ? 'Pricing' : 'Usage'
        });
      } else {
        data.push({
          question: `Question ${i}`,
          answer: `Answer for question ${i}.`,
          category: i % 3 === 0 ? 'Category A' : i % 2 === 0 ? 'Category B' : 'Category C'
        });
      }
    }
    
    return data;
  };

  // Handle dataset selection
  const handleDatasetSelect = async (datasetId: string) => {
    await loadSpecificDatasetData(datasetId);
    // Only switch to editor view if we're in management view
    if (datasetView === 'management') {
      setDatasetView('editor');
    }
  };

  // Handle dataset upload
  const handleDatasetUpload = async (file: File) => {
    try {
      // Simulate file upload with progress
      const newDataset = {
        id: `dataset-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""),
        description: `Uploaded dataset: ${file.name}`,
        row_count: Math.floor(Math.random() * 1000) + 100,
        format: file.name.split('.').pop()?.toLowerCase() || 'csv',
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        size_mb: (file.size / (1024 * 1024)).toFixed(2),
        status: 'active'
      };
      
      // Add to available datasets
      setAvailableDatasets(prev => [newDataset, ...prev]);
      setSelectedDatasetId(newDataset.id);
      
      // Generate mock data for the uploaded file
      const fileName = file.name.toLowerCase();
      const mockData = [];
      for (let i = 1; i <= newDataset.row_count; i++) {
        if (fileName.includes('tech') || fileName.includes('summit')) {
          mockData.push({
            question: `Tech Summit Question ${i}`,
            answer: `This is a detailed technical answer for question ${i} related to the tech summit.`,
            category: i % 3 === 0 ? 'Technical' : i % 2 === 0 ? 'General' : 'Advanced'
          });
        } else if (fileName.includes('customer') || fileName.includes('support')) {
          mockData.push({
            question: `Customer Support Question ${i}`,
            answer: `Here's how to resolve customer support issue ${i}.`,
            category: i % 3 === 0 ? 'Billing' : i % 2 === 0 ? 'Technical' : 'General'
          });
        } else if (fileName.includes('product') || fileName.includes('knowledge')) {
          mockData.push({
            question: `Product Knowledge Question ${i}`,
            answer: `Product knowledge answer for question ${i}.`,
            category: i % 3 === 0 ? 'Features' : i % 2 === 0 ? 'Pricing' : 'Usage'
          });
        } else {
          mockData.push({
            question: `Question ${i}`,
            answer: `Answer for question ${i}.`,
            category: i % 3 === 0 ? 'Category A' : i % 2 === 0 ? 'Category B' : 'Category C'
          });
        }
      }
      setDatasetData(mockData);
      
      // Save to localStorage for persistence
      const savedDatasets = JSON.parse(localStorage.getItem('uploadedDatasets') || '{}');
      savedDatasets[newDataset.id] = {
        ...newDataset,
        data: mockData
      };
      localStorage.setItem('uploadedDatasets', JSON.stringify(savedDatasets));
      
      toast({
        title: "Dataset Uploaded & Saved",
        description: `${file.name} has been successfully uploaded and saved with ${newDataset.row_count} rows.`,
      });
    } catch (error) {
      console.error('Error uploading dataset:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload dataset. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle dataset deletion
  const handleDatasetDelete = async (datasetId: string) => {
    try {
      setAvailableDatasets(prev => prev.filter(d => d.id !== datasetId));
      
      if (selectedDatasetId === datasetId) {
        const remainingDatasets = availableDatasets.filter(d => d.id !== datasetId);
        if (remainingDatasets.length > 0) {
          await loadSpecificDatasetData(remainingDatasets[0].id);
        } else {
          setSelectedDatasetId('');
          setDatasetData([]);
        }
      }
      
      toast({
        title: "Dataset Deleted",
        description: "Dataset has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting dataset:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete dataset. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStartEdit = (rowIndex: number, columnKey: string, value: string) => {
    setEditingCell({ row: rowIndex, col: columnKey, value: value || '' });
  };

  // Save dataset data changes
  const saveDatasetChanges = () => {
    if (selectedDatasetId) {
      const savedDatasets = JSON.parse(localStorage.getItem('uploadedDatasets') || '{}');
      if (savedDatasets[selectedDatasetId]) {
        savedDatasets[selectedDatasetId].data = datasetData;
        savedDatasets[selectedDatasetId].last_modified = new Date().toISOString();
        localStorage.setItem('uploadedDatasets', JSON.stringify(savedDatasets));
        
        toast({
          title: "Changes Saved",
          description: "Dataset changes have been saved successfully.",
        });
      }
    }
  };

  const handleSaveEdit = (rowIndex: number, columnKey: string) => {
    if (!editingCell) return;
    const newData = [...datasetData];
    newData[rowIndex] = { ...newData[rowIndex], [columnKey]: editingCell.value };
    setDatasetData(newData);
    setEditingCell(null);
    
    // Auto-save changes
    saveDatasetChanges();
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newData = datasetData.filter((_, index) => index !== rowIndex);
    setDatasetData(newData);
    setSelectedRows(selectedRows.filter(i => i !== rowIndex));
    
    // Auto-save changes
    saveDatasetChanges();
  };

  const handleDeleteSelected = () => {
    const newData = datasetData.filter((_, index) => !selectedRows.includes(index));
    setDatasetData(newData);
    setSelectedRows([]);
    setSelectAll(false);
    
    // Auto-save changes
    saveDatasetChanges();
  };

  const startTraining = async () => {
    if (!preset) return;

    setIsTraining(true);
    
    // Create a new training run
    const newRun: TrainingRun = {
      id: `run-${Date.now()}`,
      preset_id: preset.id,
      version: preset.version,
      started_at: new Date().toISOString(),
      status: 'queued',
      cost_usd: 0,
      metrics: {
        accuracy: 0,
        f1_score: 0
      }
    };

    setCurrentTrainingRun(newRun);
    setTrainingRuns(prev => [newRun, ...prev]);

    toast({
      title: "Training Started",
      description: `Training run initiated for ${preset.name}`,
    });

    // Simulate training progress
    const simulateTraining = async () => {
      const stages: Array<{ status: TrainingRun['status']; duration: number }> = [
        { status: 'downloading', duration: 2000 },
        { status: 'training', duration: 5000 },
        { status: 'evaluating', duration: 3000 },
        { status: 'completed', duration: 1000 }
      ];

      for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, stage.duration));
        
        setCurrentTrainingRun(prev => prev ? {
          ...prev,
          status: stage.status,
          ...(stage.status === 'completed' && {
            finished_at: new Date().toISOString(),
            cost_usd: Math.random() * 10 + 5,
            metrics: {
              accuracy: Math.random() * 20 + 80,
              f1_score: Math.random() * 15 + 85,
              bleu_score: Math.random() * 10 + 90,
              rouge_score: Math.random() * 8 + 92
            }
          })
        } : null);

        setTrainingRuns(prev => prev.map(run => 
          run.id === newRun.id 
            ? {
                ...run,
                status: stage.status,
                ...(stage.status === 'completed' && {
                  finished_at: new Date().toISOString(),
                  cost_usd: Math.random() * 10 + 5,
                  metrics: {
                    accuracy: Math.random() * 20 + 80,
                    f1_score: Math.random() * 15 + 85,
                    bleu_score: Math.random() * 10 + 90,
                    rouge_score: Math.random() * 8 + 92
                  }
                })
              }
            : run
        ));

        if (stage.status === 'completed') {
          toast({
            title: "Training Completed",
            description: `Training run for ${preset.name} has completed successfully!`,
          });
          setIsTraining(false);
          setCurrentTrainingRun(null);
        }
      }
    };

    simulateTraining();
  };

  const handleUploadDataset = () => {
    setIsUploadModalOpen(true);
  };

  const handleCreateDataset = () => {
    const newDataset = {
      id: `dataset-${Date.now()}`,
      name: `New Dataset ${availableDatasets.length + 1}`,
      description: 'Newly created dataset',
      row_count: 0,
      format: 'csv',
      created_at: new Date().toISOString(),
      last_modified: new Date().toISOString(),
      size_mb: '0.0',
      status: 'active'
    };
    
    setAvailableDatasets(prev => [newDataset, ...prev]);
    setSelectedDatasetId(newDataset.id);
    setDatasetData([]); // Empty data for new dataset
    
    // Save to localStorage for persistence
    const savedDatasets = JSON.parse(localStorage.getItem('uploadedDatasets') || '{}');
    savedDatasets[newDataset.id] = {
      ...newDataset,
      data: []
    };
    localStorage.setItem('uploadedDatasets', JSON.stringify(savedDatasets));
    
    toast({
      title: "Dataset Created & Saved",
      description: "New dataset has been created and saved successfully.",
    });
  };

  const handleModifyDataset = () => {
    setIsModifyDatasetModalOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload progress
    const simulateUpload = async () => {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }
      
      setIsUploading(false);
      setIsUploadModalOpen(false);
      setUploadedFile(null);
      setUploadProgress(0);
      
      toast({
        title: "Dataset Uploaded",
        description: `Successfully uploaded ${file.name}`,
      });
    };

    simulateUpload();
  };

  const handleCreateNewDataset = async (datasetData: any) => {
    // Simulate dataset creation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsCreateDatasetModalOpen(false);
    toast({
      title: "Dataset Created",
      description: "New dataset has been created successfully",
    });
  };

  const handleModifyExistingDataset = async (modifications: any) => {
    // Simulate dataset modification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsModifyDatasetModalOpen(false);
    toast({
      title: "Dataset Modified",
      description: "Dataset has been updated successfully",
    });
  };

  if (!preset) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preset Not Found</DialogTitle>
            <DialogDescription>
              The selected preset could not be loaded. Please try again.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  {preset?.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="secondary" 
                    className="bg-green-100 text-green-700 border-green-200 font-medium"
                  >
                    {preset?.status}
                  </Badge>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-600">{preset?.type}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <DialogDescription className="text-base text-gray-600 mt-3 leading-relaxed">
            {preset?.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1 rounded-lg">
            <TabsTrigger value="overview" className="text-sm font-medium">Overview</TabsTrigger>
            <TabsTrigger value="training-runs" className="text-sm font-medium">Training Runs</TabsTrigger>
            <TabsTrigger value="dataset" className="text-sm font-medium">Dataset</TabsTrigger>
            <TabsTrigger value="governance" className="text-sm font-medium">Governance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">Success Rate</p>
                      <p className="text-2xl font-bold text-blue-900">{realMetrics.successRate}%</p>
                      <p className="text-xs text-blue-600 mt-1">{realMetrics.usageCount} of {realMetrics.usageCount} resolved</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-200 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-blue-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">Avg Resolution Time</p>
                      <p className="text-2xl font-bold text-green-900">{realMetrics.trainingDuration}m</p>
                      <p className="text-xs text-green-600 mt-1">Based on {realMetrics.usageCount} conversations</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-green-200 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700 mb-1">Total Cost</p>
                      <p className="text-2xl font-bold text-purple-900">${realMetrics.totalCost}</p>
                      <p className="text-xs text-purple-600 mt-1">${realMetrics.totalCost} per conversation</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-purple-200 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-purple-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700 mb-1">Total Conversations</p>
                      <p className="text-2xl font-bold text-orange-900">{realMetrics.usageCount}</p>
                      <p className="text-xs text-orange-600 mt-1">7 days of data</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-orange-200 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-orange-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Configuration Card */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
                  <span>Configuration</span>
                  {!isEditingConfig ? (
                    <Button
                      onClick={handleStartEditConfig}
                      size="sm"
                      variant="outline"
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 font-medium"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Configuration
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCancelEditConfig}
                        size="sm"
                        variant="outline"
                        className="font-medium"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveConfig}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 font-medium"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Model</Label>
                    {isEditingConfig ? (
                      <Select
                        value={editableConfig.model}
                        onValueChange={(value) => setEditableConfig({...editableConfig, model: value})}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="claude-3">Claude 3</SelectItem>
                          <SelectItem value="llama-3">Llama 3</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-sm text-gray-900 font-medium">{realConfig.model}</div>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Temperature: {isEditingConfig ? editableConfig.temperature : realConfig.temperature}</Label>
                    {isEditingConfig ? (
                      <Slider
                        value={[editableConfig.temperature]}
                        onValueChange={([value]) => setEditableConfig({...editableConfig, temperature: value})}
                        max={2}
                        min={0}
                        step={0.1}
                        className="mt-2"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 font-medium">{realConfig.temperature}</div>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Max Tokens</Label>
                    {isEditingConfig ? (
                      <Input
                        type="number"
                        value={editableConfig.maxTokens}
                        onChange={(e) => setEditableConfig({...editableConfig, maxTokens: parseInt(e.target.value)})}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 font-medium">{realConfig.maxTokens.toLocaleString()}</div>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Epochs</Label>
                    {isEditingConfig ? (
                      <Input
                        type="number"
                        value={editableConfig.epochs}
                        onChange={(e) => setEditableConfig({...editableConfig, epochs: parseInt(e.target.value)})}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 font-medium">{realConfig.epochs}</div>
                    )}
                  </div>
                </div>
                {isEditingConfig && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <div className="font-semibold mb-2">Configuration Tips:</div>
                        <ul className="space-y-1 text-sm">
                          <li>• <strong>Temperature:</strong> Lower values (0.1-0.3) for focused responses, higher (0.7-1.0) for creativity</li>
                          <li>• <strong>Max Tokens:</strong> Higher values allow longer responses but increase costs</li>
                          <li>• <strong>Epochs:</strong> More epochs improve accuracy but increase training time</li>
                          <li>• <strong>Model:</strong> GPT-4 is more capable but costs more than GPT-3.5</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Analytics Card */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">94.2%</div>
                    <div className="text-sm font-medium text-gray-700">Accuracy Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">4.2/5</div>
                    <div className="text-sm font-medium text-gray-700">User Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">1.8s</div>
                    <div className="text-sm font-medium text-gray-700">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">2.1%</div>
                    <div className="text-sm font-medium text-gray-700">Error Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Card */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Training completed</div>
                        <div className="text-xs text-gray-500">Model updated successfully</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Configuration updated</div>
                        <div className="text-xs text-gray-500">Temperature adjusted to 0.7</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">1 day ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training-runs" className="space-y-6 mt-6">
            {/* Current Training Run */}
            {currentTrainingRun && (
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">Current Training Run</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Status</p>
                        <p className="text-lg font-semibold text-blue-600">{currentTrainingRun.status}</p>
                      </div>
                      <Button
                        onClick={startTraining}
                        disabled={isTraining}
                        className="bg-blue-600 hover:bg-blue-700 font-medium"
                      >
                        {isTraining ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Training...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Start Training
                          </>
                        )}
                      </Button>
                    </div>
                    <JobProgressBar status={currentTrainingRun.status} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Training History */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Training History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingRuns.map((run) => (
                    <div key={run.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(run.status)}`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Version {run.version}</p>
                          <p className="text-xs text-gray-500">
                            Started {new Date(run.started_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${run.cost_usd.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{run.status}</p>
                      </div>
                    </div>
                  ))}
                  {trainingRuns.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <History className="w-16 h-16 mx-auto mb-6 text-gray-300" />
                      <p className="text-lg font-medium text-gray-700 mb-2">No training runs yet</p>
                      <p className="text-sm text-gray-500 mb-6">Start your first training session to improve your AI assistant</p>
                      <Button
                        onClick={startTraining}
                        disabled={isTraining}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 font-medium px-8 py-3"
                      >
                        {isTraining ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                            Starting Training...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 mr-3" />
                            Start Training
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dataset" className="space-y-6 mt-6">
            {/* Dataset Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant={datasetView === 'overview' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDatasetView('overview')}
                  className="font-medium"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Overview
                </Button>
                <Button
                  variant={datasetView === 'management' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDatasetView('management')}
                  className="font-medium"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Manage Datasets
                </Button>
                <Button
                  variant={datasetView === 'editor' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDatasetView('editor')}
                  className="font-medium"
                  disabled={!selectedDatasetId}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Data Editor
                </Button>
              </div>
              
              {datasetView === 'management' && (
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".csv,.json,.xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleDatasetUpload(file);
                        // Reset the input value to allow uploading the same file again
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                    id="dataset-upload-input"
                  />
                  <label htmlFor="dataset-upload-input">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      onClick={() => document.getElementById('dataset-upload-input')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Dataset
                    </Button>
                  </label>
                  <Button variant="outline" size="sm" onClick={handleCreateDataset}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Dataset
                  </Button>
                </div>
              )}
            </div>

            {/* Dataset Overview */}
            {datasetView === 'overview' && (
              <div className="space-y-6">
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">Dataset Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                          <Database className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{availableDatasets.length}</p>
                        <p className="text-sm font-medium text-gray-700">Total Datasets</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                          <FileText className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">
                          {availableDatasets.reduce((total, dataset) => total + dataset.row_count, 0).toLocaleString()}
                        </p>
                        <p className="text-sm font-medium text-gray-700">Total Rows</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                          <Shield className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">
                          {availableDatasets.reduce((total, dataset) => total + parseFloat(dataset.size_mb), 0).toFixed(1)} MB
                        </p>
                        <p className="text-sm font-medium text-gray-700">Total Size</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Datasets */}
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">Recent Datasets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {availableDatasets.slice(0, 3).map((dataset) => (
                        <div key={dataset.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{dataset.name}</p>
                              <p className="text-xs text-gray-500">{dataset.row_count.toLocaleString()} rows • {dataset.format.toUpperCase()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {dataset.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDatasetSelect(dataset.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Dataset Management */}
            {datasetView === 'management' && (
              <div className="space-y-6">
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">Dataset Management</CardTitle>
                    <CardDescription>Manage all datasets associated with this preset</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingDatasets ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-3 text-gray-600">Loading datasets...</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {availableDatasets.map((dataset) => (
                          <div key={dataset.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-gray-900">{dataset.name}</h4>
                                  {selectedDatasetId === dataset.id && (
                                    <Badge variant="secondary" className="text-xs">Active</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{dataset.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <span>{dataset.row_count.toLocaleString()} rows</span>
                                  <span>•</span>
                                  <span>{dataset.format.toUpperCase()}</span>
                                  <span>•</span>
                                  <span>{dataset.size_mb} MB</span>
                                  <span>•</span>
                                  <span>Modified {new Date(dataset.last_modified).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDatasetSelect(dataset.id)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDatasetDelete(dataset.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {availableDatasets.length === 0 && (
                          <div className="text-center py-12 text-gray-500">
                            <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium mb-2">No datasets yet</p>
                            <p className="text-sm mb-6">Upload or create your first dataset to get started</p>
                            <div className="flex items-center justify-center gap-4">
                              <input
                                type="file"
                                accept=".csv,.json,.xlsx,.xls"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleDatasetUpload(file);
                                    // Reset the input value to allow uploading the same file again
                                    e.target.value = '';
                                  }
                                }}
                                className="hidden"
                                id="empty-dataset-upload"
                              />
                              <label htmlFor="empty-dataset-upload">
                                <Button 
                                  variant="outline" 
                                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                  onClick={() => document.getElementById('empty-dataset-upload')?.click()}
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload Dataset
                                </Button>
                              </label>
                              <Button variant="outline" onClick={handleCreateDataset}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Dataset
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Data Editor */}
            {datasetView === 'editor' && selectedDatasetId && (
              <div className="space-y-6">
                {/* Dataset Info Header */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50/30">
                                      <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                              <Edit className="w-5 h-5" />
                              Data Editor
                            </CardTitle>
                            <CardDescription className="text-blue-100">
                              Edit and manage your dataset content
                            </CardDescription>
                          </div>
                                                  <div className="flex items-center gap-3">
                            <Label htmlFor="dataset-selector" className="text-sm font-medium text-blue-100">
                              Active Dataset:
                            </Label>
                            <Select
                              value={selectedDatasetId}
                              onValueChange={handleDatasetSelect}
                            >
                              <SelectTrigger className="w-72 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-white/40 focus:ring-white/20">
                                <SelectValue placeholder="Select a dataset" />
                              </SelectTrigger>
                            <SelectContent>
                              {availableDatasets.map((dataset) => (
                                <SelectItem key={dataset.id} value={dataset.id}>
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span>{dataset.name}</span>
                                    <span className="text-xs text-gray-500">({dataset.row_count} rows)</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                                              <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                          <Button size="sm" className="bg-white text-blue-600 hover:bg-gray-50 font-medium" onClick={saveDatasetChanges}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                    </div>
                  </CardHeader>
                </Card>

                                  {/* Data Editor Content */}
                  <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">Data Editor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Search and Filters */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Search data..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <Select value={filterColumn} onValueChange={setFilterColumn}>
                          <SelectTrigger className="w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Filter by column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Columns</SelectItem>
                            <SelectItem value="question">Question</SelectItem>
                            <SelectItem value="answer">Answer</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Table */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  <input 
                                    type="checkbox" 
                                    checked={selectAll}
                                    onChange={(e) => {
                                      setSelectAll(e.target.checked);
                                      setSelectedRows(e.target.checked ? datasetData.map((_, i) => i) : []);
                                    }}
                                    className="rounded border-gray-300"
                                  />
                                </th>
                                {columns.map((column) => (
                                  <th 
                                    key={column.key}
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort(column.key)}
                                  >
                                    <div className="flex items-center gap-1">
                                      {column.label}
                                      {sortColumn === column.key && (
                                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                      )}
                                    </div>
                                  </th>
                                ))}
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {paginatedData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <input 
                                      type="checkbox" 
                                      checked={selectedRows.includes(rowIndex)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedRows([...selectedRows, rowIndex]);
                                        } else {
                                          setSelectedRows(selectedRows.filter(i => i !== rowIndex));
                                        }
                                      }}
                                      className="rounded border-gray-300"
                                    />
                                  </td>
                                  {columns.map((column) => (
                                    <td key={column.key} className="px-4 py-3">
                                      {editingCell?.row === rowIndex && editingCell.col === column.key ? (
                                        <Input
                                          value={editingCell.value}
                                          onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                                          onBlur={() => handleSaveEdit(rowIndex, column.key)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              handleSaveEdit(rowIndex, column.key);
                                            } else if (e.key === 'Escape') {
                                              setEditingCell(null);
                                            }
                                          }}
                                          autoFocus
                                          className="w-full"
                                        />
                                      ) : (
                                        <div 
                                          className="cursor-pointer hover:bg-blue-50 p-1 rounded"
                                          onClick={() => handleStartEdit(rowIndex, column.key, row[column.key])}
                                        >
                                          {row[column.key] || '-'}
                                        </div>
                                      )}
                                    </td>
                                  ))}
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleStartEdit(rowIndex, 'question', row.question)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteRow(rowIndex)}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, filteredData.length)} of {filteredData.length} entries
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="border-gray-300"
                          >
                            Previous
                          </Button>
                          <span className="text-sm text-gray-700">Page {currentPage}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage * 10 >= filteredData.length}
                            className="border-gray-300"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* No Dataset Selected */}
            {datasetView === 'editor' && !selectedDatasetId && (
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="text-center py-12">
                  <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-700 mb-2">No Dataset Selected</p>
                  <p className="text-sm text-gray-500 mb-6">Select a dataset from the management view to start editing</p>
                  <Button
                    variant="outline"
                    onClick={() => setDatasetView('management')}
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Go to Dataset Management
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance" className="space-y-6 mt-6">
                                        {/* Governance Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Governance & Compliance
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Manage data privacy, security policies, and compliance requirements for {preset?.name}
                  </p>
                </div>
                <Button 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsGovernanceModalOpen(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Policies
                </Button>
              </div>

                          {/* Real Governance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Training Success Rate</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {trainingRuns.length > 0 
                            ? `${Math.round((trainingRuns.filter(run => run.status === 'completed').length / trainingRuns.length) * 100)}%`
                            : '0%'
                          }
                        </p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Total Runs</span>
                        <span className="text-gray-900 font-medium">{trainingRuns.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                              <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Dataset Security</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {availableDatasets.length > 0 ? '100%' : '0%'}
                        </p>
                      </div>
                      <Lock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Protected Datasets</span>
                        <span className="text-gray-900 font-medium">{availableDatasets.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                              <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Data Quality Score</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {datasetData.length > 0 ? '95%' : '0%'}
                        </p>
                      </div>
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Total Records</span>
                        <span className="text-gray-900 font-medium">{datasetData.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                              <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Model Performance</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {realMetrics.successRate > 0 ? `${realMetrics.successRate}%` : '0%'}
                        </p>
                      </div>
                      <BarChart3 className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Accuracy</span>
                        <span className="text-gray-900 font-medium">{realMetrics.successRate > 0 ? `${realMetrics.successRate}%` : 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            </div>

                          {/* Real Data Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Preset Configuration & Security */}
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="bg-gray-900 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <Settings className="w-4 h-4" />
                      Preset Configuration & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Model Type</p>
                            <p className="text-xs text-gray-600">{preset?.type?.toUpperCase() || 'LLM'} - GPT-4</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">Active</Badge>
                      </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <div>
                                                     <p className="text-sm font-medium text-gray-900">Safety Filters</p>
                                                       <p className="text-xs text-gray-600">Disabled</p>
                        </div>
                      </div>
                                               <Badge variant="outline" className="text-gray-500 border-gray-500">
                           Inactive
                         </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-purple-600" />
                        <div>
                                                     <p className="text-sm font-medium text-gray-900">Visibility</p>
                                                       <p className="text-xs text-gray-600">{preset?.visibility?.charAt(0).toUpperCase() + preset?.visibility?.slice(1) || 'Public'}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-purple-600 border-purple-600">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <div>
                                                     <p className="text-sm font-medium text-gray-900">Last Updated</p>
                                                       <p className="text-xs text-gray-600">Never</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-600">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dataset Management & Compliance */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gray-900 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Database className="w-4 h-4" />
                    Dataset Management & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Total Datasets</p>
                          <p className="text-xs text-gray-600">{availableDatasets.length} datasets available</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600 text-xs">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Fingerprint className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Data Encryption</p>
                          <p className="text-xs text-gray-600">AES-256 encryption enabled</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <LineChart className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Active Dataset</p>
                          <p className="text-xs text-gray-600">{selectedDatasetId ? availableDatasets.find(d => d.id === selectedDatasetId)?.name || 'None' : 'None selected'}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-purple-600 border-purple-600 text-xs">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Data Validation</p>
                          <p className="text-xs text-gray-600">{datasetData.length} records validated</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Training Performance & Analytics */}
            <Card className="border border-gray-200 shadow-sm col-span-1 lg:col-span-2">
              <CardHeader className="bg-gray-900 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <BarChart3 className="w-4 h-4" />
                  Training Performance & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">Recent Training Runs</h4>
                    <div className="text-xs text-gray-600">
                      {trainingRuns.length > 0 ? (
                        <div className="space-y-2">
                          {trainingRuns.slice(0, 3).map((run, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-xs text-gray-600">Run {run.id}</span>
                              <Badge variant="outline" className={`text-xs ${
                                run.status === 'completed' ? 'text-green-600 border-green-600' :
                                run.status === 'training' ? 'text-blue-600 border-blue-600' :
                                'text-red-600 border-red-600'
                              }`}>
                                {run.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">No training runs yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">Performance Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-xs text-gray-600">Success Rate</span>
                        <span className="text-sm font-medium text-gray-900">
                          {realMetrics.successRate > 0 ? `${realMetrics.successRate}%` : '0%'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-xs text-gray-600">Accuracy</span>
                        <span className="text-sm font-medium text-gray-900">
                          {realMetrics.accuracy > 0 ? `${realMetrics.accuracy}%` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-xs text-gray-600">Response Time</span>
                        <span className="text-sm font-medium text-gray-900">
                          {realMetrics.responseTime > 0 ? `${realMetrics.responseTime}ms` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">Compliance Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-gray-600">Data Privacy</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">Compliant</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-gray-600">Security</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-purple-600" />
                          <span className="text-xs text-gray-600">Access Control</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">Enabled</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
              <div>
                <h4 className="font-semibold text-gray-900">Governance Actions</h4>
                <p className="text-sm text-gray-600">Manage compliance policies and security settings for {preset?.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" className="hover:bg-green-50 hover:border-green-300">
                  <Download className="w-4 h-4 mr-2" />
                  Download Logs
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsGovernanceModalOpen(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Policies
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Upload Dataset Modal */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Dataset</DialogTitle>
              <DialogDescription>
                Upload a new dataset file (CSV, JSON, or Excel format)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop your file here, or click to browse</p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsUploadModalOpen(false)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => uploadedFile && handleFileUpload(uploadedFile)}
                  disabled={!uploadedFile || isUploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Dataset Modal */}
        <Dialog open={isCreateDatasetModalOpen} onOpenChange={setIsCreateDatasetModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Dataset</DialogTitle>
              <DialogDescription>
                Create a new dataset from scratch with custom fields and data
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dataset-name">Dataset Name</Label>
                <Input id="dataset-name" placeholder="Enter dataset name" />
              </div>
              <div>
                <Label htmlFor="dataset-description">Description</Label>
                <Textarea id="dataset-description" placeholder="Describe your dataset" />
              </div>
              <div>
                <Label>Dataset Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dataset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conversation">Conversation Data</SelectItem>
                    <SelectItem value="qa">Q&A Pairs</SelectItem>
                    <SelectItem value="structured">Structured Data</SelectItem>
                    <SelectItem value="custom">Custom Format</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsCreateDatasetModalOpen(false)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleCreateNewDataset({})}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Create Dataset
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modify Dataset Modal */}
        <Dialog open={isModifyDatasetModalOpen} onOpenChange={setIsModifyDatasetModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modify Dataset: {preset?.dataset.name}</DialogTitle>
              <DialogDescription>
                Edit, add, or remove data from your current dataset
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Dataset Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Total Rows</div>
                  <div className="text-lg font-bold text-blue-900">{preset?.dataset.row_count.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Columns</div>
                  <div className="text-lg font-bold text-green-900">5</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Last Modified</div>
                  <div className="text-lg font-bold text-purple-900">Today</div>
                </div>
              </div>

              {/* Data Editor */}
              <div className="border rounded-lg">
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Data Editor</h4>
                    <p className="text-sm text-gray-600">Edit your dataset data directly</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => setShowAddRow(true)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Row
                    </Button>
                    <Button 
                      onClick={() => setShowColumnManager(true)}
                      size="sm"
                      variant="outline"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Columns
                    </Button>
                  </div>
                </div>
                
                {/* Search and Filters */}
                <div className="p-4 border-b bg-white">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input 
                        placeholder="Search in dataset..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                      />
                    </div>
                    <Select value={filterColumn} onValueChange={setFilterColumn}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by column" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Columns</SelectItem>
                        <SelectItem value="question">Question</SelectItem>
                        <SelectItem value="answer">Answer</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="difficulty">Difficulty</SelectItem>
                        <SelectItem value="tags">Tags</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={() => { setSearchTerm(''); setFilterColumn('all'); }}
                      variant="ghost"
                      size="sm"
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input 
                            type="checkbox" 
                            checked={selectAll}
                            onChange={(e) => {
                              setSelectAll(e.target.checked);
                              setSelectedRows(e.target.checked ? datasetData.map((_, i) => i) : []);
                            }}
                            className="rounded border-gray-300"
                          />
                        </th>
                        {columns.map((column) => (
                          <th 
                            key={column.key}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort(column.key)}
                          >
                            <div className="flex items-center gap-1">
                              {column.label}
                              {sortColumn === column.key && (
                                <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                              )}
                            </div>
                          </th>
                        ))}
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <input 
                              type="checkbox" 
                              checked={selectedRows.includes(rowIndex)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRows([...selectedRows, rowIndex]);
                                } else {
                                  setSelectedRows(selectedRows.filter(i => i !== rowIndex));
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                          </td>
                          {columns.map((column) => (
                            <td key={column.key} className="px-4 py-3">
                              {editingCell?.row === rowIndex && editingCell.col === column.key ? (
                                <Input
                                  value={editingCell.value}
                                  onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                                  onBlur={() => handleSaveEdit(rowIndex, column.key)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleSaveEdit(rowIndex, column.key);
                                    } else if (e.key === 'Escape') {
                                      setEditingCell({ row: -1, col: '', value: '' });
                                    }
                                  }}
                                  autoFocus
                                  className="w-full"
                                />
                              ) : (
                                <div 
                                  className="cursor-pointer hover:bg-blue-50 p-1 rounded"
                                  onClick={() => handleStartEdit(rowIndex, column.key, row[column.key])}
                                >
                                  {row[column.key] || '-'}
                                </div>
                              )}
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStartEdit(rowIndex, 'question', row.question)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteRow(rowIndex)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, filteredData.length)} of {filteredData.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage + 1} of {Math.ceil(filteredData.length / 10)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(Math.ceil(filteredData.length / 10) - 1, currentPage + 1))}
                      disabled={currentPage >= Math.ceil(filteredData.length / 10) - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedRows.length > 0 && (
                    <>
                      <span className="text-sm text-gray-600">
                        {selectedRows.length} row(s) selected
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSelected()}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Selected
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsModifyDatasetModalOpen(false)} 
                    variant="outline" 
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleModifyExistingDataset({})}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Governance Configuration Modal */}
        <Dialog open={isGovernanceModalOpen} onOpenChange={setIsGovernanceModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Configure Governance Policies for {preset?.name}
              </DialogTitle>
              <DialogDescription>
                Manage security settings, compliance policies, and data protection rules
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Security Settings */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Enable Safety Filters</Label>
                        <p className="text-xs text-gray-600">Filter inappropriate or harmful content</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Data Encryption</Label>
                        <p className="text-xs text-gray-600">AES-256 encryption for all data</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Access Logging</Label>
                        <p className="text-xs text-gray-600">Log all access and modifications</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Auto Backup</Label>
                        <p className="text-xs text-gray-600">Automatic daily backups</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Policies */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Compliance Policies
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">GDPR Compliance</Label>
                        <p className="text-xs text-gray-600">EU data protection standards</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Data Retention</Label>
                        <p className="text-xs text-gray-600">Auto-delete after 2 years</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">PII Anonymization</Label>
                        <p className="text-xs text-gray-600">Automatically anonymize personal data</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Audit Trail</Label>
                        <p className="text-xs text-gray-600">Complete activity logging</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Access Control */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Access Control
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Preset Visibility</Label>
                      <Select defaultValue={preset?.visibility || 'public'}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Require Authentication</Label>
                        <p className="text-xs text-gray-600">Force login for access</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Session Timeout</Label>
                        <p className="text-xs text-gray-600">Auto-logout after 30 minutes</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsGovernanceModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    toast({
                      title: "Policies Updated",
                      description: "Governance policies have been successfully updated.",
                    });
                    setIsGovernanceModalOpen(false);
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Policies
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingPresetTab; 