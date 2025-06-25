import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ResolveButtonProps {
  onResolve: () => void;
  disabled?: boolean;
  chatStatus?: string;
  className?: string;
}

export const ResolveButton = ({ onResolve, disabled = false, chatStatus, className }: ResolveButtonProps) => {
  if (chatStatus === 'resolved') {
    return (
      <Button variant="outline" disabled className={`text-green-600 border-green-200 ${className || ''}`}>
        <CheckCircle className="w-4 h-4 mr-2" />
        Resolved
      </Button>
    );
  }

  return (
    <Button
      onClick={onResolve}
      disabled={disabled}
      className={`bg-green-500 hover:bg-green-600 text-white ${className || ''}`}
    >
      <CheckCircle className="w-4 h-4 mr-2" />
      Resolve Chat
    </Button>
  );
};
