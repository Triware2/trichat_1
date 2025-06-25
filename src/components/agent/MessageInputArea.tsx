import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send,
  Paperclip,
  Smile,
  Image,
  StickyNote,
  FileAudio,
  FileVideo,
  X,
  MessageSquare
} from 'lucide-react';
import { Drawer, DrawerTrigger, DrawerContent } from '@/components/ui/drawer';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CannedResponses } from './CannedResponses';
// @ts-ignore
import { Picker } from 'emoji-mart';
// @ts-ignore
import 'emoji-mart/css/emoji-mart.css';

interface MessageInputAreaProps {
  message: string;
  setMessage: (message: string) => void;
  isPrivateNoteMode: boolean;
  setIsPrivateNoteMode: (mode: boolean) => void;
  onSendMessage: () => void;
  onFileUpload: () => void;
  onImageUpload: () => void;
  setShowCannedResponses: (show: boolean) => void;
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
  onImageUpload,
  setShowCannedResponses
}: MessageInputAreaProps) => {
  const [mediaAttachments, setMediaAttachments] = useState<MediaAttachment[]>([]);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendWithAttachments();
    }
  };

  const handleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiSelect = (emoji: any) => {
    if (isPrivateNoteMode) {
      setMessage(message + emoji.native); // If you want a separate private note message state, update that here instead
    } else {
      setMessage(message + emoji.native);
    }
    setShowEmojiPicker(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isPrivateNoteMode) {
        const attachment: MediaAttachment = {
          type: 'file',
          name: file.name,
          file: file,
        };
        setMediaAttachments(prev => [...prev, attachment]);
      } else {
        setMessage(message + ` [${file.name}]`);
      }
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
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
    <div className="p-2 bg-white">
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
      
      {/* World-Class Input Container */}
      <div className={`
        flex items-center gap-2 px-2 py-1.5 
        bg-white rounded-full border-2 
        ${isPrivateNoteMode 
          ? 'border-amber-300 focus-within:border-amber-500' 
          : 'border-slate-200 focus-within:border-orange-500'
        }
        focus-within:ring-2 ${isPrivateNoteMode ? 'focus-within:ring-amber-500/30' : 'focus-within:ring-orange-500/30'}
        transition-all duration-300 ease-in-out
      `}>
        {/* Left-side Action Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full flex-shrink-0 ${isPrivateNoteMode ? 'text-amber-600 bg-amber-100' : 'text-slate-500 hover:bg-slate-100'}`}
          title={isPrivateNoteMode ? "Switch to public message" : "Add Private Note"}
          onClick={() => setIsPrivateNoteMode(!isPrivateNoteMode)}
        >
          <StickyNote className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-500 hover:bg-slate-100 flex-shrink-0"
          title="Use Canned Response"
          onClick={() => setShowCannedResponses(true)}
        >
          <MessageSquare className="w-5 h-5" />
        </Button>

        {/* Text Input - Flexible */}
        <Input
          className="flex-1 h-full border-0 bg-transparent focus:ring-0 focus:outline-none text-sm px-2 placeholder-slate-400"
          placeholder={isPrivateNoteMode ? "Type a private note..." : "Type your message..."}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        
        {/* Right-side Action Buttons */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
        />
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-500 hover:bg-slate-100 flex-shrink-0"
          onClick={handleFileButtonClick}
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-slate-500 hover:bg-slate-100 flex-shrink-0"
              onClick={handleEmojiPicker}
              title="Add emoji"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
              align="end" 
              className="p-0 border-none shadow-2xl mb-2"
          >
            <Picker onSelect={handleEmojiSelect} set="apple" />
          </PopoverContent>
        </Popover>

        {/* Send Button */}
        <Button
          size="icon"
          className="rounded-full w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl transition-all flex-shrink-0"
          onClick={handleSendWithAttachments}
          disabled={!message.trim() && !mediaAttachments.length}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
