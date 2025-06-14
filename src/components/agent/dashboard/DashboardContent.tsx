
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/components/agent/DashboardStats';
import { QueueStatus } from '@/components/agent/QueueStatus';
import { RecentActivity } from '@/components/agent/RecentActivity';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

interface DashboardContentProps {
  stats: Array<{
    title: string;
    value: string;
    icon: any;
    color: string;
  }>;
  chats: Array<{
    id: number;
    customer: string;
    lastMessage: string;
    time: string;
    status: string;
    unread: number;
    priority: string;
  }>;
  activities: Array<{
    customer: string;
    action: string;
    time: string;
    type: string;
  }>;
  onStatClick: (statTitle: string) => void;
  onQueueAction: (customer: string) => void;
}

export const DashboardContent = ({ 
  stats, 
  chats, 
  activities, 
  onStatClick, 
  onQueueAction 
}: DashboardContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleGlobalSearch = () => {
    if (searchQuery.trim()) {
      console.log('Global search for:', searchQuery);
      // Global search functionality would be implemented here
    }
  };

  return (
    <TabsContent value="dashboard" className="h-full p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Global Search Section */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-500" />
              Global Search
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations, customers, tickets, or any content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleGlobalSearch()}
                />
              </div>
              <Button 
                onClick={handleGlobalSearch}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" className="px-4">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Search across all conversations, customer profiles, tickets, and knowledge base
            </p>
          </CardContent>
        </Card>

        <DashboardStats stats={stats} onStatClick={onStatClick} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <QueueStatus chats={chats} onQueueAction={onQueueAction} />
          <RecentActivity activities={activities} />
        </div>
      </div>
    </TabsContent>
  );
};
