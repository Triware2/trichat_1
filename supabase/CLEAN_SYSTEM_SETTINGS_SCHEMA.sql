-- Clean System Settings Tables Schema
-- Run this in your Supabase SQL editor
-- This script will DROP existing tables and recreate them with correct structure

-- Drop existing tables in correct order (due to foreign key constraints)
DROP TABLE IF EXISTS system_logs CASCADE;
DROP TABLE IF EXISTS maintenance_mode CASCADE;
DROP TABLE IF EXISTS system_backups CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- System Settings Table with correct TEXT column for value
CREATE TABLE system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('general', 'notifications', 'security', 'integrations', 'maintenance')),
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category, key)
);

-- System Backups Table
CREATE TABLE system_backups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    size BIGINT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'failed', 'in_progress')),
    type TEXT NOT NULL CHECK (type IN ('manual', 'automatic')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES profiles(id)
);

-- Maintenance Mode Table
CREATE TABLE maintenance_mode (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enabled BOOLEAN DEFAULT FALSE,
    message TEXT,
    scheduled_start TIMESTAMP WITH TIME ZONE,
    scheduled_end TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Logs Table
CREATE TABLE system_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    level TEXT NOT NULL CHECK (level IN ('info', 'warning', 'error', 'debug')),
    message TEXT NOT NULL,
    category TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_system_settings_category ON system_settings(category);
CREATE INDEX idx_system_settings_key ON system_settings(key);
CREATE INDEX idx_system_backups_status ON system_backups(status);
CREATE INDEX idx_system_backups_created_at ON system_backups(created_at);
CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_category ON system_logs(category);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);

-- Enable Row Level Security
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_mode ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for system_settings
CREATE POLICY "Allow admins to manage system settings" ON system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for system_backups
CREATE POLICY "Allow admins to manage backups" ON system_backups
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for maintenance_mode
CREATE POLICY "Allow admins to manage maintenance mode" ON maintenance_mode
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for system_logs
CREATE POLICY "Allow admins to view system logs" ON system_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Allow system to insert logs" ON system_logs
    FOR INSERT WITH CHECK (true);

-- Insert default system settings
INSERT INTO system_settings (category, key, value, description) VALUES
-- General Settings
('general', 'company_name', 'TriChat', 'Company name displayed throughout the system'),
('general', 'support_email', 'support@trichat.com', 'Primary support email address'),
('general', 'timezone', 'UTC', 'Default system timezone'),
('general', 'language', 'en', 'Default system language'),
('general', 'max_agents', '50', 'Maximum number of concurrent agents'),
('general', 'session_timeout', '30', 'Session timeout in minutes'),
('general', 'maintenance_mode', 'false', 'System maintenance mode status'),

-- Notification Settings
('notifications', 'email_alerts', 'true', 'Enable email notifications'),
('notifications', 'push_notifications', 'true', 'Enable push notifications'),
('notifications', 'sms_alerts', 'false', 'Enable SMS notifications'),
('notifications', 'webhook_url', '', 'Webhook URL for external notifications'),
('notifications', 'notification_frequency', 'immediate', 'Notification frequency (immediate, hourly, daily)'),

-- Security Settings
('security', 'password_policy', 'strong', 'Password policy strength'),
('security', 'two_factor_auth', 'true', 'Enable two-factor authentication'),
('security', 'ip_whitelist', '', 'Comma-separated list of allowed IP addresses'),
('security', 'session_timeout', '30', 'Session timeout in minutes'),
('security', 'max_login_attempts', '5', 'Maximum login attempts before lockout'),
('security', 'lockout_duration', '15', 'Account lockout duration in minutes'),

-- Integration Settings
('integrations', 'email_provider', 'sendgrid', 'Email service provider'),
('integrations', 'api_key', '', 'Email provider API key'),
('integrations', 'webhook_secret', '', 'Webhook secret for security'),
('integrations', 'crm_integration', 'none', 'CRM integration type'),
('integrations', 'slack_webhook', '', 'Slack webhook URL'),
('integrations', 'zapier_webhook', '', 'Zapier webhook URL'),

-- Maintenance Settings
('maintenance', 'auto_backup', 'true', 'Enable automatic backups'),
('maintenance', 'backup_frequency', 'daily', 'Backup frequency (daily, weekly, monthly)'),
('maintenance', 'backup_retention', '30', 'Number of days to retain backups'),
('maintenance', 'log_retention', '90', 'Number of days to retain system logs'),
('maintenance', 'performance_monitoring', 'true', 'Enable performance monitoring');

-- Insert initial maintenance mode record
INSERT INTO maintenance_mode (enabled, message) VALUES
(false, 'System is currently under maintenance. Please check back later.');

-- Insert sample system logs
INSERT INTO system_logs (level, message, category, metadata) VALUES
('info', 'System initialized successfully', 'system', '{"version": "1.0.0"}'),
('info', 'Database connection established', 'database', '{"connection_pool": "active"}'),
('info', 'Email service configured', 'email', '{"provider": "sendgrid"}'); 