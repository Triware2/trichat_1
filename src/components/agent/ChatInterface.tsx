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

      // Simulate customer typing response
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
    <div className="h-full flex flex-col gap-4">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                {customerName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{customerName}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-500">{customerStatus}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" title="Voice Call" onClick={handleVoiceCall}>
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Video Call" onClick={handleVideoCall}>
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" title="More Options" onClick={handleMoreOptions}>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col">
          <MessageList messages={messages} isTyping={isTyping} />

          <QuickResponses responses={quickResponses} onResponseSelect={handleQuickResponse} />

          <div className="px-4 py-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCannedResponses(!showCannedResponses)}
              className="w-full flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Canned Responses
              </span>
              {showCannedResponses ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleFileUpload} title="Attach File">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Add Image" onClick={handleImageUpload}>
                <Image className="w-4 h-4" />
              </Button>
              <Input 
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button variant="ghost" size="sm" title="Add Emoji" onClick={handleEmojiPicker}>
                <Smile className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showCannedResponses && (
        <Card className="h-96">
          <CannedResponses 
            onSelectResponse={handleCannedResponseSelect}
            isSelectionMode={true}
          />
        </Card>
      )}
    </div>
  );
};
