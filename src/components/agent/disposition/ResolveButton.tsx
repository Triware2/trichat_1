
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ResolveButtonProps {
  onResolve: () => void;
  disabled?: boolean;
  chatStatus?: string;
}

export const ResolveButton = ({ onResolve, disabled = false, chatStatus }: ResolveButtonProps) => {
  if (chatStatus === 'resolved') {
    return (
      <Button variant="outline" disabled className="text-green-600 border-green-200">
        <CheckCircle className="w-4 h-4 mr-2" />
        Resolved
      </Button>
    );
  }

  return (
    <Button
      onClick={onResolve}
      disabled={disabled}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      <CheckCircle className="w-4 h-4 mr-2" />
      Resolve Chat
    </Button>
  );
};
