
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Send,
  Paperclip,
  Smile,
  Image,
  StickyNote
} from 'lucide-react';

interface MessageInputAreaProps {
  message: string;
  setMessage: (message: string) => void;
  isPrivateNoteMode: boolean;
  setIsPrivateNoteMode: (mode: boolean) => void;
  onSendMessage: () => void;
  onFileUpload: () => void;
  onImageUpload: () => void;
}

export const MessageInputArea = ({
  message,
  setMessage,
  isPrivateNoteMode,
  setIsPrivateNoteMode,
  onSendMessage,
  onFileUpload,
  onImageUpload
}: MessageInputAreaProps) => {
  const { toast } = useToast();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleEmojiPicker = () => {
    toast({
      title: "Emoji picker",
      description: "Emoji picker opened.",
    });
  };

  return (
    <div className="p-4 bg-white">
      {/* Private Note Mode Indicator */}
      {isPrivateNoteMode && (
        <div className="mb-3 flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <StickyNote className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">Private Note Mode</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPrivateNoteMode(false)}
            className="ml-auto h-6 px-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
          >
            Cancel
          </Button>
        </div>
      )}
      
      {/* Main Input Container with Modern Design */}
      <div className="flex items-end gap-3 p-3 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm focus-within:shadow-md focus-within:border-orange-300 transition-all duration-200">
        
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onFileUpload} 
            className="h-8 w-8 p-0 hover:bg-slate-100 rounded-xl transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4 text-slate-600" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onImageUpload} 
            className="h-8 w-8 p-0 hover:bg-slate-100 rounded-xl transition-colors"
            title="Attach image"
          >
            <Image className="w-4 h-4 text-slate-600" />
          </Button>
        </div>

        {/* Text Input - Takes remaining space */}
        <div className="flex-1">
          <Input 
            placeholder={isPrivateNoteMode ? "Add a private note..." : "Type your message..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`border-0 bg-transparent focus:ring-0 focus-visible:ring-0 text-sm placeholder:text-slate-500 p-0 h-auto min-h-[32px] resize-none ${
              isPrivateNoteMode ? 'placeholder:text-amber-600' : ''
            }`}
            style={{ boxShadow: 'none' }}
          />
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleEmojiPicker} 
            className="h-8 w-8 p-0 hover:bg-slate-100 rounded-xl transition-colors"
            title="Add emoji"
          >
            <Smile className="w-4 h-4 text-slate-600" />
          </Button>
          
          {/* Private Note Toggle */}
          <Button
            variant={isPrivateNoteMode ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsPrivateNoteMode(!isPrivateNoteMode)}
            className={`h-8 w-8 p-0 rounded-xl transition-all ${
              isPrivateNoteMode 
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm' 
                : 'hover:bg-amber-50 text-amber-600'
            }`}
            title={isPrivateNoteMode ? "Switch to customer message" : "Add private note"}
          >
            <StickyNote className="w-4 h-4" />
          </Button>
          
          {/* Send Button */}
          <Button 
            size="sm" 
            onClick={onSendMessage}
            disabled={!message.trim()}
            className={`h-8 w-8 p-0 rounded-xl transition-all ${
              isPrivateNoteMode
                ? 'bg-amber-500 hover:bg-amber-600 text-white disabled:bg-amber-300'
                : 'bg-orange-500 hover:bg-orange-600 text-white disabled:bg-orange-300'
            } ${!message.trim() ? 'opacity-50 cursor-not-allowed' : 'shadow-sm hover:shadow-md'}`}
            title={isPrivateNoteMode ? "Add note" : "Send message"}
          >
            {isPrivateNoteMode ? (
              <StickyNote className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
