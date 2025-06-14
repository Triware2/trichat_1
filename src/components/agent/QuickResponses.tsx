
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface QuickResponsesProps {
  responses: string[];
  onResponseSelect: (response: string) => void;
}

export const QuickResponses = ({ responses, onResponseSelect }: QuickResponsesProps) => {
  return (
    <div className="px-6 py-4 border-t border-slate-200 bg-white">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <Zap className="w-3 h-3 text-white" />
        </div>
        <p className="text-sm font-medium text-slate-700">Quick Responses</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {responses.slice(0, 4).map((response, index) => (
          <Button 
            key={index}
            variant="outline" 
            size="sm"
            onClick={() => onResponseSelect(response)}
            className="text-xs h-8 px-3 bg-slate-50 border-slate-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all duration-200 rounded-lg font-medium"
          >
            <span className="truncate max-w-32">
              {response.length > 25 ? `${response.substring(0, 25)}...` : response}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
