
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Bot, Brain, MessageSquare, TrendingUp, Users, Database } from 'lucide-react';

interface BotStatisticsProps {
  stats: {
    totalBots: number;
    activeBots: number;
    llmBots: number;
    standardBots: number;
    avgResolution: string;
    totalSOPs: number;
  };
  onCreateBot: () => void;
}

export const BotStatistics = ({ stats, onCreateBot }: BotStatisticsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Intelligent Chatbots</h1>
          <p className="text-blue-600 font-medium mt-2 text-lg">AI-Powered Customer Support Platform</p>
        </div>
        <Button 
          onClick={onCreateBot}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-xl font-medium"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Chatbot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-blue-700">Total Chatbots</CardTitle>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
              <Bot className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">{stats.totalBots}</div>
            <p className="text-xs text-blue-600 font-medium">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-emerald-50/50 to-green-50/50 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-emerald-700">Active Bots</CardTitle>
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-md">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">{stats.activeBots}</div>
            <p className="text-xs text-emerald-600 font-medium">Currently serving customers</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-purple-700">AI-Powered Bots</CardTitle>
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md">
              <Brain className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">{stats.llmBots}</div>
            <p className="text-xs text-purple-600 font-medium">Advanced language models</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-cyan-700">Rule-Based Bots</CardTitle>
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-md">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">{stats.standardBots}</div>
            <p className="text-xs text-cyan-600 font-medium">Traditional chatbots</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-orange-50/50 to-red-50/50 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-orange-700">Avg. Resolution Rate</CardTitle>
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-md">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">{stats.avgResolution}</div>
            <p className="text-xs text-orange-600 font-medium">Customer satisfaction</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-indigo-700">Knowledge Base</CardTitle>
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
              <Database className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">{stats.totalSOPs}</div>
            <p className="text-xs text-indigo-600 font-medium">SOPs uploaded</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
