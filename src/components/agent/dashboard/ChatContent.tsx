
import { TabsContent } from '@/components/ui/tabs';
import { ChatInterface } from '@/components/agent/ChatInterface';
import { ChatList } from '@/components/agent/ChatList';
import { ContactPropertiesPanel } from '@/components/agent/ContactPropertiesPanel';
import { CustomerComplaintsPreview } from '@/components/agent/CustomerComplaintsPreview';
import { ChatMessage } from '@/components/admin/chatbot/types';

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
    console.log(`Navigating to customer profile for: ${getSelectedCustomerName()}`);
  };

  // Mock bot conversation history for demonstration
  const mockBotHistory: ChatMessage[] = selectedChat === 1 ? [
    {
      id: 1001,
      sender: 'bot',
      message: "Hello! I'm here to help you with your questions. How can I assist you today?",
      time: '10:25 AM',
      type: 'text',
      confidence: 1.0
    },
    {
      id: 1002,
      sender: 'customer',
      message: "Hi, I need help with my order",
      time: '10:26 AM',
      type: 'text'
    },
    {
      id: 1003,
      sender: 'bot',
      message: "I can help you track your order. Could you please provide your order number?",
      time: '10:26 AM',
      type: 'text',
      confidence: 0.9,
      intent: 'order_tracking'
    },
    {
      id: 1004,
      sender: 'customer',
      message: "Actually, I want to talk to a human agent",
      time: '10:27 AM',
      type: 'text'
    },
    {
      id: 1005,
      sender: 'bot',
      message: "I'll connect you with one of our agents right away. Please wait a moment.",
      time: '10:27 AM',
      type: 'escalation',
      escalation_reason: 'manual'
    }
  ] : [];

  return (
    <TabsContent value="chat" className="h-full m-0">
      <div className="flex h-full">
        {/* Left Section - Chat List (Own Scrollbar) */}
        <div className="w-80 border-r border-slate-200 bg-white flex-shrink-0 h-full overflow-y-auto">
          <ChatList 
            chats={chats}
            selectedChat={selectedChat}
            onChatSelect={onChatSelect}
            onFilter={onFilter}
          />
        </div>
        
        {/* Middle Section - Chat Interface (Own Scrollbar + Floating Input) */}
        <div className="flex-1 h-full relative">
          <ChatInterface
            customerName={getSelectedCustomerName()}
            customerStatus="Online"
            selectedChatId={selectedChat}
            onSendMessage={onSendMessage}
            botConversationHistory={mockBotHistory}
          />
        </div>
        
        {/* Right Section - Customer Info (Own Scrollbar) */}
        <div className="w-80 border-l border-slate-200 bg-slate-50 flex-shrink-0 h-full overflow-y-auto">
          <div className="p-3 space-y-4">
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
      </div>
    </TabsContent>
  );
};
