import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CannedResponses } from './CannedResponses';
import { MessageList } from './MessageList';
import { QuickResponses } from './QuickResponses';
import { ChatHeader } from './ChatHeader';
import { MessageInputArea } from './MessageInputArea';
import { usePrivateNotes } from './PrivateNotes';

interface Message {
  id: number;
  sender: 'agent' | 'customer';
  message: string;
  time: string;
  type: 'text' | 'image' | 'file';
  fileName?: string;
}

interface ChatInterfaceProps {
  customerName: string;
  customerStatus: string;
  selectedChatId: number;
  onSendMessage: (message: string) => void;
}

interface CannedResponse {
  id: number;
  title: string;
  message: string;
  category: string;
  createdAt: string;
}

export const ChatInterface = ({ customerName, customerStatus, selectedChatId, onSendMessage }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCannedResponses, setShowCannedResponses] = useState(false);
  const [isPrivateNoteMode, setIsPrivateNoteMode] = useState(false);
  const { toast } = useToast();
  
  // Use private notes hook with current user context
  const { notes: privateNotes, addNote, handleDeleteNote, canDeleteNote } = usePrivateNotes(
    selectedChatId, 
    'agent', // This would come from user context in a real app
    'Current Agent'
  );

  // Different message sets for different customers
  const getMessagesForChat = (chatId: number): Message[] => {
    const messageMap: { [key: number]: Message[] } = {
      1: [
        {
          id: 1,
          sender: "customer",
          message: "Hi, I need help with my recent order #12345",
          time: "10:30 AM",
          type: "text"
        },
        {
          id: 2,
          sender: "agent",
          message: "Hello! I'd be happy to help you with your order. Let me look that up for you.",
          time: "10:31 AM",
          type: "text"
        },
        {
          id: 3,
          sender: "customer",
          message: "It was supposed to arrive yesterday but I haven't received it yet",
          time: "10:32 AM",
          type: "text"
        }
      ],
      2: [
        {
          id: 1,
          sender: "customer",
          message: "Thanks for your help earlier!",
          time: "10:45 AM",
          type: "text"
        },
        {
          id: 2,
          sender: "agent",
          message: "You're welcome! Is there anything else I can help you with?",
          time: "10:46 AM",
          type: "text"
        },
        {
          id: 3,
          sender: "customer",
          message: "No, that's all. Have a great day!",
          time: "10:47 AM",
          type: "text"
        }
      ],
      3: [
        {
          id: 1,
          sender: "customer",
          message: "Still waiting for a response...",
          time: "11:00 AM",
          type: "text"
        },
        {
          id: 2,
          sender: "agent",
          message: "I apologize for the delay. I'm here to help you now. What can I assist you with?",
          time: "11:05 AM",
          type: "text"
        }
      ],
      4: [
        {
          id: 1,
          sender: "customer",
          message: "The product is not working as expected",
          time: "11:15 AM",
          type: "text"
        },
        {
          id: 2,
          sender: "agent",
          message: "I'm sorry to hear that. Can you tell me more about the issue you're experiencing?",
          time: "11:16 AM",
          type: "text"
        },
        {
          id: 3,
          sender: "customer",
          message: "When I try to use the main feature, it crashes immediately",
          time: "11:17 AM",
          type: "text"
        }
      ]
    };
    return messageMap[chatId] || [];
  };

  const [messages, setMessages] = useState<Message[]>(getMessagesForChat(selectedChatId));

  // Update messages when chat selection changes
  useState(() => {
    setMessages(getMessagesForChat(selectedChatId));
  });

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

  const handleSendMessage = () => {
    if (message.trim()) {
      if (isPrivateNoteMode) {
        // Add as private note
        addNote(message.trim());
        setMessage('');
        setIsPrivateNoteMode(false);
      } else {
        // Send as regular message
        const newMessage: Message = {
          id: messages.length + 1,
          sender: 'agent',
          message: message.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        };
        
        setMessages([...messages, newMessage]);
        onSendMessage(message.trim());
        setMessage('');
        
        toast({
          title: "Message sent",
          description: "Your message has been delivered to the customer.",
        });

        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            const customerResponse: Message = {
              id: messages.length + 2,
              sender: 'customer',
              message: "Thank you for the quick response!",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: 'text'
            };
            setMessages(prev => [...prev, customerResponse]);
          }, 2000);
        }, 500);
      }
    }
  };

  const handleQuickResponse = (response: string) => {
    setMessage(response);
    toast({
      title: "Quick response selected",
      description: "Message has been added to your input field.",
    });
  };

  const handleCannedResponseSelect = (response: CannedResponse) => {
    setMessage(response.message);
    setShowCannedResponses(false);
    toast({
      title: "Canned response selected",
      description: "Response has been added to your input field.",
    });
  };

  const handleFileUpload = () => {
    const fileMessage: Message = {
      id: messages.length + 1,
      sender: 'agent',
      message: "File uploaded: troubleshooting_guide.pdf",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'file',
      fileName: 'troubleshooting_guide.pdf'
    };
    setMessages([...messages, fileMessage]);
    toast({
      title: "File uploaded",
      description: "Document has been shared with the customer.",
    });
  };

  const handleImageUpload = () => {
    const imageMessage: Message = {
      id: messages.length + 1,
      sender: 'agent',
      message: "Image shared: product_screenshot.png",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'image',
      fileName: 'product_screenshot.png'
    };
    setMessages([...messages, imageMessage]);
    toast({
      title: "Image uploaded",
      description: "Screenshot has been shared with the customer.",
    });
  };

  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 z-10">
        <ChatHeader customerName={customerName} customerStatus={customerStatus} />
      </div>
      
      {/* Scrollable Messages Area - with bottom padding for floating input */}
      <div className="flex-1 relative">
        {/* Messages container with its own scroll and padding for floating input */}
        <div className="absolute inset-0 overflow-y-auto" style={{ paddingBottom: '180px' }}>
          <MessageList 
            messages={messages} 
            privateNotes={privateNotes}
            isTyping={isTyping}
            onDeleteNote={handleDeleteNote}
            canDeleteNote={canDeleteNote}
          />
        </div>

        {/* Fixed Floating Input Section - positioned absolutely within the chat interface */}
        <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-auto">
          {/* Canned Responses Panel - appears above input when open */}
          {showCannedResponses && (
            <div className="mb-4 h-96 border border-slate-200 bg-white shadow-lg rounded-lg">
              <CannedResponses 
                onSelectResponse={handleCannedResponseSelect}
                isSelectionMode={true}
              />
            </div>
          )}

          {/* Message Input Container */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-lg">
            {/* Canned Responses Toggle */}
            <div className="px-6 py-2 border-b border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCannedResponses(!showCannedResponses)}
                className="w-full flex items-center justify-between text-sm hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Canned Responses
                </span>
                {showCannedResponses ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>

            <MessageInputArea
              message={message}
              setMessage={setMessage}
              isPrivateNoteMode={isPrivateNoteMode}
              setIsPrivateNoteMode={setIsPrivateNoteMode}
              onSendMessage={handleSendMessage}
              onFileUpload={handleFileUpload}
              onImageUpload={handleImageUpload}
            />
          </div>
        </div>

        {/* Quick Responses - Fixed position within chat interface */}
        <div className="absolute bottom-6 right-6 z-50">
          <QuickResponses responses={quickResponses} onResponseSelect={handleQuickResponse} />
        </div>
      </div>
    </div>
  );
};
