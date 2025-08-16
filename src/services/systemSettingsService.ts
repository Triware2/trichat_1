import { supabase } from '@/integrations/supabase/client';

export interface SystemSettings {
  id?: string;
  category: 'general' | 'notifications' | 'security' | 'integrations' | 'maintenance';
  key: string;
  value: string | number | boolean | object;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SystemHealth {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  database_status: 'healthy' | 'warning' | 'error';
  uptime: number;
  active_connections: number;
}

export interface BackupInfo {
  id: string;
  filename: string;
  size: number;
  created_at: string;
  status: 'completed' | 'failed' | 'in_progress';
  type: 'manual' | 'automatic';
}

export interface MaintenanceMode {
  enabled: boolean;
  message: string;
  scheduled_start?: string;
  scheduled_end?: string;
  created_by: string;
}

export class SystemSettingsService {
  // Get all settings for a category
  static async getSettings(category: string): Promise<SystemSettings[]> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('category', category)
        .order('key');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching system settings:', error);
      return [];
    }
  }

  // Get a specific setting
  static async getSetting(category: string, key: string): Promise<SystemSettings | null> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('category', category)
        .eq('key', key)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching system setting:', error);
      return null;
    }
  }

  // Update or create a setting
  static async updateSetting(category: string, key: string, value: any, description?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          category,
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : value,
          description,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating system setting:', error);
      return false;
    }
  }

  // Update multiple settings
  static async updateSettings(settings: SystemSettings[]): Promise<boolean> {
    try {
      const settingsToUpdate = settings.map(setting => ({
        ...setting,
        value: typeof setting.value === 'object' ? JSON.stringify(setting.value) : setting.value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('system_settings')
        .upsert(settingsToUpdate);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating system settings:', error);
      return false;
    }
  }

  // Get system health information
  static async getSystemHealth(): Promise<SystemHealth> {
    try {
      // In a real implementation, this would connect to system monitoring
      // For now, return mock data
      return {
        cpu_usage: Math.floor(Math.random() * 50) + 20,
        memory_usage: Math.floor(Math.random() * 40) + 40,
        disk_usage: Math.floor(Math.random() * 30) + 30,
        database_status: 'healthy',
        uptime: Math.floor(Math.random() * 1000) + 100,
        active_connections: Math.floor(Math.random() * 50) + 10
      };
    } catch (error) {
      console.error('Error fetching system health:', error);
      return {
        cpu_usage: 0,
        memory_usage: 0,
        disk_usage: 0,
        database_status: 'error',
        uptime: 0,
        active_connections: 0
      };
    }
  }

  // Get backup history
  static async getBackups(): Promise<BackupInfo[]> {
    try {
      const { data, error } = await supabase
        .from('system_backups')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching backups:', error);
      return [];
    }
  }

  // Create a new backup
  static async createBackup(): Promise<BackupInfo | null> {
    try {
      const backupData = {
        filename: `backup_${new Date().toISOString().split('T')[0]}.zip`,
        size: Math.floor(Math.random() * 1000000) + 500000,
        status: 'in_progress',
        type: 'manual'
      };

      const { data, error } = await supabase
        .from('system_backups')
        .insert(backupData)
        .select()
        .single();

      if (error) throw error;

      // Simulate backup process
      setTimeout(async () => {
        await supabase
          .from('system_backups')
          .update({ status: 'completed' })
          .eq('id', data.id);
      }, 3000);

      return data;
    } catch (error) {
      console.error('Error creating backup:', error);
      return null;
    }
  }

  // Get maintenance mode status
  static async getMaintenanceMode(): Promise<MaintenanceMode | null> {
    try {
      const { data, error } = await supabase
        .from('maintenance_mode')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching maintenance mode:', error);
      return null;
    }
  }

  // Update maintenance mode
  static async updateMaintenanceMode(maintenanceMode: Partial<MaintenanceMode>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('maintenance_mode')
        .upsert({
          ...maintenanceMode,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating maintenance mode:', error);
      return false;
    }
  }

  // Test email connection
  static async testEmailConnection(provider: string, apiKey: string): Promise<boolean> {
    try {
      // In a real implementation, this would test the actual email provider
      // For now, simulate a test
      await new Promise(resolve => setTimeout(resolve, 2000));
      return Math.random() > 0.1; // 90% success rate
    } catch (error) {
      console.error('Error testing email connection:', error);
      return false;
    }
  }

  // Test webhook URL
  static async testWebhookUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true, timestamp: new Date().toISOString() })
      });
      return response.ok;
    } catch (error) {
      console.error('Error testing webhook URL:', error);
      return false;
    }
  }

  // Get system logs
  static async getSystemLogs(limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching system logs:', error);
      return [];
    }
  }

  // Clear system logs
  static async clearSystemLogs(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_logs')
        .delete()
        .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Delete logs older than 30 days

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing system logs:', error);
      return false;
    }
  }

  // Get system statistics
  static async getSystemStats(): Promise<any> {
    try {
      const { data: users } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });

      const { data: chats } = await supabase
        .from('chats')
        .select('id', { count: 'exact' });

      const { data: messages } = await supabase
        .from('messages')
        .select('id', { count: 'exact' });

      return {
        total_users: users?.length || 0,
        total_chats: chats?.length || 0,
        total_messages: messages?.length || 0,
        system_uptime: Math.floor(Math.random() * 1000) + 100,
        last_backup: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      };
    } catch (error) {
      console.error('Error fetching system stats:', error);
      return {
        total_users: 0,
        total_chats: 0,
        total_messages: 0,
        system_uptime: 0,
        last_backup: null
      };
    }
  }
} 