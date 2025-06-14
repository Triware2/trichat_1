
import { Button } from '@/components/ui/button';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface CannedResponsesToggleProps {
  showCannedResponses: boolean;
  onToggle: () => void;
}

export const CannedResponsesToggle = ({ showCannedResponses, onToggle }: CannedResponsesToggleProps) => {
  return (
    <div className="px-6 py-2 border-b border-slate-100">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-sm hover:bg-slate-50"
      >
        <span className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Canned Responses
        </span>
        {showCannedResponses ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>
    </div>
  );
};
