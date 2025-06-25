import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';

interface Chat {
  id: number;
  customer: string;
  lastMessage: string;
  priority: string;
}

interface QueueStatusProps {
  chats: Chat[];
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
    <Card className={small ? 'p-2' : ''}>
      <CardHeader className={small ? 'pb-2' : ''}>
        <CardTitle className={small ? 'text-base font-bold text-slate-900 font-roboto' : 'font-bold text-slate-900 font-roboto'}>My Queue</CardTitle>
        <CardDescription className={small ? 'text-xs font-medium text-slate-600' : 'font-medium text-slate-600'}>Current assigned conversations</CardDescription>
      </CardHeader>
      <CardContent className={small ? 'p-2' : ''}>
        <div className={small ? 'space-y-2' : 'space-y-3'}>
          {chats.slice(0, 3).map((chat, index) => (
            <div key={index} className={`flex items-center justify-between ${small ? 'p-2' : 'p-3'} bg-gray-50 rounded-lg`}>
              <div>
                <p className={small ? 'font-bold text-sm text-slate-900' : 'font-bold text-slate-900'}>{chat.customer}</p>
                <p className={small ? 'text-xs text-slate-500 truncate' : 'text-sm text-slate-500 truncate'}>{chat.lastMessage}</p>
              </div>
              <div className="flex items-center gap-2">
                {getPriorityBadge(chat.priority)}
                <Button size="sm" variant="outline" onClick={() => onQueueAction(String(chat.id))}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
