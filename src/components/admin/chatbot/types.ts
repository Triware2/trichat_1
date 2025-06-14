
export interface BotResponse {
  id: string;
  message: string;
  confidence: number;
  intent?: string;
  entities?: Array<{
    entity: string;
    value: string;
  }>;
  suggested_actions?: string[];
}

export interface BotTrainingData {
  id: string;
  intent: string;
  examples: string[];
  responses: string[];
  created_at: string;
  updated_at: string;
}

export interface BotConfiguration {
  id: string;
  name: string;
  welcome_message: string;
  fallback_message: string;
  escalation_threshold: number; // confidence threshold below which to escalate
  max_bot_attempts: number;
  is_active: boolean;
  auto_escalate_keywords: string[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  sender: 'customer' | 'bot' | 'agent';
  message: string;
  time: string;
  type: 'text' | 'image' | 'file' | 'escalation';
  confidence?: number;
  intent?: string;
  bot_response_id?: string;
  escalation_reason?: 'manual' | 'confidence_low' | 'max_attempts' | 'keyword_triggered';
  fileName?: string; // Added fileName property
}

export interface BotSession {
  session_id: string;
  customer_id: string;
  bot_attempts: number;
  escalated: boolean;
  escalation_reason?: string;
  started_at: string;
  escalated_at?: string;
}
