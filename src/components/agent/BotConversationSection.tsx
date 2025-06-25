import { Bot, User, AlertTriangle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatMessage } from '@/components/admin/chatbot/types';

interface BotConversationSectionProps {
  botConversationHistory: ChatMessage[];
}

export const BotConversationSection = ({ botConversationHistory }: BotConversationSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!botConversationHistory || botConversationHistory.length === 0) {
    return (
      <div className="mb-4 rounded-2xl shadow-md border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100/60 flex flex-col items-center justify-center py-10">
        <MessageSquare className="w-10 h-10 text-blue-200 mb-2" />
        <span className="text-base font-semibold text-blue-900 mb-1">No bot conversation history</span>
        <span className="text-sm text-blue-700">This chat did not have any bot interaction before escalation.</span>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-2xl shadow-md border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
      <div className="px-6 pt-5 pb-3 border-b border-blue-100 rounded-t-2xl bg-blue-50/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5 text-blue-500" />
          <span className="text-base font-semibold text-blue-900">Bot Conversation History</span>
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs font-semibold">
            {botConversationHistory.length} messages
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 rounded-full border border-blue-100 shadow-sm"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>
      <div className="px-6 pt-2 pb-1">
        <p className="text-xs text-blue-600 font-medium">Customer was escalated from bot to agent</p>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="space-y-4 max-h-64 overflow-y-auto rounded-xl bg-white/70 border border-blue-100 p-4">
            {botConversationHistory.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] flex gap-3 ${message.sender === 'customer' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                    message.sender === 'customer' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-200 text-blue-700'
                  }`}>
                    {message.sender === 'customer' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col">
                    <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                      message.sender === 'customer'
                        ? 'bg-blue-600 text-white rounded-br-2xl'
                        : message.type === 'escalation'
                        ? 'bg-orange-50 text-orange-800 border border-orange-200'
                        : 'bg-blue-50 text-blue-900 border border-blue-100'
                    }`}>
                      <p>{message.message}</p>
                      {message.type === 'escalation' && (
                        <div className="flex items-center gap-1 mt-1 text-xs">
                          <AlertTriangle className="w-3 h-3 text-orange-500" />
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
                    <div className={`text-xs text-gray-400 mt-1 ${message.sender === 'customer' ? 'text-right' : 'text-left'}`}>
                      {message.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
