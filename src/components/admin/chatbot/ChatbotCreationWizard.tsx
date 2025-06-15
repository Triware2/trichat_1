
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Brain, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Upload,
  Settings,
  Zap
} from 'lucide-react';

interface ChatbotCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatbotCreationWizard = ({ open, onOpenChange }: ChatbotCreationWizardProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [botData, setBotData] = useState({
    name: '',
    description: '',
    type: '',
    llmProvider: '',
    model: '',
    personality: '',
    escalationThreshold: 0.7,
    welcomeMessage: '',
    fallbackMessage: ''
  });

  const steps = [
    { id: 1, title: 'Bot Type', icon: Bot },
    { id: 2, title: 'Configuration', icon: Settings },
    { id: 3, title: 'Personality', icon: Brain },
    { id: 4, title: 'Review', icon: Check }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = () => {
    console.log('Creating chatbot:', botData);
    toast({
      title: "Chatbot Created Successfully!",
      description: `${botData.name} has been created and is ready for training.`,
    });
    onOpenChange(false);
    setCurrentStep(1);
    setBotData({
      name: '',
      description: '',
      type: '',
      llmProvider: '',
      model: '',
      personality: '',
      escalationThreshold: 0.7,
      welcomeMessage: '',
      fallbackMessage: ''
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return botData.type !== '';
      case 2:
        return botData.name !== '' && (botData.type === 'standard' || (botData.llmProvider && botData.model));
      case 3:
        return botData.welcomeMessage !== '';
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Choose Chatbot Type</Label>
              <p className="text-sm text-gray-600 mb-4">Select the type of chatbot you want to create</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all ${botData.type === 'standard' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
                onClick={() => setBotData({...botData, type: 'standard'})}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">Standard Chatbot</CardTitle>
                      <p className="text-sm text-gray-600">Rule-based & FAQ automation</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Pre-defined responses</li>
                    <li>• Flow-based conversations</li>
                    <li>• Quick setup & deployment</li>
                    <li>• Legacy system compatibility</li>
                  </ul>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all ${botData.type === 'llm' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'}`}
                onClick={() => setBotData({...botData, type: 'llm'})}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Brain className="w-8 h-8 text-purple-600" />
                    <div>
                      <CardTitle className="text-lg">LLM-Powered Bot</CardTitle>
                      <p className="text-sm text-gray-600">AI-driven intelligent support</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Natural language understanding</li>
                    <li>• SOP-trained responses</li>
                    <li>• Context-aware conversations</li>
                    <li>• Continuous learning</li>
                  </ul>
                  <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Bot Configuration</Label>
              <p className="text-sm text-gray-600 mb-4">Configure your chatbot's basic settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Bot Name *</Label>
                <Input
                  id="name"
                  value={botData.name}
                  onChange={(e) => setBotData({...botData, name: e.target.value})}
                  placeholder="Customer Support Bot"
                  className="mt-1"
                />
              </div>

              {botData.type === 'llm' && (
                <div>
                  <Label htmlFor="llmProvider">LLM Provider *</Label>
                  <Select value={botData.llmProvider} onValueChange={(value) => setBotData({...botData, llmProvider: value})}>
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
              )}
            </div>

            {botData.type === 'llm' && botData.llmProvider && (
              <div>
                <Label htmlFor="model">Model *</Label>
                <Select value={botData.model} onValueChange={(value) => setBotData({...botData, model: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {botData.llmProvider === 'openai' && (
                      <>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </>
                    )}
                    {botData.llmProvider === 'anthropic' && (
                      <>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                        <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                      </>
                    )}
                    {botData.llmProvider === 'mistral' && (
                      <>
                        <SelectItem value="mistral-large">Mistral Large</SelectItem>
                        <SelectItem value="mistral-medium">Mistral Medium</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={botData.description}
                onChange={(e) => setBotData({...botData, description: e.target.value})}
                placeholder="Describe the purpose and functionality of this chatbot"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Bot Personality & Messages</Label>
              <p className="text-sm text-gray-600 mb-4">Define how your bot communicates with users</p>
            </div>

            <div>
              <Label htmlFor="personality">Personality & Tone</Label>
              <Textarea
                id="personality"
                value={botData.personality}
                onChange={(e) => setBotData({...botData, personality: e.target.value})}
                placeholder="Professional, friendly, and helpful. Always maintain a positive tone and ask clarifying questions when needed."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="welcomeMessage">Welcome Message *</Label>
              <Textarea
                id="welcomeMessage"
                value={botData.welcomeMessage}
                onChange={(e) => setBotData({...botData, welcomeMessage: e.target.value})}
                placeholder="Hello! I'm here to help you with any questions or issues you might have. How can I assist you today?"
                className="mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="fallbackMessage">Fallback Message</Label>
              <Textarea
                id="fallbackMessage"
                value={botData.fallbackMessage}
                onChange={(e) => setBotData({...botData, fallbackMessage: e.target.value})}
                placeholder="I'm not sure I understand. Let me connect you with a human agent who can better assist you."
                className="mt-1"
                rows={2}
              />
            </div>

            {botData.type === 'llm' && (
              <div>
                <Label htmlFor="escalationThreshold">Escalation Confidence Threshold</Label>
                <div className="mt-1">
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={botData.escalationThreshold}
                    onChange={(e) => setBotData({...botData, escalationThreshold: parseFloat(e.target.value)})}
                    className="w-32"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Escalate to human when confidence is below this threshold (0.0 - 1.0)
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Review & Create</Label>
              <p className="text-sm text-gray-600 mb-4">Review your chatbot configuration before creating</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {botData.type === 'llm' ? <Brain className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                  {botData.name || 'Unnamed Bot'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Type:</span>
                    <p className="text-gray-600">{botData.type === 'llm' ? 'LLM-Powered' : 'Standard'}</p>
                  </div>
                  {botData.llmProvider && (
                    <div>
                      <span className="font-medium">Provider:</span>
                      <p className="text-gray-600">{botData.llmProvider}</p>
                    </div>
                  )}
                  {botData.model && (
                    <div>
                      <span className="font-medium">Model:</span>
                      <p className="text-gray-600">{botData.model}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-gray-600">{botData.description || 'No description'}</p>
                  </div>
                </div>

                {botData.welcomeMessage && (
                  <div>
                    <span className="font-medium text-sm">Welcome Message:</span>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-1">
                      {botData.welcomeMessage}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Create New Chatbot</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-300 mx-6" />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {currentStep < steps.length ? (
              <Button 
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleCreate}
                disabled={!isStepValid()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Create Chatbot
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
