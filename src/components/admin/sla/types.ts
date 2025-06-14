
export interface SLATier {
  id: string;
  name: string;
  description: string;
  customerSegments: string[];
  contractTypes: string[];
  supportPlans: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SLATarget {
  id: string;
  slaId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  firstResponseTime: number; // minutes
  resolutionTime: number; // minutes
  followUpTime?: number; // minutes
  businessHoursOnly: boolean;
}

export interface SLAExclusion {
  id: string;
  slaId: string;
  name: string;
  description: string;
  type: 'holiday' | 'after-hours' | 'low-priority' | 'maintenance' | 'custom';
  conditions: string[];
  isActive: boolean;
}

export interface SLAMilestone {
  id: string;
  name: string;
  description: string;
  targetTime: number; // minutes from case creation
  type: 'first-response' | 'follow-up' | 'escalation' | 'resolution';
}

export interface EscalationRule {
  id: string;
  slaId: string;
  name: string;
  triggerType: 'time-based' | 'priority-based' | 'breach-imminent';
  triggerCondition: string;
  escalationLevel: number;
  escalateTo: string; // user ID or team ID
  notificationMethods: ('email' | 'sms' | 'in-app')[];
  isActive: boolean;
}

export interface SLABreach {
  id: string;
  caseId: string;
  slaId: string;
  breachType: 'response' | 'resolution' | 'milestone';
  expectedTime: string;
  actualTime: string;
  severity: 'minor' | 'major' | 'critical';
  rootCause?: string;
  isResolved: boolean;
  createdAt: string;
}

export interface SLAMetrics {
  slaId: string;
  period: 'day' | 'week' | 'month' | 'quarter';
  totalCases: number;
  breachedCases: number;
  complianceRate: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  escalatedCases: number;
}
