
export interface Survey {
  id: string;
  name: string;
  type: 'CSAT' | 'NPS' | 'CES';
  description: string;
  channels: ('email' | 'sms' | 'in-app' | 'chat')[];
  triggers: SurveyTrigger[];
  questions: SurveyQuestion[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyTrigger {
  id: string;
  event: 'ticket_resolved' | 'chat_ended' | 'interaction_completed';
  delay: number; // minutes
  conditions: TriggerCondition[];
}

export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number;
}

export interface SurveyQuestion {
  id: string;
  type: 'rating' | 'text' | 'multiple_choice' | 'nps';
  question: string;
  required: boolean;
  options?: string[];
  scale?: {
    min: number;
    max: number;
    labels?: string[];
  };
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  customerId: string;
  agentId: string;
  ticketId?: string;
  chatId?: string;
  channel: string;
  responses: QuestionResponse[];
  overallRating: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  submittedAt: string;
}

export interface QuestionResponse {
  questionId: string;
  answer: string | number;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface CSATMetrics {
  averageCSAT: number;
  averageNPS: number;
  averageCES: number;
  responseRate: number;
  totalResponses: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  trendData: {
    date: string;
    csat: number;
    nps: number;
    ces: number;
  }[];
}

export interface AgentCSATMetrics extends CSATMetrics {
  agentId: string;
  agentName: string;
  improvementAreas: string[];
  strengths: string[];
}

export interface FeedbackTheme {
  theme: string;
  count: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  examples: string[];
}
