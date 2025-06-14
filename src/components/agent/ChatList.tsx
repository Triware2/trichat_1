

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Clock } from 'lucide-react';

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
      'High': { variant: 'destructive' as const, color: 'bg-red-500' },
      'Medium': { variant: 'default' as const, color: 'bg-yellow-500' },
      'Low': { variant: 'secondary' as const, color: 'bg-green-500' }
    };
    return (
      <Badge variant={variants[priority as keyof typeof variants].variant} className="text-xs font-medium">
        {priority}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'urgent': { variant: 'destructive' as const, label: 'Urgent', color: 'bg-red-100 text-red-800' },
      'pending': { variant: 'default' as const, label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      'resolved': { variant: 'secondary' as const, label: 'Resolved', color: 'bg-green-100 text-green-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <Card className="h-full flex flex-col shadow-lg border-0 bg-white">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-slate-900">
          <span className="flex items-center gap-2">
            Active Chats
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
              {filteredChats.length}
            </Badge>
          </span>
        </CardTitle>
        <div className="flex gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all duration-200"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onFilter} 
            className="px-3 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="divide-y divide-slate-100">
          {filteredChats.map((chat) => (
            <div 
              key={chat.id} 
              className={`p-4 hover:bg-slate-50 cursor-pointer transition-all duration-200 ${
                selectedChat === chat.id 
                  ? 'bg-blue-50 border-r-4 border-r-blue-500 shadow-sm' 
                  : 'hover:shadow-sm'
              }`}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-md">
                    {chat.customer.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 text-sm truncate">{chat.customer}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{chat.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {chat.unread > 0 && (
                    <Badge variant="destructive" className="text-xs h-5 px-2 bg-red-500 hover:bg-red-600">
                      {chat.unread}
                    </Badge>
                  )}
                  {getPriorityBadge(chat.priority)}
                </div>
              </div>
              
              <p className="text-sm text-slate-600 truncate mb-3 pl-13">{chat.lastMessage}</p>
              
              <div className="flex items-center justify-between pl-13">
                {getStatusBadge(chat.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

