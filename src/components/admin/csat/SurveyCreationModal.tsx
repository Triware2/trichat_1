
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Star,
  MessageSquare,
  Mail,
  Smartphone,
  Monitor,
  Clock,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { csatService, CSATSurvey } from '@/services/csatService';

interface SurveyCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSurveyCreated: (survey: CSATSurvey) => void;
  template?: 'CSAT' | 'NPS' | 'CES' | null;
}

const surveyTemplates = {
  CSAT: {
    name: 'Customer Satisfaction Survey',
    description: '5-star rating survey with optional feedback',
    type: 'CSAT' as const,
    questions: [
      { type: 'rating', question: 'How satisfied were you with our service?', required: true },
      { type: 'text', question: 'What could we have done better?', required: false }
    ],
    channels: ['email', 'in-app']
  },
  NPS: {
    name: 'Net Promoter Score Survey',
    description: '0-10 scale survey with follow-up questions',
    type: 'NPS' as const,
    questions: [
      { type: 'nps', question: 'How likely are you to recommend us to a friend or colleague?', required: true },
      { type: 'text', question: 'What is the primary reason for your score?', required: false }
    ],
    channels: ['email', 'sms']
  },
  CES: {
    name: 'Customer Effort Score Survey',
    description: 'Effort scale survey for support interactions',
    type: 'CES' as const,
    questions: [
      { type: 'effort', question: 'How easy was it to get the help you needed?', required: true },
      { type: 'text', question: 'What made this experience easy or difficult?', required: false }
    ],
    channels: ['email']
  }
};

export const SurveyCreationModal = ({ 
  open, 
  onOpenChange, 
  onSurveyCreated, 
  template 
}: SurveyCreationModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'CSAT' as 'CSAT' | 'NPS' | 'CES',
    channels: [] as string[],
    questions: [] as any[],
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const availableChannels = [
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'sms', name: 'SMS', icon: Smartphone },
    { id: 'in-app', name: 'In-App', icon: Monitor },
    { id: 'chat', name: 'Chat', icon: MessageSquare }
  ];

  const questionTypes = [
    { id: 'rating', name: 'Star Rating', icon: Star },
    { id: 'nps', name: 'NPS Scale', icon: MessageSquare },
    { id: 'effort', name: 'Effort Scale', icon: Clock },
    { id: 'text', name: 'Text Input', icon: MessageSquare },
    { id: 'multiple_choice', name: 'Multiple Choice', icon: MessageSquare }
  ];

  useEffect(() => {
    if (open && template) {
      const templateData = surveyTemplates[template];
      setFormData({
        name: templateData.name,
        description: templateData.description,
        type: templateData.type,
        channels: templateData.channels,
        questions: templateData.questions,
        is_active: true
      });
    }
  }, [open, template]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Survey name is required.",
        variant: "destructive",
      });
      return;
    }

    if (formData.channels.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one channel.",
        variant: "destructive",
      });
      return;
    }

    if (formData.questions.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one question.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const newSurvey = await csatService.createSurvey(formData);
      onSurveyCreated(newSurvey);
      handleClose();
      toast({
        title: "Success",
        description: "Survey created successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to create survey:', error);
      toast({
        title: "Error",
        description: "Failed to create survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      type: 'CSAT',
      channels: [],
      questions: [],
      is_active: true
    });
    setStep(1);
    onOpenChange(false);
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        type: 'rating',
        question: '',
        required: false,
        options: []
      }]
    }));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const toggleChannel = (channelId: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channelId)
        ? prev.channels.filter(c => c !== channelId)
        : [...prev.channels, channelId]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Survey</DialogTitle>
          <DialogDescription>
            Set up a new customer satisfaction survey with custom questions and channels
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm">Basic Info</span>
            </div>
            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm">Channels</span>
            </div>
            <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="ml-2 text-sm">Questions</span>
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Survey Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter survey name"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose of this survey"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="type">Survey Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'CSAT' | 'NPS' | 'CES') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSAT">Customer Satisfaction (CSAT)</SelectItem>
                    <SelectItem value="NPS">Net Promoter Score (NPS)</SelectItem>
                    <SelectItem value="CES">Customer Effort Score (CES)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, is_active: checked as boolean }))
                  }
                />
                <Label htmlFor="active">Activate survey immediately</Label>
              </div>
            </div>
          )}

          {/* Step 2: Channel Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Select Channels</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Choose where this survey will be displayed
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {availableChannels.map((channel) => {
                    const Icon = channel.icon;
                    const isSelected = formData.channels.includes(channel.id);
                    
                    return (
                      <div
                        key={channel.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleChannel(channel.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                          <div>
                            <p className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                              {channel.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {channel.id === 'email' && 'Send via email'}
                              {channel.id === 'sms' && 'Send via SMS'}
                              {channel.id === 'in-app' && 'Show in application'}
                              {channel.id === 'chat' && 'Show in chat widget'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Questions */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Survey Questions</Label>
                <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-4">
                {formData.questions.map((question, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label>Question Type</Label>
                        <Select 
                          value={question.type} 
                          onValueChange={(value) => updateQuestion(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {questionTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Question Text</Label>
                        <Input
                          value={question.question}
                          onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                          placeholder="Enter your question"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${index}`}
                          checked={question.required}
                          onCheckedChange={(checked) => 
                            updateQuestion(index, 'required', checked)
                          }
                        />
                        <Label htmlFor={`required-${index}`}>Required question</Label>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.questions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No questions added yet</p>
                    <p className="text-sm">Click "Add Question" to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !formData.name.trim()) ||
                    (step === 2 && formData.channels.length === 0)
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || formData.questions.length === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Survey'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
