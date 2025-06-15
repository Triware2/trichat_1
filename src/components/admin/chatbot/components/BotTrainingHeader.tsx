
import { Button } from '@/components/ui/button';
import { Plus, Bot } from 'lucide-react';

interface BotTrainingHeaderProps {
  onCreateBot: () => void;
}

export const BotTrainingHeader = ({ onCreateBot }: BotTrainingHeaderProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-8 shadow-lg">
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">Intelligent Chatbots</h1>
              <p className="text-lg text-blue-700 font-medium mt-1">Azure AI Framework</p>
            </div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
            Build and deploy enterprise-grade chatbots with advanced AI capabilities, 
            seamless integrations, and comprehensive analytics powered by Azure Cognitive Services.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Azure OpenAI Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Multi-language Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Enterprise Security</span>
            </div>
          </div>
        </div>
        <Button 
          onClick={onCreateBot}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-xl font-medium"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Chatbot
        </Button>
      </div>
    </div>
  );
};
