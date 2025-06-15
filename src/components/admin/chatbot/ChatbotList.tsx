
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Brain, 
  MessageSquare, 
  Settings, 
  Play, 
  Pause,
  MoreHorizontal,
  Zap,
  Database,
  Trash2,
  Copy,
  Edit
} from 'lucide-react';

interface Chatbot {
  id: string;
  name: string;
  type: 'standard' | 'llm';
  status: 'active' | 'inactive' | 'training';
  model?: string;
  resolutionRate: number;
  totalChats: number;
  lastUpdated: string;
  sopCount?: number;
}

export const ChatbotList = () => {
  const { toast } = useToast();
  const [chatbots, setChatbots] = useState<Chatbot[]>([
    {
      id: '1',
      name: 'Customer Support Bot',
      type: 'llm',
      status: 'active',
      model: 'GPT-4',
      resolutionRate: 94,
      totalChats: 1247,
      lastUpdated: '2024-06-14',
      sopCount: 5
    },
    {
      id: '2',
      name: 'FAQ Assistant',
      type: 'standard',
      status: 'active',
      resolutionRate: 87,
      totalChats: 892,
      lastUpdated: '2024-06-13'
    },
    {
      id: '3',
      name: 'Technical Support AI',
      type: 'llm',
      status: 'training',
      model: 'Claude-3',
      resolutionRate: 96,
      totalChats: 534,
      lastUpdated: '2024-06-14',
      sopCount: 8
    },
    {
      id: '4',
      name: 'Billing Inquiries Bot',
      type: 'standard',
      status: 'active',
      resolutionRate: 91,
      totalChats: 423,
      lastUpdated: '2024-06-12'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'training':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'llm' ? (
      <Brain className="w-4 h-4 text-purple-600" />
    ) : (
      <MessageSquare className="w-4 h-4 text-blue-600" />
    );
  };

  const handleToggleStatus = (botId: string) => {
    setChatbots(chatbots.map(bot => {
      if (bot.id === botId) {
        const newStatus = bot.status === 'active' ? 'inactive' : 'active';
        toast({
          title: `Bot ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
          description: `${bot.name} is now ${newStatus}`,
        });
        return { ...bot, status: newStatus };
      }
      return bot;
    }));
  };

  const handleDeleteBot = (botId: string) => {
    const bot = chatbots.find(b => b.id === botId);
    setChatbots(chatbots.filter(b => b.id !== botId));
    toast({
      title: "Bot Deleted",
      description: `${bot?.name} has been deleted successfully`,
      variant: "destructive"
    });
  };

  const handleCloneBot = (botId: string) => {
    const bot = chatbots.find(b => b.id === botId);
    if (bot) {
      const clonedBot = {
        ...bot,
        id: Date.now().toString(),
        name: `${bot.name} (Copy)`,
        status: 'inactive' as const,
        totalChats: 0
      };
      setChatbots([...chatbots, clonedBot]);
      toast({
        title: "Bot Cloned",
        description: `${bot.name} has been cloned successfully`,
      });
    }
  };

  const handleConfigureBot = (botId: string) => {
    const bot = chatbots.find(b => b.id === botId);
    toast({
      title: "Opening Configuration",
      description: `Configuring ${bot?.name}...`,
    });
  };

  const handleTrainingBot = (botId: string) => {
    const bot = chatbots.find(b => b.id === botId);
    toast({
      title: "Opening Training",
      description: `Training interface for ${bot?.name}...`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Active Chatbots</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chatbots.map((bot) => (
          <Card key={bot.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(bot.type)}
                  <div>
                    <CardTitle className="text-lg font-medium text-gray-900">{bot.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {bot.type === 'llm' ? 'LLM Powered' : 'Rule-Based'}
                      </Badge>
                      {bot.model && (
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                          {bot.model}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(bot.status)}>
                  {bot.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Resolution Rate</p>
                  <p className="font-semibold text-green-600">{bot.resolutionRate}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Chats</p>
                  <p className="font-semibold">{bot.totalChats.toLocaleString()}</p>
                </div>
                {bot.sopCount && (
                  <>
                    <div>
                      <p className="text-gray-500">SOPs Loaded</p>
                      <p className="font-semibold text-blue-600">{bot.sopCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Updated</p>
                      <p className="font-semibold">{bot.lastUpdated}</p>
                    </div>
                  </>
                )}
              </div>

              {bot.type === 'llm' && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">AI Features Active</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs bg-white/50">Intent Recognition</Badge>
                    <Badge variant="outline" className="text-xs bg-white/50">SOP Query</Badge>
                    <Badge variant="outline" className="text-xs bg-white/50">Auto Escalation</Badge>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleConfigureBot(bot.id)}
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Configure
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleTrainingBot(bot.id)}
                >
                  <Database className="w-3 h-3 mr-1" />
                  Training
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className={bot.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                  onClick={() => handleToggleStatus(bot.id)}
                >
                  {bot.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleCloneBot(bot.id)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDeleteBot(bot.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
