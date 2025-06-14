

import { useRef, useEffect } from 'react';
import { File, Image, Clock } from 'lucide-react';

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
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6 h-full min-h-0 bg-slate-50">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[85%] sm:max-w-sm lg:max-w-md ${
            msg.sender === 'agent' 
              ? 'order-2' 
              : 'order-1'
          }`}>
            <div className={`px-4 lg:px-5 py-3 lg:py-4 rounded-2xl shadow-md ${
              msg.sender === 'agent' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-4' 
                : 'bg-white text-slate-900 border border-slate-200 mr-4'
            }`}>
              {msg.type === 'file' ? (
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    msg.sender === 'agent' ? 'bg-blue-500' : 'bg-slate-100'
                  }`}>
                    <File className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate">{msg.fileName}</span>
                </div>
              ) : msg.type === 'image' ? (
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    msg.sender === 'agent' ? 'bg-blue-500' : 'bg-slate-100'
                  }`}>
                    <Image className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate">{msg.fileName}</span>
                </div>
              ) : (
                <p className="text-sm lg:text-base leading-relaxed break-words">{msg.message}</p>
              )}
            </div>
            <div className={`flex items-center gap-1 mt-2 text-xs text-slate-500 ${
              msg.sender === 'agent' ? 'justify-end mr-2' : 'justify-start ml-2'
            }`}>
              <Clock className="w-3 h-3" />
              <span>{msg.time}</span>
            </div>
          </div>
        </div>
      ))}
      
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-2xl shadow-md mr-4">
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

