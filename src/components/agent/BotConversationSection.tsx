
import { Bot, User, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatMessage } from '@/components/admin/chatbot/types';

interface BotConversationSectionProps {
  botConversationHistory: ChatMessage[];
}

export const BotConversationSection = ({ botConversationHistory }: BotConversationSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!botConversationHistory || botConversationHistory.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Bot Conversation History
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
              {botConversationHistory.length} messages
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          Customer was escalated from bot to agent
        </p>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {botConversationHistory.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] flex gap-2 ${message.sender === 'customer' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'customer' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-400 text-white'
                  }`}>
                    {message.sender === 'customer' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </div>
                  
                  <div className="flex flex-col">
                    <div className={`px-3 py-2 rounded-lg text-sm ${
                      message.sender === 'customer'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'escalation'
                        ? 'bg-orange-100 text-orange-800 border border-orange-200'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      <p>{message.message}</p>
                      
                      {message.type === 'escalation' && (
                        <div className="flex items-center gap-1 mt-1 text-xs">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Escalated to agent</span>
                        </div>
                      )}
                      
                      {message.confidence !== undefined && message.confidence < 0.7 && message.sender === 'bot' && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low confidence: {Math.round(message.confidence * 100)}%</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={`text-xs text-gray-500 mt-1 ${message.sender === 'customer' ? 'text-right' : 'text-left'}`}>
                      {message.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
