
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
  Tag
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
      greeting: 'bg-green-100 text-green-800',
      orders: 'bg-blue-100 text-blue-800',
      refunds: 'bg-yellow-100 text-yellow-800',
      technical: 'bg-red-100 text-red-800',
      account: 'bg-purple-100 text-purple-800',
      closing: 'bg-gray-100 text-gray-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Canned Responses
          </span>
          {!isSelectionMode && (
            <Button size="sm" onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Response
            </Button>
          )}
        </CardTitle>
        
        <div className="space-y-3">
          <Input
            placeholder="Search responses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {(isCreating || editingId !== null) && (
          <Card className="p-4 border-2 border-blue-200">
            <div className="space-y-3">
              <Input
                placeholder="Response title..."
                value={newResponse.title}
                onChange={(e) => setNewResponse({...newResponse, title: e.target.value})}
              />
              <Input
                placeholder="Category (e.g., orders, refunds, technical)..."
                value={newResponse.category}
                onChange={(e) => setNewResponse({...newResponse, category: e.target.value})}
              />
              <Textarea
                placeholder="Response message..."
                value={newResponse.message}
                onChange={(e) => setNewResponse({...newResponse, message: e.target.value})}
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={editingId ? handleUpdate : handleCreate}>
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
          </Card>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredResponses.map((response) => (
            <Card key={response.id} className="p-3 hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{response.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getCategoryColor(response.category)}`}>
                      <Tag className="w-3 h-3 mr-1" />
                      {response.category}
                    </Badge>
                    {!isSelectionMode && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(response.id)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(response.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">{response.message}</p>
                {isSelectionMode && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleSelect(response)}
                  >
                    Use This Response
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredResponses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No canned responses found</p>
            {searchTerm && (
              <p className="text-sm mt-2">Try adjusting your search terms</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
