
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, BarChart3, Activity, AlertTriangle, FileText } from 'lucide-react';
import { CustomerHeader } from './customer/CustomerHeader';
import { CustomerSearch } from './customer/CustomerSearch';
import { OverviewTab } from './customer/OverviewTab';
import { InteractionsTab } from './customer/InteractionsTab';
import { IssuesTab } from './customer/IssuesTab';
import { ProfileTab } from './customer/ProfileTab';
import { NotesTab } from './customer/NotesTab';

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

interface CustomerInfoProps {
  customer: CustomerData;
}

export const CustomerInfo = ({ customer }: CustomerInfoProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentCustomer, setCurrentCustomer] = useState(customer);

  // Enhanced customer data with 360-degree insights
  const customerInsights = {
    healthScore: 85,
    riskLevel: 'Low',
    sentimentTrend: 'Positive',
    responseTime: '2.3 mins',
    resolutionRate: '94%',
    escalationRate: '3%',
    preferredChannel: 'Chat',
    timezone: 'EST (GMT-5)',
    lastLoginDate: '2024-01-12',
    accountStatus: 'Active',
    paymentStatus: 'Current',
    contractExpiry: '2024-12-31'
  };

  const interactionTimeline = [
    {
      date: '2024-01-12',
      type: 'chat' as const,
      subject: 'Billing inquiry resolved',
      agent: 'Sarah Johnson',
      duration: '8 mins',
      sentiment: 'positive' as const,
      resolution: 'Resolved',
      satisfaction: 5
    },
    {
      date: '2024-01-10',
      type: 'email' as const,
      subject: 'Feature request submitted',
      agent: 'Mike Chen',
      duration: 'N/A',
      sentiment: 'neutral' as const,
      resolution: 'In Progress',
      satisfaction: 4
    },
    {
      date: '2024-01-08',
      type: 'phone' as const,
      subject: 'Technical support provided',
      agent: 'Emily Rodriguez',
      duration: '15 mins',
      sentiment: 'positive' as const,
      resolution: 'Resolved',
      satisfaction: 5
    },
    {
      date: '2024-01-05',
      type: 'chat' as const,
      subject: 'Account settings updated',
      agent: 'David Wilson',
      duration: '5 mins',
      sentiment: 'positive' as const,
      resolution: 'Resolved',
      satisfaction: 4
    }
  ];

  const issueCategories = [
    { category: 'Billing', count: 3, trend: 'down' as const, lastIssue: '5 days ago' },
    { category: 'Technical', count: 2, trend: 'stable' as const, lastIssue: '8 days ago' },
    { category: 'Account', count: 1, trend: 'down' as const, lastIssue: '12 days ago' },
    { category: 'Feature Request', count: 2, trend: 'up' as const, lastIssue: '2 days ago' }
  ];

  const productUsage = [
    { product: 'Premium Support', usage: '98%', status: 'Active', lastUsed: '2024-01-12' },
    { product: 'Advanced Analytics', usage: '67%', status: 'Active', lastUsed: '2024-01-11' },
    { product: 'API Access', usage: '23%', status: 'Active', lastUsed: '2024-01-08' },
    { product: 'Mobile App', usage: '89%', status: 'Active', lastUsed: '2024-01-12' }
  ];

  const communicationPreferences = {
    preferredChannel: 'Live Chat',
    preferredTime: '9 AM - 5 PM EST',
    language: 'English',
    notifications: 'Email + SMS',
    frequency: 'Immediate for urgent, Daily digest for updates'
  };

  const orderHistory = [
    {
      id: "#12345",
      date: "2024-01-15",
      amount: "$89.99",
      status: "Delivered",
      items: "Premium Support Plan",
      satisfaction: 5
    },
    {
      id: "#12344",
      date: "2024-01-10",
      amount: "$29.99",
      status: "Delivered",
      items: "Monthly Subscription",
      satisfaction: 4
    },
    {
      id: "#12343",
      date: "2023-12-28",
      amount: "$159.99",
      status: "Delivered",
      items: "Annual Plan Upgrade",
      satisfaction: 5
    }
  ];

  const [notes, setNotes] = useState([
    {
      date: "2024-01-12",
      agent: "Sarah Johnson",
      note: "Customer expressed interest in enterprise features. Provided demo access and follow-up scheduled.",
      type: "insight"
    },
    {
      date: "2024-01-10",
      agent: "Mike Chen",
      note: "Resolved login issue. Customer mentioned slow response time - escalated to dev team.",
      type: "technical"
    },
    {
      date: "2024-01-08",
      agent: "Emily Rodriguez",
      note: "Customer is very satisfied with recent updates. Potential advocate for case studies.",
      type: "feedback"
    }
  ]);

  const handleCustomerFound = (foundCustomer: CustomerData) => {
    setCurrentCustomer(foundCustomer);
  };

  const handleAddNote = (note: any) => {
    setNotes([note, ...notes]);
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Customer 360° View</h2>
            <p className="text-sm text-slate-600">Complete customer insights for better support</p>
          </div>
        </div>

        <CustomerSearch onCustomerFound={handleCustomerFound} />
        <CustomerHeader customer={currentCustomer} customerInsights={customerInsights} />
      </div>

      {/* Tabs Content */}
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
              <ProfileTab customer={currentCustomer} />
            </TabsContent>

            <TabsContent value="notes" className="space-y-6 mt-0">
              <NotesTab notes={notes} onAddNote={handleAddNote} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
