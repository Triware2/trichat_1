-- Chatbot Management Database Setup
-- Run this SQL in your Supabase SQL editor to create tables and insert test data

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

-- Enable Row Level Security (RLS)
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_sops ENABLE ROW LEVEL SECURITY;
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

-- Insert test data: 2 chatbots (1 traditional, 1 LLM)
-- Note: Replace 'your-user-id' with an actual user ID from your auth.users table
-- You can get this by running: SELECT id FROM auth.users LIMIT 1;

-- Traditional Bot (Rule-based)
INSERT INTO chatbots (
    name, 
    type, 
    status, 
    model, 
    resolution_rate, 
    total_chats, 
    sop_count,
    system_prompt,
    is_active
) VALUES (
    'Customer Support Bot',
    'standard',
    'active',
    'rule-based',
    85.5,
    1247,
    3,
    'You are a helpful customer support assistant. Always be polite, professional, and helpful.',
    true
);

-- LLM Bot
INSERT INTO chatbots (
    name, 
    type, 
    status, 
    model, 
    resolution_rate, 
    total_chats, 
    sop_count,
    system_prompt,
    is_active
) VALUES (
    'AI Assistant Pro',
    'llm',
    'active',
    'gpt-4',
    92.3,
    2156,
    2,
    'You are an advanced AI assistant powered by GPT-4. Help users with complex queries and provide detailed, accurate responses.',
    true
);

-- Insert sample rules for the traditional bot
INSERT INTO chatbot_rules (chatbot_id, trigger, conditions, response, priority, is_active)
SELECT 
    c.id,
    'billing_inquiry',
    '[{"field": "message", "operator": "contains", "value": "billing"}]',
    'I can help you with billing questions. What specific billing issue do you have?',
    1,
    true
FROM chatbots c WHERE c.name = 'Customer Support Bot';

INSERT INTO chatbot_rules (chatbot_id, trigger, conditions, response, priority, is_active)
SELECT 
    c.id,
    'order_status',
    '[{"field": "message", "operator": "contains", "value": "order"}]',
    'To check your order status, please provide your order number.',
    2,
    true
FROM chatbots c WHERE c.name = 'Customer Support Bot';

INSERT INTO chatbot_rules (chatbot_id, trigger, conditions, response, priority, is_active)
SELECT 
    c.id,
    'technical_support',
    '[{"field": "message", "operator": "contains", "value": "technical"}]',
    'I can help you with technical issues. Please describe the problem you are experiencing.',
    3,
    true
FROM chatbots c WHERE c.name = 'Customer Support Bot';

-- Insert sample SOPs for both bots
INSERT INTO chatbot_sops (chatbot_id, name, type, size, status, description, processed_content)
SELECT 
    c.id,
    'Customer Service Guidelines.pdf',
    'PDF',
    2.4,
    'active',
    'Complete customer service protocols and escalation procedures',
    'Customer service guidelines and protocols for handling various customer inquiries and complaints.'
FROM chatbots c WHERE c.name = 'Customer Support Bot';

INSERT INTO chatbot_sops (chatbot_id, name, type, size, status, description, processed_content)
SELECT 
    c.id,
    'Technical Support Manual.docx',
    'DOCX',
    1.8,
    'active',
    'Technical troubleshooting steps and common solutions',
    'Technical support procedures and troubleshooting guides for common technical issues.'
FROM chatbots c WHERE c.name = 'Customer Support Bot';

INSERT INTO chatbot_sops (chatbot_id, name, type, size, status, description, processed_content)
SELECT 
    c.id,
    'AI Assistant Training Data.pdf',
    'PDF',
    3.2,
    'active',
    'Training data and guidelines for AI assistant responses',
    'Comprehensive training data and guidelines for the AI assistant to provide accurate and helpful responses.'
FROM chatbots c WHERE c.name = 'AI Assistant Pro';

-- Insert sample conversations
INSERT INTO chatbot_conversations (chatbot_id, customer_id, session_id, total_messages, satisfaction_rating, resolution_time, status, metadata)
SELECT 
    c.id,
    'customer-001',
    'session-001',
    8,
    4.5,
    15,
    'resolved',
    '{"topic": "billing", "category": "support"}'
FROM chatbots c WHERE c.name = 'Customer Support Bot';

INSERT INTO chatbot_conversations (chatbot_id, customer_id, session_id, total_messages, satisfaction_rating, resolution_time, status, metadata)
SELECT 
    c.id,
    'customer-002',
    'session-002',
    12,
    4.8,
    25,
    'resolved',
    '{"topic": "technical", "category": "support"}'
FROM chatbots c WHERE c.name = 'AI Assistant Pro';

-- Insert sample messages for conversations
INSERT INTO chatbot_messages (conversation_id, sender_type, sender_id, content, message_type, confidence, intent)
SELECT 
    conv.id,
    'customer',
    'customer-001',
    'I need help with my billing',
    'text',
    0.95,
    'billing_inquiry'
FROM chatbot_conversations conv
JOIN chatbots c ON c.id = conv.chatbot_id
WHERE c.name = 'Customer Support Bot' AND conv.session_id = 'session-001';

INSERT INTO chatbot_messages (conversation_id, sender_type, sender_id, content, message_type, confidence, intent)
SELECT 
    conv.id,
    'bot',
    'bot-001',
    'I can help you with billing questions. What specific billing issue do you have?',
    'text',
    0.98,
    'billing_support'
FROM chatbot_conversations conv
JOIN chatbots c ON c.id = conv.chatbot_id
WHERE c.name = 'Customer Support Bot' AND conv.session_id = 'session-001';

-- Update SOP counts
UPDATE chatbots 
SET sop_count = (
    SELECT COUNT(*) 
    FROM chatbot_sops 
    WHERE chatbot_sops.chatbot_id = chatbots.id
);

-- Update total chats counts
UPDATE chatbots 
SET total_chats = (
    SELECT COUNT(*) 
    FROM chatbot_conversations 
    WHERE chatbot_conversations.chatbot_id = chatbots.id
);

SELECT 'Database setup completed successfully!' as status; 