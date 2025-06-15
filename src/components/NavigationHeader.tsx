
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
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface NavigationHeaderProps {
  title: string;
  role?: 'admin' | 'supervisor' | 'agent';
  userEmail?: string;
}

export const NavigationHeader = ({ title, role = 'admin', userEmail = 'user@trichat.com' }: NavigationHeaderProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleLogout = () => {
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Search functionality would be implemented here
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {/* New Azure-inspired Trichat Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {/* Main cube with Azure-inspired design */}
                  <div className={`w-9 h-9 bg-gradient-to-br ${getTrichatLogoGradient(role, title)} rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden`}>
                    {/* Modern geometric pattern */}
                    <div className="absolute inset-0 bg-white opacity-10">
                      <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-1 left-1 w-2 h-2 bg-white opacity-30 rounded-sm"></div>
                        <div className="absolute bottom-1 right-1 w-3 h-3 bg-white opacity-20 rounded-sm"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white opacity-40 rounded-full"></div>
                      </div>
                    </div>
                    {/* Central icon - simplified chat bubble */}
                    <div className="relative z-10">
                      <div className="w-5 h-4 bg-white rounded-lg relative">
                        <div className="absolute -bottom-1 left-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-white"></div>
                        <div className="absolute top-1 left-1 w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="absolute top-1 right-1 w-1 h-1 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`text-xl font-semibold bg-gradient-to-r ${getTrichatLogoGradient(role, title)} bg-clip-text text-transparent tracking-tight`}>
                  Trichat
                </span>
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-emerald-300 focus:ring-emerald-200 bg-gray-50"
                  />
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
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-lexend font-medium">
                3
              </span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback className={`bg-gradient-to-r ${getTrichatLogoGradient(role, title)} text-white font-lexend font-medium`}>
                      {(userEmail || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-lexend font-medium leading-none">
                      {role.charAt(0).toUpperCase() + role.slice(1)} User
                    </p>
                    <p className="text-xs leading-none text-muted-foreground font-lexend">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-lexend">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="font-lexend">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="font-lexend">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
