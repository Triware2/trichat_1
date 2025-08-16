import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, User } from 'lucide-react';

interface QueueStatusProps {
  chats: Array<{
    id: number;
    customer: string;
    lastMessage: string;
    priority: string;
  }>;
  onQueueAction: (chatId: string) => void;
  small?: boolean;
}

export const QueueStatus = ({ chats, onQueueAction, small = false }: QueueStatusProps) => {
  const getPriorityBadge = (priority: string) => {
    const variants = {
      'High': 'destructive',
      'Medium': 'default',
      'Low': 'secondary'
    } as const;
    return <Badge variant={variants[priority as keyof typeof variants]}>{priority}</Badge>;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className={`bg-gradient-to-r from-slate-50 to-[#11b890]/10 border-b border-slate-200/60 ${small ? 'p-4' : 'p-6'}`}>
        <CardTitle className={`flex items-center space-x-3 ${small ? 'text-lg' : 'text-xl'} font-semibold text-slate-900`}>
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#11b890] to-[#0ea373] rounded-lg">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span>My Queue</span>
        </CardTitle>
        <CardDescription className={`${small ? 'text-sm' : 'text-base'} text-slate-600 mt-1`}>
          Current assigned conversations
        </CardDescription>
      </CardHeader>
      <CardContent className={small ? 'p-4' : 'p-6'}>
        {chats.length > 0 ? (
          <div className={small ? 'space-y-3' : 'space-y-4'}>
            {chats.slice(0, 3).map((chat, index) => (
              <div key={index} className={`flex items-center justify-between ${small ? 'p-3' : 'p-4'} bg-gradient-to-r from-slate-50/50 to-[#11b890]/10 rounded-xl border border-slate-200 hover:shadow-md transition-shadow`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <h4 className={`${small ? 'text-sm' : 'text-base'} font-semibold text-slate-900 truncate`}>
                      {chat.customer}
                    </h4>
                  </div>
                  <p className={`${small ? 'text-xs' : 'text-sm'} text-slate-600 truncate`}>
                    {chat.lastMessage}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-3">
                  {getPriorityBadge(chat.priority)}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-white hover:bg-[#11b890]/10 border-[#11b890]/30 hover:border-[#11b890]/50"
                    onClick={() => onQueueAction(String(chat.id))}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No chats in queue</h3>
            <p className="text-slate-600">New conversations will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
