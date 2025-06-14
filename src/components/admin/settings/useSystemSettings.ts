
import { useState } from 'react';
import { SystemSettingsState } from './types';
import { useToast } from '@/hooks/use-toast';

export const useSystemSettings = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<SystemSettingsState>({
    general: {
      companyName: 'SupportPro',
      supportEmail: 'support@supportpro.com',
      timeZone: 'UTC',
      language: 'en',
      maxAgents: 50
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      smsAlerts: false,
      webhookUrl: ''
    },
    security: {
      sessionTimeout: 30,
      passwordPolicy: 'strong',
      twoFactorAuth: true,
      ipWhitelist: ''
    },
    integrations: {
      emailProvider: 'sendgrid',
      apiKey: '',
      webhookSecret: '',
      crmIntegration: 'none'
    }
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);

  const updateSettings = (category: keyof SystemSettingsState, updates: Partial<any>) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], ...updates }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Your system settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const testEmailConnection = async () => {
    setIsTestingConnection(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Connection Successful",
        description: "Email provider connection is working correctly.",
      });
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

  const createBackup = async () => {
    setBackupInProgress(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "Backup Created",
        description: "System backup completed successfully. Download link sent to your email.",
      });
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

  const resetToDefaults = () => {
    setSettings({
      general: {
        companyName: 'TriChat',
        supportEmail: 'support@trichat.com',
        timeZone: 'UTC',
        language: 'en',
        maxAgents: 50
      },
      notifications: {
        emailAlerts: true,
        pushNotifications: true,
        smsAlerts: false,
        webhookUrl: ''
      },
      security: {
        sessionTimeout: 30,
        passwordPolicy: 'strong',
        twoFactorAuth: true,
        ipWhitelist: ''
      },
      integrations: {
        emailProvider: 'sendgrid',
        apiKey: '',
        webhookSecret: '',
        crmIntegration: 'none'
      }
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  return {
    settings,
    updateSettings,
    handleSaveSettings,
    testEmailConnection,
    createBackup,
    resetToDefaults,
    isTestingConnection,
    backupInProgress
  };
};
