
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Brain, MessageSquare } from 'lucide-react';
import { WizardStepProps } from './types';

export const ReviewStep = ({ botData }: WizardStepProps) => {
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
};
