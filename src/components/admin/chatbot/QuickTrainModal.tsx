import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { chatbotService, Chatbot } from '@/services/chatbotService';
import { 
  Zap, 
  Brain, 
  Bot, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw,
  Settings,
  MessageSquare,
  FileText,
  Database,
  Sparkles,
  TrendingUp,
  Loader2
} from 'lucide-react';

interface QuickTrainModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TrainingPreset {
  id: string;
  name: string;
  description: string;
  type: 'rule-based' | 'llm';
  config: any;
  estimatedTime?: string;
  accuracy?: string;
  created_at?: string;
  updated_at?: string;
  usage_count?: number;
}

export const QuickTrainModal = ({ open, onOpenChange }: QuickTrainModalProps) => {
  const { toast } = useToast();
  const [selectedBot, setSelectedBot] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [presets, setPresets] = useState<TrainingPreset[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [loading, setLoading] = useState(false);

  // Load chatbots and presets on open
  useEffect(() => {
    if (open) {
      loadChatbots();
      loadPresets();
    }
  }, [open]);

  const loadChatbots = async () => {
    try {
      setLoading(true);
      const data = await chatbotService.getChatbots();
      setChatbots(data);
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

  const loadPresets = async () => {
    try {
      setLoading(true);
      // Fetch chatbots and map to presets (simulate real presets)
      const bots = await chatbotService.getChatbots();
      const mappedPresets: TrainingPreset[] = (bots || []).map((bot: any) => ({
        id: bot.id,
        name: bot.name || 'Untitled',
        description: bot.system_prompt || 'No description',
        type: bot.type === 'llm' ? 'llm' : 'rule-based',
        config: {
          model: bot.model || 'gpt-4',
          temperature: bot.config?.temperature || 0.7,
          max_tokens: bot.config?.max_tokens || 1000,
          epochs: bot.config?.epochs || 3,
          learning_rate: bot.config?.learning_rate || 0.001,
          batch_size: bot.config?.batch_size || 32,
          validation_split: bot.config?.validation_split || 0.2,
          safety_filters: bot.config?.safety_filters ?? true,
          custom_instructions: bot.system_prompt || ''
        },
        estimatedTime: '10-20 minutes',
        accuracy: bot.resolution_rate ? `${bot.resolution_rate}%` : 'N/A',
        created_at: bot.created_at,
        updated_at: bot.updated_at,
        usage_count: bot.total_chats || 0
      }));
      setPresets(mappedPresets);
    } catch (error) {
      console.error('Error loading presets:', error);
      toast({
        title: "Error",
        description: "Failed to load training presets.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Simulate training progress
  useEffect(() => {
    if (isTraining && trainingProgress < 100) {
      const interval = setInterval(() => {
        setTrainingProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          if (newProgress >= 100) {
            setIsTraining(false);
            setTrainingProgress(100);
            toast({
              title: "Training Complete!",
              description: "Your chatbot has been successfully trained and is ready to use.",
            });
            return 100;
          }
          return newProgress;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTraining, trainingProgress, toast]);

  const handleStartTraining = async () => {
    if (!selectedBot || !selectedPreset) {
      toast({
        title: "Selection Required",
        description: "Please select both a chatbot and a training preset.",
        variant: "destructive"
      });
      return;
    }
    const preset = presets.find(p => p.id === selectedPreset);
    if (!preset) return;
    setIsTraining(true);
    setTrainingProgress(0);
    setCurrentStep('Initializing training...');
    try {
      // Start training process (simulate backend call)
      const success = await chatbotService.startTraining(selectedBot);
      if (!success) {
        throw new Error('Failed to start training');
      }
      // Simulate training steps
      const steps = [
        'Loading training data...',
        'Preprocessing conversations...',
        'Training model...',
        'Validating performance...',
        'Optimizing parameters...',
        'Finalizing model...'
      ];
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
      setCurrentStep('Training complete!');
    } catch (error) {
      setIsTraining(false);
      setCurrentStep('');
      toast({
        title: "Training Failed",
        description: "An error occurred during training. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStopTraining = () => {
    setIsTraining(false);
    setTrainingProgress(0);
    setCurrentStep('');
    toast({
      title: "Training Stopped",
      description: "Training has been stopped. You can restart anytime.",
    });
  };

  const selectedPresetData = presets.find(p => p.id === selectedPreset);

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      MessageSquare,
      Target,
      Settings,
      Bot,
      Brain,
      Zap
    };
    return icons[iconName] || Bot;
  };

  // Only show LLM bots and LLM presets
  const llmBots = chatbots.filter(bot => bot.type === 'llm');
  const llmPresets = presets.filter(preset => preset.type === 'llm');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl mx-auto bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl shadow-blue-500/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900">
            <Zap className="w-5 h-5 text-blue-600" />
            Quick Train
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600">
            Rapidly train your LLM-powered chatbot with optimized presets for different use cases
          </DialogDescription>
        </DialogHeader>
        {/* Select Chatbot */}
        <div className="mb-6">
          <Label className="block text-base font-semibold mb-2">Select Chatbot</Label>
          {llmBots.length === 0 ? (
            <div className="text-slate-500 text-sm">No LLM-powered bots available. Please create an LLM bot first.</div>
          ) : (
            <Select value={selectedBot} onValueChange={setSelectedBot} disabled={loading || isTraining}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an LLM chatbot to train" />
              </SelectTrigger>
              <SelectContent>
                {llmBots.map(bot => (
                  <SelectItem key={bot.id} value={bot.id}>{bot.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {/* Training Presets */}
        <div className="mb-6">
          <Label className="block text-base font-semibold mb-2">Training Presets</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {llmPresets.length === 0 ? (
              <div className="text-slate-500 text-sm col-span-2">No LLM training presets available.</div>
            ) : (
              llmPresets.map(preset => (
                <Card
                  key={preset.id}
                  className={`cursor-pointer border-2 transition-all duration-200 ${selectedPreset === preset.id ? 'border-blue-500 shadow-lg' : 'border-slate-200 hover:border-blue-300'}`}
                  onClick={() => setSelectedPreset(preset.id)}
                  aria-selected={selectedPreset === preset.id}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-lg text-slate-900">{preset.name}</span>
                    </div>
                    <div className="text-slate-600 text-sm mb-2">{preset.description}</div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Model: {preset.config.model}</span>
                      <span>Accuracy: {preset.accuracy || 'N/A'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
        {/* Training Progress */}
        {isTraining && (
          <div className="mb-6">
            <Label className="block text-base font-semibold mb-2">Training Progress</Label>
            <Progress value={trainingProgress} className="h-3" />
            <div className="mt-2 text-sm text-slate-700">{currentStep}</div>
          </div>
        )}
        {/* Start Training Button */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleStartTraining}
            disabled={isTraining || !selectedBot || !selectedPreset || llmBots.length === 0 || llmPresets.length === 0}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300"
          >
            {isTraining ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            {isTraining ? 'Training...' : 'Start Training'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 