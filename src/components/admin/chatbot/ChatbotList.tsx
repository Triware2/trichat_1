import React, { useState, useEffect } from 'react';
import { chatbotService, Chatbot } from '@/services/chatbotService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bot, 
  Settings, 
  Trash2, 
  Edit, 
  Search, 
  Filter,
  Plus,
  AlertCircle,
  Brain
} from 'lucide-react';
import { toast } from 'sonner';

interface ChatbotListProps {
  onSelectChatbot: (chatbot: Chatbot) => void;
  onEditChatbot: (chatbot: Chatbot) => void;
  onDeleteChatbot: (chatbotId: string) => void;
  onCreateNew: () => void;
}

export default function ChatbotList({
  onSelectChatbot,
  onEditChatbot,
  onDeleteChatbot,
  onCreateNew
}: ChatbotListProps) {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadChatbots();
  }, []);

  const loadChatbots = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatbotService.getChatbots();
      setChatbots(data);
    } catch (err) {
      console.error('Error loading chatbots:', err);
      setError('Failed to load chatbots. Please try again.');
      toast.error('Failed to load chatbots');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (chatbotId: string) => {
    try {
      await chatbotService.deleteChatbot(chatbotId);
      setChatbots(chatbots.filter(bot => bot.id !== chatbotId));
      toast.success('Chatbot deleted successfully');
    } catch (err) {
      console.error('Error deleting chatbot:', err);
      toast.error('Failed to delete chatbot');
    }
  };

  const filteredChatbots = chatbots.filter(chatbot => {
    const matchesSearch = chatbot.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || chatbot.status === statusFilter;
    
    // Handle both LLM and rule-based bot filtering
    let matchesType = true;
    if (typeFilter !== 'all') {
      if (typeFilter === 'llm') {
        matchesType = chatbot.type === 'llm';
      } else if (typeFilter === 'rule-based') {
        matchesType = chatbot.type === 'standard';
      }
    }
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'training': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBotTypeInfo = (type: string) => {
    if (type === 'standard') {
      return {
        icon: <Settings className="w-4 h-4" />,
        type: 'Rule-Based',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      };
    } else {
      return {
        icon: <Brain className="w-4 h-4" />,
        type: 'LLM-Powered',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      };
    }
  };

  const getModelDisplayName = (model: string) => {
    if (!model) return 'Not specified';
    
    if (model.startsWith('rule-based-')) {
      const engineType = model.replace('rule-based-', '');
      switch (engineType) {
        case 'rule-engine': return 'Rule Engine';
        case 'decision-tree': return 'Decision Tree';
        case 'pattern-matching': return 'Pattern Matching';
        case 'custom-rules': return 'Custom Rules';
        default: return engineType;
      }
    } else {
      switch (model) {
        case 'gpt-4': return 'GPT-4';
        case 'gpt-3.5-turbo': return 'GPT-3.5 Turbo';
        case 'claude-3': return 'Claude 3';
        case 'custom': return 'Custom Model';
        default: return model;
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Chatbot Management</h2>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Create New Bot
          </Button>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Chatbot Management</h2>
          <p className="text-gray-600">Manage and configure your AI assistants</p>
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Bot
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search chatbots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="training">Training</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="llm">LLM-Powered</SelectItem>
            <SelectItem value="rule-based">Rule-Based</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800">{error}</span>
              <Button variant="outline" size="sm" onClick={loadChatbots}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chatbots List */}
      {filteredChatbots.length === 0 && !error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No chatbots found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first chatbot'}
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <Button onClick={onCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Bot
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredChatbots.map((chatbot) => {
            const botTypeInfo = getBotTypeInfo(chatbot.type);
            return (
              <Card key={chatbot.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelectChatbot(chatbot)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${botTypeInfo.bgColor} rounded-lg flex items-center justify-center`}>
                        {botTypeInfo.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{chatbot.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={getStatusColor(chatbot.status)}>
                            {chatbot.status}
                          </Badge>
                          <Badge variant="outline" className={`${botTypeInfo.color} bg-opacity-10`}>
                            {botTypeInfo.type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {getModelDisplayName(chatbot.model || '')}
                          </span>
                        </div>
                        {chatbot.system_prompt && (
                          <p className="text-sm text-gray-600 mt-1">{chatbot.system_prompt}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Resolution Rate</div>
                        <div className="font-semibold">{chatbot.resolution_rate || 0}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total Chats</div>
                        <div className="font-semibold">{chatbot.total_chats || 0}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditChatbot(chatbot);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(chatbot.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { ChatbotList };
