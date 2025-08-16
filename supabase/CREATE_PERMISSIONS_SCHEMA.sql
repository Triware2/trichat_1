-- Comprehensive Permissions System Schema
-- This creates all necessary tables for role-based access control

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role Permissions Table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL CHECK (role IN ('admin', 'supervisor', 'agent')),
    permissions TEXT[] NOT NULL DEFAULT '{}',
    description TEXT,
    is_custom BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom Permissions Table
CREATE TABLE IF NOT EXISTS custom_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    code TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('core', 'security', 'compliance', 'advanced', 'custom')),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    applies_to TEXT[] DEFAULT '{}'
);

-- Permission Audit Logs Table
CREATE TABLE IF NOT EXISTS permission_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('grant', 'revoke', 'create', 'update', 'delete')),
    permission TEXT NOT NULL,
    target_user UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    target_role TEXT,
    reason TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Access Control Policies Table
CREATE TABLE IF NOT EXISTS access_control_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('allow', 'deny', 'require_approval')),
    conditions JSONB NOT NULL DEFAULT '{}',
    actions TEXT[] NOT NULL DEFAULT '{}',
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role Templates Table
CREATE TABLE IF NOT EXISTS role_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    permissions TEXT[] NOT NULL DEFAULT '{}',
    is_default BOOLEAN DEFAULT FALSE,
    industry TEXT,
    company_size TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Custom Permissions Table (for individual user overrides)
CREATE TABLE IF NOT EXISTS user_custom_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    permissions TEXT[] NOT NULL DEFAULT '{}',
    reason TEXT,
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Permission Groups Table (for organizing permissions)
CREATE TABLE IF NOT EXISTS permission_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    permissions TEXT[] NOT NULL DEFAULT '{}',
    category TEXT NOT NULL CHECK (category IN ('core', 'security', 'compliance', 'advanced', 'custom')),
    is_required BOOLEAN DEFAULT FALSE,
    icon TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);
CREATE INDEX IF NOT EXISTS idx_role_permissions_created_by ON role_permissions(created_by);
CREATE INDEX IF NOT EXISTS idx_custom_permissions_code ON custom_permissions(code);
CREATE INDEX IF NOT EXISTS idx_custom_permissions_category ON custom_permissions(category);
CREATE INDEX IF NOT EXISTS idx_custom_permissions_created_by ON custom_permissions(created_by);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON permission_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON permission_audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON permission_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_access_policies_type ON access_control_policies(type);
CREATE INDEX IF NOT EXISTS idx_access_policies_priority ON access_control_policies(priority);
CREATE INDEX IF NOT EXISTS idx_user_custom_permissions_user_id ON user_custom_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_permission_groups_category ON permission_groups(category);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_control_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_custom_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_groups ENABLE ROW LEVEL SECURITY;

-- Role Permissions RLS Policies
CREATE POLICY "Users can view role permissions" ON role_permissions
    FOR SELECT USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM role_permissions rp 
        WHERE rp.created_by = auth.uid() 
        AND 'manage_permissions' = ANY(rp.permissions)
    ));

CREATE POLICY "Users can manage role permissions" ON role_permissions
    FOR ALL USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM role_permissions rp 
        WHERE rp.created_by = auth.uid() 
        AND 'manage_permissions' = ANY(rp.permissions)
    ));

-- Custom Permissions RLS Policies
CREATE POLICY "Users can view custom permissions" ON custom_permissions
    FOR SELECT USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM role_permissions rp 
        WHERE rp.created_by = auth.uid() 
        AND 'manage_permissions' = ANY(rp.permissions)
    ));

CREATE POLICY "Users can manage custom permissions" ON custom_permissions
    FOR ALL USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM role_permissions rp 
        WHERE rp.created_by = auth.uid() 
        AND 'manage_permissions' = ANY(rp.permissions)
    ));

-- Audit Logs RLS Policies
CREATE POLICY "Users can view audit logs" ON permission_audit_logs
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = target_user OR EXISTS (
        SELECT 1 FROM role_permissions rp 
        WHERE rp.created_by = auth.uid() 
        AND 'view_audit_logs' = ANY(rp.permissions)
    ));

CREATE POLICY "System can insert audit logs" ON permission_audit_logs
    FOR INSERT WITH CHECK (true);

-- Access Control Policies RLS Policies
CREATE POLICY "Users can view access policies" ON access_control_policies
    FOR SELECT USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM role_permissions rp 
        WHERE rp.created_by = auth.uid() 
        AND 'manage_permissions' = ANY(rp.permissions)
    ));

CREATE POLICY "Users can manage access policies" ON access_control_policies
    FOR ALL USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM role_permissions rp 
        WHERE rp.created_by = auth.uid() 
        AND 'manage_permissions' = ANY(rp.permissions)
    ));

-- User Custom Permissions RLS Policies
CREATE POLICY "Users can view their own custom permissions" ON user_custom_permissions
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = granted_by OR EXISTS (
        SELECT 1 FROM role_permissions rp 
        WHERE rp.created_by = auth.uid() 
        AND 'manage_permissions' = ANY(rp.permissions)
    ));

CREATE POLICY "Users can manage custom permissions" ON user_custom_permissions
    FOR ALL USING (auth.uid() = granted_by OR EXISTS (
        SELECT 1 FROM role_permissions rp 
        WHERE rp.created_by = auth.uid() 
        AND 'manage_permissions' = ANY(rp.permissions)
    ));

-- Permission Groups RLS Policies
CREATE POLICY "Users can view permission groups" ON permission_groups
    FOR SELECT USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM role_permissions rp 
        WHERE rp.created_by = auth.uid() 
        AND 'manage_permissions' = ANY(rp.permissions)
    ));

CREATE POLICY "Users can manage permission groups" ON permission_groups
    FOR ALL USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM role_permissions rp 
        WHERE rp.created_by = auth.uid() 
        AND 'manage_permissions' = ANY(rp.permissions)
    ));

-- Functions for permission management

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION has_permission(
    p_user_id UUID,
    p_permission TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    has_perm BOOLEAN := FALSE;
    user_role TEXT;
BEGIN
    -- Get user's role from profiles table
    SELECT role INTO user_role FROM profiles WHERE id = p_user_id;
    
    -- Check role permissions
    SELECT EXISTS (
        SELECT 1 FROM role_permissions rp
        WHERE rp.created_by = p_user_id
        AND p_permission = ANY(rp.permissions)
        AND rp.role = user_role
    ) INTO has_perm;
    
    -- If not found in role permissions, check custom permissions
    IF NOT has_perm THEN
        SELECT EXISTS (
            SELECT 1 FROM user_custom_permissions ucp
            WHERE ucp.user_id = p_user_id
            AND p_permission = ANY(ucp.permissions)
            AND ucp.is_active = TRUE
            AND (ucp.expires_at IS NULL OR ucp.expires_at > NOW())
        ) INTO has_perm;
    END IF;
    
    -- Check custom permission definitions
    IF NOT has_perm THEN
        SELECT EXISTS (
            SELECT 1 FROM custom_permissions cp
            WHERE cp.code = p_permission
            AND cp.is_active = TRUE
            AND user_role = ANY(cp.applies_to)
        ) INTO has_perm;
    END IF;
    
    RETURN has_perm;
END;
$$;

-- Function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions(p_user_id UUID)
RETURNS TABLE (
    permission TEXT,
    source TEXT,
    granted_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Get user's role
    SELECT role INTO user_role FROM profiles WHERE id = p_user_id;
    
    -- Return role permissions
    RETURN QUERY
    SELECT 
        unnest(rp.permissions) as permission,
        'role' as source,
        rp.created_at as granted_at
    FROM role_permissions rp
    WHERE rp.created_by = p_user_id AND rp.role = user_role
    
    UNION ALL
    
    -- Return custom permissions
    SELECT 
        unnest(ucp.permissions) as permission,
        'custom' as source,
        ucp.granted_at as granted_at
    FROM user_custom_permissions ucp
    WHERE ucp.user_id = p_user_id 
    AND ucp.is_active = TRUE
    AND (ucp.expires_at IS NULL OR ucp.expires_at > NOW())
    
    UNION ALL
    
    -- Return custom permission definitions
    SELECT 
        cp.code as permission,
        'custom_definition' as source,
        cp.created_at as granted_at
    FROM custom_permissions cp
    WHERE cp.is_active = TRUE
    AND user_role = ANY(cp.applies_to);
END;
$$;

-- Function to grant permission to user
CREATE OR REPLACE FUNCTION grant_permission(
    p_user_id UUID,
    p_permission TEXT,
    p_granted_by UUID,
    p_reason TEXT DEFAULT NULL,
    p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if granter has permission to grant permissions
    IF NOT has_permission(p_granted_by, 'manage_permissions') THEN
        RAISE EXCEPTION 'Insufficient permissions to grant permissions';
    END IF;
    
    -- Insert or update user custom permission
    INSERT INTO user_custom_permissions (user_id, permissions, reason, granted_by, expires_at)
    VALUES (p_user_id, ARRAY[p_permission], p_reason, p_granted_by, p_expires_at)
    ON CONFLICT (user_id) DO UPDATE SET
        permissions = array_append(user_custom_permissions.permissions, p_permission),
        reason = COALESCE(p_reason, user_custom_permissions.reason),
        granted_by = p_granted_by,
        expires_at = p_expires_at,
        updated_at = NOW();
    
    -- Log the action
    INSERT INTO permission_audit_logs (user_id, action, permission, target_user, reason)
    VALUES (p_granted_by, 'grant', p_permission, p_user_id, p_reason);
    
    RETURN TRUE;
END;
$$;

-- Function to revoke permission from user
CREATE OR REPLACE FUNCTION revoke_permission(
    p_user_id UUID,
    p_permission TEXT,
    p_revoked_by UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if revoker has permission to revoke permissions
    IF NOT has_permission(p_revoked_by, 'manage_permissions') THEN
        RAISE EXCEPTION 'Insufficient permissions to revoke permissions';
    END IF;
    
    -- Remove permission from user custom permissions
    UPDATE user_custom_permissions 
    SET permissions = array_remove(permissions, p_permission),
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Log the action
    INSERT INTO permission_audit_logs (user_id, action, permission, target_user, reason)
    VALUES (p_revoked_by, 'revoke', p_permission, p_user_id, p_reason);
    
    RETURN TRUE;
END;
$$;

-- Function to get permission audit trail
CREATE OR REPLACE FUNCTION get_permission_audit_trail(
    p_user_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
    action TEXT,
    permission TEXT,
    target_user UUID,
    target_role TEXT,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pal.action,
        pal.permission,
        pal.target_user,
        pal.target_role,
        pal.reason,
        pal.timestamp,
        pal.ip_address,
        pal.user_agent
    FROM permission_audit_logs pal
    WHERE pal.user_id = p_user_id
    AND pal.timestamp BETWEEN p_start_date AND p_end_date
    ORDER BY pal.timestamp DESC;
END;
$$;

-- Insert default permission groups
INSERT INTO permission_groups (name, description, permissions, category, is_required, icon) VALUES
('Dashboard & Analytics', 'Access to dashboard and analytics features', 
 ARRAY['view_dashboard', 'view_analytics', 'view_performance_metrics', 'export_analytics', 'view_real_time_data'], 
 'core', false, '📊'),

('User Management', 'Manage user accounts and permissions', 
 ARRAY['view_users', 'create_users', 'edit_users', 'delete_users', 'suspend_users', 'activate_users', 'assign_roles', 'view_user_activity', 'reset_user_password'], 
 'core', false, '👥'),

('Chat Management', 'Manage chat conversations and operations', 
 ARRAY['view_chats', 'manage_chats', 'assign_chats', 'transfer_chats', 'close_chats', 'reopen_chats', 'view_chat_history', 'delete_chat_messages', 'edit_chat_messages', 'view_chat_analytics', 'bulk_chat_operations'], 
 'core', false, '💬'),

('Reports & Analytics', 'Create and manage reports', 
 ARRAY['view_reports', 'create_reports', 'edit_reports', 'delete_reports', 'schedule_reports', 'export_reports', 'view_custom_reports', 'share_reports'], 
 'core', false, '📈'),

('System Settings', 'System configuration and administration', 
 ARRAY['view_settings', 'edit_settings', 'manage_permissions', 'manage_system', 'view_audit_logs', 'manage_integrations', 'configure_webhooks', 'manage_api_keys'], 
 'security', false, '⚙️'),

('Chat Widget', 'Configure and manage chat widget', 
 ARRAY['view_widget', 'edit_widget', 'configure_widget', 'deploy_widget', 'view_widget_analytics'], 
 'core', false, '🔧'),

('Customer Data', 'Access and manage customer information', 
 ARRAY['view_customer_data', 'edit_customer_data', 'delete_customer_data', 'export_customer_data', 'view_customer_history', 'merge_customer_records', 'anonymize_customer_data'], 
 'compliance', false, '👤'),

('Content Management', 'Manage templates and dispositions', 
 ARRAY['view_dispositions', 'edit_dispositions', 'create_dispositions', 'delete_dispositions', 'view_templates', 'edit_templates', 'create_templates', 'delete_templates', 'manage_canned_responses'], 
 'core', false, '📝'),

('CSAT & Feedback', 'Customer satisfaction surveys and feedback', 
 ARRAY['view_csat', 'manage_csat_surveys', 'view_csat_analytics', 'export_csat_data', 'configure_csat_settings'], 
 'core', false, '⭐'),

('Billing & Subscriptions', 'Manage billing and subscription settings', 
 ARRAY['view_billing', 'manage_billing', 'view_subscriptions', 'manage_subscriptions', 'view_payment_history', 'process_refunds'], 
 'security', false, '💳'),

('Security & Compliance', 'Security settings and compliance management', 
 ARRAY['view_security_logs', 'manage_security_settings', 'view_compliance_reports', 'manage_data_retention', 'configure_2fa', 'manage_ip_whitelist'], 
 'security', false, '🔒'),

('Integrations & APIs', 'Manage third-party integrations and APIs', 
 ARRAY['view_integrations', 'manage_integrations', 'configure_webhooks', 'manage_api_keys', 'view_api_usage', 'test_integrations'], 
 'advanced', false, '🔗'),

('Workflow & Automation', 'Create and manage automated workflows', 
 ARRAY['view_workflows', 'create_workflows', 'edit_workflows', 'delete_workflows', 'manage_automation_rules', 'view_automation_logs'], 
 'advanced', false, '🔄'),

('Knowledge Base', 'Manage knowledge base articles', 
 ARRAY['view_knowledge_base', 'create_knowledge_articles', 'edit_knowledge_articles', 'delete_knowledge_articles', 'manage_knowledge_categories', 'publish_knowledge_articles'], 
 'core', false, '📚'),

('SLA Management', 'Service Level Agreement management', 
 ARRAY['view_sla', 'create_sla', 'edit_sla', 'delete_sla', 'view_sla_reports', 'configure_sla_escalations'], 
 'advanced', false, '⏱️')
ON CONFLICT DO NOTHING;

-- Insert default role permissions for the three roles
INSERT INTO role_permissions (role, permissions, description) VALUES
('admin', ARRAY[
  'view_dashboard', 'view_analytics', 'view_performance_metrics', 'export_analytics', 'view_real_time_data',
  'view_users', 'create_users', 'edit_users', 'delete_users', 'suspend_users', 'activate_users', 'assign_roles', 'view_user_activity', 'reset_user_password',
  'view_chats', 'manage_chats', 'assign_chats', 'transfer_chats', 'close_chats', 'reopen_chats', 'view_chat_history', 'delete_chat_messages', 'edit_chat_messages', 'view_chat_analytics', 'bulk_chat_operations',
  'view_reports', 'create_reports', 'edit_reports', 'delete_reports', 'schedule_reports', 'export_reports', 'view_custom_reports', 'share_reports',
  'view_settings', 'edit_settings', 'manage_permissions', 'manage_system', 'view_audit_logs', 'manage_integrations', 'configure_webhooks', 'manage_api_keys',
  'view_widget', 'edit_widget', 'configure_widget', 'deploy_widget', 'view_widget_analytics',
  'view_customer_data', 'edit_customer_data', 'delete_customer_data', 'export_customer_data', 'view_customer_history', 'merge_customer_records', 'anonymize_customer_data',
  'view_dispositions', 'edit_dispositions', 'create_dispositions', 'delete_dispositions', 'view_templates', 'edit_templates', 'create_templates', 'delete_templates', 'manage_canned_responses',
  'view_csat', 'manage_csat_surveys', 'view_csat_analytics', 'export_csat_data', 'configure_csat_settings',
  'view_billing', 'manage_billing', 'view_subscriptions', 'manage_subscriptions', 'view_payment_history', 'process_refunds',
  'view_security_logs', 'manage_security_settings', 'view_compliance_reports', 'manage_data_retention', 'configure_2fa', 'manage_ip_whitelist',
  'view_integrations', 'manage_integrations', 'configure_webhooks', 'manage_api_keys', 'view_api_usage', 'test_integrations',
  'view_workflows', 'create_workflows', 'edit_workflows', 'delete_workflows', 'manage_automation_rules', 'view_automation_logs',
  'view_knowledge_base', 'create_knowledge_articles', 'edit_knowledge_articles', 'delete_knowledge_articles', 'manage_knowledge_categories', 'publish_knowledge_articles',
  'view_sla', 'create_sla', 'edit_sla', 'delete_sla', 'view_sla_reports', 'configure_sla_escalations'
], 'Full system administrator with all permissions'),

('supervisor', ARRAY[
  'view_dashboard', 'view_analytics', 'view_performance_metrics', 'export_analytics', 'view_real_time_data',
  'view_users', 'edit_users', 'view_user_activity',
  'view_chats', 'manage_chats', 'assign_chats', 'transfer_chats', 'close_chats', 'reopen_chats', 'view_chat_history', 'view_chat_analytics', 'bulk_chat_operations',
  'view_reports', 'create_reports', 'edit_reports', 'export_reports', 'view_custom_reports', 'share_reports',
  'view_settings',
  'view_widget', 'view_widget_analytics',
  'view_customer_data', 'edit_customer_data', 'view_customer_history',
  'view_dispositions', 'edit_dispositions', 'view_templates', 'edit_templates', 'manage_canned_responses',
  'view_csat', 'view_csat_analytics', 'export_csat_data',
  'view_billing', 'view_subscriptions', 'view_payment_history',
  'view_security_logs',
  'view_integrations', 'view_api_usage',
  'view_workflows', 'view_automation_logs',
  'view_knowledge_base', 'create_knowledge_articles', 'edit_knowledge_articles', 'manage_knowledge_categories', 'publish_knowledge_articles',
  'view_sla', 'view_sla_reports'
], 'Team supervisor with management and oversight permissions'),

('agent', ARRAY[
  'view_dashboard', 'view_analytics',
  'view_chats', 'manage_chats', 'view_chat_history', 'view_chat_analytics',
  'view_reports', 'export_reports',
  'view_widget',
  'view_customer_data', 'edit_customer_data', 'view_customer_history',
  'view_dispositions', 'view_templates', 'manage_canned_responses',
  'view_csat',
  'view_knowledge_base'
], 'Customer service agent with basic operational permissions')
ON CONFLICT DO NOTHING;

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON role_permissions TO authenticated;
GRANT ALL ON custom_permissions TO authenticated;
GRANT ALL ON permission_audit_logs TO authenticated;
GRANT ALL ON access_control_policies TO authenticated;
GRANT ALL ON role_templates TO authenticated;
GRANT ALL ON user_custom_permissions TO authenticated;
GRANT ALL ON permission_groups TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION has_permission(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_permissions(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION grant_permission(UUID, TEXT, UUID, TEXT, TIMESTAMP WITH TIME ZONE) TO authenticated;
GRANT EXECUTE ON FUNCTION revoke_permission(UUID, TEXT, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_permission_audit_trail(UUID, TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) TO authenticated; 