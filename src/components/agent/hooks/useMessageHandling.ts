import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/components/admin/chatbot/types';

interface CannedResponse {
  id: number;
  title: string;
  message: string;
  category: string;
  createdAt: string;
}

interface MediaAttachment {
  type: 'image' | 'audio' | 'video' | 'file';
  name: string;
  url?: string;
}

export const useMessageHandling = (
  messages: ChatMessage[],
  setMessages: (messages: ChatMessage[]) => void,
  onSendMessage: (message: string) => void,
  addNote: (note: string, attachments?: MediaAttachment[]) => void,
  botConversationHistory?: ChatMessage[]
) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPrivateNoteMode, setIsPrivateNoteMode] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (message.trim() || isPrivateNoteMode) {
      if (isPrivateNoteMode) {
        // Get attachments from the global reference (set by MessageInputArea)
        const attachments = (window as any).currentMediaAttachments || [];
        
        // Add as private note with optional attachments
        addNote(message.trim(), attachments);
        setMessage('');
        setIsPrivateNoteMode(false);
        
        // Clear the global attachments reference
        (window as any).currentMediaAttachments = [];
      } else {
        // Send as regular message
        const newMessage: ChatMessage = {
          id: messages.length + 1,
          sender: 'agent',
          message: message.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        };
        
        setMessages([...messages, newMessage]);
        onSendMessage(message.trim());
        setMessage('');

        // Simulate customer response
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            const customerResponse: ChatMessage = {
              id: messages.length + 2,
              sender: 'customer',
              message: "Thank you for the quick response!",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: 'text'
            };
            setMessages([...messages, newMessage, customerResponse]);
          }, 2000);
        }, 500);
      }
    }
  };

  const handleQuickResponse = (response: string) => {
    setMessage(response);
  };

  const handleCannedResponseSelect = (responseText: string) => {
    setMessage(responseText);
  };

  const handleFileUpload = () => {
    const fileMessage: ChatMessage = {
      id: messages.length + 1,
      sender: 'agent',
      message: "File uploaded: troubleshooting_guide.pdf",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'file',
      fileName: 'troubleshooting_guide.pdf'
    };
    setMessages([...messages, fileMessage]);
  };

  const handleImageUpload = () => {
    const imageMessage: ChatMessage = {
      id: messages.length + 1,
      sender: 'agent',
      message: "Image shared: product_screenshot.png",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'image',
      fileName: 'product_screenshot.png'
    };
    setMessages([...messages, imageMessage]);
  };

  return {
    message,
    setMessage,
    isTyping,
    isPrivateNoteMode,
    setIsPrivateNoteMode,
    handleSendMessage,
    handleQuickResponse,
    handleCannedResponseSelect,
    handleFileUpload,
    handleImageUpload,
    botConversationHistory
  };
};
