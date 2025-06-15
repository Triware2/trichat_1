
import { Button } from '@/components/ui/button';
import { Download, Upload, Bot } from 'lucide-react';

interface TrainingHeaderProps {
  onExportRules: () => void;
}

export const TrainingHeader = ({ onExportRules }: TrainingHeaderProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 p-8">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extralight text-gray-900 mb-3 tracking-tight">
              Bot Training Studio
            </h1>
            <p className="text-gray-500 text-lg font-light leading-relaxed">
              Configure intelligent responses and conversation flows with precision
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            onClick={onExportRules}
            className="border-gray-200/70 text-gray-600 hover:bg-gray-50/80 hover:border-gray-300 transition-all duration-300 rounded-2xl px-6 py-3 font-medium shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Rules
          </Button>
          <Button 
            variant="outline"
            className="border-gray-200/70 text-gray-600 hover:bg-gray-50/80 hover:border-gray-300 transition-all duration-300 rounded-2xl px-6 py-3 font-medium shadow-sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Rules
          </Button>
        </div>
      </div>
    </div>
  );
};
