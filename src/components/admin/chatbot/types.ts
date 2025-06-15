
export interface BotCondition {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than';
  value: string;
}

export interface BotRule {
  id: string;
  trigger: string;
  conditions: BotCondition[];
  response: string;
  priority: number;
  is_active: boolean;
}

export interface FlowStep {
  id: string;
  type: 'message' | 'question' | 'action' | 'condition';
  content: string;
  next_step?: string;
}

export interface ConversationFlow {
  id: string;
  name: string;
  trigger_intent: string;
  is_active: boolean;
  steps: FlowStep[];
}

export interface ChatMessage {
  id: number;
  sender: 'customer' | 'agent' | 'bot' | 'system';
  message: string;
  time: string;
  type: 'text' | 'file' | 'image' | 'escalation';
  fileName?: string;
  confidence?: number;
  intent?: string;
  bot_response_id?: string;
  escalation_reason?: string;
}

export interface BotResponse {
  id: string;
  message: string;
  confidence: number;
  intent: string;
}

export interface BotSession {
  session_id: string;
  customer_id: string;
  bot_attempts: number;
  escalated: boolean;
  started_at: string;
}
