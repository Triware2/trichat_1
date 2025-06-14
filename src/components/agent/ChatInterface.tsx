
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreHorizontal,
  Image,
  File
} from 'lucide-react';

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

export const ChatInterface = ({ customerName, customerStatus, onSendMessage }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const fileMessage: Message = {
      id: messages.length + 1,
      sender: 'agent',
      message: "File uploaded: troubleshooting_guide.pdf",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'file',
      fileName: 'troubleshooting_guide.pdf'
    };
    setMessages([...messages, fileMessage]);
  };

  return (
    <Card className="h-full flex flex-col">
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
            <Button variant="ghost" size="sm" title="Voice Call">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Video Call">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="More Options">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'agent' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-900'
              }`}>
                {msg.type === 'file' ? (
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4" />
                    <span className="text-sm">{msg.fileName}</span>
                  </div>
                ) : (
                  <p className="text-sm">{msg.message}</p>
                )}
                <p className={`text-xs mt-1 ${
                  msg.sender === 'agent' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Responses */}
        <div className="px-4 py-2 border-t bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Quick Responses:</p>
          <div className="flex flex-wrap gap-1">
            {quickResponses.slice(0, 4).map((response, index) => (
              <Button 
                key={index}
                variant="outline" 
                size="sm"
                onClick={() => handleQuickResponse(response)}
                className="text-xs h-6 px-2"
              >
                {response.length > 20 ? `${response.substring(0, 20)}...` : response}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleFileUpload} title="Attach File">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Add Image">
              <Image className="w-4 h-4" />
            </Button>
            <Input 
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button variant="ghost" size="sm" title="Add Emoji">
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
  );
};
