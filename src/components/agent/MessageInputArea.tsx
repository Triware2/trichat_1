
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Send,
  Paperclip,
  Smile,
  Image,
  StickyNote,
  FileAudio,
  FileVideo,
  X
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

interface MediaAttachment {
  type: 'image' | 'audio' | 'video' | 'file';
  name: string;
  url?: string;
  file?: File;
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
  const [mediaAttachments, setMediaAttachments] = useState<MediaAttachment[]>([]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendWithAttachments();
    }
  };

  const handleEmojiPicker = () => {
    toast({
      title: "Emoji picker",
      description: "Emoji picker opened.",
    });
  };

  const handleMediaUpload = (type: 'image' | 'audio' | 'video') => {
    const input = document.createElement('input');
    input.type = 'file';
    
    let accept = '';
    switch (type) {
      case 'image':
        accept = 'image/*';
        break;
      case 'audio':
        accept = 'audio/*';
        break;
      case 'video':
        accept = 'video/*';
        break;
    }
    input.accept = accept;
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const attachment: MediaAttachment = {
          type,
          name: file.name,
          file: file,
          url: URL.createObjectURL(file)
        };
        setMediaAttachments(prev => [...prev, attachment]);
        
        toast({
          title: "Media attached",
          description: `${file.name} has been added to your private note.`,
        });
      }
    };
    
    input.click();
  };

  const removeAttachment = (index: number) => {
    setMediaAttachments(prev => {
      const newAttachments = [...prev];
      // Clean up object URL to prevent memory leaks
      if (newAttachments[index].url) {
        URL.revokeObjectURL(newAttachments[index].url!);
      }
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const handleSendWithAttachments = () => {
    // Pass attachments along with the message
    if (isPrivateNoteMode && (message.trim() || mediaAttachments.length > 0)) {
      // This would be handled by the parent component
      onSendMessage();
      // Clear attachments after sending
      setMediaAttachments([]);
    } else if (!isPrivateNoteMode && message.trim()) {
      onSendMessage();
    }
  };

  // Expose attachments to parent component
  React.useEffect(() => {
    // Store attachments in a way the parent can access them
    (window as any).currentMediaAttachments = mediaAttachments;
  }, [mediaAttachments]);

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

      {/* Media Attachments Preview (only in private note mode) */}
      {isPrivateNoteMode && mediaAttachments.length > 0 && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="text-xs font-semibold text-amber-800 mb-2">Attachments for Private Note:</h4>
          <div className="space-y-2">
            {mediaAttachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-2 bg-amber-100 rounded-lg p-2">
                {attachment.type === 'image' && <Image className="w-4 h-4 text-amber-600" />}
                {attachment.type === 'audio' && <FileAudio className="w-4 h-4 text-amber-600" />}
                {attachment.type === 'video' && <FileVideo className="w-4 h-4 text-amber-600" />}
                {attachment.type === 'file' && <Paperclip className="w-4 h-4 text-amber-600" />}
                <span className="text-xs text-amber-800 font-medium flex-1">{attachment.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
                  className="h-5 w-5 p-0 text-amber-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Main Input Container with Modern Design */}
      <div className="flex items-end gap-3 p-3 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm focus-within:shadow-md focus-within:border-orange-300 transition-all duration-200">
        
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1">
          {isPrivateNoteMode ? (
            // Media upload buttons for private notes
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleMediaUpload('image')} 
                className="h-8 w-8 p-0 hover:bg-amber-100 rounded-xl transition-colors"
                title="Attach image"
              >
                <Image className="w-4 h-4 text-amber-600" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleMediaUpload('audio')} 
                className="h-8 w-8 p-0 hover:bg-amber-100 rounded-xl transition-colors"
                title="Attach audio"
              >
                <FileAudio className="w-4 h-4 text-amber-600" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleMediaUpload('video')} 
                className="h-8 w-8 p-0 hover:bg-amber-100 rounded-xl transition-colors"
                title="Attach video"
              >
                <FileVideo className="w-4 h-4 text-amber-600" />
              </Button>
            </>
          ) : (
            // Regular file upload buttons for customer messages
            <>
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
            </>
          )}
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
            onClick={handleSendWithAttachments}
            disabled={!message.trim() && mediaAttachments.length === 0}
            className={`h-8 w-8 p-0 rounded-xl transition-all ${
              isPrivateNoteMode
                ? 'bg-amber-500 hover:bg-amber-600 text-white disabled:bg-amber-300'
                : 'bg-orange-500 hover:bg-orange-600 text-white disabled:bg-orange-300'
            } ${(!message.trim() && mediaAttachments.length === 0) ? 'opacity-50 cursor-not-allowed' : 'shadow-sm hover:shadow-md'}`}
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
