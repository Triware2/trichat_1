
export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: string;
  recordsCount: number;
  config: DataSourceConfig;
}

export type DataSourceType = 
  | 'api' 
  | 'webhook' 
  | 'database' 
  | 'crm' 
  | 'ecommerce' 
  | 'helpdesk' 
  | 'analytics';

export interface DataSourceConfig {
  apiUrl?: string;
  apiKey?: string;
  webhookUrl?: string;
  database?: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
  integration?: {
    clientId: string;
    clientSecret: string;
    accessToken?: string;
    refreshToken?: string;
  };
  mapping: FieldMapping[];
  syncInterval: number; // in minutes
  autoSync: boolean;
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'email' | 'phone';
  required: boolean;
}

export interface SyncLog {
  id: string;
  dataSourceId: string;
  timestamp: string;
  status: 'success' | 'error' | 'partial';
  recordsProcessed: number;
  recordsSuccess: number;
  recordsError: number;
  errorMessage?: string;
}
