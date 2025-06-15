
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Brain, Zap } from 'lucide-react';
import { WizardStepProps } from './types';

export const BotTypeStep = ({ botData, setBotData }: WizardStepProps) => {
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
};
