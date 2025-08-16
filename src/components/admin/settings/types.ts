
export interface GeneralSettings {
  companyName: string;
  supportEmail: string;
  timeZone: string;
  language: string;
  maxAgents: number;
  sessionTimeout: number;
  maintenanceMode: boolean;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  webhookUrl: string;
  notificationFrequency: 'immediate' | 'hourly' | 'daily';
}

export interface SecuritySettings {
  sessionTimeout: number;
  passwordPolicy: 'weak' | 'medium' | 'strong';
  twoFactorAuth: boolean;
  ipWhitelist: string;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

export interface IntegrationSettings {
  emailProvider: 'sendgrid' | 'mailgun' | 'smtp' | 'none';
  apiKey: string;
  webhookSecret: string;
  crmIntegration: 'none' | 'salesforce' | 'hubspot' | 'zoho' | 'freshdesk' | 'zendesk' | 'intercom' | 'pipedrive' | 'monday' | 'asana' | 'trello' | 'jira' | 'notion' | 'slack' | 'microsoft_dynamics' | 'oracle_crm' | 'sap_crm' | 'sugar_crm' | 'insightly' | 'nimble' | 'agile_crm' | 'capsule_crm' | 'streak_crm' | 'copper_crm';
  slackWebhook: string;
  zapierWebhook: string;
  // CRM-specific fields
  crmInstanceUrl?: string;
  crmClientId?: string;
  crmClientSecret?: string;
  crmUsername?: string;
  crmPassword?: string;
  crmSecurityToken?: string;
  crmPortalId?: string;
  crmContactProperties?: string;
  crmDealPipeline?: string;
  crmDomain?: string;
  crmTicketFields?: string;
  crmContactFields?: string;
  crmSubdomain?: string;
  crmEmail?: string;
  crmApiToken?: string;
  crmAccessToken?: string;
  crmWorkspaceId?: string;
  crmConversationFields?: string;
  crmDealFields?: string;
  crmRefreshToken?: string;
}

export interface MaintenanceSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupRetention: number;
  logRetention: number;
  performanceMonitoring: boolean;
}

export interface SystemSettingsState {
  general: GeneralSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  integrations: IntegrationSettings;
  maintenance: MaintenanceSettings;
}

export interface SystemHealth {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  databaseStatus: 'healthy' | 'warning' | 'error';
  uptime: number;
  activeConnections: number;
}

export interface BackupInfo {
  id: string;
  filename: string;
  size: number;
  createdAt: string;
  status: 'completed' | 'failed' | 'in_progress';
  type: 'manual' | 'automatic';
}

export interface MaintenanceMode {
  enabled: boolean;
  message: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  createdBy: string;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  category: string;
  userId?: string;
  metadata?: any;
  createdAt: string;
}

export interface SystemStats {
  totalUsers: number;
  totalChats: number;
  totalMessages: number;
  systemUptime: number;
  lastBackup: string | null;
}
