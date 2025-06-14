
import { useState } from 'react';
import { Permission, Role, RolePermissions, User, PermissionGroup } from './types';

const defaultRolePermissions: RolePermissions[] = [
  {
    role: 'admin',
    description: 'Full system access with all permissions',
    permissions: [
      'view_dashboard', 'view_analytics', 'view_users', 'create_users', 'edit_users', 'delete_users',
      'view_chats', 'manage_chats', 'assign_chats', 'view_reports', 'create_reports', 'edit_reports',
      'view_settings', 'edit_settings', 'manage_permissions', 'view_widget', 'edit_widget',
      'view_customer_data', 'edit_customer_data', 'view_dispositions', 'edit_dispositions',
      'view_templates', 'edit_templates', 'manage_system'
    ]
  },
  {
    role: 'supervisor',
    description: 'Manage team and monitor performance',
    permissions: [
      'view_dashboard', 'view_analytics', 'view_users', 'view_chats', 'manage_chats', 'assign_chats',
      'view_reports', 'create_reports', 'view_customer_data', 'edit_customer_data',
      'view_dispositions', 'view_templates', 'edit_templates'
    ]
  },
  {
    role: 'agent',
    description: 'Handle customer conversations',
    permissions: [
      'view_dashboard', 'view_chats', 'view_customer_data', 'view_dispositions', 'view_templates'
    ]
  }
];

const permissionGroups: PermissionGroup[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Dashboard and overview access',
    permissions: ['view_dashboard', 'view_analytics']
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'User account management',
    permissions: ['view_users', 'create_users', 'edit_users', 'delete_users']
  },
  {
    id: 'chats',
    name: 'Chat Management',
    description: 'Chat and conversation management',
    permissions: ['view_chats', 'manage_chats', 'assign_chats']
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    description: 'Reporting and analytics access',
    permissions: ['view_reports', 'create_reports', 'edit_reports']
  },
  {
    id: 'system',
    name: 'System Settings',
    description: 'System configuration and settings',
    permissions: ['view_settings', 'edit_settings', 'manage_permissions', 'manage_system']
  },
  {
    id: 'widget',
    name: 'Chat Widget',
    description: 'Chat widget configuration',
    permissions: ['view_widget', 'edit_widget']
  },
  {
    id: 'customer',
    name: 'Customer Data',
    description: 'Customer information access',
    permissions: ['view_customer_data', 'edit_customer_data']
  },
  {
    id: 'content',
    name: 'Content Management',
    description: 'Templates and dispositions',
    permissions: ['view_dispositions', 'edit_dispositions', 'view_templates', 'edit_templates']
  }
];

export const useAccessManagement = () => {
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>(defaultRolePermissions);

  const hasPermission = (userRole: Role, permission: Permission, customPermissions?: Permission[]): boolean => {
    if (customPermissions?.includes(permission)) return true;
    
    const role = rolePermissions.find(r => r.role === userRole);
    return role?.permissions.includes(permission) || false;
  };

  const updateRolePermissions = (role: Role, permissions: Permission[]) => {
    setRolePermissions(prev => 
      prev.map(rp => rp.role === role ? { ...rp, permissions } : rp)
    );
  };

  const getRolePermissions = (role: Role): Permission[] => {
    return rolePermissions.find(rp => rp.role === role)?.permissions || [];
  };

  const getAllPermissions = (): Permission[] => {
    return permissionGroups.flatMap(group => group.permissions);
  };

  return {
    rolePermissions,
    permissionGroups,
    hasPermission,
    updateRolePermissions,
    getRolePermissions,
    getAllPermissions
  };
};
