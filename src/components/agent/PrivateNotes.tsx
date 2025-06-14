
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, User, Clock, StickyNote } from 'lucide-react';

interface PrivateNote {
  id: number;
  content: string;
  author: string;
  timestamp: string;
  chatId: number;
}

interface PrivateNotesProps {
  chatId: number;
}

export const PrivateNotes = ({ chatId }: PrivateNotesProps) => {
  const [notes, setNotes] = useState<PrivateNote[]>([
    {
      id: 1,
      content: "Customer seems frustrated about delivery delay. Offered 20% discount on next order.",
      author: "Sarah Johnson",
      timestamp: "10:25 AM",
      chatId: 1
    },
    {
      id: 2,
      content: "Follow up needed - customer requested manager callback.",
      author: "Mike Chen",
      timestamp: "11:10 AM",
      chatId: 1
    }
  ]);
  
  const { toast } = useToast();

  const chatNotes = notes.filter(note => note.chatId === chatId);

  const handleDeleteNote = (noteId: number) => {
    setNotes(notes.filter(note => note.id !== noteId));
    toast({
      title: "Note deleted",
      description: "The private note has been removed.",
    });
  };

  const addNote = (content: string) => {
    const note: PrivateNote = {
      id: notes.length + 1,
      content: content.trim(),
      author: "Current Agent",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chatId: chatId
    };
    
    setNotes([...notes, note]);
    
    toast({
      title: "Private note added",
      description: "Your internal note has been saved for team collaboration.",
    });
  };

  return (
    <div className="border-t border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
        <h3 className="font-semibold text-amber-800">Private Team Notes</h3>
        <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Internal Only</span>
      </div>

      <div className="space-y-3 max-h-48 overflow-y-auto">
        {chatNotes.length === 0 ? (
          <p className="text-amber-600 text-sm italic">No private notes for this conversation yet.</p>
        ) : (
          chatNotes.map((note) => (
            <Card key={note.id} className="bg-white border-amber-200">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs text-amber-600">
                    <User className="w-3 h-3" />
                    <span className="font-medium">{note.author}</span>
                    <Clock className="w-3 h-3" />
                    <span>{note.timestamp}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNote(note.id)}
                    className="h-6 w-6 p-0 text-amber-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-sm text-gray-700">{note.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Export the addNote functionality for use in parent component
export const usePrivateNotes = (chatId: number) => {
  const [notes, setNotes] = useState<PrivateNote[]>([
    {
      id: 1,
      content: "Customer seems frustrated about delivery delay. Offered 20% discount on next order.",
      author: "Sarah Johnson",
      timestamp: "10:25 AM",
      chatId: 1
    },
    {
      id: 2,
      content: "Follow up needed - customer requested manager callback.",
      author: "Mike Chen",
      timestamp: "11:10 AM",
      chatId: 1
    }
  ]);

  const { toast } = useToast();

  const addNote = (content: string) => {
    const note: PrivateNote = {
      id: notes.length + 1,
      content: content.trim(),
      author: "Current Agent",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chatId: chatId
    };
    
    setNotes([...notes, note]);
    
    toast({
      title: "Private note added",
      description: "Your internal note has been saved for team collaboration.",
    });
  };

  return { addNote };
};
