
import { Button } from '@/components/ui/button';
import { Phone, Video, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatHeaderProps {
  customerName: string;
  customerStatus: string;
}

export const ChatHeader = ({ customerName, customerStatus }: ChatHeaderProps) => {
  const { toast } = useToast();

  const handleVoiceCall = () => {
    toast({
      title: "Voice call initiated",
      description: `Starting voice call with ${customerName}...`,
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "Video call initiated",
      description: `Starting video call with ${customerName}...`,
    });
  };

  const handleMoreOptions = () => {
    toast({
      title: "More options",
      description: "Additional options menu opened.",
    });
  };

  return (
    <div className="border-b border-slate-200 p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white font-medium">
              {customerName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{customerName}</h3>
            <p className="text-sm text-emerald-600 font-medium">{customerStatus}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleVoiceCall} className="h-9 w-9 p-0 hover:bg-slate-100">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleVideoCall} className="h-9 w-9 p-0 hover:bg-slate-100">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleMoreOptions} className="h-9 w-9 p-0 hover:bg-slate-100">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
