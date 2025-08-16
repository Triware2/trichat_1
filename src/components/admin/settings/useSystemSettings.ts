
import { useState, useEffect } from 'react';
import { SystemSettingsState, SystemHealth, BackupInfo, MaintenanceMode, SystemLog, SystemStats } from './types';
import { SystemSettingsService } from '@/services/systemSettingsService';
import { useToast } from '@/hooks/use-toast';

export const useSystemSettings = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<SystemSettingsState>({
    general: {
      companyName: 'TriChat',
      supportEmail: 'support@trichat.com',
      timeZone: 'UTC',
      language: 'en',
      maxAgents: 50,
      sessionTimeout: 30,
      maintenanceMode: false
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      smsAlerts: false,
      webhookUrl: '',
      notificationFrequency: 'immediate'
    },
    security: {
      sessionTimeout: 30,
      passwordPolicy: 'strong',
      twoFactorAuth: true,
      ipWhitelist: '',
      maxLoginAttempts: 5,
      lockoutDuration: 15
    },
    integrations: {
      emailProvider: 'sendgrid',
      apiKey: '',
      webhookSecret: '',
      crmIntegration: 'none',
      slackWebhook: '',
      zapierWebhook: ''
    },
    maintenance: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupRetention: 30,
      logRetention: 90,
      performanceMonitoring: true
    }
  });

  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [maintenanceMode, setMaintenanceMode] = useState<MaintenanceMode | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load all settings on component mount
  useEffect(() => {
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    setLoading(true);
    try {
      // Load settings for each category
      const [generalSettings, notificationSettings, securitySettings, integrationSettings, maintenanceSettings] = await Promise.all([
        SystemSettingsService.getSettings('general'),
        SystemSettingsService.getSettings('notifications'),
        SystemSettingsService.getSettings('security'),
        SystemSettingsService.getSettings('integrations'),
        SystemSettingsService.getSettings('maintenance')
      ]);

      // Convert database settings to state format
      const newSettings: SystemSettingsState = {
        general: {
          companyName: getSettingValue(generalSettings, 'company_name', 'TriChat'),
          supportEmail: getSettingValue(generalSettings, 'support_email', 'support@trichat.com'),
          timeZone: getSettingValue(generalSettings, 'timezone', 'UTC'),
          language: getSettingValue(generalSettings, 'language', 'en'),
          maxAgents: parseInt(getSettingValue(generalSettings, 'max_agents', '50')),
          sessionTimeout: parseInt(getSettingValue(generalSettings, 'session_timeout', '30')),
          maintenanceMode: getSettingValue(generalSettings, 'maintenance_mode', 'false') === 'true'
        },
        notifications: {
          emailAlerts: getSettingValue(notificationSettings, 'email_alerts', 'true') === 'true',
          pushNotifications: getSettingValue(notificationSettings, 'push_notifications', 'true') === 'true',
          smsAlerts: getSettingValue(notificationSettings, 'sms_alerts', 'false') === 'true',
          webhookUrl: getSettingValue(notificationSettings, 'webhook_url', ''),
          notificationFrequency: getSettingValue(notificationSettings, 'notification_frequency', 'immediate') as any
        },
        security: {
          sessionTimeout: parseInt(getSettingValue(securitySettings, 'session_timeout', '30')),
          passwordPolicy: getSettingValue(securitySettings, 'password_policy', 'strong') as any,
          twoFactorAuth: getSettingValue(securitySettings, 'two_factor_auth', 'true') === 'true',
          ipWhitelist: getSettingValue(securitySettings, 'ip_whitelist', ''),
          maxLoginAttempts: parseInt(getSettingValue(securitySettings, 'max_login_attempts', '5')),
          lockoutDuration: parseInt(getSettingValue(securitySettings, 'lockout_duration', '15'))
        },
        integrations: {
          emailProvider: getSettingValue(integrationSettings, 'email_provider', 'sendgrid') as any,
          apiKey: getSettingValue(integrationSettings, 'api_key', ''),
          webhookSecret: getSettingValue(integrationSettings, 'webhook_secret', ''),
          crmIntegration: getSettingValue(integrationSettings, 'crm_integration', 'none') as any,
          slackWebhook: getSettingValue(integrationSettings, 'slack_webhook', ''),
          zapierWebhook: getSettingValue(integrationSettings, 'zapier_webhook', '')
        },
        maintenance: {
          autoBackup: getSettingValue(maintenanceSettings, 'auto_backup', 'true') === 'true',
          backupFrequency: getSettingValue(maintenanceSettings, 'backup_frequency', 'daily') as any,
          backupRetention: parseInt(getSettingValue(maintenanceSettings, 'backup_retention', '30')),
          logRetention: parseInt(getSettingValue(maintenanceSettings, 'log_retention', '90')),
          performanceMonitoring: getSettingValue(maintenanceSettings, 'performance_monitoring', 'true') === 'true'
        }
      };

      setSettings(newSettings);

      // Load additional data
      const [health, backupList, maintenance, logs, stats] = await Promise.all([
        SystemSettingsService.getSystemHealth(),
        SystemSettingsService.getBackups(),
        SystemSettingsService.getMaintenanceMode(),
        SystemSettingsService.getSystemLogs(20),
        SystemSettingsService.getSystemStats()
      ]);

      setSystemHealth(health);
      setBackups(backupList);
      setMaintenanceMode(maintenance);
      setSystemLogs(logs);
      setSystemStats(stats);

    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load system settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSettingValue = (settings: any[], key: string, defaultValue: string): string => {
    const setting = settings.find(s => s.key === key);
    return setting ? setting.value : defaultValue;
  };

  const updateSettings = (category: keyof SystemSettingsState, updates: Partial<any>) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], ...updates }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Convert settings back to database format
      const settingsToSave = [
        // General settings
        { category: 'general', key: 'company_name', value: settings.general.companyName },
        { category: 'general', key: 'support_email', value: settings.general.supportEmail },
        { category: 'general', key: 'timezone', value: settings.general.timeZone },
        { category: 'general', key: 'language', value: settings.general.language },
        { category: 'general', key: 'max_agents', value: settings.general.maxAgents.toString() },
        { category: 'general', key: 'session_timeout', value: settings.general.sessionTimeout.toString() },
        { category: 'general', key: 'maintenance_mode', value: settings.general.maintenanceMode.toString() },

        // Notification settings
        { category: 'notifications', key: 'email_alerts', value: settings.notifications.emailAlerts.toString() },
        { category: 'notifications', key: 'push_notifications', value: settings.notifications.pushNotifications.toString() },
        { category: 'notifications', key: 'sms_alerts', value: settings.notifications.smsAlerts.toString() },
        { category: 'notifications', key: 'webhook_url', value: settings.notifications.webhookUrl },
        { category: 'notifications', key: 'notification_frequency', value: settings.notifications.notificationFrequency },

        // Security settings
        { category: 'security', key: 'session_timeout', value: settings.security.sessionTimeout.toString() },
        { category: 'security', key: 'password_policy', value: settings.security.passwordPolicy },
        { category: 'security', key: 'two_factor_auth', value: settings.security.twoFactorAuth.toString() },
        { category: 'security', key: 'ip_whitelist', value: settings.security.ipWhitelist },
        { category: 'security', key: 'max_login_attempts', value: settings.security.maxLoginAttempts.toString() },
        { category: 'security', key: 'lockout_duration', value: settings.security.lockoutDuration.toString() },

        // Integration settings
        { category: 'integrations', key: 'email_provider', value: settings.integrations.emailProvider },
        { category: 'integrations', key: 'api_key', value: settings.integrations.apiKey },
        { category: 'integrations', key: 'webhook_secret', value: settings.integrations.webhookSecret },
        { category: 'integrations', key: 'crm_integration', value: settings.integrations.crmIntegration },
        { category: 'integrations', key: 'slack_webhook', value: settings.integrations.slackWebhook },
        { category: 'integrations', key: 'zapier_webhook', value: settings.integrations.zapierWebhook },

        // Maintenance settings
        { category: 'maintenance', key: 'auto_backup', value: settings.maintenance.autoBackup.toString() },
        { category: 'maintenance', key: 'backup_frequency', value: settings.maintenance.backupFrequency },
        { category: 'maintenance', key: 'backup_retention', value: settings.maintenance.backupRetention.toString() },
        { category: 'maintenance', key: 'log_retention', value: settings.maintenance.logRetention.toString() },
        { category: 'maintenance', key: 'performance_monitoring', value: settings.maintenance.performanceMonitoring.toString() }
      ];

      const success = await SystemSettingsService.updateSettings(settingsToSave);
      
      if (success) {
        toast({
          title: "Settings Saved",
          description: "Your system settings have been updated successfully.",
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const testEmailConnection = async () => {
    setIsTestingConnection(true);
    try {
      const success = await SystemSettingsService.testEmailConnection(
        settings.integrations.emailProvider,
        settings.integrations.apiKey
      );
      
      if (success) {
        toast({
          title: "Connection Successful",
          description: "Email provider connection is working correctly.",
        });
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to email provider. Please check your settings.",
        variant: "destructive"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const testWebhookUrl = async (url: string) => {
    try {
      const success = await SystemSettingsService.testWebhookUrl(url);
      
      if (success) {
        toast({
          title: "Webhook Test Successful",
          description: "Webhook URL is working correctly.",
        });
      } else {
        throw new Error('Webhook test failed');
      }
    } catch (error) {
      toast({
        title: "Webhook Test Failed",
        description: "Unable to reach the webhook URL. Please check the URL and try again.",
        variant: "destructive"
      });
    }
  };

  const createBackup = async () => {
    setBackupInProgress(true);
    try {
      const backup = await SystemSettingsService.createBackup();
      
      if (backup) {
        toast({
          title: "Backup Started",
          description: "System backup has been initiated. You'll be notified when it's complete.",
        });
        
        // Refresh backup list after a delay
        setTimeout(() => {
          loadBackups();
        }, 5000);
      } else {
        throw new Error('Failed to create backup');
      }
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "Failed to create system backup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setBackupInProgress(false);
    }
  };

  const loadBackups = async () => {
    try {
      const backupList = await SystemSettingsService.getBackups();
      setBackups(backupList);
    } catch (error) {
      console.error('Error loading backups:', error);
    }
  };

  const updateMaintenanceMode = async (enabled: boolean, message: string) => {
    try {
      const success = await SystemSettingsService.updateMaintenanceMode({
        enabled,
        message
      });
      
      if (success) {
        setMaintenanceMode(prev => prev ? { ...prev, enabled, message } : { enabled, message, createdBy: '' });
        toast({
          title: "Maintenance Mode Updated",
          description: `Maintenance mode has been ${enabled ? 'enabled' : 'disabled'}.`,
        });
      } else {
        throw new Error('Failed to update maintenance mode');
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update maintenance mode. Please try again.",
        variant: "destructive"
      });
    }
  };

  const clearSystemLogs = async () => {
    try {
      const success = await SystemSettingsService.clearSystemLogs();
      
      if (success) {
        setSystemLogs([]);
        toast({
          title: "Logs Cleared",
          description: "System logs have been cleared successfully.",
        });
      } else {
        throw new Error('Failed to clear logs');
      }
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Failed to clear system logs. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetToDefaults = async () => {
    try {
      // Reset to default values
      const defaultSettings: SystemSettingsState = {
        general: {
          companyName: 'TriChat',
          supportEmail: 'support@trichat.com',
          timeZone: 'UTC',
          language: 'en',
          maxAgents: 50,
          sessionTimeout: 30,
          maintenanceMode: false
        },
        notifications: {
          emailAlerts: true,
          pushNotifications: true,
          smsAlerts: false,
          webhookUrl: '',
          notificationFrequency: 'immediate'
        },
        security: {
          sessionTimeout: 30,
          passwordPolicy: 'strong',
          twoFactorAuth: true,
          ipWhitelist: '',
          maxLoginAttempts: 5,
          lockoutDuration: 15
        },
        integrations: {
          emailProvider: 'sendgrid',
          apiKey: '',
          webhookSecret: '',
          crmIntegration: 'none',
          slackWebhook: '',
          zapierWebhook: ''
        },
        maintenance: {
          autoBackup: true,
          backupFrequency: 'daily',
          backupRetention: 30,
          logRetention: 90,
          performanceMonitoring: true
        }
      };

      setSettings(defaultSettings);
      
      toast({
        title: "Settings Reset",
        description: "All settings have been reset to default values.",
      });
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Failed to reset settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    settings,
    systemHealth,
    backups,
    maintenanceMode,
    systemLogs,
    systemStats,
    loading,
    saving,
    isTestingConnection,
    backupInProgress,
    updateSettings,
    handleSaveSettings,
    testEmailConnection,
    testWebhookUrl,
    createBackup,
    updateMaintenanceMode,
    clearSystemLogs,
    resetToDefaults,
    loadAllSettings
  };
};
