
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Bot, Brain, Settings, Check } from 'lucide-react';
import { BotData, WizardStep } from './components/wizard/types';
import { WizardProgress } from './components/wizard/WizardProgress';
import { WizardNavigation } from './components/wizard/WizardNavigation';
import { BotTypeStep } from './components/wizard/BotTypeStep';
import { ConfigurationStep } from './components/wizard/ConfigurationStep';
import { PersonalityStep } from './components/wizard/PersonalityStep';
import { ReviewStep } from './components/wizard/ReviewStep';

interface ChatbotCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatbotCreationWizard = ({ open, onOpenChange }: ChatbotCreationWizardProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [botData, setBotData] = useState<BotData>({
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

  const steps: WizardStep[] = [
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
        return <BotTypeStep botData={botData} setBotData={setBotData} />;
      case 2:
        return <ConfigurationStep botData={botData} setBotData={setBotData} />;
      case 3:
        return <PersonalityStep botData={botData} setBotData={setBotData} />;
      case 4:
        return <ReviewStep botData={botData} setBotData={setBotData} />;
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

        <WizardProgress steps={steps} currentStep={currentStep} />

        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onCancel={() => onOpenChange(false)}
          onCreate={handleCreate}
          isStepValid={isStepValid()}
        />
      </DialogContent>
    </Dialog>
  );
};
