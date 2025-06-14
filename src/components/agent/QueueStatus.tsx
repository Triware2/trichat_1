
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
  onQueueAction: (customer: string) => void;
}

export const QueueStatus = ({ chats, onQueueAction }: QueueStatusProps) => {
  const getPriorityBadge = (priority: string) => {
    const variants = {
      'High': 'destructive',
      'Medium': 'default',
      'Low': 'secondary'
    } as const;
    return <Badge variant={variants[priority as keyof typeof variants]}>{priority}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Queue</CardTitle>
        <CardDescription>Current assigned conversations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {chats.slice(0, 3).map((chat, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{chat.customer}</p>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>
              <div className="flex items-center gap-2">
                {getPriorityBadge(chat.priority)}
                <Button size="sm" variant="outline" onClick={() => onQueueAction(chat.customer)}>
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
