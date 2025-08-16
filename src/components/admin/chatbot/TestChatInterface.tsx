
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { chatbotService, Chatbot, ChatbotConversation, ChatbotMessage } from '@/services/chatbotService';
import { 
  Send, 
  Bot, 
  User, 
  Settings,
  RefreshCw,
  MessageSquare,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TestChatInterfaceProps {
  selectedBotId?: string | null;
}

export const TestChatInterface = ({ selectedBotId }: TestChatInterfaceProps) => {
  const { toast } = useToast();
  const [activeBot, setActiveBot] = useState('');
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<ChatbotConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatbotConversation | null>(null);
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chatbots and conversations
  useEffect(() => {
    loadChatbots();
  }, []);

  useEffect(() => {
    if (activeBot) {
      loadConversations(activeBot);
    }
  }, [activeBot]);

  // Update activeBot when selectedBotId changes
  useEffect(() => {
    if (selectedBotId) {
      setActiveBot(selectedBotId);
    }
  }, [selectedBotId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatbots = async () => {
    try {
      setLoading(true);
      const data = await chatbotService.getChatbots();
      setChatbots(data);
    } catch (error) {
      console.error('Error loading chatbots:', error);
      toast({
        title: "Error",
        description: "Failed to load chatbots. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async (chatbotId: string) => {
    try {
      const data = await chatbotService.getChatbotConversations(chatbotId);
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await chatbotService.getChatbotMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive"
      });
    }
  };

  const startNewConversation = async () => {
    if (!activeBot) return;

    try {
      console.log('Creating conversation for bot:', activeBot);
      
      const conversation: Omit<ChatbotConversation, 'id' | 'started_at'> = {
        chatbot_id: activeBot,
        customer_id: 'test-user', // For testing purposes
        session_id: `test-session-${Date.now()}`,
        status: 'active'
      };

      console.log('Conversation data:', conversation);

      const newConversation = await chatbotService.createChatbotConversation(conversation);
      console.log('New conversation result:', newConversation);
      
      if (newConversation) {
        setConversations([newConversation, ...conversations]);
        setCurrentConversation(newConversation);
        setMessages([]);
        toast({
          title: "Success",
          description: "New conversation created successfully!",
        });
      } else {
        throw new Error('Failed to create conversation - no data returned');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create new conversation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !currentConversation || sending) return;

    const userMessage = message.trim();
    setMessage('');
    setSending(true);

    try {
      // Add user message
      const userMsg: Omit<ChatbotMessage, 'id'> = {
        conversation_id: currentConversation.id,
        sender_type: 'customer',
        content: userMessage,
        message_type: 'text'
      };

      const sentUserMsg = await chatbotService.createChatbotMessage(userMsg);
      if (sentUserMsg) {
        setMessages(prev => [...prev, sentUserMsg]);
      }

      // Simulate bot response (in real implementation, this would call the AI service)
      setTimeout(async () => {
        // Generate more realistic bot response based on message content
        let botResponse = '';
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
          botResponse = "Hello! How can I help you today? I'm here to assist with any questions you might have.";
        } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
          botResponse = "I'd be happy to help! What specific issue are you experiencing? Please provide more details so I can assist you better.";
        } else if (lowerMessage.includes('order') || lowerMessage.includes('purchase')) {
          botResponse = "I can help you with order-related questions. Could you please provide your order number or tell me what you'd like to know about your order?";
        } else if (lowerMessage.includes('refund') || lowerMessage.includes('return')) {
          botResponse = "I understand you're asking about refunds or returns. Our standard return policy allows returns within 30 days of purchase. Would you like me to help you start a return process?";
        } else if (lowerMessage.includes('thank')) {
          botResponse = "You're welcome! Is there anything else I can help you with today?";
        } else {
          botResponse = `I understand you're asking about "${userMessage}". Let me help you with that. Could you please provide more specific details so I can give you the most accurate assistance?`;
        }
        
        const botMsg: Omit<ChatbotMessage, 'id'> = {
          conversation_id: currentConversation.id,
          sender_type: 'bot',
          content: botResponse,
          message_type: 'text'
        };

        const sentBotMsg = await chatbotService.createChatbotMessage(botMsg);
        if (sentBotMsg) {
          setMessages(prev => [...prev, sentBotMsg]);
        }
        setSending(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'resolved':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'escalated':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/30 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-64 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-96 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Test Chat Interface</h2>
            <p className="text-slate-600 mt-1">Test and validate your chatbot's responses</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={activeBot} onValueChange={setActiveBot}>
              <SelectTrigger className="w-64 border-blue-200 focus:border-blue-400 focus:ring-blue-200">
                <SelectValue placeholder="Select a chatbot to test" />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-200 shadow-xl">
                {chatbots.map(bot => (
                  <SelectItem key={bot.id} value={bot.id}>
                    <div className="flex items-center gap-3">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{bot.name}</span>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {bot.type}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={startNewConversation}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!activeBot}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              New Conversation
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-blue-100/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Conversations</CardTitle>
                  <p className="text-blue-600 font-medium mt-1">Test conversation history</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {conversations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <MessageSquare className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No conversations yet</p>
                    <p className="text-gray-400 text-xs">Start a new conversation to begin testing</p>
                  </div>
                ) : (
                  conversations.map(conversation => (
                    <div
                      key={conversation.id}
                      onClick={() => {
                        setCurrentConversation(conversation);
                        loadMessages(conversation.id);
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-md ${
                        currentConversation?.id === conversation.id
                          ? 'bg-blue-50 border-blue-200 shadow-md'
                          : 'bg-white border-gray-200 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                          {conversation.session_id || `Conversation ${conversation.id.slice(0, 8)}`}
                        </h3>
                        <Badge className={`text-xs ${getStatusColor(conversation.status)}`}>
                          {conversation.status || 'active'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {conversation.started_at 
                            ? new Date(conversation.started_at).toLocaleDateString()
                            : 'Unknown'
                          }
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-[600px] flex flex-col">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-blue-100/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-md">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {currentConversation ? (currentConversation.session_id || 'Chat Interface') : 'Chat Interface'}
                      </CardTitle>
                      <p className="text-emerald-600 font-medium mt-1">
                        {currentConversation ? 'Active conversation' : 'Select a conversation to start'}
                      </p>
                    </div>
                  </div>
                  {currentConversation && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {currentConversation ? (
                  <>
                    {/* Messages Area */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <MessageSquare className="w-10 h-10 text-blue-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-slate-900 mb-2">Start the Conversation</h3>
                          <p className="text-slate-600">Send your first message to test the chatbot</p>
                        </div>
                      ) : (
                        messages.map(msg => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender_type === 'customer' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md p-4 rounded-2xl ${
                                msg.sender_type === 'customer'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {msg.sender_type === 'customer' ? (
                                  <User className="w-4 h-4" />
                                ) : (
                                  <Bot className="w-4 h-4" />
                                )}
                                <span className="text-xs font-medium">
                                  {msg.sender_type === 'customer' ? 'You' : 'Bot'}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                              <div className="text-xs opacity-70 mt-2">
                                {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : 'Unknown'}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      {sending && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md p-4 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="w-4 h-4" />
                              <span className="text-xs font-medium">Bot</span>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            </div>
                            <p className="text-sm text-gray-500">Typing...</p>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 p-6">
                      <div className="flex gap-3">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="flex-1 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                          disabled={sending}
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!message.trim() || sending}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <MessageSquare className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">No Conversation Selected</h3>
                      <p className="text-slate-600">Choose a conversation from the list or start a new one</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
