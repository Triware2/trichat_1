
import { useRef, useEffect } from 'react';
import { File, Image, Video, Clock, Check, CheckCheck, StickyNote, X, Paperclip, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/components/admin/chatbot/types';

interface PrivateNote {
  id: number;
  content: string;
  author: string;
  timestamp: string;
  chatId: number;
  type: 'private-note';
  attachments?: {
    type: 'image' | 'file' | 'media';
    name: string;
    url?: string;
  }[];
}

interface MessageListProps {
  messages: ChatMessage[];
  privateNotes?: PrivateNote[];
  isTyping: boolean;
  onDeleteNote?: (noteId: number, noteAuthor: string) => void;
  canDeleteNote?: (noteAuthor: string) => boolean;
  botConversationHistory?: ChatMessage[];
}

export const MessageList = ({ 
  messages, 
  privateNotes = [], 
  isTyping, 
  onDeleteNote,
  canDeleteNote,
  botConversationHistory = []
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, privateNotes]);

  // Combine current messages and notes, sort by time
  const allItems = [
    // Add current messages
    ...messages.map(msg => ({ ...msg, itemType: 'message' as const })),
    // Add private notes
    ...privateNotes.map(note => ({ 
      ...note, 
      itemType: 'private-note' as const,
      message: note.content,
      time: note.timestamp,
      sender: 'system' as const
    }))
  ].sort((a, b) => {
    // Simple time-based sorting - in a real app you'd use proper timestamps
    return a.id - b.id;
  });

  const renderMessage = (item: any) => {
    // Handle private notes
    if (item.itemType === 'private-note') {
      return (
        <div key={`note-${item.id}`} className="flex justify-center">
          <div className="max-w-xs lg:max-w-md bg-amber-100 border-l-4 border-amber-500 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-800">Private Note</span>
                <span className="text-xs text-amber-600">• {item.author}</span>
              </div>
              {canDeleteNote && onDeleteNote && canDeleteNote(item.author) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteNote(item.id, item.author)}
                  className="h-6 w-6 p-0 text-amber-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            {item.message && (
              <p className="text-sm text-amber-900 leading-relaxed mb-2">{item.message}</p>
            )}

            {item.attachments && item.attachments.length > 0 && (
              <div className="space-y-2 mb-2">
                {item.attachments.map((attachment: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 bg-amber-50 rounded p-2 border border-amber-200">
                    {attachment.type === 'image' && <Image className="w-4 h-4 text-amber-600" />}
                    {attachment.type === 'media' && <Video className="w-4 h-4 text-amber-600" />}
                    {attachment.type === 'file' && <Paperclip className="w-4 h-4 text-amber-600" />}
                    <span className="text-xs text-amber-800 font-medium">{attachment.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mt-2 text-xs text-amber-600">
              <Clock className="w-3 h-3" />
              <span>{item.time}</span>
            </div>
          </div>
        </div>
      );
    }

    // Handle regular messages
    const msg = item as ChatMessage & { itemType: 'message' };
    return (
      <div key={`msg-${msg.id}`} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs lg:max-w-md ${msg.sender === 'agent' ? 'order-2' : 'order-1'}`}>
          {msg.sender === 'customer' && (
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                <User className="w-3 h-3" />
              </div>
              <span className="ml-2 text-xs text-slate-600">Customer</span>
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
    );
  };

  return (
    <div className="p-6 space-y-4 bg-slate-50">
      {allItems.map(renderMessage)}
      
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
