
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ResolveButton } from './disposition/ResolveButton';
import { DispositionModal } from './disposition/DispositionModal';
import { useChatResolution } from './disposition/useChatResolution';

interface ChatHeaderProps {
  customerName: string;
  customerStatus: string;
  chatId?: number;
}

export const ChatHeader = ({ customerName, customerStatus, chatId = 1 }: ChatHeaderProps) => {
  const [showDispositionModal, setShowDispositionModal] = useState(false);
  const { resolveChat, isChatResolved } = useChatResolution();
  
  const chatStatus = isChatResolved(chatId) ? 'resolved' : 'active';

  const handleResolve = () => {
    setShowDispositionModal(true);
  };

  const handleChatResolution = async (resolution: any) => {
    await resolveChat(resolution);
    setShowDispositionModal(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {customerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{customerName}</h3>
            <div className="flex items-center space-x-2">
              <Badge variant={customerStatus === 'Online' ? 'default' : 'secondary'} className="text-xs">
                {customerStatus}
              </Badge>
              <Badge variant={chatStatus === 'resolved' ? 'outline' : 'default'} className="text-xs">
                {chatStatus === 'resolved' ? 'Resolved' : 'Active'}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <ResolveButton 
            onResolve={handleResolve}
            chatStatus={chatStatus}
            disabled={chatStatus === 'resolved'}
          />
        </div>
      </div>

      <DispositionModal
        isOpen={showDispositionModal}
        onClose={() => setShowDispositionModal(false)}
        chatId={chatId}
        customerName={customerName}
        onResolve={handleChatResolution}
      />
    </>
  );
};
