
export interface CRMIntegration {
  id: string;
  name: string;
  type: 'salesforce' | 'hubspot' | 'freshdesk' | 'zendesk' | 'other';
  isActive: boolean;
  apiEndpoint?: string;
  credentials?: {
    apiKey?: string;
    token?: string;
    domain?: string;
  };
}

export interface TicketPriority {
  id: string;
  name: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  color: string;
}

export interface TicketCategory {
  id: string;
  name: string;
  description: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  chatId: number;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  crmIntegration: CRMIntegration;
  externalTicketId?: string;
  tags: string[];
  attachments: TicketAttachment[];
}

export interface TicketAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface TicketStats {
  totalRaised: number;
  resolved: number;
  pending: number;
  inProgress: number;
  resolutionRate: number;
}
