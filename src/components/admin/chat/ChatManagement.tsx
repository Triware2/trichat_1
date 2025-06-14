
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Settings, 
  Clock, 
  Users, 
  Filter,
  Play,
  Pause,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { ChannelManagement } from './ChannelManagement';
import { ChatRules } from './ChatRules';
import { BulkChatOperations } from './BulkChatOperations';
import { ChatAnalytics } from './ChatAnalytics';
import { QuickSetupModal } from './QuickSetupModal';
import { GlobalFiltersModal } from './GlobalFiltersModal';

export const ChatManagement = () => {
  const [activeTab, setActiveTab] = useState('channels');
  const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Mock data for demonstration
  const [stats] = useState({
    totalChats: 1247,
    activeChats: 89,
    waitingChats: 12,
    avgResponseTime: '2.3 min',
    channelsActive: 6,
    rulesActive: 15
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chat Management</h1>
          <p className="text-gray-600 mt-1">
            Complete control over chat channels, routing, and operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFiltersOpen(true)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Global Filters
          </Button>
          <Button 
            size="sm"
            onClick={() => setIsQuickSetupOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Quick Setup
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Chats</p>
                <p className="text-2xl font-bold">{stats.totalChats}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeChats}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Queue</p>
                <p className="text-2xl font-bold text-orange-600">{stats.waitingChats}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Channels</p>
                <p className="text-2xl font-bold">{stats.channelsActive}</p>
              </div>
              <Settings className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Rules</p>
                <p className="text-2xl font-bold">{stats.rulesActive}</p>
              </div>
              <Users className="w-8 h-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border shadow-sm rounded-xl p-1 h-auto">
          <TabsTrigger 
            value="channels" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-4"
          >
            <MessageSquare className="w-4 h-4" />
            Channel Control
          </TabsTrigger>
          <TabsTrigger 
            value="rules" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-4"
          >
            <Settings className="w-4 h-4" />
            Chat Rules
          </TabsTrigger>
          <TabsTrigger 
            value="bulk" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-4"
          >
            <Users className="w-4 h-4" />
            Bulk Operations
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-3 px-4"
          >
            <Clock className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="channels">
          <ChannelManagement />
        </TabsContent>

        <TabsContent value="rules">
          <ChatRules />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkChatOperations />
        </TabsContent>

        <TabsContent value="analytics">
          <ChatAnalytics />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <QuickSetupModal 
        open={isQuickSetupOpen} 
        onOpenChange={setIsQuickSetupOpen} 
      />
      
      <GlobalFiltersModal 
        open={isFiltersOpen} 
        onOpenChange={setIsFiltersOpen} 
      />
    </div>
  );
};
