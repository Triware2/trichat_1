
import { useRef, useEffect } from 'react';
import { File, Image, Clock, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: number;
  sender: 'agent' | 'customer';
  message: string;
  time: string;
  type: 'text' | 'image' | 'file';
  fileName?: string;
}

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export const MessageList = ({ messages, isTyping }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs lg:max-w-md ${msg.sender === 'agent' ? 'order-2' : 'order-1'}`}>
            {msg.sender === 'customer' && (
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  JS
                </div>
                <span className="ml-2 text-xs text-slate-600">John Smith</span>
              </div>
            )}
            
            <div className={`px-4 py-3 rounded-2xl shadow-sm ${
              msg.sender === 'agent' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-slate-900 border border-slate-200'
            }`}>
              {msg.type === 'file' ? (
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    msg.sender === 'agent' ? 'bg-orange-600' : 'bg-slate-100'
                  }`}>
                    <File className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate">{msg.fileName}</span>
                </div>
              ) : msg.type === 'image' ? (
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    msg.sender === 'agent' ? 'bg-orange-600' : 'bg-slate-100'
                  }`}>
                    <Image className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate">{msg.fileName}</span>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{msg.message}</p>
              )}
            </div>
            
            <div className={`flex items-center gap-2 mt-2 text-xs text-slate-500 ${
              msg.sender === 'agent' ? 'justify-end' : 'justify-start'
            }`}>
              <Clock className="w-3 h-3" />
              <span>{msg.time}</span>
              {msg.sender === 'agent' && (
                <CheckCheck className="w-3 h-3 text-slate-400" />
              )}
            </div>
          </div>
        </div>
      ))}
      
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-2xl shadow-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
