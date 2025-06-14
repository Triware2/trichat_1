
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Activity, AlertTriangle, User, FileText } from 'lucide-react';
import { OverviewTab } from './OverviewTab';
import { InteractionsTab } from './InteractionsTab';
import { IssuesTab } from './IssuesTab';
import { ProfileTab } from './ProfileTab';
import { NotesTab } from './NotesTab';

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  location: string;
  customerSince: string;
  tier: string;
  previousChats: number;
  satisfaction: number;
  lastContact: string;
  totalOrders: number;
  totalSpent: string;
}

interface CustomerInsights {
  healthScore: number;
  riskLevel: string;
  sentimentTrend: string;
  responseTime: string;
  resolutionRate: string;
  escalationRate: string;
  preferredChannel: string;
  timezone: string;
  lastLoginDate: string;
  accountStatus: string;
  paymentStatus: string;
  contractExpiry: string;
}

interface InteractionTimeline {
  date: string;
  type: 'chat' | 'email' | 'phone';
  subject: string;
  agent: string;
  duration: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  resolution: string;
  satisfaction: number;
}

interface IssueCategory {
  category: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  lastIssue: string;
}

interface ProductUsage {
  product: string;
  usage: string;
  status: string;
  lastUsed: string;
}

interface CommunicationPreferences {
  preferredChannel: string;
  preferredTime: string;
  language: string;
  notifications: string;
  frequency: string;
}

interface OrderHistory {
  id: string;
  date: string;
  amount: string;
  status: string;
  items: string;
  satisfaction: number;
}

interface Note {
  date: string;
  agent: string;
  note: string;
  type: string;
}

interface CustomerTabsContentProps {
  customer: CustomerData;
  customerInsights: CustomerInsights;
  interactionTimeline: InteractionTimeline[];
  issueCategories: IssueCategory[];
  productUsage: ProductUsage[];
  communicationPreferences: CommunicationPreferences;
  orderHistory: OrderHistory[];
  notes: Note[];
  onAddNote: (note: any) => void;
}

export const CustomerTabsContent = ({
  customer,
  customerInsights,
  interactionTimeline,
  issueCategories,
  productUsage,
  communicationPreferences,
  orderHistory,
  notes,
  onAddNote
}: CustomerTabsContentProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="interactions" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Activity className="w-4 h-4 mr-2" />
            Interactions
          </TabsTrigger>
          <TabsTrigger value="issues" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Issues
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            Notes
          </TabsTrigger>
        </TabsList>

        <div className="space-y-6">
          <TabsContent value="overview" className="space-y-6 mt-0">
            <OverviewTab 
              customerInsights={customerInsights}
              communicationPreferences={communicationPreferences}
              productUsage={productUsage}
            />
          </TabsContent>

          <TabsContent value="interactions" className="space-y-6 mt-0">
            <InteractionsTab interactionTimeline={interactionTimeline} />
          </TabsContent>

          <TabsContent value="issues" className="space-y-6 mt-0">
            <IssuesTab issueCategories={issueCategories} orderHistory={orderHistory} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 mt-0">
            <ProfileTab customer={customer} />
          </TabsContent>

          <TabsContent value="notes" className="space-y-6 mt-0">
            <NotesTab notes={notes} onAddNote={onAddNote} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
