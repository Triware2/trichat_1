-- Create Bulk Operations Tables Safely
-- Run this SQL in your Supabase SQL editor

-- Create bulk_operations table if it doesn't exist
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

-- Create bulk_operation_logs table if it doesn't exist
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

-- Create conversation_tags table if it doesn't exist
CREATE TABLE IF NOT EXISTS conversation_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    tag_color VARCHAR(7) DEFAULT '#3B82F6',
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(conversation_id, tag_name)
);

-- Create conversation_assignments table if it doesn't exist
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

-- Create conversation_escalations table if it doesn't exist
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

-- Create conversation_flags table if it doesn't exist
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
ALTER TABLE bulk_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_operation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_flags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies safely
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own bulk operations" ON bulk_operations;
    DROP POLICY IF EXISTS "Users can insert bulk operations" ON bulk_operations;
    DROP POLICY IF EXISTS "Users can update their own bulk operations" ON bulk_operations;
    
    DROP POLICY IF EXISTS "Users can view logs for their operations" ON bulk_operation_logs;
    DROP POLICY IF EXISTS "Users can insert operation logs" ON bulk_operation_logs;
    
    DROP POLICY IF EXISTS "Users can manage tags for conversations they have access to" ON conversation_tags;
    DROP POLICY IF EXISTS "Users can view assignments for conversations they have access to" ON conversation_assignments;
    DROP POLICY IF EXISTS "Users can insert assignments" ON conversation_assignments;
    DROP POLICY IF EXISTS "Users can view escalations for conversations they have access to" ON conversation_escalations;
    DROP POLICY IF EXISTS "Users can insert escalations" ON conversation_escalations;
    DROP POLICY IF EXISTS "Users can view flags for conversations they have access to" ON conversation_flags;
    DROP POLICY IF EXISTS "Users can insert flags" ON conversation_flags;
    
    -- Create new policies
    CREATE POLICY "Users can view their own bulk operations" ON bulk_operations
        FOR SELECT USING (created_by = auth.uid());

    CREATE POLICY "Users can insert bulk operations" ON bulk_operations
        FOR INSERT WITH CHECK (created_by = auth.uid());

    CREATE POLICY "Users can update their own bulk operations" ON bulk_operations
        FOR UPDATE USING (created_by = auth.uid());

    CREATE POLICY "Users can view logs for their operations" ON bulk_operation_logs
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM bulk_operations 
                WHERE id = bulk_operation_logs.operation_id AND created_by = auth.uid()
            )
        );

    CREATE POLICY "Users can insert operation logs" ON bulk_operation_logs
        FOR INSERT WITH CHECK (true);

    CREATE POLICY "Users can manage tags for conversations they have access to" ON conversation_tags
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM chat_conversations 
                WHERE id = conversation_tags.conversation_id AND 
                (created_by = auth.uid() OR assigned_agent_id = auth.uid())
            )
        );

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
END $$;

-- Verify the tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('bulk_operations', 'bulk_operation_logs', 'conversation_tags', 'conversation_assignments', 'conversation_escalations', 'conversation_flags')
ORDER BY table_name; 