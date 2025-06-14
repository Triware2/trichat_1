
import { TabsContent } from '@/components/ui/tabs';
import { ChatInterface } from '@/components/agent/ChatInterface';
import { ChatList } from '@/components/agent/ChatList';
import { ContactPropertiesPanel } from '@/components/agent/ContactPropertiesPanel';
import { CustomerComplaintsPreview } from '@/components/agent/CustomerComplaintsPreview';

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
  const handleViewCustomerProfile = () => {
    // This would typically navigate to the customer info page
    // For now, we'll just log the action - you can integrate with your routing system
    console.log(`Navigating to customer profile for: ${getSelectedCustomerName()}`);
    // Example: navigate('/customer-info', { state: { customerId: selectedChat } });
  };

  return (
    <TabsContent value="chat" className="h-full m-0">
      <div className="flex h-full">
        <div className="w-80 border-r border-slate-200 bg-white">
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
        <div className="w-72 border-l border-slate-200 bg-slate-50 p-3 overflow-y-auto">
          <CustomerComplaintsPreview 
            chatId={selectedChat}
            customerName={getSelectedCustomerName()}
            onViewFullProfile={handleViewCustomerProfile}
          />
          <ContactPropertiesPanel 
            chatId={selectedChat}
            customerName={getSelectedCustomerName()}
          />
        </div>
      </div>
    </TabsContent>
  );
};
