
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Send, 
  Bot, 
  User, 
  TestTube,
  RotateCcw,
  Download,
  Settings,
  Brain,
  Zap
} from 'lucide-react';
import { ChatMessage } from './types';

export const TestChatInterface = () => {
  const [selectedBot, setSelectedBot] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const availableBots = [
    { id: '1', name: 'Customer Support Bot', type: 'llm', model: 'GPT-4' },
    { id: '2', name: 'FAQ Assistant', type: 'standard', model: 'Rule-based' },
    { id: '3', name: 'Technical Support AI', type: 'llm', model: 'Claude-3' }
  ];

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedBot) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'customer',
      message: newMessage,
      time: new Date().toLocaleTimeString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const bot = availableBots.find(b => b.id === selectedBot);
      const isLLMBot = bot?.type === 'llm';
      
      const botResponse: ChatMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        message: isLLMBot 
          ? `I understand you're asking about "${newMessage}". Based on our SOPs, here's what I can help you with. This response is generated using ${bot?.model} with high confidence.`
          : `Thank you for your message. I found this information in our FAQ database that might help answer your question about "${newMessage}".`,
        time: new Date().toLocaleTimeString(),
        type: 'text',
        confidence: isLLMBot ? Math.random() * 0.3 + 0.7 : undefined,
        intent: isLLMBot ? 'support_inquiry' : undefined
      };

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleExportChat = () => {
    const chatData = {
      bot: availableBots.find(b => b.id === selectedBot),
      messages: messages,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-test-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Test Chat Interface</h2>
          <p className="text-gray-600 mt-1">Simulate customer interactions to test your chatbots</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClearChat} disabled={messages.length === 0}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
          <Button variant="outline" onClick={handleExportChat} disabled={messages.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bot Selection & Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Test Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Chatbot
                </label>
                <Select value={selectedBot} onValueChange={setSelectedBot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a bot to test" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBots.map((bot) => (
                      <SelectItem key={bot.id} value={bot.id}>
                        <div className="flex items-center gap-2">
                          {bot.type === 'llm' ? (
                            <Brain className="w-4 h-4 text-purple-600" />
                          ) : (
                            <Bot className="w-4 h-4 text-blue-600" />
                          )}
                          <span>{bot.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {bot.model}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBot && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TestTube className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Test Mode Active</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Testing {availableBots.find(b => b.id === selectedBot)?.name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Test Scenarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "I need help with my account",
                "How do I reset my password?",
                "I'm having trouble with billing",
                "Can you help me troubleshoot a technical issue?",
                "I want to cancel my subscription"
              ].map((scenario, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-2"
                  onClick={() => setNewMessage(scenario)}
                  disabled={!selectedBot}
                >
                  <span className="text-xs">{scenario}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Chat Simulation</CardTitle>
                {selectedBot && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {availableBots.find(b => b.id === selectedBot)?.type === 'llm' ? 'AI Powered' : 'Rule-based'}
                    </Badge>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p>Select a chatbot and start testing!</p>
                    <p className="text-sm mt-1">Send a message to see how your bot responds</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'customer'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === 'customer' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                          <span className="text-xs opacity-75">{message.time}</span>
                          {message.sender === 'bot' && message.confidence && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                message.confidence > 0.8 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}
                            >
                              {Math.round(message.confidence * 100)}% confidence
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{message.message}</p>
                        {message.intent && (
                          <div className="mt-2 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            <span className="text-xs opacity-75">Intent: {message.intent}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
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
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={selectedBot ? "Type your test message..." : "Select a bot first..."}
                    disabled={!selectedBot || isLoading}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!selectedBot || !newMessage.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
