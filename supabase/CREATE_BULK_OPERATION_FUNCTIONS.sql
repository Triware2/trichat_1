-- Create Bulk Operation Database Functions
-- Run this SQL in your Supabase SQL editor

-- Function to update conversation tags
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_chat_conversations_updated_at ON chat_conversations;
CREATE TRIGGER update_chat_conversations_updated_at 
    BEFORE UPDATE ON chat_conversations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the functions were created
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'update_conversation_tags',
    'bulk_assign_conversations',
    'bulk_update_conversation_status',
    'bulk_update_conversation_priority',
    'bulk_flag_conversations',
    'bulk_escalate_conversations',
    'update_updated_at_column'
)
ORDER BY routine_name; 