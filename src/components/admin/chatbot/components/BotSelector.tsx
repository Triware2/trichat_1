
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap } from 'lucide-react';

interface BotSelectorProps {
  activeBot: string;
  onBotChange: (botId: string) => void;
  standardBots: Array<{ id: string; name: string }>;
}

export const BotSelector = ({ activeBot, onBotChange, standardBots }: BotSelectorProps) => {
  return (
    <Card className="bg-white shadow-sm border-gray-100/50 rounded-3xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-light text-gray-900 flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          Select Training Target
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Select value={activeBot} onValueChange={onBotChange}>
          <SelectTrigger className="w-full max-w-md border-gray-200/70 rounded-2xl focus:border-blue-500 transition-all duration-300 h-12 shadow-sm">
            <SelectValue placeholder="Choose a bot to configure" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-gray-200/70 shadow-lg">
            {standardBots.map(bot => (
              <SelectItem key={bot.id} value={bot.id} className="rounded-xl py-3">
                {bot.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {activeBot && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/40 rounded-2xl border border-blue-100/50 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-sm"></div>
              <p className="text-blue-900/90 font-medium text-lg">
                Currently Training: <span className="font-light">{standardBots.find(b => b.id === activeBot)?.name}</span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
