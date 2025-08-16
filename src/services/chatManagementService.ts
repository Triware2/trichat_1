import { supabase } from '@/integrations/supabase/client';

export interface ChatChannel {
  id: string;
  name: string;
  type: 'website' | 'whatsapp' | 'facebook' | 'instagram' | 'email' | 'sms' | 'api' | 'telegram' | 'discord' | 'slack';
  status: 'active' | 'inactive' | 'maintenance' | 'testing';
  priority: 'high' | 'medium' | 'low';
  max_concurrent_chats: number;
  current_active_chats: number;
  business_hours: {
    enabled: boolean;
    timezone: string;
    schedule: Record<string, { start: string; end: string; enabled: boolean }>;
  };
  auto_response: {
    enabled: boolean;
    message: string;
    delay: number;
  };
  routing: {
    type: 'round_robin' | 'least_busy' | 'skill_based' | 'random';
    fallback_agent?: string;
    skill_requirements: string[];
  };
  config: Record<string, any>;
  webhook_url?: string;
  api_key?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  is_active: boolean;
}

export interface ChatRule {
  id: string;
  name: string;
  description?: string;
  channel_id: string;
  trigger_type: 'keyword' | 'intent' | 'time' | 'customer_type' | 'queue_length' | 'custom';
  trigger_conditions: Record<string, any>;
  actions: Record<string, any>;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ChatConversation {
  id: string;
  channel_id: string;
  customer_id?: string;
  assigned_agent_id?: string;
  session_id: string;
  subject?: string;
  status: 'queued' | 'active' | 'waiting' | 'resolved' | 'closed' | 'escalated' | 'transferred';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  metadata: Record<string, any>;
  started_at: string;
  first_response_at?: string;
  resolved_at?: string;
  closed_at?: string;
  escalated_at?: string;
  transferred_at?: string;
  wait_time?: number;
  response_time?: number;
  resolution_time?: number;
  total_messages: number;
  customer_messages: number;
  agent_messages: number;
  satisfaction_rating?: number;
  satisfaction_feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: 'customer' | 'agent' | 'system' | 'bot';
  sender_id?: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system' | 'private_note';
  metadata: Record<string, any>;
  is_private: boolean;
  is_read: boolean;
  read_at?: string;
  delivered_at?: string;
  created_at: string;
}

export interface ChatStats {
  total_chats: number;
  active_chats: number;
  waiting_chats: number;
  avg_response_time: number;
  channels_active: number;
  rules_active: number;
}

export interface ChatBulkOperation {
  id: string;
  name: string;
  operation_type: 'assign' | 'close' | 'escalate' | 'tag' | 'priority_change' | 'export';
  filters: Record<string, any>;
  target_data?: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  total_items: number;
  processed_items: number;
  success_count: number;
  error_count: number;
  errors: any[];
  created_at: string;
  started_at?: string;
  completed_at?: string;
  created_by: string;
}

export interface ChatTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ChatAnalytics {
  id: string;
  channel_id: string;
  date: string;
  total_conversations: number;
  active_conversations: number;
  resolved_conversations: number;
  escalated_conversations: number;
  avg_response_time: number;
  avg_resolution_time: number;
  avg_wait_time: number;
  avg_satisfaction_rating: number;
  total_messages: number;
  customer_messages: number;
  agent_messages: number;
  peak_hour?: number;
  peak_day?: string;
  created_at: string;
  updated_at: string;
}

// Bulk Operations Interfaces
export interface BulkOperation {
  id: string;
  type: 'assign' | 'close' | 'tag' | 'priority' | 'archive' | 'delete' | 'escalate' | 'flag' | 'export' | 'import' | 'merge' | 'split' | 'schedule' | 'notify' | 'analyze' | 'automate';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  affected_count: number;
  affected_conversation_ids: string[];
  created_by: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  failed_at?: string;
  error_message?: string;
  details: any;
  progress_percentage: number;
  estimated_completion?: string;
  operation_metadata: any;
}

export interface BulkOperationLog {
  id: string;
  operation_id: string;
  conversation_id?: string;
  action_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  details: any;
  created_at: string;
  completed_at?: string;
}

class ChatManagementService {
  // Channel Management
  async getChannels(): Promise<ChatChannel[]> {
    const { data, error } = await supabase
      .from('chat_channels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch channels: ${error.message}`);
    return data || [];
  }

  async createChannel(channel: Omit<ChatChannel, 'id' | 'created_at' | 'updated_at'>): Promise<ChatChannel> {
    const { data, error } = await supabase
      .from('chat_channels')
      .insert(channel)
      .select()
      .single();

    if (error) throw new Error(`Failed to create channel: ${error.message}`);
    return data;
  }

  async updateChannel(id: string, updates: Partial<ChatChannel>): Promise<ChatChannel> {
    const { data, error } = await supabase
      .from('chat_channels')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update channel: ${error.message}`);
    return data;
  }

  async deleteChannel(id: string): Promise<void> {
    const { error } = await supabase
      .from('chat_channels')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete channel: ${error.message}`);
  }

  // Chat Rules Management
  async getRules(channelId?: string): Promise<ChatRule[]> {
    let query = supabase.from('chat_rules').select('*').order('priority', { ascending: true });
    
    if (channelId) {
      query = query.eq('channel_id', channelId);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch rules: ${error.message}`);
    return data || [];
  }

  async createRule(rule: Omit<ChatRule, 'id' | 'created_at' | 'updated_at'>): Promise<ChatRule> {
    const { data, error } = await supabase
      .from('chat_rules')
      .insert(rule)
      .select()
      .single();

    if (error) throw new Error(`Failed to create rule: ${error.message}`);
    return data;
  }

  async updateRule(id: string, updates: Partial<ChatRule>): Promise<ChatRule> {
    const { data, error } = await supabase
      .from('chat_rules')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update rule: ${error.message}`);
    return data;
  }

  async deleteRule(id: string): Promise<void> {
    const { error } = await supabase
      .from('chat_rules')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete rule: ${error.message}`);
  }

  // Conversation Management
  async getConversations(filters?: {
    channelId?: string;
    status?: string;
    priority?: string;
    assignedAgentId?: string;
    limit?: number;
    offset?: number;
  }): Promise<ChatConversation[]> {
    let query = supabase
      .from('chat_conversations')
      .select(`
        *,
        chat_channels(name, type),
        customers(name, email),
        profiles!assigned_agent_id(full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (filters?.channelId) query = query.eq('channel_id', filters.channelId);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.priority) query = query.eq('priority', filters.priority);
    if (filters?.assignedAgentId) query = query.eq('assigned_agent_id', filters.assignedAgentId);
    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch conversations: ${error.message}`);
    return data || [];
  }

  async getConversation(id: string): Promise<ChatConversation> {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select(`
        *,
        chat_channels(name, type),
        customers(name, email),
        profiles!assigned_agent_id(full_name, email)
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(`Failed to fetch conversation: ${error.message}`);
    return data;
  }

  async updateConversation(id: string, updates: Partial<ChatConversation>): Promise<ChatConversation> {
    const { data, error } = await supabase
      .from('chat_conversations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update conversation: ${error.message}`);
    return data;
  }

  // Message Management
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        profiles!sender_id(full_name, email)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Failed to fetch messages: ${error.message}`);
    return data || [];
  }

  async sendMessage(message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(message)
      .select()
      .single();

    if (error) throw new Error(`Failed to send message: ${error.message}`);
    return data;
  }

  // Analytics
  async getChatStats(timeRange: string = '24 hours'): Promise<ChatStats> {
    const { data, error } = await supabase.rpc('get_chat_stats', {
      user_id: (await supabase.auth.getUser()).data.user?.id,
      time_range: timeRange
    });

    if (error) throw new Error(`Failed to fetch chat stats: ${error.message}`);
    return data || {
      total_chats: 0,
      active_chats: 0,
      waiting_chats: 0,
      avg_response_time: 0,
      channels_active: 0,
      rules_active: 0
    };
  }

  async getAnalytics(channelId?: string, dateRange?: { start: string; end: string }): Promise<ChatAnalytics[]> {
    let query = supabase
      .from('chat_analytics')
      .select('*')
      .order('date', { ascending: false });

    if (channelId) query = query.eq('channel_id', channelId);
    if (dateRange) {
      query = query.gte('date', dateRange.start).lte('date', dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch analytics: ${error.message}`);
    return data || [];
  }

  // Bulk Operations
  async createBulkOperation(operation: Omit<BulkOperation, 'id' | 'created_at'>): Promise<BulkOperation> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bulk_operations')
        .insert({
          ...operation,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as BulkOperation;
    } catch (error: any) {
      console.error('Error creating bulk operation:', error);
      throw new Error(error.message);
    }
  }

  async updateBulkOperation(operationId: string, updates: Partial<BulkOperation>): Promise<BulkOperation> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bulk_operations')
        .update(updates)
        .eq('id', operationId)
        .eq('created_by', user.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as BulkOperation;
    } catch (error: any) {
      console.error('Error updating bulk operation:', error);
      throw new Error(error.message);
    }
  }

  async getBulkOperations(limit: number = 50): Promise<BulkOperation[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bulk_operations')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw new Error(error.message);
      return data as BulkOperation[];
    } catch (error: any) {
      console.error('Error fetching bulk operations:', error);
      throw new Error(error.message);
    }
  }

  async getBulkOperation(operationId: string): Promise<BulkOperation> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bulk_operations')
        .select('*')
        .eq('id', operationId)
        .eq('created_by', user.id)
        .single();

      if (error) throw new Error(error.message);
      return data as BulkOperation;
    } catch (error: any) {
      console.error('Error fetching bulk operation:', error);
      throw new Error(error.message);
    }
  }

  async createBulkOperationLog(log: Omit<BulkOperationLog, 'id' | 'created_at'>): Promise<BulkOperationLog> {
    try {
      const { data, error } = await supabase
        .from('bulk_operation_logs')
        .insert(log)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as BulkOperationLog;
    } catch (error: any) {
      console.error('Error creating bulk operation log:', error);
      throw new Error(error.message);
    }
  }

  async getBulkOperationLogs(operationId: string): Promise<BulkOperationLog[]> {
    try {
      const { data, error } = await supabase
        .from('bulk_operation_logs')
        .select('*')
        .eq('operation_id', operationId)
        .order('created_at', { ascending: true });

      if (error) throw new Error(error.message);
      return data as BulkOperationLog[];
    } catch (error: any) {
      console.error('Error fetching bulk operation logs:', error);
      throw new Error(error.message);
    }
  }

  // Bulk Operation Execution Methods
  async executeBulkAssign(conversationIds: string[], agentId: string, reason?: string): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create bulk operation record
      const operation = await this.createBulkOperation({
        type: 'assign',
        status: 'processing',
        affected_count: conversationIds.length,
        affected_conversation_ids: conversationIds,
        created_by: user.id,
        details: { agentId, reason },
        progress_percentage: 0,
        operation_metadata: {}
      });

      // Execute the bulk assignment using the database function
      const { data, error } = await supabase.rpc('bulk_assign_conversations', {
        conversation_ids: conversationIds,
        agent_id: agentId,
        assignment_reason: reason
      });

      if (error) throw new Error(error.message);

      // Update operation status
      await this.updateBulkOperation(operation.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        progress_percentage: 100
      });

      return data as number;
    } catch (error: any) {
      console.error('Error executing bulk assign:', error);
      throw new Error(error.message);
    }
  }

  async executeBulkTag(conversationIds: string[], tagsToAdd: string[], tagsToRemove: string[]): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create bulk operation record
      const operation = await this.createBulkOperation({
        type: 'tag',
        status: 'processing',
        affected_count: conversationIds.length,
        affected_conversation_ids: conversationIds,
        created_by: user.id,
        details: { tagsToAdd, tagsToRemove },
        progress_percentage: 0,
        operation_metadata: {}
      });

      // Execute the bulk tag update using the database function
      const { data, error } = await supabase.rpc('update_conversation_tags', {
        conversation_ids: conversationIds,
        tags_to_add: tagsToAdd,
        tags_to_remove: tagsToRemove
      });

      if (error) throw new Error(error.message);

      // Update operation status
      await this.updateBulkOperation(operation.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        progress_percentage: 100
      });

      return data as number;
    } catch (error: any) {
      console.error('Error executing bulk tag:', error);
      throw new Error(error.message);
    }
  }

  async executeBulkStatusUpdate(conversationIds: string[], newStatus: string): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create bulk operation record
      const operation = await this.createBulkOperation({
        type: 'close', // or 'archive' based on status
        status: 'processing',
        affected_count: conversationIds.length,
        affected_conversation_ids: conversationIds,
        created_by: user.id,
        details: { newStatus },
        progress_percentage: 0,
        operation_metadata: {}
      });

      // Execute the bulk status update using the database function
      const { data, error } = await supabase.rpc('bulk_update_conversation_status', {
        conversation_ids: conversationIds,
        new_status: newStatus
      });

      if (error) throw new Error(error.message);

      // Update operation status
      await this.updateBulkOperation(operation.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        progress_percentage: 100
      });

      return data as number;
    } catch (error: any) {
      console.error('Error executing bulk status update:', error);
      throw new Error(error.message);
    }
  }

  async executeBulkPriorityUpdate(conversationIds: string[], newPriority: string): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create bulk operation record
      const operation = await this.createBulkOperation({
        type: 'priority',
        status: 'processing',
        affected_count: conversationIds.length,
        affected_conversation_ids: conversationIds,
        created_by: user.id,
        details: { newPriority },
        progress_percentage: 0,
        operation_metadata: {}
      });

      // Execute the bulk priority update using the database function
      const { data, error } = await supabase.rpc('bulk_update_conversation_priority', {
        conversation_ids: conversationIds,
        new_priority: newPriority
      });

      if (error) throw new Error(error.message);

      // Update operation status
      await this.updateBulkOperation(operation.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        progress_percentage: 100
      });

      return data as number;
    } catch (error: any) {
      console.error('Error executing bulk priority update:', error);
      throw new Error(error.message);
    }
  }

  async executeBulkFlag(conversationIds: string[], flagReason: string, flagType: string = 'general', shouldFlag: boolean = true): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create bulk operation record
      const operation = await this.createBulkOperation({
        type: 'flag',
        status: 'processing',
        affected_count: conversationIds.length,
        affected_conversation_ids: conversationIds,
        created_by: user.id,
        details: { flagReason, flagType, shouldFlag },
        progress_percentage: 0,
        operation_metadata: {}
      });

      // Execute the bulk flag operation using the database function
      const { data, error } = await supabase.rpc('bulk_flag_conversations', {
        conversation_ids: conversationIds,
        flag_reason: flagReason,
        flag_type: flagType,
        should_flag: shouldFlag
      });

      if (error) throw new Error(error.message);

      // Update operation status
      await this.updateBulkOperation(operation.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        progress_percentage: 100
      });

      return data as number;
    } catch (error: any) {
      console.error('Error executing bulk flag:', error);
      throw new Error(error.message);
    }
  }

  async executeBulkEscalate(conversationIds: string[], escalationReason?: string): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create bulk operation record
      const operation = await this.createBulkOperation({
        type: 'escalate',
        status: 'processing',
        affected_count: conversationIds.length,
        affected_conversation_ids: conversationIds,
        created_by: user.id,
        details: { escalationReason },
        progress_percentage: 0,
        operation_metadata: {}
      });

      // Execute the bulk escalation using the database function
      const { data, error } = await supabase.rpc('bulk_escalate_conversations', {
        conversation_ids: conversationIds,
        escalation_reason: escalationReason
      });

      if (error) throw new Error(error.message);

      // Update operation status
      await this.updateBulkOperation(operation.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        progress_percentage: 100
      });

      return data as number;
    } catch (error: any) {
      console.error('Error executing bulk escalate:', error);
      throw new Error(error.message);
    }
  }

  // Real-time subscriptions for bulk operations
  subscribeToBulkOperations(callback: (payload: any) => void) {
    return supabase
      .channel('bulk_operations_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bulk_operations'
      }, callback)
      .subscribe();
  }

  subscribeToBulkOperationLogs(callback: (payload: any) => void) {
    return supabase
      .channel('bulk_operation_logs_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bulk_operation_logs'
      }, callback)
      .subscribe();
  }

  // Real-time subscriptions for conversations and messages
  subscribeToConversations(callback: (payload: any) => void) {
    return supabase
      .channel('chat_conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_conversations' }, callback)
      .subscribe();
  }

  subscribeToMessages(conversationId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`chat_messages_${conversationId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'chat_messages',
        filter: `conversation_id=eq.${conversationId}`
      }, callback)
      .subscribe();
  }

  // Templates
  async getTemplates(category?: string): Promise<ChatTemplate[]> {
    let query = supabase
      .from('chat_templates')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (category) query = query.eq('category', category);

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch templates: ${error.message}`);
    return data || [];
  }

  async createTemplate(template: Omit<ChatTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<ChatTemplate> {
    const { data, error } = await supabase
      .from('chat_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw new Error(`Failed to create template: ${error.message}`);
    return data;
  }

  async updateTemplate(id: string, updates: Partial<ChatTemplate>): Promise<ChatTemplate> {
    const { data, error } = await supabase
      .from('chat_templates')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update template: ${error.message}`);
    return data;
  }

  async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('chat_templates')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete template: ${error.message}`);
  }

  // Utility functions
  async searchConversations(query: string): Promise<ChatConversation[]> {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select(`
        *,
        chat_channels(name, type),
        customers(name, email),
        profiles!assigned_agent_id(full_name, email)
      `)
      .or(`subject.ilike.%${query}%,session_id.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to search conversations: ${error.message}`);
    return data || [];
  }

  async getQueuePosition(conversationId: string): Promise<number> {
    const { data, error } = await supabase
      .from('chat_queue')
      .select('position')
      .eq('conversation_id', conversationId)
      .single();

    if (error) throw new Error(`Failed to get queue position: ${error.message}`);
    return data?.position || 0;
  }

  async estimateWaitTime(channelId: string): Promise<number> {
    const { data, error } = await supabase
      .from('chat_queue')
      .select('estimated_wait_time')
      .eq('channel_id', channelId)
      .order('position', { ascending: true })
      .limit(1)
      .single();

    if (error) throw new Error(`Failed to estimate wait time: ${error.message}`);
    return data?.estimated_wait_time || 0;
  }
}

export const chatManagementService = new ChatManagementService(); 