
export interface BotData {
  name: string;
  description: string;
  type: string;
  llmProvider: string;
  model: string;
  personality: string;
  escalationThreshold: number;
  welcomeMessage: string;
  fallbackMessage: string;
}

export interface WizardStep {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface WizardStepProps {
  botData: BotData;
  setBotData: (data: BotData) => void;
}

export interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  onCreate: () => void;
  isStepValid: boolean;
}

export interface WizardProgressProps {
  steps: WizardStep[];
  currentStep: number;
}
