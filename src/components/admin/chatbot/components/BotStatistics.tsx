
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bot, 
  Brain, 
  MessageSquare,
  BarChart3,
  Database
} from 'lucide-react';

interface BotStatisticsProps {
  stats: {
    totalBots: number;
    activeBots: number;
    llmBots: number;
    standardBots: number;
    avgResolution: string;
    totalSOPs: number;
  };
}

export const BotStatistics = ({ stats }: BotStatisticsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bots</p>
              <p className="text-2xl font-bold">{stats.totalBots}</p>
            </div>
            <Bot className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Now</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeBots}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">LLM Powered</p>
              <p className="text-2xl font-bold text-purple-600">{stats.llmBots}</p>
            </div>
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Standard</p>
              <p className="text-2xl font-bold text-orange-600">{stats.standardBots}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold">{stats.avgResolution}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">SOPs Loaded</p>
              <p className="text-2xl font-bold">{stats.totalSOPs}</p>
            </div>
            <Database className="w-8 h-8 text-indigo-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
