-- Add Missing Columns to chat_conversations table
-- Run this SQL in your Supabase SQL editor

-- Add missing columns to existing chat_conversations table
ALTER TABLE chat_conversations 
ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE chat_conversations 
ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0;

ALTER TABLE chat_conversations 
ADD COLUMN IF NOT EXISTS satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5);

ALTER TABLE chat_conversations 
ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT false;

ALTER TABLE chat_conversations 
ADD COLUMN IF NOT EXISTS escalation_level INTEGER DEFAULT 0;

ALTER TABLE chat_conversations 
ADD COLUMN IF NOT EXISTS response_time INTEGER DEFAULT 0;

ALTER TABLE chat_conversations 
ADD COLUMN IF NOT EXISTS resolution_time INTEGER;

ALTER TABLE chat_conversations 
ADD COLUMN IF NOT EXISTS customer_type VARCHAR(50) DEFAULT 'new' CHECK (customer_type IN ('new', 'returning', 'vip', 'enterprise'));

ALTER TABLE chat_conversations 
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';

ALTER TABLE chat_conversations 
ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'UTC';

ALTER TABLE chat_conversations 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Update existing records to have proper default values
UPDATE chat_conversations 
SET last_message_at = COALESCE(last_message_at, created_at)
WHERE last_message_at IS NULL;

UPDATE chat_conversations 
SET message_count = COALESCE(message_count, 0)
WHERE message_count IS NULL;

UPDATE chat_conversations 
SET is_flagged = COALESCE(is_flagged, false)
WHERE is_flagged IS NULL;

UPDATE chat_conversations 
SET escalation_level = COALESCE(escalation_level, 0)
WHERE escalation_level IS NULL;

UPDATE chat_conversations 
SET response_time = COALESCE(response_time, 0)
WHERE response_time IS NULL;

UPDATE chat_conversations 
SET customer_type = COALESCE(customer_type, 'new')
WHERE customer_type IS NULL;

UPDATE chat_conversations 
SET language = COALESCE(language, 'en')
WHERE language IS NULL;

UPDATE chat_conversations 
SET timezone = COALESCE(timezone, 'UTC')
WHERE timezone IS NULL;

UPDATE chat_conversations 
SET metadata = COALESCE(metadata, '{}')
WHERE metadata IS NULL;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_chat_conversations_last_message_at ON chat_conversations(last_message_at);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_message_count ON chat_conversations(message_count);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_satisfaction_score ON chat_conversations(satisfaction_score);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_is_flagged ON chat_conversations(is_flagged);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_escalation_level ON chat_conversations(escalation_level);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_response_time ON chat_conversations(response_time);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_customer_type ON chat_conversations(customer_type);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_language ON chat_conversations(language);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_timezone ON chat_conversations(timezone);

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'chat_conversations' 
ORDER BY ordinal_position; 