import { supabase } from '@/integrations/supabase/client';

export interface SupportTicket {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  subject: string;
  description: string;
  assigned_to?: string;
  response?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  closed_at?: string;
}

export interface SupportResponse {
  id: string;
  ticket_id: string;
  responder_id?: string;
  responder_name: string;
  responder_email: string;
  response: string;
  is_internal: boolean;
  attachments?: string[];
  created_at: string;
}

export interface SupportCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  sort_order: number;
}

export interface SupportFAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  is_published: boolean;
  sort_order: number;
}

export interface SupportResource {
  id: string;
  title: string;
  description?: string;
  url?: string;
  type: 'documentation' | 'video' | 'community' | 'api';
  is_active: boolean;
  sort_order: number;
}

export interface SupportStats {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  urgent_tickets: number;
}

class SupportService {
  // Get all support tickets (for admin/creator)
  async getSupportTickets(filters?: {
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
  }): Promise<SupportTicket[]> {
    try {
      let query = supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters?.search) {
        query = query.or(`subject.ilike.%${filters.search}%,user_name.ilike.%${filters.search}%,user_email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching support tickets:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSupportTickets:', error);
      throw error;
    }
  }

  // Get user's own support tickets
  async getUserSupportTickets(): Promise<SupportTicket[]> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user support tickets:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserSupportTickets:', error);
      throw error;
    }
  }

  // Create a new support ticket
  async createSupportTicket(ticketData: {
    user_name: string;
    user_email: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    subject: string;
    description: string;
    attachments?: string[];
  }): Promise<SupportTicket> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([ticketData])
        .select()
        .single();

      if (error) {
        console.error('Error creating support ticket:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createSupportTicket:', error);
      throw error;
    }
  }

  // Update support ticket status
  async updateTicketStatus(ticketId: string, status: string): Promise<SupportTicket> {
    try {
      const updateData: any = { status };
      
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      } else if (status === 'closed') {
        updateData.closed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', ticketId)
        .select()
        .single();

      if (error) {
        console.error('Error updating ticket status:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateTicketStatus:', error);
      throw error;
    }
  }

  // Add response to a ticket
  async addTicketResponse(responseData: {
    ticket_id: string;
    responder_name: string;
    responder_email: string;
    response: string;
    is_internal?: boolean;
    attachments?: string[];
  }): Promise<SupportResponse> {
    try {
      const { data, error } = await supabase
        .from('support_responses')
        .insert([responseData])
        .select()
        .single();

      if (error) {
        console.error('Error adding ticket response:', error);
        throw error;
      }

      // Update ticket status to resolved if it's not internal
      if (!responseData.is_internal) {
        await this.updateTicketStatus(responseData.ticket_id, 'resolved');
      }

      return data;
    } catch (error) {
      console.error('Error in addTicketResponse:', error);
      throw error;
    }
  }

  // Get responses for a ticket
  async getTicketResponses(ticketId: string): Promise<SupportResponse[]> {
    try {
      const { data, error } = await supabase
        .from('support_responses')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching ticket responses:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTicketResponses:', error);
      throw error;
    }
  }

  // Get support categories
  async getSupportCategories(): Promise<SupportCategory[]> {
    try {
      const { data, error } = await supabase
        .from('support_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching support categories:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSupportCategories:', error);
      throw error;
    }
  }

  // Get FAQ entries
  async getFAQ(category?: string): Promise<SupportFAQ[]> {
    try {
      let query = supabase
        .from('support_faq')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching FAQ:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFAQ:', error);
      throw error;
    }
  }

  // Get support resources
  async getSupportResources(): Promise<SupportResource[]> {
    try {
      const { data, error } = await supabase
        .from('support_resources')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching support resources:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSupportResources:', error);
      throw error;
    }
  }

  // Get support statistics
  async getSupportStats(): Promise<SupportStats> {
    try {
      const { data, error } = await supabase
        .rpc('get_support_stats');

      if (error) {
        console.error('Error fetching support stats:', error);
        throw error;
      }

      return data[0] || {
        total_tickets: 0,
        open_tickets: 0,
        in_progress_tickets: 0,
        resolved_tickets: 0,
        urgent_tickets: 0
      };
    } catch (error) {
      console.error('Error in getSupportStats:', error);
      throw error;
    }
  }

  // Search FAQ
  async searchFAQ(query: string): Promise<SupportFAQ[]> {
    try {
      const { data, error } = await supabase
        .from('support_faq')
        .select('*')
        .eq('is_published', true)
        .or(`question.ilike.%${query}%,answer.ilike.%${query}%`)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error searching FAQ:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchFAQ:', error);
      throw error;
    }
  }

  // Delete support ticket (admin only)
  async deleteSupportTicket(ticketId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .delete()
        .eq('id', ticketId);

      if (error) {
        console.error('Error deleting support ticket:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteSupportTicket:', error);
      throw error;
    }
  }

  // Assign ticket to support agent
  async assignTicket(ticketId: string, assignedTo: string): Promise<SupportTicket> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .update({ assigned_to: assignedTo })
        .eq('id', ticketId)
        .select()
        .single();

      if (error) {
        console.error('Error assigning ticket:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in assignTicket:', error);
      throw error;
    }
  }

  // Get ticket by ID
  async getTicketById(ticketId: string): Promise<SupportTicket | null> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (error) {
        console.error('Error fetching ticket by ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getTicketById:', error);
      throw error;
    }
  }
}

export const supportService = new SupportService(); 