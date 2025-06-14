
export interface GeneralSettings {
  companyName: string;
  supportEmail: string;
  timeZone: string;
  language: string;
  maxAgents: number;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  webhookUrl: string;
}

export interface SecuritySettings {
  sessionTimeout: number;
  passwordPolicy: string;
  twoFactorAuth: boolean;
  ipWhitelist: string;
}

export interface IntegrationSettings {
  emailProvider: string;
  apiKey: string;
  webhookSecret: string;
  crmIntegration: string;
}

export interface SystemSettingsState {
  general: GeneralSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  integrations: IntegrationSettings;
}
