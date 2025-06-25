import { useState } from 'react';

export interface PrivateNote {
  id: number;
  content: string;
  author: string;
  timestamp: string;
  chatId: string;
  type: 'private-note';
  attachments?: {
    type: 'image' | 'file' | 'media' | 'audio' | 'video';
    name: string;
    url?: string;
  }[];
}

interface PrivateNotesProps {
  chatId: string | null;
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
      chatId: "d8b8a5a3-7b1f-4d2c-9b9a-1e2f3a4b5c6d",
      type: 'private-note',
      attachments: [
        {
          type: 'image',
          name: 'customer_complaint_screenshot.png',
          url: '#'
        }
      ]
    },
    {
      id: 2,
      content: "Follow up needed - customer requested manager callback.",
      author: "Mike Chen", 
      timestamp: "11:10 AM",
      chatId: "d8b8a5a3-7b1f-4d2c-9b9a-1e2f3a4b5c6d",
      type: 'private-note',
      attachments: [
        {
          type: 'audio',
          name: 'customer_voice_message.mp3',
          url: '#'
        }
      ]
    }
  ]);

  const chatNotes = chatId ? notes.filter(note => note.chatId === chatId) : [];

  const canDeleteNote = (noteAuthor: string) => {
    return noteAuthor === currentUserName || currentUserRole === 'supervisor' || currentUserRole === 'admin';
  };

  const handleDeleteNote = (noteId: number, noteAuthor: string) => {
    if (!canDeleteNote(noteAuthor)) return;

    setNotes(notes.filter(note => note.id !== noteId));
  };

  const addNote = (content: string, attachments?: { type: 'image' | 'file' | 'media' | 'audio' | 'video'; name: string; url?: string; }[]) => {
    if (!chatId) return;
    const note: PrivateNote = {
      id: notes.length + 1,
      content: content.trim(),
      author: currentUserName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chatId: chatId,
      type: 'private-note',
      attachments: attachments?.map(att => ({
        type: att.type === 'audio' ? 'audio' : att.type === 'video' ? 'video' : att.type === 'image' ? 'image' : 'file',
        name: att.name,
        url: att.url
      }))
    };
    
    setNotes([...notes, note]);
    
    const attachmentText = attachments && attachments.length > 0 
      ? ` with ${attachments.length} attachment(s)`
      : '';

    return note;
  };

  return { notes: chatNotes, addNote, handleDeleteNote, canDeleteNote };
};

// Export the hook for use in parent component
export const usePrivateNotes = (chatId: string | null, currentUserRole?: 'agent' | 'supervisor' | 'admin', currentUserName?: string) => {
  return PrivateNotes({ chatId, currentUserRole, currentUserName });
};
