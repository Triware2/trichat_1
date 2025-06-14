
export type Permission = 
  | 'view_dashboard'
  | 'view_analytics' 
  | 'view_users'
  | 'create_users'
  | 'edit_users'
  | 'delete_users'
  | 'view_chats'
  | 'manage_chats'
  | 'assign_chats'
  | 'view_reports'
  | 'create_reports'
  | 'edit_reports'
  | 'view_settings'
  | 'edit_settings'
  | 'manage_permissions'
  | 'view_widget'
  | 'edit_widget'
  | 'view_customer_data'
  | 'edit_customer_data'
  | 'view_dispositions'
  | 'edit_dispositions'
  | 'view_templates'
  | 'edit_templates'
  | 'manage_system';

export type Role = 'admin' | 'supervisor' | 'agent';

export interface RolePermissions {
  role: Role;
  permissions: Permission[];
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  customPermissions?: Permission[];
  status: 'active' | 'inactive';
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}
