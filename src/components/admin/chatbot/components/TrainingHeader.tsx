
import { Button } from '@/components/ui/button';
import { Download, Brain, Zap } from 'lucide-react';

interface TrainingHeaderProps {
  onExportRules: () => void;
  onQuickTrain: () => void;
}

export const TrainingHeader = ({ onExportRules, onQuickTrain }: TrainingHeaderProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Bot Training Studio</h1>
            <p className="text-slate-600">Configure rules, flows, and training parameters for your AI assistants</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={onExportRules}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white text-slate-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Rules
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
            onClick={onQuickTrain}
          >
            <Zap className="w-4 h-4 mr-2" />
            Quick Train
          </Button>
        </div>
      </div>
    </div>
  );
};
