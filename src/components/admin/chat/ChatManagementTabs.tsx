
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Settings, Users, BarChart3 } from 'lucide-react';
import { ChannelManagement } from './ChannelManagement';
import { ChatRules } from './ChatRules';
import { BulkChatOperations } from './BulkChatOperations';
import { ChatAnalytics } from './ChatAnalytics';

export const ChatManagementTabs = () => {
  const [activeTab, setActiveTab] = useState('channels');

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chat Management</h1>
              <p className="text-gray-600 mt-1">Manage chat channels, routing, and operations</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="bg-white border-b border-gray-200">
              <div className="px-4 sm:px-6 lg:px-8">
                <TabsList className="h-auto p-0 bg-transparent">
                  <TabsTrigger 
                    value="channels" 
                    className="flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors border-b-2 border-transparent rounded-none data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300 bg-transparent shadow-none"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Channel Control
                  </TabsTrigger>
                  <TabsTrigger 
                    value="rules" 
                    className="flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors border-b-2 border-transparent rounded-none data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300 bg-transparent shadow-none ml-8"
                  >
                    <Settings className="w-4 h-4" />
                    Chat Rules
                  </TabsTrigger>
                  <TabsTrigger 
                    value="bulk" 
                    className="flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors border-b-2 border-transparent rounded-none data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300 bg-transparent shadow-none ml-8"
                  >
                    <Users className="w-4 h-4" />
                    Bulk Operations
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics" 
                    className="flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors border-b-2 border-transparent rounded-none data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300 bg-transparent shadow-none ml-8"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>
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
        </div>
      </div>
    </div>
  );
};
