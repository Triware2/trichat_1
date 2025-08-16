import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react';

interface JobProgressBarProps {
  status: 'queued' | 'downloading' | 'training' | 'evaluating' | 'completed' | 'failed';
  progress?: number;
  currentStep?: string;
  error?: string;
}

const steps = [
  { key: 'queued', label: 'Queued', icon: Clock },
  { key: 'downloading', label: 'Downloading', icon: Loader2 },
  { key: 'training', label: 'Training', icon: Loader2 },
  { key: 'evaluating', label: 'Evaluating', icon: Loader2 },
  { key: 'completed', label: 'Completed', icon: CheckCircle }
];

export const JobProgressBar: React.FC<JobProgressBarProps> = ({
  status,
  progress = 0,
  currentStep,
  error
}) => {
  const currentStepIndex = steps.findIndex(step => step.key === status);
  const isFailed = status === 'failed';

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="relative">
        <Progress 
          value={isFailed ? 0 : progress} 
          className="h-3"
          style={{
            background: isFailed ? '#fef2f2' : undefined,
            '--progress-background': isFailed ? '#ef4444' : undefined
          } as React.CSSProperties}
        />
        {isFailed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
        )}
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

      {/* Current Status */}
      {currentStep && (
        <div className="flex items-center gap-2">
          <Badge variant={isFailed ? 'destructive' : 'default'}>
            {isFailed ? 'Failed' : currentStep}
          </Badge>
          {error && (
            <span className="text-sm text-red-600">{error}</span>
          )}
        </div>
      )}
    </div>
  );
}; 