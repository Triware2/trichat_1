
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BotTrainingHeaderProps {
  onCreateBot: () => void;
}

export const BotTrainingHeader = ({ onCreateBot }: BotTrainingHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 font-segoe">Chatbot Framework</h1>
        <p className="text-gray-600 mt-1">
          Build and manage intelligent chatbots with LLM integration and custom SOP training
        </p>
      </div>
      <Button 
        onClick={onCreateBot}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Chatbot
      </Button>
    </div>
  );
};
