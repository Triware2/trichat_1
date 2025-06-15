
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
        <div key={`note-${item.id}`} className="flex justify-center mb-6">
          <div className="max-w-md bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <StickyNote className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-amber-800">Private Note</span>
                <span className="text-xs text-amber-600">• {item.author}</span>
              </div>
              {canDeleteNote && onDeleteNote && canDeleteNote(item.author) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteNote(item.id, item.author)}
                  className="h-6 w-6 p-0 text-amber-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            {item.message && (
              <p className="text-sm text-amber-900 leading-relaxed mb-3">{item.message}</p>
            )}

            {item.attachments && item.attachments.length > 0 && (
              <div className="space-y-2 mb-3">
                {item.attachments.map((attachment: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 bg-amber-50 rounded-lg p-2 border border-amber-200">
                    {attachment.type === 'image' && <Image className="w-4 h-4 text-amber-600" />}
                    {attachment.type === 'media' && <Video className="w-4 h-4 text-amber-600" />}
                    {attachment.type === 'file' && <Paperclip className="w-4 h-4 text-amber-600" />}
                    <span className="text-xs text-amber-800 font-medium">{attachment.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-amber-600">
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
      <div key={`msg-${msg.id}`} className={`flex mb-6 ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-sm lg:max-w-md ${msg.sender === 'agent' ? 'order-2' : 'order-1'}`}>
          {msg.sender === 'customer' && (
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
                <User className="w-4 h-4" />
              </div>
              <span className="ml-3 text-sm font-medium text-slate-700">Customer</span>
            </div>
          )}
          
          <div className={`px-4 py-3 rounded-2xl shadow-sm transition-all hover:shadow-md ${
            msg.sender === 'agent' 
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md' 
              : 'bg-white text-slate-900 border border-slate-200 rounded-bl-md'
          }`}>
            {msg.type === 'file' ? (
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  msg.sender === 'agent' ? 'bg-orange-600' : 'bg-slate-100'
                }`}>
                  <File className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium truncate">{msg.fileName}</span>
              </div>
            ) : msg.type === 'image' ? (
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  msg.sender === 'agent' ? 'bg-orange-600' : 'bg-slate-100'
                }`}>
                  <Image className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium truncate">{msg.fileName}</span>
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{msg.message}</p>
            )}
          </div>
          
          <div className={`flex items-center gap-2 mt-2 text-xs ${
            msg.sender === 'agent' ? 'justify-end text-slate-500' : 'justify-start text-slate-500'
          }`}>
            <Clock className="w-3 h-3" />
            <span>{msg.time}</span>
            {msg.sender === 'agent' && (
              <CheckCheck className="w-3 h-3 text-orange-500" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-2 bg-gradient-to-b from-slate-50 to-white min-h-full">
      {allItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Start the conversation</h3>
          <p className="text-sm text-slate-600">Send a message to begin chatting with the customer.</p>
        </div>
      ) : (
        allItems.map(renderMessage)
      )}
      
      {isTyping && (
        <div className="flex justify-start mb-6">
          <div className="bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
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
