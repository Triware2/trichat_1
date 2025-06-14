
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface Chat {
  id: number;
  customer: string;
  lastMessage: string;
  time: string;
  status: string;
  unread: number;
  priority: string;
}

interface ChatListProps {
  chats: Chat[];
  selectedChat: number;
  onChatSelect: (chatId: number) => void;
  onFilter: () => void;
}

export const ChatList = ({ chats, selectedChat, onChatSelect, onFilter }: ChatListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'High': 'destructive',
      'Medium': 'default',
      'Low': 'secondary'
    } as const;
    return <Badge variant={variants[priority as keyof typeof variants]}>{priority}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'urgent': 'destructive',
      'pending': 'default',
      'resolved': 'secondary'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Active Chats</span>
          <Badge variant="outline">{filteredChats.length}</Badge>
        </CardTitle>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm" onClick={onFilter}>
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {filteredChats.map((chat) => (
            <div 
              key={chat.id} 
              className={`p-4 hover:bg-gray-50 cursor-pointer border-b transition-colors ${
                selectedChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{chat.customer}</h4>
                <div className="flex items-center gap-2">
                  {chat.unread > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {chat.unread}
                    </Badge>
                  )}
                  {getPriorityBadge(chat.priority)}
                </div>
              </div>
              <p className="text-sm text-gray-600 truncate mb-2">{chat.lastMessage}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{chat.time}</span>
                {getStatusBadge(chat.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
