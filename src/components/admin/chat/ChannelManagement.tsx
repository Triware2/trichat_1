import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Globe, 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Mail, 
  Smartphone,
  Code,
  Settings,
  Clock,
  Users,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { chatManagementService, ChatChannel } from '@/services/chatManagementService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ChannelManagementProps {
  onChannelUpdate?: () => void;
}

export const ChannelManagement = ({ onChannelUpdate }: ChannelManagementProps) => {
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<ChatChannel | null>(null);
  const [newChannel, setNewChannel] = useState({
    name: '',
    type: 'website' as const,
    status: 'active' as const,
    priority: 'medium' as const,
    max_concurrent_chats: 50,
    current_active_chats: 0,
    business_hours: {
      enabled: false,
      timezone: 'UTC',
      schedule: {}
    },
    auto_response: {
      enabled: false,
      message: '',
      delay: 0
    },
    routing: {
      type: 'round_robin' as const,
      fallback_agent: null,
      skill_requirements: []
    },
    config: {},
    is_active: true
  });
  const { toast } = useToast();

  // Fetch channels from service
  const fetchChannels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatManagementService.getChannels();
      setChannels(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch channels",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  // Add Channel
  const addChannel = async (channel: Omit<ChatChannel, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      await chatManagementService.createChannel(channel);
      await fetchChannels();
      onChannelUpdate?.();
      toast({
        title: "Success",
        description: "Channel created successfully",
      });
      setIsAddDialogOpen(false);
      // Reset form
      setNewChannel({
        name: '',
        type: 'website' as const,
        status: 'active' as const,
        priority: 'medium' as const,
        max_concurrent_chats: 50,
        current_active_chats: 0,
        business_hours: {
          enabled: false,
          timezone: 'UTC',
          schedule: {}
        },
        auto_response: {
          enabled: false,
          message: '',
          delay: 0
        },
        routing: {
          type: 'round_robin' as const,
          fallback_agent: null,
          skill_requirements: []
        },
        config: {},
        is_active: true
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleCreateChannel = async () => {
    if (!newChannel.name.trim()) {
      toast({
        title: "Error",
        description: "Channel name is required",
        variant: "destructive"
      });
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive"
      });
      return;
    }
    
    await addChannel({
      ...newChannel,
      created_by: user.id
    });
  };

  // Update Channel
  const updateChannel = async (id: string, updates: Partial<ChatChannel>) => {
    try {
      setLoading(true);
      await chatManagementService.updateChannel(id, updates);
      await fetchChannels();
      onChannelUpdate?.();
      toast({
        title: "Success",
        description: "Channel updated successfully",
      });
      setEditingChannel(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete Channel
  const deleteChannel = async (channelId: string) => {
    try {
      setLoading(true);
      await chatManagementService.deleteChannel(channelId);
      await fetchChannels();
      onChannelUpdate?.();
      toast({
        title: "Success",
        description: "Channel deleted successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle Channel Status
  const toggleChannelStatus = async (channelId: string) => {
    const channel = channels.find((c) => c.id === channelId);
    if (!channel) return;
    const newStatus = channel.status === 'active' ? 'inactive' : 'active';
    await updateChannel(channelId, { status: newStatus });
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'website': return <Globe className="w-5 h-5" />;
      case 'whatsapp': return <MessageCircle className="w-5 h-5" />;
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      case 'sms': return <Smartphone className="w-5 h-5" />;
      case 'api': return <Code className="w-5 h-5" />;
      default: return <MessageCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Channel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Channel</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Channel Type</Label>
                <Select 
                  value={newChannel.type} 
                  onValueChange={(value) => setNewChannel(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website Chat</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="facebook">Facebook Messenger</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="api">API Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Channel Name</Label>
                <Input 
                  placeholder="Enter channel name" 
                  value={newChannel.name}
                  onChange={(e) => setNewChannel(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select 
                  value={newChannel.priority} 
                  onValueChange={(value) => setNewChannel(prev => ({ ...prev, priority: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Max Concurrent Chats</Label>
                <Input 
                  type="number" 
                  placeholder="50" 
                  value={newChannel.max_concurrent_chats}
                  onChange={(e) => setNewChannel(prev => ({ ...prev, max_concurrent_chats: parseInt(e.target.value) || 50 }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateChannel}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Create Channel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {channels.map((channel) => (
          <Card key={channel.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {getChannelIcon(channel.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                    <Badge className={getStatusColor(channel.status)}>
                      {channel.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleChannelStatus(channel.id)}
                  >
                    {channel.status === 'active' ? 
                      <Pause className="w-4 h-4" /> : 
                      <Play className="w-4 h-4" />
                    }
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Active Chats */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Chats</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{channel.current_active_chats}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-600">{channel.max_concurrent_chats}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${(channel.current_active_chats / channel.max_concurrent_chats) * 100}%` 
                  }}
                />
              </div>

              {/* Business Hours */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Business Hours</span>
                <Switch 
                  checked={channel.business_hours.enabled}
                  onCheckedChange={(checked) => {
                    updateChannel(channel.id, { 
                      business_hours: { ...channel.business_hours, enabled: checked } 
                    });
                  }}
                />
              </div>

              {/* Auto Response */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Auto Response</span>
                <Switch 
                  checked={channel.auto_response.enabled}
                  onCheckedChange={(checked) => {
                    updateChannel(channel.id, { 
                      auto_response: { ...channel.auto_response, enabled: checked } 
                    });
                  }}
                />
              </div>

              {/* Routing Type */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Routing</span>
                <Badge variant="outline">
                  {channel.routing.type.replace('_', ' ')}
                </Badge>
              </div>

              {/* Priority */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Priority</span>
                <Badge 
                  variant={channel.priority === 'high' ? 'destructive' : 
                           channel.priority === 'medium' ? 'default' : 'secondary'}
                >
                  {channel.priority}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
