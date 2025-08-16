import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Loader2, CheckCircle, AlertCircle, Settings, Brain } from 'lucide-react';
import { chatbotService, Chatbot } from '@/services/chatbotService';

interface CreateBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBotCreated: (bot: Chatbot) => void;
  botToEdit?: Chatbot | null;
}

export default function CreateBotModal({ isOpen, onClose, onBotCreated, botToEdit }: CreateBotModalProps) {
  const isEditMode = !!botToEdit;
  const [formData, setFormData] = useState({
    name: botToEdit?.name || '',
    description: botToEdit?.system_prompt || '',
    bot_type: botToEdit?.type === 'llm' ? 'llm' : 'rule-based',
    model_type: botToEdit?.type === 'llm'
      ? botToEdit?.model || 'gpt-4'
      : (botToEdit?.model ? botToEdit.model.replace('rule-based-', '') : 'rule-engine')
  });
  useEffect(() => {
    if (botToEdit) {
      setFormData({
        name: botToEdit.name || '',
        description: botToEdit.system_prompt || '',
        bot_type: botToEdit.type === 'llm' ? 'llm' : 'rule-based',
        model_type: botToEdit.type === 'llm'
          ? botToEdit.model || 'gpt-4'
          : (botToEdit.model ? botToEdit.model.replace('rule-based-', '') : 'rule-engine')
      });
    } else {
      setFormData({ name: '', description: '', bot_type: 'llm', model_type: 'gpt-4' });
    }
  }, [botToEdit, isOpen]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const botTypes = [
    { value: 'llm', label: 'LLM-Powered (AI)', icon: Brain, description: 'Advanced AI models like GPT-4, Claude, etc.' },
    { value: 'rule-based', label: 'Rule-Based (Traditional)', icon: Settings, description: 'Traditional rule-based chatbot with predefined responses' }
  ];

  const llmModels = [
    { value: 'gpt-4', label: 'GPT-4 (Advanced)' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Fast)' },
    { value: 'claude-3', label: 'Claude 3 (Balanced)' },
    { value: 'custom', label: 'Custom Model' }
  ];

  const ruleBasedModels = [
    { value: 'rule-engine', label: 'Rule Engine (Standard)' },
    { value: 'decision-tree', label: 'Decision Tree' },
    { value: 'pattern-matching', label: 'Pattern Matching' },
    { value: 'custom-rules', label: 'Custom Rules' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Database connection not configured. Please check your environment variables.');
      }
      if (isEditMode && botToEdit) {
        // Update existing bot
        const updates = {
          name: formData.name,
          type: formData.bot_type === 'llm' ? 'llm' : 'standard',
          model: formData.bot_type === 'llm' ? formData.model_type : `rule-based-${formData.model_type}`,
          system_prompt: formData.description || undefined
        };
        const updatedBot = await chatbotService.updateChatbot(botToEdit.id, updates);
        if (updatedBot) {
          onBotCreated(updatedBot);
          handleClose();
        } else {
          setError('Failed to update chatbot. Please check your database connection and try again.');
        }
      } else {
        // Create new bot
        const newBot = await chatbotService.createChatbot({
          name: formData.name,
          type: formData.bot_type === 'llm' ? 'llm' : 'standard',
          status: 'inactive',
          model: formData.bot_type === 'llm' ? formData.model_type : `rule-based-${formData.model_type}`,
          system_prompt: formData.description || undefined,
          is_active: true
        });
        if (newBot) {
          onBotCreated(newBot);
          handleClose();
        } else {
          setError('Failed to create chatbot. Please check your database connection and try again.');
        }
      }
    } catch (err: any) {
      console.error('Error creating/updating chatbot:', err);
      if (err.message && err.message.includes('Database connection')) {
        setError(err.message);
      } else {
        setError('An error occurred while saving the chatbot. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', bot_type: 'llm', model_type: 'gpt-4' });
    setError('');
    setIsLoading(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBotTypeChange = (botType: 'llm' | 'rule-based') => {
    setFormData(prev => ({ 
      ...prev, 
      bot_type: botType,
      model_type: botType === 'llm' ? 'gpt-4' : 'rule-engine'
    }));
  };

  const currentModels = formData.bot_type === 'llm' ? llmModels : ruleBasedModels;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl shadow-blue-500/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Bot className="w-4 h-4 text-white" />
            </div>
            {isEditMode ? 'Edit Chatbot' : 'Create New Chatbot'}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600">
            {isEditMode ? 'Update your chatbot settings.' : 'Configure your new AI chatbot with custom settings.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bot Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
              Bot Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter bot name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="bg-white/80 backdrop-blur-sm border border-white/30 focus:border-blue-500 focus:ring-blue-500/20 text-sm"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-slate-700">
              System Prompt
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the bot's purpose..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="bg-white/80 backdrop-blur-sm border border-white/30 focus:border-blue-500 focus:ring-blue-500/20 text-sm min-h-[80px]"
              rows={3}
            />
          </div>

          {/* Bot Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Bot Type *
            </Label>
            <div className="space-y-2">
              {botTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.value}
                    className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      formData.bot_type === type.value
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-white/80'
                    }`}
                    onClick={() => handleBotTypeChange(type.value as 'llm' | 'rule-based')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        formData.bot_type === type.value
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 text-sm">{type.label}</h3>
                        <p className="text-xs text-slate-600 truncate">{type.description}</p>
                      </div>
                      {formData.bot_type === type.value && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model_type" className="text-sm font-medium text-slate-700">
              {formData.bot_type === 'llm' ? 'AI Model' : 'Rule Engine Type'} *
            </Label>
            <Select value={formData.model_type} onValueChange={(value) => handleInputChange('model_type', value)}>
              <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-white/30 focus:border-blue-500 focus:ring-blue-500/20 text-sm">
                <SelectValue placeholder={`Select ${formData.bot_type === 'llm' ? 'AI model' : 'rule engine type'}...`} />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border border-white/30 shadow-xl">
                {currentModels.map((model) => (
                  <SelectItem key={model.value} value={model.value} className="hover:bg-blue-50/50 text-sm">
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50/80 border border-red-200/50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="text-xs text-red-700">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="bg-white/80 backdrop-blur-sm border border-white/30 hover:bg-white/90 text-slate-700 text-sm px-4 py-2"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 text-sm px-4 py-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditMode ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Save Changes' : 'Create Bot'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 