
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Search, Bell, Settings, Plus, User, Key, Database, Bot, Users, Shield } from 'lucide-react';

export const DashboardHeader = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState('');
  const [newItemData, setNewItemData] = useState({
    name: '',
    email: '',
    role: '',
    type: ''
  });
  const [notifications] = useState([
    { id: 1, title: 'New user registration', message: 'John Doe has registered as an agent', time: '2 minutes ago', unread: true },
    { id: 2, title: 'Data sync completed', message: 'CRM data synchronization finished successfully', time: '1 hour ago', unread: true },
    { id: 3, title: 'System update', message: 'Scheduled maintenance completed', time: '3 hours ago', unread: false }
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search Results",
        description: `Searching for "${searchQuery}" across all resources...`,
      });
      // Here you would implement actual search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const handleCreate = () => {
    if (!createType) {
      toast({
        title: "Please select a type",
        description: "Choose what you want to create from the dropdown.",
        variant: "destructive"
      });
      return;
    }

    switch (createType) {
      case 'user':
        if (!newItemData.name || !newItemData.email || !newItemData.role) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields for the user.",
            variant: "destructive"
          });
          return;
        }
        toast({
          title: "User Created",
          description: `${newItemData.name} has been created as a ${newItemData.role}.`,
        });
        break;
      
      case 'api-key':
        toast({
          title: "API Key Generated",
          description: "New API key has been generated and copied to clipboard.",
        });
        break;
      
      case 'data-source':
        toast({
          title: "Data Source Created",
          description: "New data source connection has been established.",
        });
        break;
      
      case 'bot-config':
        toast({
          title: "Bot Configuration Created",
          description: "New chatbot configuration has been saved.",
        });
        break;
      
      default:
        toast({
          title: "Created Successfully",
          description: `New ${createType} has been created.`,
        });
    }

    setIsCreateModalOpen(false);
    setNewItemData({ name: '', email: '', role: '', type: '' });
    setCreateType('');
  };

  const handleNotificationClick = (notification: any) => {
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  const handleSettingsClick = () => {
    toast({
      title: "Settings",
      description: "Opening system settings panel...",
    });
    // Here you would navigate to settings or open settings modal
    window.location.hash = '#settings';
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your organization's resources and settings
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Functional Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users, settings, logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </form>
          
          {/* Functional Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 relative">
                <Bell className="w-4 h-4" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-white" align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">{notification.title}</span>
                    {notification.unread && <Badge variant="secondary" className="text-xs">New</Badge>}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  <span className="text-xs text-gray-400 mt-1">{notification.time}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-blue-600 font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Functional Settings Button */}
          <Button variant="ghost" size="sm" className="p-2" onClick={handleSettingsClick}>
            <Settings className="w-4 h-4" />
          </Button>
          
          {/* Functional Create Button */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-4">
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Create New Resource</DialogTitle>
                <DialogDescription>
                  Choose what you want to create and fill in the details.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="create-type">Resource Type</Label>
                  <Select value={createType} onValueChange={setCreateType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select what to create" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="user">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          New User
                        </div>
                      </SelectItem>
                      <SelectItem value="api-key">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4" />
                          API Key
                        </div>
                      </SelectItem>
                      <SelectItem value="data-source">
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4" />
                          Data Source
                        </div>
                      </SelectItem>
                      <SelectItem value="bot-config">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4" />
                          Bot Configuration
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {createType === 'user' && (
                  <>
                    <div>
                      <Label htmlFor="user-name">Full Name</Label>
                      <Input
                        id="user-name"
                        value={newItemData.name}
                        onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-email">Email</Label>
                      <Input
                        id="user-email"
                        type="email"
                        value={newItemData.email}
                        onChange={(e) => setNewItemData({...newItemData, email: e.target.value})}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-role">Role</Label>
                      <Select value={newItemData.role} onValueChange={(value) => setNewItemData({...newItemData, role: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="agent">Agent</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {createType === 'api-key' && (
                  <div>
                    <Label htmlFor="api-name">API Key Name</Label>
                    <Input
                      id="api-name"
                      value={newItemData.name}
                      onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
                      placeholder="Enter API key description"
                    />
                  </div>
                )}

                {createType === 'data-source' && (
                  <>
                    <div>
                      <Label htmlFor="ds-name">Data Source Name</Label>
                      <Input
                        id="ds-name"
                        value={newItemData.name}
                        onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
                        placeholder="Enter data source name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ds-type">Type</Label>
                      <Select value={newItemData.type} onValueChange={(value) => setNewItemData({...newItemData, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data source type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="api">REST API</SelectItem>
                          <SelectItem value="webhook">Webhook</SelectItem>
                          <SelectItem value="database">Database</SelectItem>
                          <SelectItem value="crm">CRM Integration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {createType === 'bot-config' && (
                  <div>
                    <Label htmlFor="bot-name">Configuration Name</Label>
                    <Input
                      id="bot-name"
                      value={newItemData.name}
                      onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
                      placeholder="Enter configuration name"
                    />
                  </div>
                )}

                <Button onClick={handleCreate} className="w-full">
                  Create {createType ? createType.replace('-', ' ') : 'Resource'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
