
export interface CustomScript {
  id: string;
  name: string;
  description: string;
  language: 'javascript' | 'python' | 'typescript';
  trigger: 'manual' | 'webhook' | 'scheduled' | 'event';
  code: string;
  status: 'active' | 'inactive' | 'testing';
  lastRun: string;
  executions: number;
  environment: 'production' | 'sandbox' | 'development';
}

export interface NewScript {
  name: string;
  description: string;
  language: 'javascript' | 'python' | 'typescript';
  trigger: 'manual' | 'webhook' | 'scheduled' | 'event';
  code: string;
}
