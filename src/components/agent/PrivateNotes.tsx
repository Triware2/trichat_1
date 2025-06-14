
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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

interface PrivateNotesProps {
  chatId: number;
  currentUserRole?: 'agent' | 'supervisor' | 'admin';
  currentUserName?: string;
}

export const PrivateNotes = ({ chatId, currentUserRole = 'agent', currentUserName = 'Current Agent' }: PrivateNotesProps) => {
  const [notes, setNotes] = useState<PrivateNote[]>([
    {
      id: 1,
      content: "Customer seems frustrated about delivery delay. Offered 20% discount on next order.",
      author: "Sarah Johnson",
      timestamp: "10:25 AM",
      chatId: 1,
      type: 'private-note'
    },
    {
      id: 2,
      content: "Follow up needed - customer requested manager callback.",
      author: "Mike Chen", 
      timestamp: "11:10 AM",
      chatId: 1,
      type: 'private-note'
    }
  ]);
  
  const { toast } = useToast();

  const chatNotes = notes.filter(note => note.chatId === chatId);

  const canDeleteNote = (noteAuthor: string) => {
    return noteAuthor === currentUserName || currentUserRole === 'supervisor' || currentUserRole === 'admin';
  };

  const handleDeleteNote = (noteId: number, noteAuthor: string) => {
    if (!canDeleteNote(noteAuthor)) {
      toast({
        title: "Access denied",
        description: "You can only delete your own notes.",
        variant: "destructive"
      });
      return;
    }

    setNotes(notes.filter(note => note.id !== noteId));
    toast({
      title: "Note deleted",
      description: "The private note has been removed.",
    });
  };

  const addNote = (content: string, attachments?: { type: 'image' | 'file' | 'media'; name: string; url?: string; }[]) => {
    const note: PrivateNote = {
      id: notes.length + 1,
      content: content.trim(),
      author: currentUserName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chatId: chatId,
      type: 'private-note',
      attachments: attachments
    };
    
    setNotes([...notes, note]);
    
    toast({
      title: "Private note added",
      description: "Your internal note has been saved for team collaboration.",
    });

    return note;
  };

  return { notes: chatNotes, addNote, handleDeleteNote, canDeleteNote };
};

// Export the hook for use in parent component
export const usePrivateNotes = (chatId: number, currentUserRole?: 'agent' | 'supervisor' | 'admin', currentUserName?: string) => {
  return PrivateNotes({ chatId, currentUserRole, currentUserName });
};
