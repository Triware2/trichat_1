import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Settings, Target, Zap, Shield, TestTube, Lightbulb, 
  TrendingUp, Clock, DollarSign, CheckCircle, AlertCircle, 
  Plus, Minus, RotateCcw, Save, Play, Eye
} from 'lucide-react';

interface AdvancedPresetCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (preset: any) => void;
}

export const AdvancedPresetCreator = ({ isOpen, onClose, onCreated }: AdvancedPresetCreatorProps) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  
  const [preset, setPreset] = useState({
    name: '',
    description: '',
    category: 'general',
    modelType: 'gpt-4-turbo',
    version: '1.0.0',
    isPublic: false,
    tags: [] as string[],
    advancedParams: {
      epochs: 25,
      learningRate: 0.001,
      batchSize: 32,
      temperature: 0.7,
      maxTokens: 1500,
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.05,
      validationSplit: 0.2,
      earlyStopping: true,
      dataAugmentation: true,
      crossValidation: true,
      optimizer: 'adamw',
      lossFunction: 'categorical_crossentropy',
      regularization: 0.01,
      dropoutRate: 0.1,
      gradientClipping: 1.0,
      warmupSteps: 1000,
      scheduler: 'cosine',
      mixedPrecision: true
    },
    performance: {
      accuracy: 0,
      responseTime: 0,
      userSatisfaction: 0,
      trainingTime: 0,
      costPerRequest: 0
    }
  });

  const [recommendations, setRecommendations] = useState([
    "Increase epochs to 30 for better accuracy",
    "Use cosine scheduler for smoother training",
    "Enable mixed precision for faster training",
    "Add data augmentation for better generalization"
  ]);

  const handleCreate = () => {
    const newPreset = {
      id: Date.now().toString(),
      ...preset,
      author: 'Current User',
      rating: 0,
      usageCount: 0,
      lastUsed: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
      validationResults: {
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        confusionMatrix: [[0, 0], [0, 0]],
        testCases: []
      },
      recommendations: recommendations,
      collaborators: [],
      changeHistory: []
    };
    onCreated(newPreset);
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    // Simulate AI optimization
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          setIsOptimizing(false);
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const addTag = (tag: string) => {
    if (tag && !preset.tags.includes(tag)) {
      setPreset(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Brain className="w-6 h-6 text-blue-600" />
            Create Advanced Training Preset
          </DialogTitle>
          <DialogDescription>
            Design a world-class training configuration with AI-powered optimization
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Optimization
            </TabsTrigger>
            <TabsTrigger value="validation" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Validation
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Preset Name *</Label>
                  <Input
                    id="name"
                    value={preset.name}
                    onChange={(e) => setPreset(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Customer Support Pro Elite"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={preset.description}
                    onChange={(e) => setPreset(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this preset is optimized for..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={preset.category} onValueChange={(value) => setPreset(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer-service">Customer Service</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="sales">Sales & Marketing</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="modelType">Model Type</Label>
                  <Select value={preset.modelType} onValueChange={(value) => setPreset(prev => ({ ...prev, modelType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Latest)</SelectItem>
                      <SelectItem value="gpt-4">GPT-4 (Stable)</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast)</SelectItem>
                      <SelectItem value="claude-3">Claude 3 (Balanced)</SelectItem>
                      <SelectItem value="custom">Custom Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={preset.version}
                    onChange={(e) => setPreset(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="1.0.0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={preset.isPublic}
                    onCheckedChange={(checked) => setPreset(prev => ({ ...prev, isPublic: checked }))}
                  />
                  <Label htmlFor="isPublic">Make Public</Label>
                </div>
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {preset.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-700">
                        {tag}
                        <button
                          onClick={() => setPreset(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Training Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Epochs: {preset.advancedParams.epochs}</Label>
                    <Slider
                      value={[preset.advancedParams.epochs]}
                      onValueChange={([value]) => setPreset(prev => ({
                        ...prev,
                        advancedParams: { ...prev.advancedParams, epochs: value }
                      }))}
                      max={100}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Learning Rate: {preset.advancedParams.learningRate}</Label>
                    <Slider
                      value={[preset.advancedParams.learningRate * 10000]}
                      onValueChange={([value]) => setPreset(prev => ({
                        ...prev,
                        advancedParams: { ...prev.advancedParams, learningRate: value / 10000 }
                      }))}
                      max={50}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Batch Size: {preset.advancedParams.batchSize}</Label>
                    <Slider
                      value={[preset.advancedParams.batchSize]}
                      onValueChange={([value]) => setPreset(prev => ({
                        ...prev,
                        advancedParams: { ...prev.advancedParams, batchSize: value }
                      }))}
                      max={128}
                      min={8}
                      step={8}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Temperature: {preset.advancedParams.temperature}</Label>
                    <Slider
                      value={[preset.advancedParams.temperature * 100]}
                      onValueChange={([value]) => setPreset(prev => ({
                        ...prev,
                        advancedParams: { ...prev.advancedParams, temperature: value / 100 }
                      }))}
                      max={100}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Advanced Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Early Stopping</Label>
                    <Switch
                      checked={preset.advancedParams.earlyStopping}
                      onCheckedChange={(checked) => setPreset(prev => ({
                        ...prev,
                        advancedParams: { ...prev.advancedParams, earlyStopping: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Data Augmentation</Label>
                    <Switch
                      checked={preset.advancedParams.dataAugmentation}
                      onCheckedChange={(checked) => setPreset(prev => ({
                        ...prev,
                        advancedParams: { ...prev.advancedParams, dataAugmentation: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Cross Validation</Label>
                    <Switch
                      checked={preset.advancedParams.crossValidation}
                      onCheckedChange={(checked) => setPreset(prev => ({
                        ...prev,
                        advancedParams: { ...prev.advancedParams, crossValidation: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Mixed Precision</Label>
                    <Switch
                      checked={preset.advancedParams.mixedPrecision}
                      onCheckedChange={(checked) => setPreset(prev => ({
                        ...prev,
                        advancedParams: { ...prev.advancedParams, mixedPrecision: checked }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Optimizer</Label>
                    <Select value={preset.advancedParams.optimizer} onValueChange={(value) => setPreset(prev => ({
                      ...prev,
                      advancedParams: { ...prev.advancedParams, optimizer: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adamw">AdamW (Recommended)</SelectItem>
                        <SelectItem value="adam">Adam</SelectItem>
                        <SelectItem value="sgd">SGD</SelectItem>
                        <SelectItem value="rmsprop">RMSprop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  AI-Powered Optimization
                </CardTitle>
                <CardDescription>
                  Let our AI optimize your training parameters for maximum performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isOptimizing ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>AI is optimizing your preset...</span>
                    </div>
                    <Progress value={optimizationProgress} className="w-full" />
                    <p className="text-sm text-slate-600">
                      Analyzing training patterns, adjusting parameters, and validating performance...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button onClick={handleOptimize} className="w-full">
                      <Zap className="w-4 h-4 mr-2" />
                      Start AI Optimization
                    </Button>
                    <div className="space-y-3">
                      <h4 className="font-semibold">AI Recommendations:</h4>
                      {recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                          <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  Validation & Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Your preset will be validated against industry benchmarks and tested for performance.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold text-green-700">Ready for Testing</div>
                    <div className="text-sm text-green-600">All parameters validated</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-blue-700">Performance Target</div>
                    <div className="text-sm text-blue-600">95%+ accuracy expected</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preset Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{preset.name || 'Untitled Preset'}</h3>
                    <p className="text-slate-600">{preset.description || 'No description provided'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Category:</span> {preset.category}
                    </div>
                    <div>
                      <span className="font-medium">Model:</span> {preset.modelType}
                    </div>
                    <div>
                      <span className="font-medium">Epochs:</span> {preset.advancedParams.epochs}
                    </div>
                    <div>
                      <span className="font-medium">Learning Rate:</span> {preset.advancedParams.learningRate}
                    </div>
                  </div>
                  {preset.tags.length > 0 && (
                    <div>
                      <span className="font-medium text-sm">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {preset.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!preset.name}>
            <Save className="w-4 h-4 mr-2" />
            Create Preset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 