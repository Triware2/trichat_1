
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Plus, X, Paperclip, Image, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Attachment {
  type: 'image' | 'file' | 'media';
  name: string;
  url?: string;
}

interface PrivateNoteInputProps {
  onAddNote: (content: string, attachments?: Attachment[]) => void;
}

export const PrivateNoteInput = ({ onAddNote }: PrivateNoteInputProps) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const { toast } = useToast();

  const handleAddNote = () => {
    if (noteContent.trim() || attachments.length > 0) {
      onAddNote(noteContent, attachments);
      setNoteContent('');
      setAttachments([]);
      setIsAddingNote(false);
    }
  };

  const handleCancel = () => {
    setIsAddingNote(false);
    setNoteContent('');
    setAttachments([]);
  };

  const handleFileUpload = (type: 'image' | 'file' | 'media') => {
    // Simulate file upload - in real app this would handle actual file uploads
    const fileName = type === 'image' ? 'screenshot.png' : type === 'media' ? 'video.mp4' : 'document.pdf';
    const newAttachment: Attachment = {
      type,
      name: fileName,
      url: '#' // Would be actual URL in real implementation
    };
    
    setAttachments([...attachments, newAttachment]);
    toast({
      title: "File attached",
      description: `${fileName} has been attached to your note.`,
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  if (isAddingNote) {
    return (
      <div className="border border-amber-200 rounded-lg p-3 bg-amber-50">
        <div className="flex items-center gap-2 mb-2">
          <StickyNote className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">Add Private Note</span>
        </div>
        
        <Textarea
          placeholder="Add a private note for your team..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="resize-none border-amber-200 focus:border-amber-300 focus:ring-amber-200 mb-2"
          rows={2}
        />

        {/* Attachment options */}
        <div className="flex items-center gap-2 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFileUpload('image')}
            className="h-8 px-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
            title="Attach image"
          >
            <Image className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFileUpload('media')}
            className="h-8 px-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
            title="Attach media"
          >
            <Video className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFileUpload('file')}
            className="h-8 px-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
        </div>

        {/* Show attachments */}
        {attachments.length > 0 && (
          <div className="mb-2 space-y-1">
            {attachments.map((attachment, index) => (
              <div key={index} className="flex items-center justify-between bg-amber-100 rounded px-2 py-1">
                <div className="flex items-center gap-2">
                  {attachment.type === 'image' && <Image className="w-3 h-3 text-amber-600" />}
                  {attachment.type === 'media' && <Video className="w-3 h-3 text-amber-600" />}
                  {attachment.type === 'file' && <Paperclip className="w-3 h-3 text-amber-600" />}
                  <span className="text-xs text-amber-800">{attachment.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
                  className="h-4 w-4 p-0 text-amber-500 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={handleAddNote}
            disabled={!noteContent.trim() && attachments.length === 0}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Save Note
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCancel}
            className="text-amber-600 hover:text-amber-800 hover:bg-amber-100"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsAddingNote(true)}
      className="h-9 w-9 p-0 hover:bg-amber-100 text-amber-600"
      title="Add private note"
    >
      <StickyNote className="w-4 h-4" />
    </Button>
  );
};
