
// Comprehensive Permission Types
export type Permission = 
  // Dashboard & Analytics
  | 'view_dashboard'
  | 'view_analytics'
  | 'view_performance_metrics'
  | 'export_analytics'
  | 'view_real_time_data'
  
  // User Management
  | 'view_users'
  | 'create_users'
  | 'edit_users'
  | 'delete_users'
  | 'suspend_users'
  | 'activate_users'
  | 'assign_roles'
  | 'view_user_activity'
  | 'reset_user_password'
  
  // Chat Management
  | 'view_chats'
  | 'manage_chats'
  | 'assign_chats'
  | 'transfer_chats'
  | 'close_chats'
  | 'reopen_chats'
  | 'view_chat_history'
  | 'delete_chat_messages'
  | 'edit_chat_messages'
  | 'view_chat_analytics'
  | 'bulk_chat_operations'
  
  // Reports & Analytics
  | 'view_reports'
  | 'create_reports'
  | 'edit_reports'
  | 'delete_reports'
  | 'schedule_reports'
  | 'export_reports'
  | 'view_custom_reports'
  | 'share_reports'
  
  // System Settings
  | 'view_settings'
  | 'edit_settings'
  | 'manage_permissions'
  | 'manage_system'
  | 'view_audit_logs'
  | 'manage_integrations'
  | 'configure_webhooks'
  | 'manage_api_keys'
  
  // Chat Widget
  | 'view_widget'
  | 'edit_widget'
  | 'configure_widget'
  | 'deploy_widget'
  | 'view_widget_analytics'
  
  // Customer Data
  | 'view_customer_data'
  | 'edit_customer_data'
  | 'delete_customer_data'
  | 'export_customer_data'
  | 'view_customer_history'
  | 'merge_customer_records'
  | 'anonymize_customer_data'
  
  // Content Management
  | 'view_dispositions'
  | 'edit_dispositions'
  | 'create_dispositions'
  | 'delete_dispositions'
  | 'view_templates'
  | 'edit_templates'
  | 'create_templates'
  | 'delete_templates'
  | 'manage_canned_responses'
  
  // CSAT & Feedback
  | 'view_csat'
  | 'manage_csat_surveys'
  | 'view_csat_analytics'
  | 'export_csat_data'
  | 'configure_csat_settings'
  
  // Billing & Subscriptions
  | 'view_billing'
  | 'manage_billing'
  | 'view_subscriptions'
  | 'manage_subscriptions'
  | 'view_payment_history'
  | 'process_refunds'
  
  // Security & Compliance
  | 'view_security_logs'
  | 'manage_security_settings'
  | 'view_compliance_reports'
  | 'manage_data_retention'
  | 'configure_2fa'
  | 'manage_ip_whitelist'
  
  // Integrations & APIs
  | 'view_integrations'
  | 'manage_integrations'
  | 'configure_webhooks'
  | 'manage_api_keys'
  | 'view_api_usage'
  | 'test_integrations'
  
  // Workflow & Automation
  | 'view_workflows'
  | 'create_workflows'
  | 'edit_workflows'
  | 'delete_workflows'
  | 'manage_automation_rules'
  | 'view_automation_logs'
  
  // Knowledge Base
  | 'view_knowledge_base'
  | 'create_knowledge_articles'
  | 'edit_knowledge_articles'
  | 'delete_knowledge_articles'
  | 'manage_knowledge_categories'
  | 'publish_knowledge_articles'
  
  // SLA Management
  | 'view_sla'
  | 'create_sla'
  | 'edit_sla'
  | 'delete_sla'
  | 'view_sla_reports'
  | 'configure_sla_escalations'
  
  // Custom Permissions (for dynamic permissions)
  | string;

export type Role = 'admin' | 'supervisor' | 'agent';

export interface RolePermissions {
  role: Role;
  permissions: Permission[];
  description: string;
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  customPermissions?: Permission[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  department?: string;
  manager?: string;
  phone?: string;
  avatar?: string;
  timezone?: string;
  language?: string;
  twoFactorEnabled?: boolean;
  loginAttempts?: number;
  lockedUntil?: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  category: 'core' | 'advanced' | 'security' | 'compliance' | 'custom';
  isRequired?: boolean;
  icon?: string;
}

export interface CustomPermission {
  id: string;
  name: string;
  description: string;
  code: string;
  category: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  appliesTo: Role[];
}

export interface PermissionAuditLog {
  id: string;
  userId: string;
  action: 'grant' | 'revoke' | 'create' | 'update' | 'delete';
  permission: Permission;
  targetUser?: string;
  targetRole?: Role;
  reason?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault?: boolean;
  industry?: string;
  companySize?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionMatrix {
  roles: Role[];
  permissions: Permission[];
  matrix: Record<Role, Permission[]>;
  lastUpdated: string;
  updatedBy: string;
}

export interface AccessControlPolicy {
  id: string;
  name: string;
  description: string;
  type: 'allow' | 'deny' | 'require_approval';
  conditions: {
    roles?: Role[];
    permissions?: Permission[];
    timeRestrictions?: {
      startTime?: string;
      endTime?: string;
      daysOfWeek?: number[];
    };
    ipRestrictions?: string[];
    deviceRestrictions?: string[];
  };
  actions: Permission[];
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
