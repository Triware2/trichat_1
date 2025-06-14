
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';

interface Note {
  date: string;
  agent: string;
  note: string;
  type: string;
}

interface NotesTabProps {
  notes: Note[];
  onAddNote: (note: Note) => void;
}

export const NotesTab = ({ notes, onAddNote }: NotesTabProps) => {
  const [newNote, setNewNote] = useState('');
  const { toast } = useToast();

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        date: new Date().toLocaleDateString(),
        agent: "Current Agent",
        note: newNote.trim(),
        type: "general"
      };
      onAddNote(note);
      setNewNote('');
      toast({
        title: "Note added",
        description: "Customer note has been saved successfully.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Note */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea 
            placeholder="Add a note about this customer interaction or insight..."
            className="w-full p-3 border border-slate-200 rounded-lg text-sm resize-none focus:border-orange-300 focus:ring-orange-200"
            rows={4}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button 
            onClick={handleAddNote} 
            disabled={!newNote.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Save Note
          </Button>
        </CardContent>
      </Card>

      {/* Notes History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notes History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No notes yet. Add your first note above.</p>
            </div>
          ) : (
            notes.map((note, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{note.agent}</span>
                    <Badge variant="outline" className="text-xs">{note.type}</Badge>
                  </div>
                  <span className="text-xs text-slate-500">{note.date}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{note.note}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
