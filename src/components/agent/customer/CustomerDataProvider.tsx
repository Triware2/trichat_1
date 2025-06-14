
import { CustomerInsights, InteractionTimeline, IssueCategory, ProductUsage, CommunicationPreferences, OrderHistory, Note } from './CustomerDataTypes';

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

export const getIssueCategories = (): IssueCategory[] => [
  { category: 'Billing', count: 3, trend: 'down' as const, lastIssue: '5 days ago' },
  { category: 'Technical', count: 2, trend: 'stable' as const, lastIssue: '8 days ago' },
  { category: 'Account', count: 1, trend: 'down' as const, lastIssue: '12 days ago' },
  { category: 'Feature Request', count: 2, trend: 'up' as const, lastIssue: '2 days ago' }
];

export const getProductUsage = (): ProductUsage[] => [
  { product: 'Premium Support', usage: '98%', status: 'Active', lastUsed: '2024-01-12' },
  { product: 'Advanced Analytics', usage: '67%', status: 'Active', lastUsed: '2024-01-11' },
  { product: 'API Access', usage: '23%', status: 'Active', lastUsed: '2024-01-08' },
  { product: 'Mobile App', usage: '89%', status: 'Active', lastUsed: '2024-01-12' }
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

export const getInitialNotes = (): Note[] => [
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
];
