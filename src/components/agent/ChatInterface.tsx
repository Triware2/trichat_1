import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreHorizontal,
  Image,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CannedResponses } from './CannedResponses';
import { MessageList } from './MessageList';
import { QuickResponses } from './QuickResponses';

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
  onSendMessage: (message: string) => void;
}

interface CannedResponse {
  id: number;
  title: string;
  message: string;
  category: string;
  createdAt: string;
}

export const ChatInterface = ({ customerName, customerStatus, onSendMessage }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCannedResponses, setShowCannedResponses] = useState(false);
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([
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
    },
    {
      id: 4,
      sender: "agent",
      message: "I can see your order here. It looks like there was a delay in shipping. Let me check the tracking information for you.",
      time: "10:33 AM",
      type: "text"
    },
    {
      id: 5,
      sender: "customer",
      message: "Thank you, I appreciate your help",
      time: "10:34 AM",
      type: "text"
    }
  ]);

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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  const handleVoiceCall = () => {
    toast({
      title: "Voice call initiated",
      description: `Starting voice call with ${customerName}...`,
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "Video call initiated",
      description: `Starting video call with ${customerName}...`,
    });
  };

  const handleMoreOptions = () => {
    toast({
      title: "More options",
      description: "Additional options menu opened.",
    });
  };

  const handleEmojiPicker = () => {
    toast({
      title: "Emoji picker",
      description: "Emoji picker opened.",
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white font-medium">
                {customerName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{customerName}</h3>
              <p className="text-sm text-emerald-600 font-medium">{customerStatus}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleVoiceCall} className="h-9 w-9 p-0 hover:bg-slate-100">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleVideoCall} className="h-9 w-9 p-0 hover:bg-slate-100">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleMoreOptions} className="h-9 w-9 p-0 hover:bg-slate-100">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 flex flex-col min-h-0">
        <MessageList messages={messages} isTyping={isTyping} />

        <QuickResponses responses={quickResponses} onResponseSelect={handleQuickResponse} />

        {/* Canned Responses Toggle */}
        <div className="px-6 py-2 border-t border-slate-200 bg-white">
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

        {/* Message Input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={handleFileUpload} className="h-9 w-9 p-0 hover:bg-slate-100">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleImageUpload} className="h-9 w-9 p-0 hover:bg-slate-100">
              <Image className="w-4 h-4" />
            </Button>
            <Input 
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border-slate-200 focus:border-orange-300 focus:ring-orange-200"
            />
            <Button variant="ghost" size="sm" onClick={handleEmojiPicker} className="h-9 w-9 p-0 hover:bg-slate-100">
              <Smile className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white h-9 px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {showCannedResponses && (
        <div className="h-96 border-t border-slate-200">
          <CannedResponses 
            onSelectResponse={handleCannedResponseSelect}
            isSelectionMode={true}
          />
        </div>
      )}
    </div>
  );
};
