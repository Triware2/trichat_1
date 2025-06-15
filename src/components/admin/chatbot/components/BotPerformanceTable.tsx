
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Brain } from 'lucide-react';

export const BotPerformanceTable = () => {
  const botPerformanceData = [
    { name: 'Customer Support Bot', conversations: 456, resolution: 94, satisfaction: 4.6, type: 'LLM' },
    { name: 'Technical Support AI', conversations: 324, resolution: 96, satisfaction: 4.8, type: 'LLM' },
    { name: 'FAQ Assistant', conversations: 234, resolution: 87, satisfaction: 4.2, type: 'Standard' },
    { name: 'Billing Inquiries Bot', conversations: 189, resolution: 91, satisfaction: 4.4, type: 'Standard' }
  ];

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-6">
        <CardTitle className="text-lg font-semibold text-gray-900">Individual Bot Performance</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {botPerformanceData.map((bot, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white">
                  {bot.type === 'LLM' ? <Brain className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{bot.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {bot.type} {bot.type === 'LLM' ? 'Powered' : 'Bot'}
                    </Badge>
                    <span className="text-sm text-gray-500">{bot.conversations} conversations</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{bot.resolution}%</p>
                  <p className="text-xs text-gray-500">Resolution</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{bot.satisfaction}</p>
                  <p className="text-xs text-gray-500">Satisfaction</p>
                </div>
                <Badge className={bot.resolution > 90 ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}>
                  {bot.resolution > 90 ? 'Excellent' : 'Good'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
