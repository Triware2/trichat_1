
import { ArrowRight } from 'lucide-react';
import { WizardProgressProps } from './types';

export const WizardProgress = ({ steps, currentStep }: WizardProgressProps) => {
  return (
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
  );
};
