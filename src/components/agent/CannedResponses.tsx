import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Plus, Search, MessageSquare, Tag, Trash2, Edit, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// This interface now matches the database schema
export interface CannedResponse {
  id: number;
  user_id: string;
  title: string;
  message: string;
  category: string | null;
  created_at: string;
}

interface CannedResponsesProps {
  onSelectResponse?: (responseText: string) => void;
  className?: string;
}

export const CannedResponses = ({ onSelectResponse, className }: CannedResponsesProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [responses, setResponses] = useState<CannedResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResponse, setEditingResponse] = useState<CannedResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showMineOnly, setShowMineOnly] = useState(true); // Default to "My Responses"

  useEffect(() => {
    fetchResponses();
  }, [user]); // Refetch if user changes

  const fetchResponses = async () => {
    if (!user) return;
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('canned_responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error fetching responses',
        description: error.message,
        variant: 'destructive',
      });
      console.error("Error fetching responses:", error);
    } else {
      setResponses(data || []);
    }
    setIsLoading(false);
  };

  const filteredResponses = useMemo(() => {
    return responses.filter(response => {
      const matchesOwner = !showMineOnly || response.user_id === user?.id;
      const matchesCategory = selectedCategory === 'All' || response.category === selectedCategory;
      const matchesSearch = searchTerm === '' ||
        response.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.message.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesOwner && matchesCategory && matchesSearch;
    });
  }, [responses, showMineOnly, selectedCategory, searchTerm, user]);

  const allCategories = useMemo(() => {
    const categories = new Set(responses.map(r => r.category).filter(Boolean) as string[]);
    return ['All', ...categories];
  }, [responses]);

  const handleSaveResponse = async (formData: { title: string; message: string; category: string; }) => {
    if (!user) {
        toast({ title: 'You must be logged in', variant: 'destructive' });
      return;
    }

    const responseData = {
        user_id: user.id,
        title: formData.title,
        message: formData.message,
        category: formData.category || null,
    };

    const { error } = editingResponse
        ? await supabase.from('canned_responses').update(responseData).eq('id', editingResponse.id)
        : await supabase.from('canned_responses').insert(responseData);

    if (error) {
        toast({ title: 'Failed to save response', description: error.message, variant: 'destructive' });
    } else {
        toast({ title: `Response ${editingResponse ? 'updated' : 'created'}`, description: 'Your response has been saved successfully.' });
        await fetchResponses(); // Refresh the list
        setIsDialogOpen(false);
        setEditingResponse(null);
    }
  };

  const handleDeleteResponse = async (id: number) => {
    const { error } = await supabase.from('canned_responses').delete().eq('id', id);
    if (error) {
        toast({ title: 'Failed to delete response', description: error.message, variant: 'destructive' });
    } else {
        toast({ title: 'Response deleted', description: 'The response has been removed.' });
        await fetchResponses();
    }
  };

  const openEditDialog = (response: CannedResponse) => {
    setEditingResponse(response);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingResponse(null);
    setIsDialogOpen(true);
  };

  return (
    <div className={`h-full flex flex-col bg-slate-50 ${className || ''}`.trim()}>
      <header className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
                    <h2 className="text-lg font-bold text-slate-800">Canned Responses</h2>
                    <p className="text-sm text-slate-500">Manage & use response templates</p>
            </div>
            </div>
            <Button onClick={openNewDialog} size="sm">
              <Plus className="w-4 h-4 mr-2" />
                Create New
            </Button>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
                placeholder="Search by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>
            <div className='flex items-center gap-2 p-1 bg-slate-100 rounded-md'>
                 <Button variant={showMineOnly ? 'default' : 'ghost'} size="sm" onClick={() => setShowMineOnly(true)} className='text-xs'>
                     My Responses
                 </Button>
                 <Button variant={!showMineOnly ? 'default' : 'ghost'} size="sm" onClick={() => setShowMineOnly(false)} className='text-xs'>
                     All
                 </Button>
            </div>
        </div>
      </header>

      <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Tag className="w-4 h-4 text-slate-500 shrink-0"/>
              {allCategories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                      className={`text-xs rounded-full h-7 ${selectedCategory === category ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-white hover:bg-slate-100'}`}
              >
                      {category}
              </Button>
            ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
            <p className="text-center text-slate-500">Loading responses...</p>
        ) : filteredResponses.length === 0 ? (
            <div className="text-center py-10">
                <XCircle className="mx-auto w-12 h-12 text-slate-300" />
                <h3 className="mt-4 text-lg font-medium text-slate-700">No Responses Found</h3>
                <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or create a new response.</p>
            </div>
          ) : (
          filteredResponses.map(response => (
            <ResponseCard 
              key={response.id} 
              response={response} 
              onSelect={onSelectResponse}
              onEdit={() => openEditDialog(response)}
              onDelete={() => handleDeleteResponse(response.id)}
            />
          ))
        )}
      </main>

      <ResponseDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen}
        onSave={handleSaveResponse}
        editingResponse={editingResponse}
      />
                  </div>
  );
};

// Sub-component for displaying a single response card
const ResponseCard = ({ response, onSelect, onEdit, onDelete }: { response: CannedResponse, onSelect?: (text: string) => void, onEdit: () => void, onDelete: () => void }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 hover:border-orange-400 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-slate-800">{response.title}</h4>
          {response.category && <Badge variant="secondary" className="mt-1">{response.category}</Badge>}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
                            <Edit className="w-4 h-4 text-slate-500" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Edit</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
            </TooltipTrigger>
                    <TooltipContent><p>Delete</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
        </div>
      </div>
      <p className="text-sm text-slate-600 my-3">{response.message}</p>
      {onSelect && (
        <Button onClick={() => onSelect(response.message)} className="w-full mt-2" size="sm">
          Use This Response
        </Button>
      )}
    </div>
  );
}

// Sub-component for the create/edit dialog
const ResponseDialog = ({ isOpen, setIsOpen, onSave, editingResponse }: { isOpen: boolean, setIsOpen: (open: boolean) => void, onSave: (data: any) => void, editingResponse: CannedResponse | null }) => {
    const [formData, setFormData] = useState({ title: '', message: '', category: '' });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: editingResponse?.title || '',
                message: editingResponse?.message || '',
                category: editingResponse?.category || '',
            });
        }
    }, [isOpen, editingResponse]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[480px]">
                <form onSubmit={handleSubmit}>
          <DialogHeader>
                        <DialogTitle>{editingResponse ? 'Edit' : 'Create'} Canned Response</DialogTitle>
          </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">Title</label>
                            <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g., Order Status Inquiry" required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <Textarea id="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="Enter the response text..." className="min-h-[100px]" required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="category" className="text-sm font-medium">Category</label>
                            <Input id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g., orders, greeting (optional)" />
                        </div>
          </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Response</Button>
          </DialogFooter>
                </form>
        </DialogContent>
      </Dialog>
  );
};
