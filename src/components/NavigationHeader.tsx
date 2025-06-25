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
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

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
        return 'from-red-500 to-orange-500';
      case 'supervisor':
        return 'from-blue-500 to-cyan-500';
      case 'agent':
        return 'from-emerald-500 to-teal-500';
      default:
        return 'from-blue-600 to-purple-600';
    }
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {/* Google Cloud-inspired Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  {/* You can add a cloud icon or keep your current logo here */}
                  <span className="text-white font-bold text-xl">T</span>
                </div>
              </div>
              <span className="font-semibold text-xl text-gray-900 tracking-tight">Trichat</span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">Supervisor Dashboard</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-gray-400">|</span>
            <h1 className="text-lg font-lexend font-medium text-gray-900">{title}</h1>
            <Badge className={getRoleBadgeColor(role)}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Center - Search (only for agents) */}
        {role === 'agent' && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations, customers, or content..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!e.target.value) setSearchOpen(false);
                  }}
                  onFocus={() => searchResults.chats.length + searchResults.messages.length + searchResults.customers.length + searchResults.agents.length > 0 && setSearchOpen(true)}
                  className="pl-10 border-gray-200 focus:border-emerald-300 focus:ring-emerald-200 bg-gray-50"
                />
                {/* Dropdown for search results */}
                {searchOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 max-h-96 overflow-y-auto">
                    {searchLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin w-6 h-6 text-emerald-500" />
                      </div>
                    ) : (
                      <>
                        {searchResults.chats.length > 0 && (
                          <div>
                            <div className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-500">Chats</div>
                            {searchResults.chats.map((chat) => (
                              <div key={chat.id} className="px-4 py-2 hover:bg-emerald-50 cursor-pointer flex flex-col gap-0.5" onClick={() => handleResultClick('chat', chat.id)}>
                                <span className="font-medium text-slate-800">{chat.customer}</span>
                                <span className="text-xs text-slate-400 truncate">{chat.subject}</span>
                                <span className="text-xs text-slate-300">Chat ID: {chat.id}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {searchResults.customers && searchResults.customers.length > 0 && (
                          <div>
                            <div className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-500">Customers</div>
                            {searchResults.customers.map((cust) => (
                              <div key={cust.id} className="px-4 py-2 hover:bg-orange-50 cursor-pointer flex flex-col gap-0.5" onClick={() => handleResultClick('customer', cust.id)}>
                                <span className="font-medium text-orange-700">{cust.name}</span>
                                <span className="text-xs text-slate-400">{cust.email || cust.phone}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {searchResults.agents && searchResults.agents.length > 0 && (
                          <div>
                            <div className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-500">Agents</div>
                            {searchResults.agents.map((agent) => (
                              <div key={agent.id} className="px-4 py-2 hover:bg-green-50 cursor-pointer flex flex-col gap-0.5" onClick={() => handleResultClick('agent', agent.id)}>
                                <span className="font-medium text-green-700">{agent.full_name}</span>
                                <span className="text-xs text-slate-400">{agent.email}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {searchResults.messages.length > 0 && (
                          <div>
                            <div className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-500">Messages</div>
                            {searchResults.messages.map((msg) => (
                              <div key={msg.id} className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex flex-col gap-0.5" onClick={() => handleResultClick('message', msg.id, msg)}>
                                <span className="text-slate-700 text-sm truncate">{msg.content}</span>
                                <span className="text-xs text-slate-400">In Chat: {msg.chat_id}</span>
                                <span className="text-xs text-slate-300">{new Date(msg.created_at).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {searchResults.chats.length + searchResults.messages.length + searchResults.customers.length + searchResults.agents.length === 0 && (
                          <div className="px-4 py-8 text-center text-slate-400">No results found.</div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Mobile search button for agents */}
          {role === 'agent' && (
            <Button variant="ghost" size="sm" className="md:hidden">
              <Search className="w-5 h-5" />
            </Button>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative rounded-full w-10 h-10">
                <Bell className="w-5 h-5" />
                {hasUnread && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1">
                    <p className={`text-sm font-medium ${!n.is_read ? 'text-slate-800' : 'text-slate-500'}`}>{n.message}</p>
                    <p className="text-xs text-slate-400">{new Date(n.created_at).toLocaleString()}</p>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No new notifications
                </div>
              )}
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
              <DropdownMenuItem onClick={() => navigate('/agent/profile')}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/agent/settings')}>
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
