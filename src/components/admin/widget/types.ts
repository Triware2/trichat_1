
export interface WidgetConfig {
  id?: string;
  title: string;
  subtitle: string;
  primaryColor: string;
  position: string;
  welcomeMessage: string;
  placeholder: string;
  showAvatar: boolean;
  autoOpen: boolean;
  department: string;
  buttonText: string;
  buttonSelector: string;
  // New integration-specific configs
  apiEndpoint?: string;
  webhookUrl?: string;
  customCSS?: string;
  allowFileUpload?: boolean;
  showTypingIndicator?: boolean;
  enableRating?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  customFields?: CustomField[];
  branding?: BrandingConfig;
  appearance?: AppearanceConfig;
  behavior?: BehaviorConfig;
  language?: string;
  timezone?: string;
  workingHours?: WorkingHours;
  autoResponders?: AutoResponder[];
  // Advanced features
  autoAssign?: boolean;
  autoDetectLanguage?: boolean;
  updatedAt?: string;
}

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

export interface BrandingConfig {
  logo?: string;
  companyName?: string;
  hideTriChatBranding?: boolean;
  customFavicon?: string;
}

export interface AppearanceConfig {
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  darkModeSupport?: boolean;
  width?: number;
  height?: number;
  responsive?: boolean;
  fontFamily?: string;
  fontSize?: number;
  boldHeadings?: boolean;
  animationType?: string;
  animationDuration?: number;
  roundedCorners?: boolean;
  shadowEffects?: boolean;
}

export interface BehaviorConfig {
  showOnScroll?: boolean;
  showOnExitIntent?: boolean;
  showAfterDelay?: boolean;
  delaySeconds?: number;
  soundNotifications?: boolean;
  desktopNotifications?: boolean;
}

export interface WorkingHours {
  enabled: boolean;
  timezone: string;
  schedule: {
    [key: string]: { start: string; end: string; enabled: boolean };
  };
}

export interface AutoResponder {
  id: string;
  trigger: string;
  response: string;
  enabled: boolean;
}

export type IntegrationType = 
  | 'widget' 
  | 'button' 
  | 'inline' 
  | 'popup' 
  | 'fullscreen' 
  | 'api' 
  | 'webhook' 
  | 'iframe' 
  | 'react-component' 
  | 'wordpress' 
  | 'shopify' 
  | 'slack' 
  | 'teams' 
  | 'whatsapp' 
  | 'facebook' 
  | 'telegram' 
  | 'discord' 
  | 'mobile-sdk';

export interface Position {
  value: string;
  label: string;
}

export interface Department {
  value: string;
  label: string;
}

export interface IntegrationTypeOption {
  value: IntegrationType;
  label: string;
  description: string;
  icon: any;
  category: 'web' | 'api' | 'platform' | 'messaging' | 'mobile';
  complexity: 'easy' | 'medium' | 'advanced';
  features: string[];
}
