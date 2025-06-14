
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Mouse } from 'lucide-react';
import { IntegrationType } from './types';

interface IntegrationTypeSelectorProps {
  integrationType: IntegrationType;
  onTypeChange: (type: IntegrationType) => void;
}

export const IntegrationTypeSelector = ({ integrationType, onTypeChange }: IntegrationTypeSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Type</CardTitle>
        <CardDescription>Choose how you want to integrate TriChat into your website</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              integrationType === 'widget' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onTypeChange('widget')}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Floating Widget</h3>
                <p className="text-sm text-gray-600">Always visible chat widget on your website</p>
              </div>
            </div>
          </div>

          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              integrationType === 'button' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onTypeChange('button')}
          >
            <div className="flex items-center gap-3">
              <Mouse className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Button Trigger</h3>
                <p className="text-sm text-gray-600">Opens when users click your help button</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
