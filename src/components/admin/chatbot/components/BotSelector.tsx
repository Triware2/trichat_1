
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { Chatbot } from '@/services/chatbotService';

interface BotSelectorProps {
  activeBot: string;
  onBotChange: (botId: string) => void;
  standardBots: Chatbot[];
}

export const BotSelector = ({ activeBot, onBotChange, standardBots }: BotSelectorProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Select Bot to Train</h3>
            <p className="text-slate-600">Choose a bot from the dropdown to start configuring training rules</p>
          </div>
          <div className="w-64">
            <Select value={activeBot} onValueChange={onBotChange}>
              <SelectTrigger className="bg-white/80 backdrop-blur-sm border border-slate-200">
                <SelectValue placeholder="Select a bot..." />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl">
                {standardBots.map((bot) => (
                  <SelectItem key={bot.id} value={bot.id} className="hover:bg-blue-50/50">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      {bot.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
