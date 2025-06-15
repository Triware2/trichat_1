
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

interface ChatInterfaceProps {
  customerName: string;
  customerStatus: string;
  selectedChatId: number;
  onSendMessage: (message: string) => void;
  botConversationHistory?: ChatMessage[];
}

export const ChatInterface = ({ 
  customerName, 
  customerStatus, 
  selectedChatId, 
  onSendMessage,
  botConversationHistory = []
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

  const quickResponses = [
    "Thank you for contacting us!",
    "I'd be happy to help you with that.",
    "Let me check that information for you.",
    "Is there anything else I can help you with?",
    "Thank you for your patience.",
    "I understand your concern.",
    "Let me transfer you to the right department.",
    "Your issue has been resolved."
  ];

  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Fixed Header - Always visible at top */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 z-20 shadow-sm">
        <ChatHeader 
          customerName={customerName} 
          customerStatus={customerStatus} 
          chatId={selectedChatId}
        />
      </div>
      
      {/* Main Chat Content Area - Independent scrollable sections */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        
        {/* Bot Conversation History Section - Independent scroll */}
        {botConversationHistory.length > 0 && (
          <div className="flex-shrink-0 border-b border-blue-200 bg-blue-50/30 max-h-80 overflow-y-auto">
            <div className="p-4">
              <BotConversationSection botConversationHistory={botConversationHistory} />
            </div>
          </div>
        )}
        
        {/* Messages Section - Independent scroll, takes remaining space */}
        <div className="flex-1 min-h-0 relative bg-slate-50">
          <div className="h-full overflow-y-auto pb-40">
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

        {/* Quick Responses - Floating on the right side */}
        <div className="absolute right-4 bottom-44 z-30">
          <QuickResponses responses={quickResponses} onResponseSelect={handleQuickResponse} />
        </div>
      </div>

      {/* Floating Input Section - Always fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg">
        <FloatingInputSection
          showCannedResponses={showCannedResponses}
          setShowCannedResponses={setShowCannedResponses}
          message={message}
          setMessage={setMessage}
          isPrivateNoteMode={isPrivateNoteMode}
          setIsPrivateNoteMode={setIsPrivateNoteMode}
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          onImageUpload={handleImageUpload}
          onCannedResponseSelect={handleCannedResponseSelect}
        />
      </div>
    </div>
  );
};
