
import { useState } from 'react';
import { MessageList } from './MessageList';
import { QuickResponses } from './QuickResponses';
import { ChatHeader } from './ChatHeader';
import { FloatingInputSection } from './chat/FloatingInputSection';
import { usePrivateNotes } from './PrivateNotes';
import { useChatData } from './hooks/useChatData';
import { useMessageHandling } from './hooks/useMessageHandling';

interface ChatInterfaceProps {
  customerName: string;
  customerStatus: string;
  selectedChatId: number;
  onSendMessage: (message: string) => void;
}

export const ChatInterface = ({ customerName, customerStatus, selectedChatId, onSendMessage }: ChatInterfaceProps) => {
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
  } = useMessageHandling(messages, setMessages, onSendMessage, addNote);

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
    <div className="h-full flex flex-col bg-white relative overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 z-10">
        <ChatHeader customerName={customerName} customerStatus={customerStatus} />
      </div>
      
      {/* Scrollable Messages Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Messages container with its own scroll and padding for floating input */}
        <div className="absolute inset-0 overflow-y-auto pb-48">
          <MessageList 
            messages={messages} 
            privateNotes={privateNotes}
            isTyping={isTyping}
            onDeleteNote={handleDeleteNote}
            canDeleteNote={canDeleteNote}
          />
        </div>

        {/* Fixed Floating Input Section - positioned absolutely and stays in place */}
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

        {/* Quick Responses - Fixed position within chat interface */}
        <div className="absolute bottom-52 right-6 z-50">
          <QuickResponses responses={quickResponses} onResponseSelect={handleQuickResponse} />
        </div>
      </div>
    </div>
  );
};
