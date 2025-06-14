import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  MessageSquare,
  Tag,
  Search
} from 'lucide-react';

interface CannedResponse {
  id: number;
  title: string;
  message: string;
  category: string;
  createdAt: string;
}

interface CannedResponsesProps {
  onSelectResponse?: (response: CannedResponse) => void;
  isSelectionMode?: boolean;
}

export const CannedResponses = ({ onSelectResponse, isSelectionMode = false }: CannedResponsesProps) => {
  const { toast } = useToast();
  const [responses, setResponses] = useState<CannedResponse[]>([
    {
      id: 1,
      title: "Welcome Message",
      message: "Hello! Thank you for contacting us. I'm here to help you with any questions or concerns you may have.",
      category: "greeting",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Order Status Check",
      message: "I'd be happy to check your order status for you. Could you please provide me with your order number?",
      category: "orders",
      createdAt: "2024-01-15"
    },
    {
      id: 3,
      title: "Refund Process",
      message: "I understand you'd like to request a refund. Let me review your order details and guide you through the refund process.",
      category: "refunds",
      createdAt: "2024-01-16"
    },
    {
      id: 4,
      title: "Technical Support",
      message: "I see you're experiencing a technical issue. Let me help you troubleshoot this problem step by step.",
      category: "technical",
      createdAt: "2024-01-16"
    },
    {
      id: 5,
      title: "Account Access",
      message: "I'm sorry to hear you're having trouble accessing your account. Let me help you resolve this issue quickly.",
      category: "account",
      createdAt: "2024-01-17"
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newResponse, setNewResponse] = useState({
    title: '',
    message: '',
    category: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'greeting', 'orders', 'refunds', 'technical', 'account', 'closing'];

  const handleCreate = () => {
    if (!newResponse.title.trim() || !newResponse.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and message fields.",
        variant: "destructive"
      });
      return;
    }

    const response: CannedResponse = {
      id: responses.length + 1,
      title: newResponse.title,
      message: newResponse.message,
      category: newResponse.category || 'general',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setResponses([...responses, response]);
    setNewResponse({ title: '', message: '', category: '' });
    setIsCreating(false);
    
    toast({
      title: "Response Created",
      description: "Your canned response has been created successfully.",
    });
  };

  const handleEdit = (id: number) => {
    const response = responses.find(r => r.id === id);
    if (response) {
      setNewResponse({
        title: response.title,
        message: response.message,
        category: response.category
      });
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    if (!newResponse.title.trim() || !newResponse.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and message fields.",
        variant: "destructive"
      });
      return;
    }

    setResponses(responses.map(r => 
      r.id === editingId 
        ? { ...r, title: newResponse.title, message: newResponse.message, category: newResponse.category }
        : r
    ));
    setNewResponse({ title: '', message: '', category: '' });
    setEditingId(null);
    
    toast({
      title: "Response Updated",
      description: "Your canned response has been updated successfully.",
    });
  };

  const handleDelete = (id: number) => {
    setResponses(responses.filter(r => r.id !== id));
    toast({
      title: "Response Deleted",
      description: "The canned response has been deleted.",
    });
  };

  const handleSelect = (response: CannedResponse) => {
    if (onSelectResponse) {
      onSelectResponse(response);
      toast({
        title: "Response Selected",
        description: "The canned response has been added to your message.",
      });
    }
  };

  const filteredResponses = responses.filter(response => {
    const matchesSearch = response.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || response.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      greeting: 'bg-green-100 text-green-800 border-green-200',
      orders: 'bg-blue-100 text-blue-800 border-blue-200',
      refunds: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      technical: 'bg-red-100 text-red-800 border-red-200',
      account: 'bg-purple-100 text-purple-800 border-purple-200',
      closing: 'bg-gray-100 text-gray-800 border-gray-200',
      general: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Canned Responses</h2>
              <p className="text-sm text-slate-600">Manage your quick response templates</p>
            </div>
          </div>
          {!isSelectionMode && (
            <Button size="sm" onClick={() => setIsCreating(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Response
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200 focus:border-orange-300 focus:ring-orange-200"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`text-xs ${selectedCategory === category ? 'bg-orange-500 hover:bg-orange-600' : 'hover:bg-slate-100'}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {(isCreating || editingId !== null) && (
          <Card className="border-2 border-orange-200 shadow-md">
            <CardContent className="p-4">
              <div className="space-y-4">
                <Input
                  placeholder="Response title..."
                  value={newResponse.title}
                  onChange={(e) => setNewResponse({...newResponse, title: e.target.value})}
                  className="border-slate-200 focus:border-orange-300 focus:ring-orange-200"
                />
                <Input
                  placeholder="Category (e.g., orders, refunds, technical)..."
                  value={newResponse.category}
                  onChange={(e) => setNewResponse({...newResponse, category: e.target.value})}
                  className="border-slate-200 focus:border-orange-300 focus:ring-orange-200"
                />
                <Textarea
                  placeholder="Response message..."
                  value={newResponse.message}
                  onChange={(e) => setNewResponse({...newResponse, message: e.target.value})}
                  rows={4}
                  className="border-slate-200 focus:border-orange-300 focus:ring-orange-200"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => {}} className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Update' : 'Create'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                      setNewResponse({ title: '', message: '', category: '' });
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {filteredResponses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No responses found</h3>
              <p className="text-sm text-slate-600">
                {searchTerm ? "Try adjusting your search terms" : "Create your first canned response to get started"}
              </p>
            </div>
          ) : (
            filteredResponses.map((response) => (
              <Card key={response.id} className="hover:shadow-md transition-all duration-200 border border-slate-200">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 text-lg mb-1">{response.title}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-xs border ${getCategoryColor(response.category)}`}>
                            <Tag className="w-3 h-3 mr-1" />
                            {response.category}
                          </Badge>
                          <span className="text-xs text-slate-500">Created: {response.createdAt}</span>
                        </div>
                      </div>
                      {!isSelectionMode && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => {}} className="h-8 w-8 p-0 hover:bg-slate-100">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => {}} className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">{response.message}</p>
                    {isSelectionMode && (
                      <Button 
                        size="sm" 
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => onSelectResponse && onSelectResponse(response)}
                      >
                        Use This Response
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
