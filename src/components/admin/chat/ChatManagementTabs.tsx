
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">Chat Management</h1>
        </div>
        <p className="text-sm text-slate-600">Manage chat channels, routing, and operations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0">
        <div className="border-b border-slate-200">
          <TabsList className="h-auto bg-transparent p-0 space-x-0">
            <div className="flex">
              <TabsTrigger 
                value="channels" 
                className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
              >
                <MessageSquare className="w-4 h-4" />
                Channels
              </TabsTrigger>
              <TabsTrigger 
                value="rules" 
                className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
              >
                <Settings className="w-4 h-4" />
                Rules
              </TabsTrigger>
              <TabsTrigger 
                value="bulk" 
                className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
              >
                <Users className="w-4 h-4" />
                Bulk Operations
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 bg-transparent rounded-none border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </div>
          </TabsList>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <TabsContent value="channels" className="mt-0 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Channel Management</h3>
                <p className="text-gray-600 mt-1">Configure and manage your communication channels</p>
              </div>
              <ChannelManagement />
            </div>
          </TabsContent>

          <TabsContent value="rules" className="mt-0 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Chat Rules</h3>
                <p className="text-gray-600 mt-1">Set up automated routing and response rules</p>
              </div>
              <ChatRules />
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="mt-0 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Bulk Operations</h3>
                <p className="text-gray-600 mt-1">Perform actions on multiple conversations</p>
              </div>
              <BulkChatOperations />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Chat Analytics</h3>
                <p className="text-gray-600 mt-1">Analyze conversation patterns and performance</p>
              </div>
              <ChatAnalytics />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
