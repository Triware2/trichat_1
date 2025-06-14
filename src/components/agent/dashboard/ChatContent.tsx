
import { TabsContent } from '@/components/ui/tabs';
import { ChatInterface } from '@/components/agent/ChatInterface';
import { ChatList } from '@/components/agent/ChatList';

interface ChatContentProps {
  chats: Array<{
    id: number;
    customer: string;
    lastMessage: string;
    time: string;
    status: string;
    unread: number;
    priority: string;
  }>;
  selectedChat: number;
  onChatSelect: (chatId: number) => void;
  onFilter: () => void;
  onSendMessage: (message: string) => void;
  getSelectedCustomerName: () => string;
}

export const ChatContent = ({ 
  chats, 
  selectedChat, 
  onChatSelect, 
  onFilter, 
  onSendMessage, 
  getSelectedCustomerName 
}: ChatContentProps) => {
  return (
    <TabsContent value="chat" className="h-full">
      <div className="flex h-full">
        <div className="w-96 border-r border-slate-200 bg-white">
          <ChatList 
            chats={chats}
            selectedChat={selectedChat}
            onChatSelect={onChatSelect}
            onFilter={onFilter}
          />
        </div>
        <div className="flex-1">
          <ChatInterface
            customerName={getSelectedCustomerName()}
            customerStatus="Online"
            selectedChatId={selectedChat}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>
    </TabsContent>
  );
};
