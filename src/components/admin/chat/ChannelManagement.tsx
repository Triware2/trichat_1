
import { useState } from 'react';
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
  Pause
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChatChannel } from './types';

export const ChannelManagement = () => {
  const [channels, setChannels] = useState<ChatChannel[]>([
    {
      id: '1',
      name: 'Website Chat',
      type: 'website',
      status: 'active',
      priority: 'high',
      maxConcurrentChats: 50,
      currentActiveChats: 23,
      businessHours: {
        enabled: true,
        timezone: 'UTC',
        schedule: {
          monday: { start: '09:00', end: '17:00', enabled: true },
          tuesday: { start: '09:00', end: '17:00', enabled: true },
          wednesday: { start: '09:00', end: '17:00', enabled: true },
          thursday: { start: '09:00', end: '17:00', enabled: true },
          friday: { start: '09:00', end: '17:00', enabled: true },
          saturday: { start: '10:00', end: '14:00', enabled: false },
          sunday: { start: '10:00', end: '14:00', enabled: false }
        }
      },
      autoResponse: {
        enabled: true,
        message: 'Hello! We\'ll be with you shortly.',
        delay: 30
      },
      routing: {
        type: 'least_busy',
        skillRequirements: ['general_support']
      }
    },
    {
      id: '2',
      name: 'WhatsApp Business',
      type: 'whatsapp',
      status: 'active',
      priority: 'medium',
      maxConcurrentChats: 30,
      currentActiveChats: 8,
      businessHours: {
        enabled: true,
        timezone: 'UTC',
        schedule: {
          monday: { start: '08:00', end: '20:00', enabled: true },
          tuesday: { start: '08:00', end: '20:00', enabled: true },
          wednesday: { start: '08:00', end: '20:00', enabled: true },
          thursday: { start: '08:00', end: '20:00', enabled: true },
          friday: { start: '08:00', end: '20:00', enabled: true },
          saturday: { start: '09:00', end: '18:00', enabled: true },
          sunday: { start: '09:00', end: '18:00', enabled: false }
        }
      },
      autoResponse: {
        enabled: true,
        message: 'Thanks for reaching out! An agent will respond soon.',
        delay: 60
      },
      routing: {
        type: 'skill_based',
        skillRequirements: ['whatsapp_support', 'mobile_support']
      }
    },
    {
      id: '3',
      name: 'Facebook Messenger',
      type: 'facebook',
      status: 'inactive',
      priority: 'low',
      maxConcurrentChats: 20,
      currentActiveChats: 0,
      businessHours: {
        enabled: false,
        timezone: 'UTC',
        schedule: {}
      },
      autoResponse: {
        enabled: false,
        message: '',
        delay: 0
      },
      routing: {
        type: 'round_robin',
        skillRequirements: ['social_media']
      }
    }
  ]);

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

  const toggleChannelStatus = (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { 
            ...channel, 
            status: channel.status === 'active' ? 'inactive' : 'active' 
          }
        : channel
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Channel Management</h2>
        <Dialog>
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
                <Select>
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
                <Input placeholder="Enter channel name" />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select>
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
                <Input type="number" placeholder="50" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Channel</Button>
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
                  <span className="font-semibold">{channel.currentActiveChats}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-600">{channel.maxConcurrentChats}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${(channel.currentActiveChats / channel.maxConcurrentChats) * 100}%` 
                  }}
                />
              </div>

              {/* Business Hours */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Business Hours</span>
                <Switch 
                  checked={channel.businessHours.enabled}
                  onCheckedChange={(checked) => {
                    setChannels(prev => prev.map(ch => 
                      ch.id === channel.id 
                        ? { 
                            ...ch, 
                            businessHours: { ...ch.businessHours, enabled: checked }
                          }
                        : ch
                    ));
                  }}
                />
              </div>

              {/* Auto Response */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Auto Response</span>
                <Switch 
                  checked={channel.autoResponse.enabled}
                  onCheckedChange={(checked) => {
                    setChannels(prev => prev.map(ch => 
                      ch.id === channel.id 
                        ? { 
                            ...ch, 
                            autoResponse: { ...ch.autoResponse, enabled: checked }
                          }
                        : ch
                    ));
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
