
import { TabsContent } from '@/components/ui/tabs';
import { ChatInterface } from '@/components/agent/ChatInterface';
import { ChatList } from '@/components/agent/ChatList';
import { ContactPropertiesPanel } from '@/components/agent/ContactPropertiesPanel';
import { CustomerComplaintsPreview } from '@/components/agent/CustomerComplaintsPreview';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  return (
    <TabsContent value="chat" className="h-full m-0">
      <div className="flex h-full">
        {/* Left Section - Chat List (Independent Scrolling) */}
        <div className="w-80 border-r border-slate-200 bg-white flex-shrink-0 h-full">
          <ScrollArea className="h-full">
            <ChatList 
              chats={chats}
              selectedChat={selectedChat}
              onChatSelect={onChatSelect}
              onFilter={onFilter}
            />
          </ScrollArea>
        </div>
        
        {/* Middle Section - Chat Interface (Independent Scrolling) */}
        <div className="flex-1 h-full overflow-hidden">
          <ScrollArea className="h-full">
            <ChatInterface
              customerName={getSelectedCustomerName()}
              customerStatus="Online"
              selectedChatId={selectedChat}
              onSendMessage={onSendMessage}
            />
          </ScrollArea>
        </div>
        
        {/* Right Section - Customer Info (Independent Scrolling) */}
        <div className="w-80 border-l border-slate-200 bg-slate-50 flex-shrink-0 h-full">
          <ScrollArea className="h-full">
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
          </ScrollArea>
        </div>
      </div>
    </TabsContent>
  );
};
