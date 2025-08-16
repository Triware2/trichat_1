import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, Edit, Trash2, Copy, Play, Settings, Brain, Target, 
  Clock, Star, Users, CheckCircle, AlertCircle, ArrowRight
} from 'lucide-react';

interface TrainingPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  modelType: string;
  trainingParams: {
    epochs: number;
    learningRate: number;
    batchSize: number;
    temperature: number;
  };
  usageCount: number;
  lastUsed: string;
  createdAt: string;
  isActive: boolean;
}

export const TrainingPresetsManager = () => {
  const [presets, setPresets] = useState<TrainingPreset[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<TrainingPreset | null>(null);
  const [newPreset, setNewPreset] = useState<Partial<TrainingPreset>>({
    name: '',
    description: '',
    category: 'general',
    modelType: 'gpt-4',
    trainingParams: {
      epochs: 10,
      learningRate: 0.001,
      batchSize: 32,
      temperature: 0.7
    }
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockPresets: TrainingPreset[] = [
      {
        id: '1',
        name: 'Customer Support Pro',
        description: 'Optimized for customer service with empathy and problem-solving',
        category: 'customer-service',
        modelType: 'gpt-4',
        trainingParams: {
          epochs: 15,
          learningRate: 0.0005,
          batchSize: 64,
          temperature: 0.8
        },
        usageCount: 23,
        lastUsed: '2024-01-15',
        createdAt: '2024-01-01',
        isActive: true
      },
      {
        id: '2',
        name: 'Technical Support',
        description: 'Specialized for technical troubleshooting and documentation',
        category: 'technical',
        modelType: 'gpt-4',
        trainingParams: {
          epochs: 12,
          learningRate: 0.001,
          batchSize: 32,
          temperature: 0.6
        },
        usageCount: 15,
        lastUsed: '2024-01-10',
        createdAt: '2024-01-05',
        isActive: true
      },
      {
        id: '3',
        name: 'Sales Assistant',
        description: 'Focused on lead qualification and product recommendations',
        category: 'sales',
        modelType: 'gpt-3.5-turbo',
        trainingParams: {
          epochs: 8,
          learningRate: 0.002,
          batchSize: 48,
          temperature: 0.9
        },
        usageCount: 8,
        lastUsed: '2024-01-08',
        createdAt: '2024-01-12',
        isActive: false
      }
    ];
    setPresets(mockPresets);
  }, []);

  const handleCreatePreset = () => {
    const preset: TrainingPreset = {
      id: Date.now().toString(),
      name: newPreset.name || '',
      description: newPreset.description || '',
      category: newPreset.category || 'general',
      modelType: newPreset.modelType || 'gpt-4',
      trainingParams: newPreset.trainingParams || {
        epochs: 10,
        learningRate: 0.001,
        batchSize: 32,
        temperature: 0.7
      },
      usageCount: 0,
      lastUsed: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true
    };

    setPresets([...presets, preset]);
    setNewPreset({
      name: '',
      description: '',
      category: 'general',
      modelType: 'gpt-4',
      trainingParams: {
        epochs: 10,
        learningRate: 0.001,
        batchSize: 32,
        temperature: 0.7
      }
    });
    setIsCreateModalOpen(false);
  };

  const handleEditPreset = () => {
    if (!editingPreset) return;
    
    setPresets(presets.map(preset => 
      preset.id === editingPreset.id ? editingPreset : preset
    ));
    setEditingPreset(null);
    setIsEditModalOpen(false);
  };

  const handleDeletePreset = (id: string) => {
    setPresets(presets.filter(preset => preset.id !== id));
  };

  const handleDuplicatePreset = (preset: TrainingPreset) => {
    const duplicated: TrainingPreset = {
      ...preset,
      id: Date.now().toString(),
      name: `${preset.name} (Copy)`,
      usageCount: 0,
      lastUsed: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPresets([...presets, duplicated]);
  };

  const handleUsePreset = (preset: TrainingPreset) => {
    // Update usage count and last used date
    setPresets(presets.map(p => 
      p.id === preset.id 
        ? { ...p, usageCount: p.usageCount + 1, lastUsed: new Date().toISOString().split('T')[0] }
        : p
    ));
    
    // Implement actual preset usage logic
    console.log('Using preset:', preset);
    
    // Apply preset configuration to current chatbot
    if (onPresetApplied) {
      onPresetApplied(preset);
    }
    
    // Show success message
    toast({
      title: "Preset Applied",
      description: `${preset.name} has been applied to the current chatbot.`,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'customer-service': 'bg-blue-100 text-blue-700 border-blue-200',
      'technical': 'bg-purple-100 text-purple-700 border-purple-200',
      'sales': 'bg-green-100 text-green-700 border-green-200',
      'general': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Training Presets</h2>
          <p className="text-slate-600">Create and manage reusable training configurations</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25">
              <Plus className="w-4 h-4 mr-2" />
              Create Preset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Training Preset</DialogTitle>
              <DialogDescription>
                Define a new training configuration that can be reused across different bots.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Preset Name</Label>
                  <Input
                    id="name"
                    value={newPreset.name}
                    onChange={(e) => setNewPreset({...newPreset, name: e.target.value})}
                    placeholder="e.g., Customer Support Pro"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newPreset.category} onValueChange={(value) => setNewPreset({...newPreset, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer-service">Customer Service</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newPreset.description}
                  onChange={(e) => setNewPreset({...newPreset, description: e.target.value})}
                  placeholder="Describe what this preset is optimized for..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="modelType">Model Type</Label>
                  <Select value={newPreset.modelType} onValueChange={(value) => setNewPreset({...newPreset, modelType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3">Claude-3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="epochs">Training Epochs</Label>
                  <Input
                    id="epochs"
                    type="number"
                    value={newPreset.trainingParams?.epochs}
                    onChange={(e) => setNewPreset({
                      ...newPreset, 
                      trainingParams: {...newPreset.trainingParams!, epochs: parseInt(e.target.value)}
                    })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePreset}>
                Create Preset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presets.map((preset) => (
          <Card key={preset.id} className="relative overflow-hidden border border-white/30 bg-white/60 backdrop-blur-sm shadow-xl shadow-blue-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-slate-900">{preset.name}</CardTitle>
                  <Badge className={`mt-2 ${getCategoryColor(preset.category)}`}>
                    {preset.category.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {preset.isActive ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 line-clamp-2">{preset.description}</p>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <Brain className="w-3 h-3 text-blue-600" />
                  <span className="text-slate-600">{preset.modelType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-purple-600" />
                  <span className="text-slate-600">{preset.trainingParams.epochs} epochs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-green-600" />
                  <span className="text-slate-600">{preset.usageCount} uses</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-orange-600" />
                  <span className="text-slate-600">{preset.lastUsed}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-slate-500">Created {preset.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => handleUsePreset(preset)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Use
                </Button>
                
                <Dialog open={isEditModalOpen && editingPreset?.id === preset.id} onOpenChange={setIsEditModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingPreset(preset)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Training Preset</DialogTitle>
                      <DialogDescription>
                        Modify the training configuration for this preset.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="edit-name">Preset Name</Label>
                        <Input
                          id="edit-name"
                          value={editingPreset?.name || ''}
                          onChange={(e) => setEditingPreset(editingPreset ? {...editingPreset, name: e.target.value} : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          value={editingPreset?.description || ''}
                          onChange={(e) => setEditingPreset(editingPreset ? {...editingPreset, description: e.target.value} : null)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleEditPreset}>
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDuplicatePreset(preset)}
                >
                  <Copy className="w-3 h-3" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Preset</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{preset.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeletePreset(preset.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {presets.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25 mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Training Presets</h3>
          <p className="text-slate-600 mb-6">Create your first training preset to get started</p>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Preset
          </Button>
        </div>
      )}
    </div>
  );
}; 