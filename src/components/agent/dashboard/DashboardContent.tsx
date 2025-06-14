
import { TabsContent } from '@/components/ui/tabs';
import { DashboardStats } from '@/components/agent/DashboardStats';
import { QueueStatus } from '@/components/agent/QueueStatus';
import { RecentActivity } from '@/components/agent/RecentActivity';

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
  return (
    <TabsContent value="dashboard" className="h-full p-6 overflow-y-auto">
      <div className="space-y-6">
        <DashboardStats stats={stats} onStatClick={onStatClick} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <QueueStatus chats={chats} onQueueAction={onQueueAction} />
          <RecentActivity activities={activities} />
        </div>
      </div>
    </TabsContent>
  );
};
