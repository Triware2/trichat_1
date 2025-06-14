
import { useRef, useEffect } from 'react';
import { File, Image } from 'lucide-react';

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
            ) : msg.type === 'image' ? (
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4" />
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
  );
};
