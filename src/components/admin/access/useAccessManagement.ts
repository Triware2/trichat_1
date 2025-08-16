
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Permission, 
  Role, 
  RolePermissions, 
  User, 
  PermissionGroup, 
  CustomPermission,
  PermissionAuditLog,
  RoleTemplate,
  AccessControlPolicy
} from './types';

// Comprehensive permission groups
const permissionGroups: PermissionGroup[] = [
  {
    id: 'dashboard',
    name: 'Dashboard & Analytics',
    description: 'Access to dashboard and analytics features',
    category: 'core',
    permissions: [
      'view_dashboard',
      'view_analytics',
      'view_performance_metrics',
      'export_analytics',
      'view_real_time_data'
    ],
    icon: '📊'
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'Manage user accounts and permissions',
    category: 'core',
    permissions: [
      'view_users',
      'create_users',
      'edit_users',
      'delete_users',
      'suspend_users',
      'activate_users',
      'assign_roles',
      'view_user_activity',
      'reset_user_password'
    ],
    icon: '👥'
  },
  {
    id: 'chats',
    name: 'Chat Management',
    description: 'Manage chat conversations and operations',
    category: 'core',
    permissions: [
      'view_chats',
      'manage_chats',
      'assign_chats',
      'transfer_chats',
      'close_chats',
      'reopen_chats',
      'view_chat_history',
      'delete_chat_messages',
      'edit_chat_messages',
      'view_chat_analytics',
      'bulk_chat_operations'
    ],
    icon: '💬'
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    description: 'Create and manage reports',
    category: 'core',
    permissions: [
      'view_reports',
      'create_reports',
      'edit_reports',
      'delete_reports',
      'schedule_reports',
      'export_reports',
      'view_custom_reports',
      'share_reports'
    ],
    icon: '📈'
  },
  {
    id: 'system',
    name: 'System Settings',
    description: 'System configuration and administration',
    category: 'security',
    permissions: [
      'view_settings',
      'edit_settings',
      'manage_permissions',
      'manage_system',
      'view_audit_logs',
      'manage_integrations',
      'configure_webhooks',
      'manage_api_keys'
    ],
    icon: '⚙️'
  },
  {
    id: 'widget',
    name: 'Chat Widget',
    description: 'Configure and manage chat widget',
    category: 'core',
    permissions: [
      'view_widget',
      'edit_widget',
      'configure_widget',
      'deploy_widget',
      'view_widget_analytics'
    ],
    icon: '🔧'
  },
  {
    id: 'customer',
    name: 'Customer Data',
    description: 'Access and manage customer information',
    category: 'compliance',
    permissions: [
      'view_customer_data',
      'edit_customer_data',
      'delete_customer_data',
      'export_customer_data',
      'view_customer_history',
      'merge_customer_records',
      'anonymize_customer_data'
    ],
    icon: '👤'
  },
  {
    id: 'content',
    name: 'Content Management',
    description: 'Manage templates and dispositions',
    category: 'core',
    permissions: [
      'view_dispositions',
      'edit_dispositions',
      'create_dispositions',
      'delete_dispositions',
      'view_templates',
      'edit_templates',
      'create_templates',
      'delete_templates',
      'manage_canned_responses'
    ],
    icon: '📝'
  },
  {
    id: 'csat',
    name: 'CSAT & Feedback',
    description: 'Customer satisfaction surveys and feedback',
    category: 'core',
    permissions: [
      'view_csat',
      'manage_csat_surveys',
      'view_csat_analytics',
      'export_csat_data',
      'configure_csat_settings'
    ],
    icon: '⭐'
  },
  {
    id: 'billing',
    name: 'Billing & Subscriptions',
    description: 'Manage billing and subscription settings',
    category: 'security',
    permissions: [
      'view_billing',
      'manage_billing',
      'view_subscriptions',
      'manage_subscriptions',
      'view_payment_history',
      'process_refunds'
    ],
    icon: '💳'
  },
  {
    id: 'security',
    name: 'Security & Compliance',
    description: 'Security settings and compliance management',
    category: 'security',
    permissions: [
      'view_security_logs',
      'manage_security_settings',
      'view_compliance_reports',
      'manage_data_retention',
      'configure_2fa',
      'manage_ip_whitelist'
    ],
    icon: '🔒'
  },
  {
    id: 'integrations',
    name: 'Integrations & APIs',
    description: 'Manage third-party integrations and APIs',
    category: 'advanced',
    permissions: [
      'view_integrations',
      'manage_integrations',
      'configure_webhooks',
      'manage_api_keys',
      'view_api_usage',
      'test_integrations'
    ],
    icon: '🔗'
  },
  {
    id: 'workflows',
    name: 'Workflow & Automation',
    description: 'Create and manage automated workflows',
    category: 'advanced',
    permissions: [
      'view_workflows',
      'create_workflows',
      'edit_workflows',
      'delete_workflows',
      'manage_automation_rules',
      'view_automation_logs'
    ],
    icon: '🔄'
  },
  {
    id: 'knowledge',
    name: 'Knowledge Base',
    description: 'Manage knowledge base articles',
    category: 'core',
    permissions: [
      'view_knowledge_base',
      'create_knowledge_articles',
      'edit_knowledge_articles',
      'delete_knowledge_articles',
      'manage_knowledge_categories',
      'publish_knowledge_articles'
    ],
    icon: '📚'
  },
  {
    id: 'sla',
    name: 'SLA Management',
    description: 'Service Level Agreement management',
    category: 'advanced',
    permissions: [
      'view_sla',
      'create_sla',
      'edit_sla',
      'delete_sla',
      'view_sla_reports',
      'configure_sla_escalations'
    ],
    icon: '⏱️'
  }
];

// Default role permissions
const defaultRolePermissions: RolePermissions[] = [
  {
    role: 'admin',
    description: 'Full system access with all permissions',
    permissions: permissionGroups.flatMap(group => group.permissions),
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    role: 'supervisor',
    description: 'Manage team and monitor performance',
    permissions: [
      'view_dashboard',
      'view_analytics',
      'view_performance_metrics',
      'view_users',
      'view_user_activity',
      'view_chats',
      'manage_chats',
      'assign_chats',
      'transfer_chats',
      'close_chats',
      'reopen_chats',
      'view_chat_history',
      'view_chat_analytics',
      'bulk_chat_operations',
      'view_reports',
      'create_reports',
      'export_reports',
      'view_customer_data',
      'edit_customer_data',
      'view_customer_history',
      'view_dispositions',
      'edit_dispositions',
      'view_templates',
      'edit_templates',
      'manage_canned_responses',
      'view_csat',
      'view_csat_analytics',
      'view_widget',
      'view_widget_analytics',
      'view_knowledge_base',
      'create_knowledge_articles',
      'edit_knowledge_articles',
      'view_sla',
      'view_sla_reports'
    ],
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    role: 'agent',
    description: 'Handle customer conversations',
    permissions: [
      'view_dashboard',
      'view_chats',
      'manage_chats',
      'view_chat_history',
      'view_customer_data',
      'edit_customer_data',
      'view_customer_history',
      'view_dispositions',
      'view_templates',
      'edit_templates',
      'manage_canned_responses',
      'view_knowledge_base'
    ],
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useAccessManagement = () => {
  const { toast } = useToast();
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>(defaultRolePermissions);
  const [customPermissions, setCustomPermissions] = useState<CustomPermission[]>([]);
  const [auditLogs, setAuditLogs] = useState<PermissionAuditLog[]>([]);
  const [accessPolicies, setAccessPolicies] = useState<AccessControlPolicy[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data from database
  useEffect(() => {
    loadPermissionsFromDatabase();
  }, []);

  const loadPermissionsFromDatabase = async () => {
    setLoading(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;

      // Load role permissions
      const { data: rp, error: rpErr } = await (supabase as any)
        .from('role_permissions')
        .select('*')
        .eq('created_by', userId);

      if (rpErr) throw rpErr;

      if (!rp || rp.length === 0) {
        // Seed defaults for current user
        const seedRows = defaultRolePermissions.map((rp) => ({
          role: rp.role,
          description: rp.description,
          permissions: rp.permissions,
          is_custom: false,
          created_by: userId
        }));
        await (supabase as any).from('role_permissions').insert(seedRows);
        setRolePermissions(defaultRolePermissions);
      } else {
        const mapped: RolePermissions[] = rp.map((row: any) => ({
          role: row.role,
          description: row.description || '',
          permissions: row.permissions || [],
          isCustom: row.is_custom || false,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
        setRolePermissions(mapped);
      }

      // Load custom permissions
      const { data: cp, error: cpErr } = await (supabase as any)
        .from('custom_permissions')
        .select('*')
        .eq('created_by', userId)
        .eq('is_active', true);
      if (cpErr) throw cpErr;
      const mappedCustom: CustomPermission[] = (cp || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        code: row.code,
        category: row.category,
        appliesTo: row.applies_to || [],
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
      setCustomPermissions(mappedCustom);

      // Load recent audit logs (optional UI usage)
      const { data: al } = await (supabase as any)
        .from('permission_audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);
      const mappedLogs: PermissionAuditLog[] = (al || []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        action: row.action,
        permission: row.permission,
        targetUser: row.target_user,
        targetRole: row.target_role as any,
        reason: row.reason || '',
        createdAt: row.timestamp,
        ipAddress: row.ip_address || '',
        userAgent: row.user_agent || ''
      }));
      setAuditLogs(mappedLogs);

    } catch (error) {
      console.error('Error loading permissions:', error);
      // Fallback to defaults to keep UI operational
      setRolePermissions(defaultRolePermissions);
      setCustomPermissions([]);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = useCallback((userRole: Role, permission: Permission): boolean => {
    // Check role permissions
    const role = rolePermissions?.find(rp => rp.role === userRole);
    if (role?.permissions.includes(permission)) return true;
    
    // Check custom permission definitions
    const customPerm = customPermissions?.find(cp => cp.code === permission);
    if (customPerm && customPerm.appliesTo.includes(userRole)) return true;
    
    return false;
  }, [rolePermissions, customPermissions]);

  const updateRolePermissions = async (role: Role, permissions: Permission[]) => {
    setLoading(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;

      // Upsert by role/created_by
      const { data: existing } = await (supabase as any)
        .from('role_permissions')
        .select('id')
        .eq('role', role)
        .eq('created_by', userId)
        .single();

      if (existing?.id) {
        await (supabase as any)
          .from('role_permissions')
          .update({ permissions, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await (supabase as any)
          .from('role_permissions')
          .insert({ role, permissions, created_by: userId, is_custom: false });
      }

      setRolePermissions(prev => prev.map(rp => rp.role === role ? { ...rp, permissions } : rp));

      toast({
        title: "Permissions Updated",
        description: `Permissions for ${role} role have been updated.`,
      });

    } catch (error) {
      console.error('Error updating role permissions:', error);
      toast({
        title: "Error",
        description: "Failed to update role permissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCustomPermission = async (permission: Omit<CustomPermission, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;

      const { data, error } = await (supabase as any)
        .from('custom_permissions')
        .insert({
          name: permission.name,
          description: permission.description,
          code: permission.code,
          category: permission.category,
          applies_to: permission.appliesTo || [],
          created_by: userId,
          is_active: permission.isActive !== false
        })
        .select()
        .single();
      if (error) throw error;

      const newPermission: CustomPermission = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        code: data.code,
        category: data.category,
        appliesTo: data.applies_to || [],
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setCustomPermissions(prev => [newPermission, ...prev]);

      toast({
        title: "Custom Permission Created",
        description: `Permission "${permission.name}" has been created successfully.`,
      });

      return newPermission;

    } catch (error) {
      console.error('Error creating custom permission:', error);
      toast({
        title: "Error",
        description: "Failed to create custom permission.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomPermission = async (permissionId: string) => {
    setLoading(true);
    try {
      await (supabase as any)
        .from('custom_permissions')
        .delete()
        .eq('id', permissionId);

      setCustomPermissions(prev => prev.filter(cp => cp.id !== permissionId));

      toast({
        title: "Custom Permission Deleted",
        description: "Custom permission has been deleted successfully.",
      });

    } catch (error) {
      console.error('Error deleting custom permission:', error);
      toast({
        title: "Error",
        description: "Failed to delete custom permission",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRolePermissions = (role: Role): Permission[] => {
    return rolePermissions.find(rp => rp.role === role)?.permissions || [];
  };

  const getAllPermissions = (): Permission[] => {
    const standardPermissions = permissionGroups.flatMap(group => group.permissions);
    const customPermCodes = customPermissions.map(cp => cp.code);
    return [...standardPermissions, ...customPermCodes];
  };

  const logPermissionChange = async (
    userId: string,
    action: PermissionAuditLog['action'],
    permission: Permission,
    targetUser?: string,
    targetRole?: Role,
    reason?: string
  ) => {
    try {
      await (supabase as any)
        .from('permission_audit_logs')
        .insert({
          user_id: userId,
          action,
          permission,
          target_user: targetUser || null,
          target_role: targetRole || null,
          reason: reason || null
        });
    } catch (e) {
      console.warn('Audit log insert failed, continuing:', e);
    }
  };

  const createAccessPolicy = async (policy: Omit<AccessControlPolicy, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;
      const { data, error } = await (supabase as any)
        .from('access_control_policies')
        .insert({
          name: policy.name,
          description: policy.description,
          type: (policy as any).type || 'allow',
          conditions: policy.conditions || {},
          actions: policy.actions || [],
          priority: policy.priority || 0,
          is_active: policy.isActive !== false,
          created_by: userId
        })
        .select()
        .single();
      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        conditions: data.conditions,
        actions: data.actions,
        priority: data.priority,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as AccessControlPolicy;
    } catch (e) {
      console.warn('Create access policy failed, returning local object:', e);
      return { ...policy, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any;
    }
  };

  const exportPermissions = () => {
    const data = {
      rolePermissions,
      customPermissions,
      permissionGroups,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `permissions-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Permissions Exported",
      description: "Permission configuration has been exported successfully.",
    });
  };

  return {
    rolePermissions,
    permissionGroups,
    customPermissions,
    auditLogs,
    accessPolicies,
    loading,
    hasPermission,
    updateRolePermissions,
    createCustomPermission,
    deleteCustomPermission,
    getRolePermissions,
    getAllPermissions,
    createAccessPolicy,
    exportPermissions,
    loadPermissionsFromDatabase
  };
};
