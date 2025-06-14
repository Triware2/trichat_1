
export interface CustomerData {
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

export interface CustomerInsights {
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

export interface InteractionTimeline {
  date: string;
  type: 'chat' | 'email' | 'phone';
  subject: string;
  agent: string;
  duration: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  resolution: string;
  satisfaction: number;
}

export interface IssueCategory {
  category: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  lastIssue: string;
}

export interface ProductUsage {
  product: string;
  usage: string;
  status: string;
  lastUsed: string;
}

export interface CommunicationPreferences {
  preferredChannel: string;
  preferredTime: string;
  language: string;
  notifications: string;
  frequency: string;
}

export interface OrderHistory {
  id: string;
  date: string;
  amount: string;
  status: string;
  items: string;
  satisfaction: number;
}

export interface Note {
  date: string;
  agent: string;
  note: string;
  type: string;
}
