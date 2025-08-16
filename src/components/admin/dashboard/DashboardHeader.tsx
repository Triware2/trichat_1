
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Search, Plus, Download, Menu, Users, Settings, Bot, Key, Clock, Star, BarChart3, MessageSquare, Database, Palette, Headphones, CreditCard, ClipboardList, Loader2, FileText, UserPlus, Download as DownloadIcon, Bell as BellIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface DashboardHeaderProps {
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onTabChange?: (tab: string) => void;
}

interface SearchResult {
  id: string;
  title: string;
  type: string;
  description: string;
  icon: any;
  action: () => void;
}

export const DashboardHeader = ({ isSidebarCollapsed = false, onToggleSidebar, onTabChange }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'New user registration', time: '2 min ago', type: 'user' },
    { id: '2', message: 'System update completed', time: '5 min ago', type: 'system' },
    { id: '3', message: 'API key expired', time: '10 min ago', type: 'warning' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search functionality
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const results: SearchResult[] = [
      {
        id: 'users',
        title: 'User Management',
        type: 'section',
        description: 'Manage users, roles, and permissions',
        icon: Users,
        action: () => {
          onTabChange?.('users');
          setSearchQuery('');
          setShowSearchResults(false);
          toast({ title: "Navigated to User Management", description: "Search result selected" });
        }
      },
      {
        id: 'settings',
        title: 'System Settings',
        type: 'section',
        description: 'Configure system preferences and integrations',
        icon: Settings,
        action: () => {
          onTabChange?.('settings');
          setSearchQuery('');
          setShowSearchResults(false);
          toast({ title: "Navigated to System Settings", description: "Search result selected" });
        }
      },
      {
        id: 'chatbot',
        title: 'Bot Training',
        type: 'section',
        description: 'Train and configure AI chatbots',
        icon: Bot,
        action: () => {
          onTabChange?.('chatbot');
          setSearchQuery('');
          setShowSearchResults(false);
          toast({ title: "Navigated to Bot Training", description: "Search result selected" });
        }
      },
      {
        id: 'api-keys',
        title: 'API Keys',
        type: 'section',
        description: 'Manage API keys and access tokens',
        icon: Key,
        action: () => {
          onTabChange?.('api-keys');
          setSearchQuery('');
          setShowSearchResults(false);
          toast({ title: "Navigated to API Keys", description: "Search result selected" });
        }
      },
      {
        id: 'analytics',
        title: 'Analytics Dashboard',
        type: 'section',
        description: 'View performance metrics and insights',
        icon: BarChart3,
        action: () => {
          onTabChange?.('analytics');
          setSearchQuery('');
          setShowSearchResults(false);
          toast({ title: "Navigated to Analytics", description: "Search result selected" });
        }
      },
      {
        id: 'billing',
        title: 'Billing & Plans',
        type: 'section',
        description: 'Manage subscriptions and billing',
        icon: CreditCard,
        action: () => {
          navigate('/billing');
          setSearchQuery('');
          setShowSearchResults(false);
          toast({ title: "Navigated to Billing", description: "Search result selected" });
        }
      }
    ];

    // Filter results based on query
    const filtered = results.filter(result =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase()) ||
      result.type.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filtered);
    setIsSearching(false);
    setShowSearchResults(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      searchResults[0].action();
    }
  };

  // New item functionality
  const handleNewItem = () => {
    toast({
      title: "Quick Actions",
      description: "Select what you'd like to create",
    });
  };

  // Export functionality
  const handleExport = () => {
    toast({
      title: "Export Options",
      description: "Choose what data to export",
    });
  };

  // Notification functionality
  const handleNotificationClick = (notification: any) => {
    toast({
      title: "Notification",
      description: notification.message,
    });
    setShowNotifications(false);
  };

  return (
    <div className="bg-white border-b border-slate-200/60 sticky top-0 z-30">
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Toggle + Search */}
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            {onToggleSidebar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="p-2 h-9 w-9"
              >
                <Menu className="w-4 h-4 text-slate-600" />
              </Button>
            )}
            <div className="relative flex-1" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search admin panel..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSearchResults(true)}
                  className="pl-10 h-9 border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white text-sm"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 animate-spin" />
                )}
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-slate-500">
                      {isSearching ? 'Searching...' : 'No results found'}
                    </div>
                  ) : (
                    <div className="p-2">
                      <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Quick Navigation
                      </div>
                      {searchResults.map((result) => {
                        const Icon = result.icon;
                        return (
                          <button
                            key={result.id}
                            onClick={result.action}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-md flex items-center space-x-3 transition-colors"
                          >
                            <Icon className="w-4 h-4 text-slate-500" />
                            <div className="flex-1">
                              <div className="font-medium text-slate-900">{result.title}</div>
                              <div className="text-xs text-slate-500">{result.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50">
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Create New</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onTabChange?.('users')}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  New User
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTabChange?.('api-keys')}>
                  <Key className="w-4 h-4 mr-2" />
                  API Key
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTabChange?.('chatbot')}>
                  <Bot className="w-4 h-4 mr-2" />
                  Chatbot
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTabChange?.('datasources')}>
                  <Database className="w-4 h-4 mr-2" />
                  Data Source
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Export Data</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast({ title: "Export Users", description: "User data export started" })}>
                  <Users className="w-4 h-4 mr-2" />
                  Users Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "Export Analytics", description: "Analytics data export started" })}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "Export Settings", description: "System settings export started" })}>
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "Export All", description: "Full system export started" })}>
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Complete Backup
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative p-2">
                  <Bell className="w-4 h-4 text-slate-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-orange-500 text-white rounded-full">
                    {notifications.length}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="flex flex-col items-start p-3"
                  >
                    <div className="flex items-center w-full">
                      <BellIcon className="w-4 h-4 mr-2 text-slate-500" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{notification.message}</div>
                        <div className="text-xs text-slate-500">{notification.time}</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast({ title: "Mark All Read", description: "All notifications marked as read" })}>
                  <FileText className="w-4 h-4 mr-2" />
                  Mark All as Read
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
