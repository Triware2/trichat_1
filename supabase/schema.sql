-- Chatbot Management Schema for Supabase
-- Run this SQL in your Supabase SQL editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Chatbots table
CREATE TABLE IF NOT EXISTS chatbots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('standard', 'llm')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'training')),
    model VARCHAR(100),
    resolution_rate DECIMAL(5,2),
    total_chats INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sop_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    config JSONB,
    system_prompt TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Chatbot Rules table
CREATE TABLE IF NOT EXISTS chatbot_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
    trigger VARCHAR(255) NOT NULL,
    conditions JSONB,
    response TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Chatbot SOPs table
CREATE TABLE IF NOT EXISTS chatbot_sops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    size DECIMAL(10,2),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'processing' CHECK (status IN ('processing', 'active', 'error')),
    description TEXT,
    file_path VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    processed_content TEXT
);

-- Chatbot Conversations table
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
    customer_id VARCHAR(255),
    session_id VARCHAR(255),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    total_messages INTEGER DEFAULT 0,
    satisfaction_rating DECIMAL(3,2),
    resolution_time INTEGER, -- in minutes
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'escalated')),
    metadata JSONB
);

-- Chatbot Messages table
CREATE TABLE IF NOT EXISTS chatbot_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('customer', 'bot', 'agent')),
    sender_id VARCHAR(255),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'system')),
    confidence DECIMAL(3,2),
    intent VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chatbots_created_by ON chatbots(created_by);
CREATE INDEX IF NOT EXISTS idx_chatbots_status ON chatbots(status);
CREATE INDEX IF NOT EXISTS idx_chatbot_rules_chatbot_id ON chatbot_rules(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_rules_priority ON chatbot_rules(priority);
CREATE INDEX IF NOT EXISTS idx_chatbot_sops_chatbot_id ON chatbot_sops(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_sops_status ON chatbot_sops(status);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_chatbot_id ON chatbot_conversations(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_started_at ON chatbot_conversations(started_at);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_conversation_id ON chatbot_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_created_at ON chatbot_messages(created_at);

-- Chatbot Flows table
CREATE TABLE IF NOT EXISTS chatbot_flows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    version INTEGER DEFAULT 1,
    description TEXT,
    nodes JSONB NOT NULL,
    edges JSONB NOT NULL,
    validation_rules JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false
);

-- Flow Versions table
CREATE TABLE IF NOT EXISTS flow_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    flow_id UUID REFERENCES chatbot_flows(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    nodes JSONB NOT NULL,
    edges JSONB NOT NULL,
    changes_description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for flows
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_chatbot_id ON chatbot_flows(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_version ON chatbot_flows(version);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_is_active ON chatbot_flows(is_active);
CREATE INDEX IF NOT EXISTS idx_flow_versions_flow_id ON flow_versions(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_versions_version ON flow_versions(version);

-- Enable Row Level Security (RLS)
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chatbots
CREATE POLICY "Users can view their own chatbots" ON chatbots
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own chatbots" ON chatbots
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own chatbots" ON chatbots
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own chatbots" ON chatbots
    FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for chatbot_rules
CREATE POLICY "Users can view rules for their chatbots" ON chatbot_rules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chatbots 
            WHERE chatbots.id = chatbot_rules.chatbot_id 
            AND chatbots.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can insert rules for their chatbots" ON chatbot_rules
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chatbots 
            WHERE chatbots.id = chatbot_rules.chatbot_id 
            AND chatbots.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update rules for their chatbots" ON chatbot_rules
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM chatbots 
            WHERE chatbots.id = chatbot_rules.chatbot_id 
            AND chatbots.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete rules for their chatbots" ON chatbot_rules
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM chatbots 
            WHERE chatbots.id = chatbot_rules.chatbot_id 
            AND chatbots.created_by = auth.uid()
        )
    );

-- RLS Policies for chatbot_sops
CREATE POLICY "Users can view SOPs for their chatbots" ON chatbot_sops
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chatbots 
            WHERE chatbots.id = chatbot_sops.chatbot_id 
            AND chatbots.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can insert SOPs for their chatbots" ON chatbot_sops
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chatbots 
            WHERE chatbots.id = chatbot_sops.chatbot_id 
            AND chatbots.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update SOPs for their chatbots" ON chatbot_sops
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM chatbots 
            WHERE chatbots.id = chatbot_sops.chatbot_id 
            AND chatbots.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete SOPs for their chatbots" ON chatbot_sops
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM chatbots 
            WHERE chatbots.id = chatbot_sops.chatbot_id 
            AND chatbots.created_by = auth.uid()
        )
    );

-- RLS Policies for chatbot_conversations
CREATE POLICY "Users can view conversations for their chatbots" ON chatbot_conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chatbots 
            WHERE chatbots.id = chatbot_conversations.chatbot_id 
            AND chatbots.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can insert conversations for their chatbots" ON chatbot_conversations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chatbots 
            WHERE chatbots.id = chatbot_conversations.chatbot_id 
            AND chatbots.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update conversations for their chatbots" ON chatbot_conversations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM chatbots 
            WHERE chatbots.id = chatbot_conversations.chatbot_id 
            AND chatbots.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete conversations for their chatbots" ON chatbot_conversations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM chatbots 
            WHERE chatbots.id = chatbot_conversations.chatbot_id 
            AND chatbots.created_by = auth.uid()
        )
    );

-- RLS Policies for chatbot_messages
CREATE POLICY "Users can view messages for their chatbot conversations" ON chatbot_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chatbot_conversations 
            JOIN chatbots ON chatbots.id = chatbot_conversations.chatbot_id
            WHERE chatbot_conversations.id = chatbot_messages.conversation_id 
            AND chatbots.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages for their chatbot conversations" ON chatbot_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chatbot_conversations 
            JOIN chatbots ON chatbots.id = chatbot_conversations.chatbot_id
            WHERE chatbot_conversations.id = chatbot_messages.conversation_id 
            AND chatbots.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update messages for their chatbot conversations" ON chatbot_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM chatbot_conversations 
            JOIN chatbots ON chatbots.id = chatbot_conversations.chatbot_id
            WHERE chatbot_conversations.id = chatbot_messages.conversation_id 
            AND chatbots.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete messages for their chatbot conversations" ON chatbot_messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM chatbot_conversations 
            JOIN chatbots ON chatbots.id = chatbot_conversations.chatbot_id
            WHERE chatbot_conversations.id = chatbot_messages.conversation_id 
            AND chatbots.created_by = auth.uid()
        )
    );

-- Create storage bucket for chatbot files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chatbot-files', 'chatbot-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for chatbot files
CREATE POLICY "Users can upload files to their chatbot bucket" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'chatbot-files' AND 
        auth.uid() IS NOT NULL
    );

CREATE POLICY "Users can view files in chatbot bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'chatbot-files');

CREATE POLICY "Users can update their chatbot files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'chatbot-files' AND 
        auth.uid() IS NOT NULL
    );

CREATE POLICY "Users can delete their chatbot files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'chatbot-files' AND 
        auth.uid() IS NOT NULL
    ); 

-- Email Queue table for handling email notifications
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    html_body TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('welcome_email', 'password_reset', 'notification', 'general')),
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for email queue
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_type ON email_queue(type);
CREATE INDEX IF NOT EXISTS idx_email_queue_created_at ON email_queue(created_at);

-- IMPORTANT: Run this SQL in your Supabase SQL editor to remove the foreign key constraint
-- This allows creating profiles without corresponding auth.users entries
/*
DO $$ 
BEGIN
    -- Check if the constraint exists before trying to drop it
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_id_fkey' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_id_fkey;
    END IF;
END $$;

-- Add a comment explaining the change
COMMENT ON TABLE public.profiles IS 'Profiles table - can contain profiles without corresponding auth.users entries for admin-created users';
*/ 

-- Analytics Events table for tracking custom analytics and events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    metadata JSONB
);

-- Custom Analytics table for storing custom analytics configurations
CREATE TABLE IF NOT EXISTS custom_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    metrics JSONB NOT NULL,
    filters JSONB,
    time_range VARCHAR(20) DEFAULT '30d',
    chart_type VARCHAR(50) DEFAULT 'bar',
    data_source VARCHAR(100) DEFAULT 'chats',
    query TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_run TIMESTAMP WITH TIME ZONE,
    results JSONB
);

-- Create indexes for analytics tables
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_by ON analytics_events(created_by);
CREATE INDEX IF NOT EXISTS idx_custom_analytics_created_by ON custom_analytics(created_by);
CREATE INDEX IF NOT EXISTS idx_custom_analytics_status ON custom_analytics(status);
CREATE INDEX IF NOT EXISTS idx_custom_analytics_created_at ON custom_analytics(created_at);

-- Enable RLS on analytics tables
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for analytics_events
CREATE POLICY "Allow authenticated users to view analytics events" ON analytics_events
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert analytics events" ON analytics_events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update analytics events" ON analytics_events
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete analytics events" ON analytics_events
    FOR DELETE USING (auth.role() = 'authenticated');

-- RLS policies for custom_analytics
CREATE POLICY "Allow authenticated users to view custom analytics" ON custom_analytics
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert custom analytics" ON custom_analytics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update custom analytics" ON custom_analytics
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete custom analytics" ON custom_analytics
    FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger to update updated_at timestamp for custom_analytics
CREATE OR REPLACE FUNCTION update_custom_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_custom_analytics_updated_at
    BEFORE UPDATE ON custom_analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_custom_analytics_updated_at(); 