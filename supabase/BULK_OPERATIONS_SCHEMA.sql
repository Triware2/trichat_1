-- Comprehensive Bulk Operations Schema
-- Run this SQL in your Supabase SQL editor

-- Enhanced chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
    channel_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'waiting', 'resolved', 'closed', 'archived')),
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_agent_name VARCHAR(255),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_count INTEGER DEFAULT 0,
    satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
    is_flagged BOOLEAN DEFAULT false,
    escalation_level INTEGER DEFAULT 0,
    response_time INTEGER DEFAULT 0, -- in seconds
    resolution_time INTEGER, -- in seconds
    customer_type VARCHAR(50) DEFAULT 'new' CHECK (customer_type IN ('new', 'returning', 'vip', 'enterprise')),
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(100) DEFAULT 'UTC',
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Bulk operations tracking table
CREATE TABLE IF NOT EXISTS bulk_operations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'assign', 'close', 'tag', 'priority', 'archive', 'delete', 'escalate', 
        'flag', 'export', 'import', 'merge', 'split', 'schedule', 'notify', 
        'analyze', 'automate'
    )),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    affected_count INTEGER NOT NULL DEFAULT 0,
    affected_conversation_ids UUID[] DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    details JSONB DEFAULT '{}',
    progress_percentage INTEGER DEFAULT 0,
    estimated_completion TIMESTAMP WITH TIME ZONE,
    operation_metadata JSONB DEFAULT '{}'
);

-- Bulk operation logs for detailed tracking
CREATE TABLE IF NOT EXISTS bulk_operation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    operation_id UUID NOT NULL REFERENCES bulk_operations(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Conversation tags management
CREATE TABLE IF NOT EXISTS conversation_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    tag_color VARCHAR(7) DEFAULT '#3B82F6',
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(conversation_id, tag_name)
);

-- Conversation assignments history
CREATE TABLE IF NOT EXISTS conversation_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assignment_reason TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unassigned_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Conversation escalations
CREATE TABLE IF NOT EXISTS conversation_escalations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    escalation_level INTEGER NOT NULL DEFAULT 1,
    escalated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    escalation_reason TEXT,
    escalated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    assigned_supervisor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Conversation flags
CREATE TABLE IF NOT EXISTS conversation_flags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    flagged_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    flag_reason TEXT,
    flag_type VARCHAR(50) DEFAULT 'general' CHECK (flag_type IN ('urgent', 'spam', 'inappropriate', 'duplicate', 'general')),
    flagged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unflagged_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_priority ON chat_conversations(priority);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_assigned_agent ON chat_conversations(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_channel ON chat_conversations(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_created_at ON chat_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_last_message_at ON chat_conversations(last_message_at);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_customer_type ON chat_conversations(customer_type);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_is_flagged ON chat_conversations(is_flagged);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_tags ON chat_conversations USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_bulk_operations_type ON bulk_operations(type);
CREATE INDEX IF NOT EXISTS idx_bulk_operations_status ON bulk_operations(status);
CREATE INDEX IF NOT EXISTS idx_bulk_operations_created_by ON bulk_operations(created_by);
CREATE INDEX IF NOT EXISTS idx_bulk_operations_created_at ON bulk_operations(created_at);

CREATE INDEX IF NOT EXISTS idx_bulk_operation_logs_operation_id ON bulk_operation_logs(operation_id);
CREATE INDEX IF NOT EXISTS idx_bulk_operation_logs_conversation_id ON bulk_operation_logs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_bulk_operation_logs_status ON bulk_operation_logs(status);

CREATE INDEX IF NOT EXISTS idx_conversation_tags_conversation_id ON conversation_tags(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_tags_tag_name ON conversation_tags(tag_name);

CREATE INDEX IF NOT EXISTS idx_conversation_assignments_conversation_id ON conversation_assignments(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_assignments_agent_id ON conversation_assignments(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversation_assignments_is_active ON conversation_assignments(is_active);

CREATE INDEX IF NOT EXISTS idx_conversation_escalations_conversation_id ON conversation_escalations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_escalations_escalation_level ON conversation_escalations(escalation_level);

CREATE INDEX IF NOT EXISTS idx_conversation_flags_conversation_id ON conversation_flags(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_flags_is_active ON conversation_flags(is_active);

-- Enable Row Level Security
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_operation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_conversations
CREATE POLICY "Users can view conversations they created or are assigned to" ON chat_conversations
    FOR SELECT USING (
        created_by = auth.uid() OR 
        assigned_agent_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
        )
    );

CREATE POLICY "Users can update conversations they created or are assigned to" ON chat_conversations
    FOR UPDATE USING (
        created_by = auth.uid() OR 
        assigned_agent_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
        )
    );

CREATE POLICY "Users can insert conversations" ON chat_conversations
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins can delete conversations" ON chat_conversations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for bulk_operations
CREATE POLICY "Users can view their own bulk operations" ON bulk_operations
    FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can insert bulk operations" ON bulk_operations
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own bulk operations" ON bulk_operations
    FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for bulk_operation_logs
CREATE POLICY "Users can view logs for their operations" ON bulk_operation_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bulk_operations 
            WHERE id = bulk_operation_logs.operation_id AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can insert operation logs" ON bulk_operation_logs
    FOR INSERT WITH CHECK (true);

-- RLS Policies for conversation_tags
CREATE POLICY "Users can manage tags for conversations they have access to" ON conversation_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = conversation_tags.conversation_id AND 
            (created_by = auth.uid() OR assigned_agent_id = auth.uid())
        )
    );

-- RLS Policies for conversation_assignments
CREATE POLICY "Users can view assignments for conversations they have access to" ON conversation_assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = conversation_assignments.conversation_id AND 
            (created_by = auth.uid() OR assigned_agent_id = auth.uid())
        )
    );

CREATE POLICY "Users can insert assignments" ON conversation_assignments
    FOR INSERT WITH CHECK (assigned_by = auth.uid());

-- RLS Policies for conversation_escalations
CREATE POLICY "Users can view escalations for conversations they have access to" ON conversation_escalations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = conversation_escalations.conversation_id AND 
            (created_by = auth.uid() OR assigned_agent_id = auth.uid())
        )
    );

CREATE POLICY "Users can insert escalations" ON conversation_escalations
    FOR INSERT WITH CHECK (escalated_by = auth.uid());

-- RLS Policies for conversation_flags
CREATE POLICY "Users can view flags for conversations they have access to" ON conversation_flags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = conversation_flags.conversation_id AND 
            (created_by = auth.uid() OR assigned_agent_id = auth.uid())
        )
    );

CREATE POLICY "Users can insert flags" ON conversation_flags
    FOR INSERT WITH CHECK (flagged_by = auth.uid());

-- Functions for bulk operations
CREATE OR REPLACE FUNCTION update_conversation_tags(
    conversation_ids UUID[],
    tags_to_add TEXT[],
    tags_to_remove TEXT[]
)
RETURNS INTEGER AS $$
DECLARE
    affected_count INTEGER := 0;
    conv_id UUID;
    current_tags TEXT[];
    new_tags TEXT[];
BEGIN
    FOREACH conv_id IN ARRAY conversation_ids
    LOOP
        -- Get current tags
        SELECT tags INTO current_tags FROM chat_conversations WHERE id = conv_id;
        
        -- Add new tags
        new_tags := current_tags || tags_to_add;
        
        -- Remove specified tags
        new_tags := array_remove(new_tags, ALL tags_to_remove);
        
        -- Update conversation
        UPDATE chat_conversations 
        SET tags = new_tags, updated_at = NOW()
        WHERE id = conv_id;
        
        affected_count := affected_count + 1;
    END LOOP;
    
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to bulk assign conversations
CREATE OR REPLACE FUNCTION bulk_assign_conversations(
    conversation_ids UUID[],
    agent_id UUID,
    assignment_reason TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    affected_count INTEGER := 0;
    conv_id UUID;
    agent_name TEXT;
BEGIN
    -- Get agent name
    SELECT full_name INTO agent_name FROM profiles WHERE id = agent_id;
    
    FOREACH conv_id IN ARRAY conversation_ids
    LOOP
        -- Update conversation
        UPDATE chat_conversations 
        SET assigned_agent_id = agent_id, 
            assigned_agent_name = agent_name,
            updated_at = NOW()
        WHERE id = conv_id;
        
        -- Create assignment record
        INSERT INTO conversation_assignments (
            conversation_id, agent_id, assigned_by, assignment_reason
        ) VALUES (
            conv_id, agent_id, auth.uid(), assignment_reason
        );
        
        affected_count := affected_count + 1;
    END LOOP;
    
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to bulk update conversation status
CREATE OR REPLACE FUNCTION bulk_update_conversation_status(
    conversation_ids UUID[],
    new_status TEXT
)
RETURNS INTEGER AS $$
DECLARE
    affected_count INTEGER := 0;
BEGIN
    UPDATE chat_conversations 
    SET status = new_status, updated_at = NOW()
    WHERE id = ANY(conversation_ids);
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to bulk update conversation priority
CREATE OR REPLACE FUNCTION bulk_update_conversation_priority(
    conversation_ids UUID[],
    new_priority TEXT
)
RETURNS INTEGER AS $$
DECLARE
    affected_count INTEGER := 0;
BEGIN
    UPDATE chat_conversations 
    SET priority = new_priority, updated_at = NOW()
    WHERE id = ANY(conversation_ids);
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to bulk flag/unflag conversations
CREATE OR REPLACE FUNCTION bulk_flag_conversations(
    conversation_ids UUID[],
    flag_reason TEXT,
    flag_type TEXT DEFAULT 'general',
    should_flag BOOLEAN DEFAULT true
)
RETURNS INTEGER AS $$
DECLARE
    affected_count INTEGER := 0;
    conv_id UUID;
BEGIN
    FOREACH conv_id IN ARRAY conversation_ids
    LOOP
        IF should_flag THEN
            -- Flag conversation
            UPDATE chat_conversations 
            SET is_flagged = true, updated_at = NOW()
            WHERE id = conv_id;
            
            -- Create flag record
            INSERT INTO conversation_flags (
                conversation_id, flagged_by, flag_reason, flag_type
            ) VALUES (
                conv_id, auth.uid(), flag_reason, flag_type
            );
        ELSE
            -- Unflag conversation
            UPDATE chat_conversations 
            SET is_flagged = false, updated_at = NOW()
            WHERE id = conv_id;
            
            -- Update flag record
            UPDATE conversation_flags 
            SET unflagged_at = NOW(), is_active = false
            WHERE conversation_id = conv_id AND is_active = true;
        END IF;
        
        affected_count := affected_count + 1;
    END LOOP;
    
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to bulk escalate conversations
CREATE OR REPLACE FUNCTION bulk_escalate_conversations(
    conversation_ids UUID[],
    escalation_reason TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    affected_count INTEGER := 0;
    conv_id UUID;
BEGIN
    FOREACH conv_id IN ARRAY conversation_ids
    LOOP
        -- Update conversation
        UPDATE chat_conversations 
        SET escalation_level = escalation_level + 1,
            priority = 'urgent',
            updated_at = NOW()
        WHERE id = conv_id;
        
        -- Create escalation record
        INSERT INTO conversation_escalations (
            conversation_id, escalation_level, escalated_by, escalation_reason
        ) VALUES (
            conv_id, 
            (SELECT escalation_level FROM chat_conversations WHERE id = conv_id),
            auth.uid(), 
            escalation_reason
        );
        
        affected_count := affected_count + 1;
    END LOOP;
    
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_chat_conversations_updated_at 
    BEFORE UPDATE ON chat_conversations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the tables were created
SELECT table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name IN ('chat_conversations', 'bulk_operations', 'bulk_operation_logs', 'conversation_tags', 'conversation_assignments', 'conversation_escalations', 'conversation_flags')
ORDER BY table_name, ordinal_position; 