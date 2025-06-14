
export interface ChatChannel {
  id: string;
  name: string;
  type: 'website' | 'whatsapp' | 'facebook' | 'instagram' | 'email' | 'sms' | 'api';
  status: 'active' | 'inactive' | 'maintenance';
  priority: 'high' | 'medium' | 'low';
  maxConcurrentChats: number;
  currentActiveChats: number;
  businessHours: {
    enabled: boolean;
    timezone: string;
    schedule: {
      [key: string]: {
        start: string;
        end: string;
        enabled: boolean;
      };
    };
  };
  autoResponse: {
    enabled: boolean;
    message: string;
    delay: number;
  };
  routing: {
    type: 'round_robin' | 'least_busy' | 'skill_based' | 'random';
    fallbackAgent?: string;
    skillRequirements: string[];
  };
}

export interface ChatRule {
  id: string;
  name: string;
  conditions: {
    channel?: string[];
    timeRange?: {
      start: string;
      end: string;
    };
    customerType?: 'new' | 'returning' | 'vip' | 'all';
    keywords?: string[];
    sentiment?: 'positive' | 'negative' | 'neutral';
  };
  actions: {
    assignTo?: string;
    priority?: 'high' | 'medium' | 'low';
    autoResponse?: string;
    escalate?: boolean;
    tag?: string[];
  };
  enabled: boolean;
  createdAt: string;
}

export interface BulkOperation {
  id: string;
  type: 'assign' | 'close' | 'tag' | 'priority' | 'archive' | 'delete';
  status: 'pending' | 'running' | 'completed' | 'failed';
  totalChats: number;
  processedChats: number;
  createdAt: string;
  createdBy: string;
  parameters: Record<string, any>;
}

export interface ChatFilter {
  channels: string[];
  status: string[];
  priority: string[];
  agents: string[];
  dateRange: {
    start: string;
    end: string;
  };
  tags: string[];
}
