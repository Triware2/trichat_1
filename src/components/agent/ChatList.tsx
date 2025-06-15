
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Clock, MoreHorizontal } from 'lucide-react';

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

  const getPriorityColor = (priority: string) => {
    const colors = {
      'High': 'bg-red-50 text-red-700 border-red-200',
      'Medium': 'bg-amber-50 text-amber-700 border-amber-200',
      'Low': 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
    return colors[priority as keyof typeof colors] || colors.Low;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'urgent': 'bg-red-500',
      'pending': 'bg-amber-500',
      'resolved': 'bg-emerald-500'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header - Fixed */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Conversations</h2>
            <p className="text-xs text-slate-600">{filteredChats.length} active chats</p>
          </div>
          <Button variant="outline" size="sm" onClick={onFilter} className="hover:bg-slate-100 p-2">
            <Filter className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-sm border-slate-200 focus:border-orange-300 focus:ring-orange-200 bg-white h-8"
          />
        </div>
      </div>

      {/* Chat List - Independently Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-base font-medium text-slate-900 mb-1">No conversations found</h3>
            <p className="text-xs text-slate-600">Try adjusting your search terms or check back later.</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div 
              key={chat.id} 
              className={`p-3 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50 ${
                selectedChat === chat.id 
                  ? 'bg-orange-50 border-r-4 border-r-orange-500 shadow-sm' 
                  : ''
              }`}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white font-medium text-xs shadow-md">
                    {chat.customer.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(chat.status)} rounded-full border-2 border-white shadow-sm`}></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 truncate text-sm">{chat.customer}</h3>
                    <div className="flex items-center space-x-1">
                      {chat.unread > 0 && (
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {chat.unread}
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-slate-200 rounded-full">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-600 truncate mb-2 leading-relaxed">{chat.lastMessage}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500 font-medium">{chat.time}</span>
                    </div>
                    <Badge variant="outline" className={`text-xs font-medium border px-1.5 py-0.5 ${getPriorityColor(chat.priority)}`}>
                      {chat.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
