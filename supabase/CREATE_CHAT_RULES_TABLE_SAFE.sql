-- Create chat_rules table for advanced chat automation (Safe Version)
-- Run this SQL in your Supabase SQL editor

-- Create the chat_rules table if it doesn't exist
CREATE TABLE IF NOT EXISTS chat_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
    trigger_type VARCHAR(50) NOT NULL DEFAULT 'keyword',
    trigger_conditions JSONB NOT NULL DEFAULT '{}',
    actions JSONB NOT NULL DEFAULT '{}',
    priority INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    execution_order INTEGER NOT NULL DEFAULT 1,
    conditions_logic VARCHAR(10) NOT NULL DEFAULT 'AND' CHECK (conditions_logic IN ('AND', 'OR')),
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_chat_rules_created_by ON chat_rules(created_by);
CREATE INDEX IF NOT EXISTS idx_chat_rules_channel_id ON chat_rules(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_rules_is_active ON chat_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_rules_execution_order ON chat_rules(execution_order);
CREATE INDEX IF NOT EXISTS idx_chat_rules_priority ON chat_rules(priority);

-- Enable Row Level Security
ALTER TABLE chat_rules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (only if they don't exist)
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own chat rules" ON chat_rules;
    DROP POLICY IF EXISTS "Users can insert their own chat rules" ON chat_rules;
    DROP POLICY IF EXISTS "Users can update their own chat rules" ON chat_rules;
    DROP POLICY IF EXISTS "Users can delete their own chat rules" ON chat_rules;
    
    -- Create new policies
    CREATE POLICY "Users can view their own chat rules" ON chat_rules
        FOR SELECT USING (created_by = auth.uid());

    CREATE POLICY "Users can insert their own chat rules" ON chat_rules
        FOR INSERT WITH CHECK (created_by = auth.uid());

    CREATE POLICY "Users can update their own chat rules" ON chat_rules
        FOR UPDATE USING (created_by = auth.uid());

    CREATE POLICY "Users can delete their own chat rules" ON chat_rules
        FOR DELETE USING (created_by = auth.uid());
END $$;

-- Create function to update updated_at timestamp (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at (if it doesn't exist)
DROP TRIGGER IF EXISTS update_chat_rules_updated_at ON chat_rules;
CREATE TRIGGER update_chat_rules_updated_at 
    BEFORE UPDATE ON chat_rules 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created
SELECT table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'chat_rules' 
ORDER BY ordinal_position; 