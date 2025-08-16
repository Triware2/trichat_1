import { supabase } from '@/integrations/supabase/client';
import { TablesInsert } from '@/integrations/supabase/types';
import { emailService } from './emailService';

// Custom UUID generation function that works in all browsers
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'supervisor' | 'agent';
  status: 'online' | 'busy' | 'away' | 'offline';
  department?: string | null;
  skills?: string[] | null;
  max_concurrent_chats?: number | null;
  timezone?: string | null;
  avatar_url?: string | null;
  last_seen?: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateUserData {
  email: string;
  full_name: string;
  role: 'admin' | 'supervisor' | 'agent';
  password: string;
  department?: string;
  skills?: string[];
  max_concurrent_chats?: number;
  timezone?: string;
}

export interface UpdateUserData {
  id: string;
  email?: string;
  full_name?: string;
  role?: 'admin' | 'supervisor' | 'agent';
  department?: string;
  skills?: string[];
  max_concurrent_chats?: number;
  timezone?: string;
  is_active?: boolean;
}

class UserManagementService {
  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw error;
    }
  }

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      // NOTE: This approach creates a profile without a corresponding auth user
      // In production, you should implement a backend API that:
      // 1. Creates the user in auth.users using service role key
      // 2. Creates the profile using the auth user's ID
      // 3. Sends the welcome email
      
      const userId = generateUUID();
      const profileData: TablesInsert<'profiles'> = {
        id: userId,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        status: 'offline',
        department: userData.department || null,
        skills: userData.skills || null,
        max_concurrent_chats: userData.max_concurrent_chats || null,
        timezone: userData.timezone || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        throw new Error(`Failed to create user profile: ${profileError.message}`);
      }

      await emailService.sendWelcomeEmail(userData.email, userData.full_name, userData.role);

      return profile;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  async updateUser(userData: UpdateUserData): Promise<User> {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .update({
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          department: userData.department,
          skills: userData.skills,
          max_concurrent_chats: userData.max_concurrent_chats,
          timezone: userData.timezone,
          is_active: userData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userData.id)
        .select()
        .single();

      if (profileError) {
        throw new Error(`Failed to update user: ${profileError.message}`);
      }

      return profile;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
      }

      // NOTE: In production, you should also delete the corresponding auth user
      // This requires a backend service with service role key
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }

  async updateUserStatus(userId: string, status: 'online' | 'busy' | 'away' | 'offline'): Promise<User> {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .update({
          status: status,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (profileError) {
        throw new Error(`Failed to update user status: ${profileError.message}`);
      }

      return profile;
    } catch (error) {
      console.error('Error in updateUserStatus:', error);
      throw error;
    }
  }

  async filterUsers(role?: string, status?: string): Promise<User[]> {
    try {
      let query = supabase.from('profiles').select('*');

      if (role && role !== 'all') {
        query = query.eq('role', role as 'admin' | 'supervisor' | 'agent');
      }

      if (status && status !== 'all') {
        query = query.eq('status', status as 'online' | 'busy' | 'away' | 'offline');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to filter users: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in filterUsers:', error);
      throw error;
    }
  }

  async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to search users: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchUsers:', error);
      throw error;
    }
  }
}

export const userManagementService = new UserManagementService(); 