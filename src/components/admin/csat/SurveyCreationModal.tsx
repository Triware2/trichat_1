
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, Star, MessageSquare, Mail, Smartphone, Monitor } from 'lucide-react';
import { Survey, SurveyQuestion } from './types';

interface SurveyCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSurveyCreated: (survey: Survey) => void;
  template?: 'CSAT' | 'NPS' | 'CES' | null;
}

interface SurveyFormData {
  name: string;
  description: string;
  type: 'CSAT' | 'NPS' | 'CES';
  channels: string[];
}

export const SurveyCreationModal = ({ 
  open, 
  onOpenChange, 
  onSurveyCreated,
  template 
}: SurveyCreationModalProps) => {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<SurveyFormData>({
    defaultValues: {
      name: '',
      description: '',
      type: template || 'CSAT',
      channels: [],
    },
  });

  const channels = [
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'sms', label: 'SMS', icon: Smartphone },
    { id: 'in-app', label: 'In-App', icon: Monitor },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
  ];

  const getDefaultQuestions = (type: 'CSAT' | 'NPS' | 'CES'): SurveyQuestion[] => {
    switch (type) {
      case 'CSAT':
        return [
          {
            id: '1',
            type: 'rating',
            question: 'How satisfied were you with your support experience?',
            required: true,
            scale: { min: 1, max: 5, labels: ['Very Unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'] }
          },
          {
            id: '2',
            type: 'text',
            question: 'Please share any additional feedback about your experience.',
            required: false
          }
        ];
      case 'NPS':
        return [
          {
            id: '1',
            type: 'nps',
            question: 'How likely are you to recommend our service to a friend or colleague?',
            required: true,
            scale: { min: 0, max: 10 }
          },
          {
            id: '2',
            type: 'text',
            question: 'What is the primary reason for your score?',
            required: false
          }
        ];
      case 'CES':
        return [
          {
            id: '1',
            type: 'rating',
            question: 'How easy was it to get your issue resolved?',
            required: true,
            scale: { min: 1, max: 5, labels: ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy'] }
          },
          {
            id: '2',
            type: 'text',
            question: 'How could we make this process easier?',
            required: false
          }
        ];
      default:
        return [];
    }
  };

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(c => c !== channelId)
        : [...prev, channelId]
    );
  };

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      type: 'text',
      question: '',
      required: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, updates: Partial<SurveyQuestion>) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const onSubmit = (data: SurveyFormData) => {
    if (selectedChannels.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one channel.",
        variant: "destructive",
      });
      return;
    }

    const surveyQuestions = questions.length > 0 ? questions : getDefaultQuestions(data.type);

    const newSurvey: Survey = {
      id: Date.now().toString(),
      name: data.name,
      type: data.type,
      description: data.description,
      channels: selectedChannels as ('email' | 'sms' | 'in-app' | 'chat')[],
      triggers: [
        {
          id: '1',
          event: 'ticket_resolved',
          delay: 5,
          conditions: []
        }
      ],
      questions: surveyQuestions,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSurveyCreated(newSurvey);
    onOpenChange(false);
    form.reset();
    setQuestions([]);
    setSelectedChannels([]);

    toast({
      title: "Survey Created",
      description: `"${data.name}" has been created successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Survey</DialogTitle>
          <DialogDescription>
            Design a customer satisfaction survey to collect feedback after interactions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Survey Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Post-Support CSAT" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Survey Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select survey type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CSAT">CSAT (Customer Satisfaction)</SelectItem>
                        <SelectItem value="NPS">NPS (Net Promoter Score)</SelectItem>
                        <SelectItem value="CES">CES (Customer Effort Score)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe when and why this survey should be sent..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Delivery Channels</FormLabel>
              <FormDescription>Select how this survey will be delivered to customers</FormDescription>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className={`
                      p-3 border rounded-lg cursor-pointer transition-colors
                      ${selectedChannels.includes(channel.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => handleChannelToggle(channel.id)}
                  >
                    <div className="flex items-center gap-2">
                      <channel.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{channel.label}</span>
                      {selectedChannels.includes(channel.id) && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <FormLabel>Survey Questions</FormLabel>
                  <FormDescription>
                    {questions.length === 0 
                      ? `Default ${form.watch('type')} questions will be used if none are added`
                      : `${questions.length} custom question${questions.length > 1 ? 's' : ''} added`
                    }
                  </FormDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Question
                </Button>
              </div>

              {questions.map((question, index) => (
                <div key={question.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Question {index + 1}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Input
                    placeholder="Enter your question..."
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                  />
                  
                  <div className="flex items-center gap-4">
                    <Select 
                      value={question.type} 
                      onValueChange={(value) => updateQuestion(question.id, { type: value as any })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Response</SelectItem>
                        <SelectItem value="rating">Rating Scale</SelectItem>
                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                        <SelectItem value="nps">NPS Scale</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox 
                        checked={question.required}
                        onCheckedChange={(checked) => updateQuestion(question.id, { required: !!checked })}
                      />
                      Required
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Survey</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
