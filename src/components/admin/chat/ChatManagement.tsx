
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Chat Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Complete control over chat channels, routing, and operations
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFiltersOpen(true)}
            className="w-full sm:w-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            Global Filters
          </Button>
          <Button 
            size="sm"
            onClick={() => setIsQuickSetupOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Quick Setup
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Chats</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.totalChats}</p>
              </div>
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Active Now</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.activeChats}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">In Queue</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats.waitingChats}</p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Avg Response</p>
                <p className="text-lg sm:text-2xl font-bold">{stats.avgResponseTime}</p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Channels</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.channelsActive}</p>
              </div>
              <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Active Rules</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.rulesActive}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-4 bg-white border shadow-sm rounded-xl p-1 h-auto min-w-[600px] sm:min-w-0">
            <TabsTrigger 
              value="channels" 
              className="flex items-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm"
            >
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Channel Control</span>
              <span className="sm:hidden">Channels</span>
            </TabsTrigger>
            <TabsTrigger 
              value="rules" 
              className="flex items-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Chat Rules</span>
              <span className="sm:hidden">Rules</span>
            </TabsTrigger>
            <TabsTrigger 
              value="bulk" 
              className="flex items-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Bulk Operations</span>
              <span className="sm:hidden">Bulk</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-1 sm:gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm"
            >
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </TabsTrigger>
          </TabsList>
        </div>

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
