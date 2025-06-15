
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
  fileName?: string;
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

export interface LLMProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'mistral' | 'custom';
  api_endpoint?: string;
  models: string[];
  requires_api_key: boolean;
}

export interface SOPDocument {
  id: string;
  name: string;
  file_type: 'pdf' | 'docx' | 'markdown';
  file_size: number;
  upload_date: string;
  processing_status: 'uploaded' | 'processing' | 'processed' | 'error';
  chunk_count: number;
  embedding_status: 'pending' | 'in_progress' | 'completed' | 'failed';
  metadata?: {
    title?: string;
    author?: string;
    department?: string;
    version?: string;
  };
}

export interface ChatbotFramework {
  id: string;
  name: string;
  description: string;
  type: 'standard' | 'llm';
  status: 'active' | 'inactive' | 'training';
  
  // Standard bot configuration
  rules?: BotRule[];
  flows?: ConversationFlow[];
  
  // LLM bot configuration
  llm_config?: {
    provider: string;
    model: string;
    api_key_encrypted: string;
    system_prompt: string;
    temperature: number;
    max_tokens: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
  };
  
  // SOP integration
  sop_documents: string[]; // Array of SOP document IDs
  knowledge_base_id?: string;
  
  // Performance settings
  escalation_threshold: number;
  max_attempts: number;
  fallback_message: string;
  welcome_message: string;
  
  // Metrics
  total_conversations: number;
  resolution_rate: number;
  avg_satisfaction: number;
  avg_response_time: number;
  
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface BotRule {
  id: string;
  trigger: string;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'starts_with' | 'regex';
    value: string;
  }>;
  response: string;
  priority: number;
  is_active: boolean;
}

export interface ConversationFlow {
  id: string;
  name: string;
  trigger_intent: string;
  steps: FlowStep[];
  is_active: boolean;
}

export interface FlowStep {
  id: string;
  type: 'message' | 'question' | 'condition' | 'action';
  content: string;
  next_step?: string;
  conditions?: Array<{
    input: string;
    next_step: string;
  }>;
}
