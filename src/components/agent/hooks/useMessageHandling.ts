
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  sender: 'agent' | 'customer';
  message: string;
  time: string;
  type: 'text' | 'image' | 'file';
  fileName?: string;
}

interface CannedResponse {
  id: number;
  title: string;
  message: string;
  category: string;
  createdAt: string;
}

export const useMessageHandling = (
  messages: Message[],
  setMessages: (messages: Message[]) => void,
  onSendMessage: (message: string) => void,
  addNote: (note: string) => void
) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPrivateNoteMode, setIsPrivateNoteMode] = useState(false);
  const { toast } = useToast();

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
    handleImageUpload
  };
};
