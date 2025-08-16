
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  User, 
  Bot, 
  AlertTriangle, 
  Clock,
  MessageSquare
} from 'lucide-react';
import { ChatMessage, BotResponse, BotSession } from '../admin/chatbot/types';

interface BotChatInterfaceProps {
  onEscalateToAgent: (chatHistory: ChatMessage[], escalationReason: string) => void;
  customerId: string;
}

export const BotChatInterface = ({ onEscalateToAgent, customerId }: BotChatInterfaceProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botSession, setBotSession] = useState<BotSession>({
    session_id: Date.now().toString(),
    customer_id: customerId,
    bot_attempts: 0,
    escalated: false,
    started_at: new Date().toISOString()
  });

  // Bot configuration (in real app, this would come from API)
  const botConfig = {
    welcome_message: "Hello! I'm here to help you with your questions. How can I assist you today?",
    fallback_message: "I'm sorry, I didn't quite understand that. Let me connect you with one of our agents who can help you better.",
    escalation_threshold: 0.6,
    max_bot_attempts: 3,
    auto_escalate_keywords: ['agent', 'human', 'representative', 'escalate', 'manager']
  };

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 1,
      sender: 'bot',
      message: botConfig.welcome_message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      confidence: 1.0
    };
    setMessages([welcomeMessage]);
  }, []);

  // Mock bot response function (in real app, this would call your ML API)
  const getBotResponse = async (userMessage: string): Promise<BotResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerMessage = userMessage.toLowerCase();

    // Check for escalation keywords
    const hasEscalationKeyword = botConfig.auto_escalate_keywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (hasEscalationKeyword) {
      return {
        id: Date.now().toString(),
        message: "I'll connect you with one of our agents right away.",
        confidence: 0.0,
        intent: 'escalate_to_agent'
      };
    }

    // Mock responses based on keywords
    if (lowerMessage.includes('order') || lowerMessage.includes('track')) {
      return {
        id: Date.now().toString(),
        message: "I can help you track your order. Could you please provide your order number?",
        confidence: 0.9,
        intent: 'order_tracking'
      };
    }

    if (lowerMessage.includes('refund') || lowerMessage.includes('return')) {
      return {
        id: Date.now().toString(),
        message: "I understand you'd like information about returns and refunds. Our return policy allows returns within 30 days. Would you like me to help you start a return?",
        confidence: 0.85,
        intent: 'refund_inquiry'
      };
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return {
        id: Date.now().toString(),
        message: "Hello! How can I help you today?",
        confidence: 0.95,
        intent: 'greeting'
      };
    }

    // Low confidence response
    return {
      id: Date.now().toString(),
      message: "I'm not sure I understand completely. Could you please rephrase your question or try asking about orders, refunds, or general support?",
      confidence: 0.3,
      intent: 'unknown'
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      sender: 'customer',
      message: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Update bot session
    const updatedSession = {
      ...botSession,
      bot_attempts: botSession.bot_attempts + 1
    };
    setBotSession(updatedSession);

    try {
      const botResponse = await getBotResponse(inputMessage.trim());

      // Check if escalation is needed
      const shouldEscalate = 
        botResponse.confidence < botConfig.escalation_threshold ||
        updatedSession.bot_attempts >= botConfig.max_bot_attempts ||
        botResponse.intent === 'escalate_to_agent';

      if (shouldEscalate) {
        const escalationMessage: ChatMessage = {
          id: messages.length + 2,
          sender: 'bot',
          message: botConfig.fallback_message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'escalation',
          escalation_reason: botResponse.intent === 'escalate_to_agent' ? 'manual' : 
                            updatedSession.bot_attempts >= botConfig.max_bot_attempts ? 'max_attempts' : 'confidence_low'
        };

        setMessages(prev => [...prev, escalationMessage]);
        setIsTyping(false);

        // Escalate to agent after a short delay
        setTimeout(() => {
          const finalMessages = [...messages, userMessage, escalationMessage];
          onEscalateToAgent(finalMessages, escalationMessage.escalation_reason || 'manual');
        }, 2000);

        return;
      }

      // Add bot response
      const botMessage: ChatMessage = {
        id: messages.length + 2,
        sender: 'bot',
        message: botResponse.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        confidence: botResponse.confidence,
        intent: botResponse.intent,
        bot_response_id: botResponse.id
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get bot response. Connecting you to an agent.",
        variant: "destructive"
      });

      onEscalateToAgent([...messages, userMessage], 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleEscalateManually = () => {
    const escalationMessage: ChatMessage = {
      id: messages.length + 1,
      sender: 'bot',
      message: "I'll connect you with one of our agents right away. Please wait a moment.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'escalation',
      escalation_reason: 'manual'
    };

    setMessages(prev => [...prev, escalationMessage]);
    onEscalateToAgent([...messages, escalationMessage], 'manual');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          Customer Support Bot
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              Attempt {botSession.bot_attempts}/3
            </div>
            <Button variant="outline" size="sm" onClick={handleEscalateManually}>
              <User className="w-3 h-3 mr-1" />
              Talk to Agent
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md flex gap-2 ${message.sender === 'customer' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'customer' 
                    ? 'bg-blue-500 text-white' 
                    : message.sender === 'bot'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-green-500 text-white'
                }`}>
                  {message.sender === 'customer' && <User className="w-4 h-4" />}
                  {message.sender === 'bot' && <Bot className="w-4 h-4" />}
                  {message.sender === 'agent' && <MessageSquare className="w-4 h-4" />}
                </div>
                
                <div className={`px-4 py-3 rounded-2xl ${
                  message.sender === 'customer'
                    ? 'bg-blue-500 text-white'
                    : message.type === 'escalation'
                    ? 'bg-orange-100 text-orange-800 border border-orange-200'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.message}</p>
                  
                  {message.type === 'escalation' && (
                    <div className="flex items-center gap-1 mt-2 text-xs">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Escalating to agent...</span>
                    </div>
                  )}
                  
                  {message.confidence !== undefined && message.confidence < 0.7 && message.sender === 'bot' && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Low confidence: {Math.round(message.confidence * 100)}%</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`text-xs text-gray-500 mt-1 ${message.sender === 'customer' ? 'text-right' : 'text-left'}`}>
                {message.time}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};
