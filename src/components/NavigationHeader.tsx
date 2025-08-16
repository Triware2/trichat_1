import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell, 
  Settings, 
  LogOut, 
  User,
  Search,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useFavicon } from '@/hooks/use-favicon';

interface Notification {
  id: string;
  message: string;
  created_at: string;
  type: "chat_assigned" | "message_received" | "escalation" | "system_alert";
  is_read: boolean;
}

interface NavigationHeaderProps {
  title: string;
  role?: 'admin' | 'supervisor' | 'agent';
  userEmail?: string;
}

export const NavigationHeader = ({ title, role = 'admin', userEmail = 'user@trichat.com' }: NavigationHeaderProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{chats: any[], messages: any[], customers: any[], agents: any[]}>({ chats: [], messages: [], customers: [], agents: [] });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  // Update favicon based on role
  useFavicon(role);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }
      setNotifications(data || []);
      setHasUnread(data?.some(n => !n.is_read) || false);
    };

    fetchNotifications();

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev]);
          setHasUnread(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'supervisor':
        return 'bg-blue-100 text-blue-800';
      case 'agent':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrichatLogoGradient = (role: string, title: string) => {
    // Special case for Platform Control Center - use purple gradient
    if (title === 'Platform Control Center') {
      return 'from-purple-500 to-purple-600';
    }
    // Special case for Platform Management page - also use purple
    if (title === 'Platform Management') {
      return 'from-purple-500 to-purple-600';
    }
    
    switch (role) {
      case 'admin':
        return 'from-orange-500 to-orange-600';
      case 'supervisor':
        return 'from-blue-500 to-blue-600';
      case 'agent':
        return 'from-[#11b890] to-[#0ea373]';
      default:
        return 'from-blue-600 to-purple-600';
    }
  };

  // Custom Chat Bubble Logo Component
  const ChatBubbleLogo = () => (
    <div className="relative w-5 h-5">
      {/* Chat bubble shape */}
      <div className="w-5 h-4 bg-white rounded-lg relative">
        {/* Two dots inside the bubble */}
        <div className="absolute inset-0 flex items-center justify-center space-x-1">
          <div className="w-1 h-1 bg-current rounded-full opacity-60"></div>
          <div className="w-1 h-1 bg-current rounded-full opacity-60"></div>
        </div>
      </div>
      {/* Chat bubble tail */}
      <div className="absolute -bottom-0.5 left-1 w-1.5 h-1.5 bg-white transform rotate-45 rounded-br-sm"></div>
    </div>
  );

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchOpen(true);
    // Search chats by customer, subject, or id
    const { data: chats } = await supabase
      .from('chats')
      .select('*')
      .or(`customer.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%,id.ilike.%${searchQuery}%`)
      .limit(10);
    // Search customers in 'customers' table by name, email, or phone
    let customers = [];
    try {
      const { data } = await supabase
        .from('customers')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
        .limit(10);
      customers = data || [];
    } catch {}
    // Search agents in 'profiles' table by full_name or email
    let agents = [];
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .eq('role', 'agent')
        .limit(10);
      agents = data || [];
    } catch {}
    // Search messages by content, join with chat info
    let messages = [];
    try {
      const { data: msgData } = await supabase
        .from('messages')
        .select('id, content, chat_id, created_at')
        .ilike('content', `%${searchQuery}%`)
        .limit(10);
      messages = msgData || [];
    } catch {}
    setSearchResults({ chats: chats || [], messages, customers, agents });
    setSearchLoading(false);
    setSearchOpen(true);
  };

  const handleResultClick = (type: string, id: any, extra?: any) => {
    setSearchOpen(false);
    setSearchQuery('');
    if (type === 'chat') {
      navigate(`/agent/active-chat/${id}`);
    } else if (type === 'customer') {
      navigate(`/agent/customer-360?customerId=${id}`);
    } else if (type === 'agent') {
      navigate(`/agent/profile/${id}`);
    } else if (type === 'message' && extra?.chat_id) {
      navigate(`/agent/active-chat/${extra.chat_id}?messageId=${id}`);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="w-full flex items-center justify-between h-16">
          {/* Left side - Logo and Brand */}
          <div className="flex items-center space-x-4 pl-4 sm:pl-6">
            <div className="flex items-center space-x-3">
              {/* Logo with role-based gradient */}
              <div className={`w-9 h-9 bg-gradient-to-br ${getTrichatLogoGradient(role, title)} rounded-lg flex items-center justify-center shadow-lg`}>
                <ChatBubbleLogo />
              </div>
              <span className="font-semibold text-xl text-gray-900 tracking-tight">Trichat</span>
            </div>
            
            {/* Title only (desktop) */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-gray-400">|</span>
              <h1 className="text-lg font-lexend font-medium text-gray-900">{title}</h1>
            </div>
          </div>

          {/* Center - Search (only for agents) */}
          {role === 'agent' && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search conversations, customers, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchOpen(true)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchLoading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
                  )}
                </div>
              </form>

              {/* Search Results Dropdown */}
              {searchOpen && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.chats.length === 0 && searchResults.messages.length === 0 && searchResults.customers.length === 0 && searchResults.agents.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No results found</div>
                  ) : (
                    <div className="p-2">
                      {searchResults.chats.length > 0 && (
                        <div className="mb-2">
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Chats</div>
                          {searchResults.chats.map((chat: any) => (
                            <button
                              key={chat.id}
                              onClick={() => handleResultClick('chat', chat.id)}
                              className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded flex items-center space-x-2"
                            >
                              <MessageSquare className="w-4 h-4 text-blue-500" />
                              <span className="truncate">Chat with {chat.customer_name || 'Unknown'}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searchResults.customers.length > 0 && (
                        <div className="mb-2">
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customers</div>
                          {searchResults.customers.map((customer: any) => (
                            <button
                              key={customer.id}
                              onClick={() => handleResultClick('customer', customer.id)}
                              className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded flex items-center space-x-2"
                            >
                              <User className="w-4 h-4 text-green-500" />
                              <span className="truncate">{customer.name || customer.email}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searchResults.agents.length > 0 && (
                        <div className="mb-2">
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Agents</div>
                          {searchResults.agents.map((agent: any) => (
                            <button
                              key={agent.id}
                              onClick={() => handleResultClick('agent', agent.id)}
                              className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded flex items-center space-x-2"
                            >
                              <User className="w-4 h-4 text-purple-500" />
                              <span className="truncate">{agent.full_name || agent.email}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searchResults.messages.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Messages</div>
                          {searchResults.messages.map((message: any) => (
                            <button
                              key={message.id}
                              onClick={() => handleResultClick('message', message.id, { chat_id: message.chat_id })}
                              className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded"
                            >
                              <div className="truncate text-sm">{message.content}</div>
                              <div className="text-xs text-gray-500">in chat {message.chat_id}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Right side - Notifications and User */}
          <div className="flex items-center space-x-4 pr-4 sm:pr-6 lg:pr-8">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {hasUnread && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                  ) : (
                    notifications.slice(0, 10).map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                        <div className="font-medium text-sm">{notification.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.name} />
                  <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-semibold">{user?.user_metadata?.name || 'User'}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/${role}/profile`)}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/${role}/settings`)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
                <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
};


