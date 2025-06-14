
import { Button } from '@/components/ui/button';

interface QuickResponsesProps {
  responses: string[];
  onResponseSelect: (response: string) => void;
}

export const QuickResponses = ({ responses, onResponseSelect }: QuickResponsesProps) => {
  return (
    <div className="px-4 py-2 border-t bg-gray-50">
      <p className="text-xs text-gray-600 mb-2">Quick Responses:</p>
      <div className="flex flex-wrap gap-1">
        {responses.slice(0, 4).map((response, index) => (
          <Button 
            key={index}
            variant="outline" 
            size="sm"
            onClick={() => onResponseSelect(response)}
            className="text-xs h-6 px-2"
          >
            {response.length > 20 ? `${response.substring(0, 20)}...` : response}
          </Button>
        ))}
      </div>
    </div>
  );
};
