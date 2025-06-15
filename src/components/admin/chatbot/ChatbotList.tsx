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
  Edit,
  Activity,
  Shield
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

interface ChatbotListProps {
  onOpenTraining?: (botId: string, botType: 'standard' | 'llm') => void;
  onOpenConfiguration?: (botId: string) => void;
}

export const ChatbotList = ({ onOpenTraining, onOpenConfiguration }: ChatbotListProps) => {
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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm';
      case 'inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200 shadow-sm';
      case 'training':
        return 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 shadow-sm';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'llm' ? (
      <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md">
        <Brain className="w-4 h-4 text-white" />
      </div>
    ) : (
      <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-md">
        <MessageSquare className="w-4 h-4 text-white" />
      </div>
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
    if (onOpenConfiguration) {
      onOpenConfiguration(botId);
    } else {
      toast({
        title: "Opening Configuration",
        description: `Configuring ${bot?.name}...`,
      });
    }
  };

  const handleTrainingBot = (botId: string) => {
    const bot = chatbots.find(b => b.id === botId);
    if (bot && onOpenTraining) {
      onOpenTraining(botId, bot.type);
    } else {
      toast({
        title: "Opening Training",
        description: `Training interface for ${bot?.name}...`,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Deployed Chatbots</h2>
          <p className="text-blue-600 font-medium mt-1">Active AI assistants across your organization</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Settings className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chatbots.map((bot) => (
          <Card key={bot.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-blue-100/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {getTypeIcon(bot.type)}
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">
                      {bot.name}
                    </CardTitle>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="text-xs bg-white/80 border-blue-200 text-blue-700 font-medium px-3 py-1">
                        {bot.type === 'llm' ? 'Azure AI Powered' : 'Rule-Based Engine'}
                      </Badge>
                      {bot.model && (
                        <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-purple-200 font-medium px-3 py-1">
                          {bot.model}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Badge className={`${getStatusColor(bot.status)} font-medium px-3 py-1 rounded-full`}>
                  <Activity className="w-3 h-3 mr-1" />
                  {bot.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-600 font-medium">Success Rate</p>
                  <p className="text-2xl font-bold text-emerald-700 mt-1">{bot.resolutionRate}%</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-600 font-medium">Total Conversations</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">{bot.totalChats.toLocaleString()}</p>
                </div>
                {bot.sopCount && (
                  <>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                      <p className="text-sm text-purple-600 font-medium">Knowledge Base</p>
                      <p className="text-2xl font-bold text-purple-700 mt-1">{bot.sopCount} SOPs</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-600 font-medium">Last Updated</p>
                      <p className="text-sm font-semibold text-gray-700 mt-1">{bot.lastUpdated}</p>
                    </div>
                  </>
                )}
              </div>

              {bot.type === 'llm' && (
                <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 p-4 rounded-xl border border-purple-100/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-1.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-purple-800">Azure AI Capabilities</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs bg-white/70 border-purple-200 text-purple-700">
                      <Shield className="w-3 h-3 mr-1" />
                      Intent Recognition
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-white/70 border-blue-200 text-blue-700">
                      <Database className="w-3 h-3 mr-1" />
                      Knowledge Mining
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-white/70 border-indigo-200 text-indigo-700">
                      <Activity className="w-3 h-3 mr-1" />
                      Auto Escalation
                    </Badge>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => handleConfigureBot(bot.id)}
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Configure
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300"
                  onClick={() => handleTrainingBot(bot.id)}
                >
                  <Database className="w-3 h-3 mr-1" />
                  Training
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className={`border-2 ${bot.status === 'active' 
                    ? 'border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300' 
                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300'}`}
                  onClick={() => handleToggleStatus(bot.id)}
                >
                  {bot.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  onClick={() => handleCloneBot(bot.id)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDeleteBot(bot.id)}
                  className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
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
