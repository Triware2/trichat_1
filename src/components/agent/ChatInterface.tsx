import { useState } from 'react';
import { MessageList } from './MessageList';
import { QuickResponses } from './QuickResponses';
import { ChatHeader } from './ChatHeader';
import { FloatingInputSection } from './chat/FloatingInputSection';
import { BotConversationSection } from './BotConversationSection';
import { usePrivateNotes } from './PrivateNotes';
import { useChatData } from './hooks/useChatData';
import { useMessageHandling } from './hooks/useMessageHandling';
import { ChatMessage } from '@/components/admin/chatbot/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CannedResponses } from './CannedResponses';

interface ChatInterfaceProps {
  customerName: string;
  customerStatus: string;
  selectedChatId: string | null;
  onSendMessage: (message: string) => void;
  botConversationHistory?: ChatMessage[];
  agentName: string;
  subject?: string;
  onSubjectChange?: (newSubject: string) => Promise<void>;
}

export const ChatInterface = ({ 
  customerName, 
  customerStatus, 
  selectedChatId, 
  onSendMessage,
  botConversationHistory = [],
  agentName,
  subject,
  onSubjectChange
}: ChatInterfaceProps) => {
  const [showCannedResponses, setShowCannedResponses] = useState(false);
  
  // Use private notes hook with current user context
  const { notes: privateNotes, addNote, handleDeleteNote, canDeleteNote } = usePrivateNotes(
    selectedChatId, 
    'agent', // This would come from user context in a real app
    'Current Agent'
  );

  // Use chat data hook
  const { messages, setMessages } = useChatData(selectedChatId);

  // Use message handling hook
  const {
    message,
    setMessage,
    isTyping,
    isPrivateNoteMode,
    setIsPrivateNoteMode,
    handleSendMessage,
    handleQuickResponse,
    handleCannedResponseSelect,
    handleFileUpload,
    handleImageUpload
  } = useMessageHandling(messages, setMessages, onSendMessage, addNote, botConversationHistory);

  const handleSelectAndClose = (responseText: string) => {
    handleCannedResponseSelect(responseText);
    setShowCannedResponses(false);
  };

  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Header - Fixed */}
        <ChatHeader 
          customerName={customerName} 
          customerStatus={customerStatus} 
          chatId={selectedChatId}
          agentName={agentName}
          subject={subject}
          onSubjectChange={onSubjectChange}
        />
      {/* Scrollable message area (bot history + messages) */}
      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto bg-slate-50">
        {botConversationHistory.length > 0 && (
          <div className="flex-shrink-0 border-b border-blue-200 bg-blue-50/30 max-h-80 overflow-y-auto">
            <div className="p-4">
              <BotConversationSection botConversationHistory={botConversationHistory} />
            </div>
          </div>
        )}
        <div className="flex-1 min-h-0">
          <MessageList 
            messages={messages} 
            privateNotes={privateNotes}
            isTyping={isTyping}
            onDeleteNote={handleDeleteNote}
            canDeleteNote={canDeleteNote}
            botConversationHistory={[]}
          />
        </div>
      </div>
      {/* Input Section - Fixed */}
        <FloatingInputSection
          message={message}
          setMessage={setMessage}
          isPrivateNoteMode={isPrivateNoteMode}
          setIsPrivateNoteMode={setIsPrivateNoteMode}
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          onImageUpload={handleImageUpload}
        setShowCannedResponses={setShowCannedResponses}
      />
      <Sheet open={showCannedResponses} onOpenChange={setShowCannedResponses}>
        <SheetContent className="w-[500px] sm:w-[540px] p-0">
          <CannedResponses onSelectResponse={handleSelectAndClose} />
        </SheetContent>
      </Sheet>
    </div>
  );
};
