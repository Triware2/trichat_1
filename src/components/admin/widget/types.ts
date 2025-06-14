
export interface WidgetConfig {
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
}

export type IntegrationType = 'widget' | 'button';

export interface Position {
  value: string;
  label: string;
}

export interface Department {
  value: string;
  label: string;
}
