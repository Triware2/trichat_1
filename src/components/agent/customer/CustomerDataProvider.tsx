
import React, { createContext, useContext, ReactNode } from 'react';
import { 
  CustomerData, 
  CustomerInsights, 
  InteractionTimeline, 
  IssueCategory, 
  ProductUsage, 
  CommunicationPreferences, 
  OrderHistory, 
  Note 
} from './CustomerDataTypes';

interface CustomerDataContextType {
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

const CustomerDataContext = createContext<CustomerDataContextType | undefined>(undefined);

interface CustomerDataProviderProps {
  children: ReactNode;
  customerName: string;
}

export const CustomerDataProvider = ({ children, customerName }: CustomerDataProviderProps) => {
  // Mock data - in a real app this would come from an API
  const customer: CustomerData = {
    name: customerName,
    email: 'customer@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    customerSince: '2023-01-15',
    tier: 'Premium',
    previousChats: 12,
    satisfaction: 4.8,
    lastContact: '2024-01-10',
    totalOrders: 8,
    totalSpent: '$2,450.00'
  };

  const customerInsights: CustomerInsights = {
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

  const interactionTimeline: InteractionTimeline[] = [
    {
      date: '2024-01-12',
      type: 'chat',
      subject: 'Billing inquiry resolved',
      agent: 'Sarah Johnson',
      duration: '8 mins',
      sentiment: 'positive',
      resolution: 'Resolved',
      satisfaction: 5
    }
  ];

  const issueCategories: IssueCategory[] = [
    { category: 'Billing', count: 3, trend: 'down', lastIssue: '5 days ago' }
  ];

  const productUsage: ProductUsage[] = [
    { product: 'Premium Support', usage: '98%', status: 'Active', lastUsed: '2024-01-12' }
  ];

  const communicationPreferences: CommunicationPreferences = {
    preferredChannel: 'Live Chat',
    preferredTime: '9 AM - 5 PM EST',
    language: 'English',
    notifications: 'Email + SMS',
    frequency: 'Immediate for urgent, Daily digest for updates'
  };

  const orderHistory: OrderHistory[] = [
    {
      id: "#12345",
      date: "2024-01-15",
      amount: "$89.99",
      status: "Delivered",
      items: "Premium Support Plan",
      satisfaction: 5
    }
  ];

  const notes: Note[] = [
    {
      date: "2024-01-12",
      agent: "Sarah Johnson",
      note: "Customer expressed interest in enterprise features.",
      type: "insight"
    }
  ];

  const handleAddNote = (note: any) => {
    console.log('Adding note:', note);
  };

  const contextValue: CustomerDataContextType = {
    customer,
    customerInsights,
    interactionTimeline,
    issueCategories,
    productUsage,
    communicationPreferences,
    orderHistory,
    notes,
    onAddNote: handleAddNote
  };

  return (
    <CustomerDataContext.Provider value={contextValue}>
      {children}
    </CustomerDataContext.Provider>
  );
};

export const useCustomerData = () => {
  const context = useContext(CustomerDataContext);
  if (context === undefined) {
    throw new Error('useCustomerData must be used within a CustomerDataProvider');
  }
  return context;
};

export const getCustomerInsights = (): CustomerInsights => ({
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
});

export const getInteractionTimeline = (): InteractionTimeline[] => [
  {
    date: '2024-01-12',
    type: 'chat' as const,
    subject: 'Billing inquiry resolved',
    agent: 'Sarah Johnson',
    duration: '8 mins',
    sentiment: 'positive' as const,
    resolution: 'Resolved',
    satisfaction: 5
  }
];

export const getIssueCategories = (): IssueCategory[] => [
  { category: 'Billing', count: 3, trend: 'down' as const, lastIssue: '5 days ago' }
];

export const getProductUsage = (): ProductUsage[] => [
  { product: 'Premium Support', usage: '98%', status: 'Active', lastUsed: '2024-01-12' }
];

export const getCommunicationPreferences = (): CommunicationPreferences => ({
  preferredChannel: 'Live Chat',
  preferredTime: '9 AM - 5 PM EST',
  language: 'English',
  notifications: 'Email + SMS',
  frequency: 'Immediate for urgent, Daily digest for updates'
});

export const getOrderHistory = (): OrderHistory[] => [
  {
    id: "#12345",
    date: "2024-01-15",
    amount: "$89.99",
    status: "Delivered",
    items: "Premium Support Plan",
    satisfaction: 5
  }
];

export const getInitialNotes = (): Note[] => [
  {
    date: "2024-01-12",
    agent: "Sarah Johnson",
    note: "Customer expressed interest in enterprise features. Provided demo access and follow-up scheduled.",
    type: "insight"
  }
];
