
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Plus, X } from 'lucide-react';

interface PrivateNoteInputProps {
  onAddNote: (content: string) => void;
}

export const PrivateNoteInput = ({ onAddNote }: PrivateNoteInputProps) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const handleAddNote = () => {
    if (noteContent.trim()) {
      onAddNote(noteContent);
      setNoteContent('');
      setIsAddingNote(false);
    }
  };

  const handleCancel = () => {
    setIsAddingNote(false);
    setNoteContent('');
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
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={handleAddNote}
            disabled={!noteContent.trim()}
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
