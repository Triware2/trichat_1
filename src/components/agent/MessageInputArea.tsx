
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
    <div className="p-4 bg-white space-y-3 border-t border-slate-200">
      {/* Mode indicator */}
      {isPrivateNoteMode && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <StickyNote className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">Private Note Mode</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPrivateNoteMode(false)}
            className="ml-auto h-6 px-2 text-amber-600 hover:text-amber-800"
          >
            Cancel
          </Button>
        </div>
      )}
      
      <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <Button variant="ghost" size="sm" onClick={onFileUpload} className="h-9 w-9 p-0 hover:bg-slate-100">
          <Paperclip className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onImageUpload} className="h-9 w-9 p-0 hover:bg-slate-100">
          <Image className="w-4 h-4" />
        </Button>
        <Input 
          placeholder={isPrivateNoteMode ? "Type your private note..." : "Type your message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-1 border-slate-200 focus:border-orange-300 focus:ring-orange-200 bg-white ${
            isPrivateNoteMode ? 'border-amber-200 focus:border-amber-300 focus:ring-amber-200' : ''
          }`}
        />
        <Button variant="ghost" size="sm" onClick={handleEmojiPicker} className="h-9 w-9 p-0 hover:bg-slate-100">
          <Smile className="w-4 h-4" />
        </Button>
        
        {/* Private Note Toggle Button */}
        <Button
          variant={isPrivateNoteMode ? "default" : "ghost"}
          size="sm"
          onClick={() => setIsPrivateNoteMode(!isPrivateNoteMode)}
          className={`h-9 px-3 ${
            isPrivateNoteMode 
              ? 'bg-amber-600 hover:bg-amber-700 text-white' 
              : 'hover:bg-amber-100 text-amber-600'
          }`}
          title={isPrivateNoteMode ? "Switch to customer message" : "Switch to private note"}
        >
          <StickyNote className="w-4 h-4" />
        </Button>
        
        {/* Send Button */}
        <Button 
          size="sm" 
          onClick={onSendMessage}
          disabled={!message.trim()}
          className={`h-9 px-4 ${
            isPrivateNoteMode
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          {isPrivateNoteMode ? (
            <>
              <StickyNote className="w-4 h-4 mr-1" />
              Note
            </>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
