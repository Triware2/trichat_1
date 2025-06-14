

import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface QuickResponsesProps {
  responses: string[];
  onResponseSelect: (response: string) => void;
}

export const QuickResponses = ({ responses, onResponseSelect }: QuickResponsesProps) => {
  return (
    <div className="px-4 lg:px-6 py-4 border-t border-slate-200 bg-slate-50">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-blue-600" />
        <p className="text-sm font-medium text-slate-700">Quick Responses</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {responses.slice(0, 4).map((response, index) => (
          <Button 
            key={index}
            variant="outline" 
            size="sm"
            onClick={() => onResponseSelect(response)}
            className="text-xs h-8 px-3 bg-white border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 rounded-lg"
          >
            <span className="truncate max-w-24 lg:max-w-none">
              {response.length > 20 ? `${response.substring(0, 20)}...` : response}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

