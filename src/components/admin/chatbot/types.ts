
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
