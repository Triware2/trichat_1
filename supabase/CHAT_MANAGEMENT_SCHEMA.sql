-- Chat Management Database Schema
-- Run this SQL in your Supabase SQL editor to create all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Chat Channels Table
CREATE TABLE IF NOT EXISTS chat_channels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('website', 'whatsapp', 'facebook', 'instagram', 'email', 'sms', 'api', 'telegram', 'discord', 'slack')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'testing')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    max_concurrent_chats INTEGER DEFAULT 10,
    current_active_chats INTEGER DEFAULT 0,
    business_hours JSONB DEFAULT '{"enabled": false, "timezone": "UTC", "schedule": {}}',
    auto_response JSONB DEFAULT '{"enabled": false, "message": "", "delay": 0}',
    routing JSONB DEFAULT '{"type": "round_robin", "fallback_agent": null, "skill_requirements": []}',
    config JSONB DEFAULT '{}',
    webhook_url VARCHAR(500),
    api_key VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true
);

-- Chat Rules Table
CREATE TABLE IF NOT EXISTS chat_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('keyword', 'intent', 'time', 'customer_type', 'queue_length', 'custom')),
    trigger_conditions JSONB NOT NULL,
    actions JSONB NOT NULL,
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Chat Conversations Table (Enhanced)
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    channel_id UUID REFERENCES chat_channels(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    assigned_agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id VARCHAR(255) UNIQUE,
    subject VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'active', 'waiting', 'resolved', 'closed', 'escalated', 'transferred')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_response_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    escalated_at TIMESTAMP WITH TIME ZONE,
    transferred_at TIMESTAMP WITH TIME ZONE,
    wait_time INTEGER, -- in seconds
    response_time INTEGER, -- in seconds
    resolution_time INTEGER, -- in seconds
    total_messages INTEGER DEFAULT 0,
    customer_messages INTEGER DEFAULT 0,
    agent_messages INTEGER DEFAULT 0,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    satisfaction_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages Table (Enhanced)
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('customer', 'agent', 'system', 'bot')),
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'audio', 'video', 'system', 'private_note')),
    metadata JSONB DEFAULT '{}',
    is_private BOOLEAN DEFAULT false,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Queue Table
CREATE TABLE IF NOT EXISTS chat_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
    priority INTEGER DEFAULT 1,
    position INTEGER NOT NULL,
    estimated_wait_time INTEGER, -- in seconds
    assigned_agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    skill_requirements TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Analytics Table
CREATE TABLE IF NOT EXISTS chat_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_conversations INTEGER DEFAULT 0,
    active_conversations INTEGER DEFAULT 0,
    resolved_conversations INTEGER DEFAULT 0,
    escalated_conversations INTEGER DEFAULT 0,
    avg_response_time DECIMAL(10,2), -- in seconds
    avg_resolution_time DECIMAL(10,2), -- in seconds
    avg_wait_time DECIMAL(10,2), -- in seconds
    avg_satisfaction_rating DECIMAL(3,2),
    total_messages INTEGER DEFAULT 0,
    customer_messages INTEGER DEFAULT 0,
    agent_messages INTEGER DEFAULT 0,
    peak_hour INTEGER,
    peak_day VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(channel_id, date)
);

-- Chat Bulk Operations Table
CREATE TABLE IF NOT EXISTS chat_bulk_operations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    operation_type VARCHAR(50) NOT NULL CHECK (operation_type IN ('assign', 'close', 'escalate', 'tag', 'priority_change', 'export')),
    filters JSONB NOT NULL,
    target_data JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    total_items INTEGER DEFAULT 0,
    processed_items INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    errors JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id)
);

-- Chat Templates Table
CREATE TABLE IF NOT EXISTS chat_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Chat Integrations Table
CREATE TABLE IF NOT EXISTS chat_integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('crm', 'helpdesk', 'analytics', 'notification', 'custom')),
    provider VARCHAR(100) NOT NULL,
    config JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error', 'testing')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_errors JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_channels_status ON chat_channels(status);
CREATE INDEX IF NOT EXISTS idx_chat_channels_type ON chat_channels(type);
CREATE INDEX IF NOT EXISTS idx_chat_channels_created_by ON chat_channels(created_by);
CREATE INDEX IF NOT EXISTS idx_chat_rules_channel_id ON chat_rules(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_rules_trigger_type ON chat_rules(trigger_type);
CREATE INDEX IF NOT EXISTS idx_chat_rules_is_active ON chat_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_channel_id ON chat_conversations(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_assigned_agent_id ON chat_conversations(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_customer_id ON chat_conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_started_at ON chat_conversations(started_at);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_priority ON chat_conversations(priority);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_type ON chat_messages(sender_type);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_queue_conversation_id ON chat_queue(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_queue_channel_id ON chat_queue(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_queue_position ON chat_queue(position);
CREATE INDEX IF NOT EXISTS idx_chat_analytics_channel_id ON chat_analytics(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_analytics_date ON chat_analytics(date);
CREATE INDEX IF NOT EXISTS idx_chat_bulk_operations_status ON chat_bulk_operations(status);
CREATE INDEX IF NOT EXISTS idx_chat_bulk_operations_created_by ON chat_bulk_operations(created_by);
CREATE INDEX IF NOT EXISTS idx_chat_templates_category ON chat_templates(category);
CREATE INDEX IF NOT EXISTS idx_chat_templates_is_active ON chat_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_integrations_type ON chat_integrations(type);
CREATE INDEX IF NOT EXISTS idx_chat_integrations_status ON chat_integrations(status);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_bulk_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_channels
CREATE POLICY "Users can view channels they created" ON chat_channels
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert channels" ON chat_channels
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update channels they created" ON chat_channels
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete channels they created" ON chat_channels
    FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for chat_rules
CREATE POLICY "Users can view rules for their channels" ON chat_rules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_channels 
            WHERE chat_channels.id = chat_rules.channel_id 
            AND chat_channels.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can insert rules" ON chat_rules
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update rules they created" ON chat_rules
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete rules they created" ON chat_rules
    FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for chat_conversations
CREATE POLICY "Users can view conversations for their channels" ON chat_conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_channels 
            WHERE chat_channels.id = chat_conversations.channel_id 
            AND chat_channels.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can insert conversations" ON chat_conversations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_channels 
            WHERE chat_channels.id = chat_conversations.channel_id 
            AND chat_channels.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update conversations for their channels" ON chat_conversations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM chat_channels 
            WHERE chat_channels.id = chat_conversations.channel_id 
            AND chat_channels.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete conversations for their channels" ON chat_conversations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM chat_channels 
            WHERE chat_channels.id = chat_conversations.channel_id 
            AND chat_channels.created_by = auth.uid()
        )
    );

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages for their conversations" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            JOIN chat_channels ON chat_channels.id = chat_conversations.channel_id
            WHERE chat_conversations.id = chat_messages.conversation_id 
            AND chat_channels.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages" ON chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            JOIN chat_channels ON chat_channels.id = chat_conversations.channel_id
            WHERE chat_conversations.id = chat_messages.conversation_id 
            AND chat_channels.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update messages for their conversations" ON chat_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            JOIN chat_channels ON chat_channels.id = chat_conversations.channel_id
            WHERE chat_conversations.id = chat_messages.conversation_id 
            AND chat_channels.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete messages for their conversations" ON chat_messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            JOIN chat_channels ON chat_channels.id = chat_conversations.channel_id
            WHERE chat_conversations.id = chat_messages.conversation_id 
            AND chat_channels.created_by = auth.uid()
        )
    );

-- RLS Policies for other tables
CREATE POLICY "Users can view queue for their channels" ON chat_queue
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_channels 
            WHERE chat_channels.id = chat_queue.channel_id 
            AND chat_channels.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can view analytics for their channels" ON chat_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_channels 
            WHERE chat_channels.id = chat_analytics.channel_id 
            AND chat_channels.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can view bulk operations they created" ON chat_bulk_operations
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can view templates they created" ON chat_templates
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can view integrations they created" ON chat_integrations
    FOR SELECT USING (auth.uid() = created_by);

-- Functions for analytics
CREATE OR REPLACE FUNCTION get_chat_stats(user_id UUID, time_range INTERVAL DEFAULT INTERVAL '24 hours')
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_chats', COUNT(*),
        'active_chats', COUNT(*) FILTER (WHERE cc.status = 'active'),
        'waiting_chats', COUNT(*) FILTER (WHERE cc.status = 'queued'),
        'avg_response_time', AVG(cc.response_time),
        'channels_active', COUNT(DISTINCT cc.channel_id),
        'rules_active', (
            SELECT COUNT(*) FROM chat_rules 
            WHERE created_by = user_id AND is_active = true
        )
    ) INTO result
    FROM chat_conversations cc
    JOIN chat_channels ch ON ch.id = cc.channel_id
    WHERE ch.created_by = user_id
    AND cc.created_at >= NOW() - time_range;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update conversation timestamps
CREATE OR REPLACE FUNCTION update_conversation_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    
    -- Update first_response_at
    IF NEW.status = 'active' AND OLD.status = 'queued' THEN
        NEW.first_response_at = NOW();
    END IF;
    
    -- Update resolved_at
    IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
        NEW.resolved_at = NOW();
    END IF;
    
    -- Update closed_at
    IF NEW.status = 'closed' AND OLD.status != 'closed' THEN
        NEW.closed_at = NOW();
    END IF;
    
    -- Update escalated_at
    IF NEW.status = 'escalated' AND OLD.status != 'escalated' THEN
        NEW.escalated_at = NOW();
    END IF;
    
    -- Update transferred_at
    IF NEW.assigned_agent_id IS DISTINCT FROM OLD.assigned_agent_id AND NEW.assigned_agent_id IS NOT NULL THEN
        NEW.transferred_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_chat_conversations_timestamps
    BEFORE UPDATE ON chat_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamps();

-- Insert sample data
INSERT INTO chat_channels (name, type, status, priority, max_concurrent_chats, business_hours, auto_response, routing, created_by) VALUES
('Website Chat', 'website', 'active', 'high', 20, '{"enabled": true, "timezone": "UTC", "schedule": {"monday": {"start": "09:00", "end": "17:00", "enabled": true}, "tuesday": {"start": "09:00", "end": "17:00", "enabled": true}, "wednesday": {"start": "09:00", "end": "17:00", "enabled": true}, "thursday": {"start": "09:00", "end": "17:00", "enabled": true}, "friday": {"start": "09:00", "end": "17:00", "enabled": true}}}', '{"enabled": true, "message": "Thank you for contacting us. An agent will be with you shortly.", "delay": 30}', '{"type": "round_robin", "fallback_agent": null, "skill_requirements": []}', auth.uid()),
('WhatsApp Business', 'whatsapp', 'active', 'medium', 15, '{"enabled": true, "timezone": "UTC", "schedule": {"monday": {"start": "08:00", "end": "18:00", "enabled": true}, "tuesday": {"start": "08:00", "end": "18:00", "enabled": true}, "wednesday": {"start": "08:00", "end": "18:00", "enabled": true}, "thursday": {"start": "08:00", "end": "18:00", "enabled": true}, "friday": {"start": "08:00", "end": "18:00", "enabled": true}}}', '{"enabled": true, "message": "Hi! Thanks for reaching out. We''ll respond within 2 minutes.", "delay": 0}', '{"type": "least_busy", "fallback_agent": null, "skill_requirements": ["whatsapp"]}', auth.uid()),
('Email Support', 'email', 'active', 'low', 50, '{"enabled": true, "timezone": "UTC", "schedule": {"monday": {"start": "09:00", "end": "17:00", "enabled": true}, "tuesday": {"start": "09:00", "end": "17:00", "enabled": true}, "wednesday": {"start": "09:00", "end": "17:00", "enabled": true}, "thursday": {"start": "09:00", "end": "17:00", "enabled": true}, "friday": {"start": "09:00", "end": "17:00", "enabled": true}}}', '{"enabled": true, "message": "We have received your email and will respond within 4 hours.", "delay": 0}', '{"type": "skill_based", "fallback_agent": null, "skill_requirements": ["email"]}', auth.uid()),
('Facebook Messenger', 'facebook', 'active', 'medium', 10, '{"enabled": true, "timezone": "UTC", "schedule": {"monday": {"start": "09:00", "end": "17:00", "enabled": true}, "tuesday": {"start": "09:00", "end": "17:00", "enabled": true}, "wednesday": {"start": "09:00", "end": "17:00", "enabled": true}, "thursday": {"start": "09:00", "end": "17:00", "enabled": true}, "friday": {"start": "09:00", "end": "17:00", "enabled": true}}}', '{"enabled": true, "message": "Thanks for messaging us! We''ll get back to you soon.", "delay": 15}', '{"type": "round_robin", "fallback_agent": null, "skill_requirements": ["social"]}', auth.uid()),
('Instagram DM', 'instagram', 'active', 'medium', 8, '{"enabled": true, "timezone": "UTC", "schedule": {"monday": {"start": "10:00", "end": "16:00", "enabled": true}, "tuesday": {"start": "10:00", "end": "16:00", "enabled": true}, "wednesday": {"start": "10:00", "end": "16:00", "enabled": true}, "thursday": {"start": "10:00", "end": "16:00", "enabled": true}, "friday": {"start": "10:00", "end": "16:00", "enabled": true}}}', '{"enabled": true, "message": "Thanks for your DM! We''ll respond shortly.", "delay": 10}', '{"type": "skill_based", "fallback_agent": null, "skill_requirements": ["social", "instagram"]}', auth.uid()),
('SMS Support', 'sms', 'inactive', 'high', 5, '{"enabled": false, "timezone": "UTC", "schedule": {}}', '{"enabled": false, "message": "", "delay": 0}', '{"type": "round_robin", "fallback_agent": null, "skill_requirements": []}', auth.uid())
ON CONFLICT DO NOTHING;

-- Insert sample chat rules
INSERT INTO chat_rules (name, description, channel_id, trigger_type, trigger_conditions, actions, priority, created_by) VALUES
('Urgent Keywords', 'Automatically escalate conversations with urgent keywords', (SELECT id FROM chat_channels WHERE name = 'Website Chat' LIMIT 1), 'keyword', '{"keywords": ["urgent", "emergency", "critical", "help", "broken"]}', '{"action": "escalate", "priority": "urgent", "assign_to": "supervisor"}', 1, auth.uid()),
('Business Hours Check', 'Route to appropriate queue based on business hours', (SELECT id FROM chat_channels WHERE name = 'Website Chat' LIMIT 1), 'time', '{"business_hours": true, "outside_hours_action": "queue", "inside_hours_action": "assign"}', '{"action": "route", "queue": "after_hours"}', 2, auth.uid()),
('VIP Customer Detection', 'Prioritize VIP customers', (SELECT id FROM chat_channels WHERE name = 'Website Chat' LIMIT 1), 'customer_type', '{"customer_types": ["vip", "premium"], "priority_boost": 2}', '{"action": "prioritize", "priority": "high"}', 3, auth.uid())
ON CONFLICT DO NOTHING;

-- Insert sample templates
INSERT INTO chat_templates (name, category, content, variables, created_by) VALUES
('Welcome Message', 'greeting', 'Hi {{customer_name}}! Welcome to {{company_name}}. How can I help you today?', '["customer_name", "company_name"]', auth.uid()),
('Thank You', 'closing', 'Thank you for contacting {{company_name}}. Have a great day!', '["company_name"]', auth.uid()),
('Escalation Notice', 'escalation', 'I understand this is important. Let me escalate this to our specialist team who will assist you further.', '[]', auth.uid()),
('Business Hours', 'information', 'Our business hours are Monday-Friday 9 AM to 5 PM. We''ll respond to your message during our next business day.', '[]', auth.uid()),
('Technical Issue', 'support', 'I''m sorry to hear you''re experiencing this issue. Let me help you troubleshoot this step by step.', '[]', auth.uid())
ON CONFLICT DO NOTHING; 