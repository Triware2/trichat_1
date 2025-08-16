-- Add missing columns to chat_rules table for advanced features
-- Run this SQL in your Supabase SQL editor

-- Add execution_order column
ALTER TABLE chat_rules 
ADD COLUMN IF NOT EXISTS execution_order INTEGER DEFAULT 1;

-- Add conditions_logic column
ALTER TABLE chat_rules 
ADD COLUMN IF NOT EXISTS conditions_logic VARCHAR(10) DEFAULT 'AND' CHECK (conditions_logic IN ('AND', 'OR'));

-- Update existing records to have default values
UPDATE chat_rules 
SET execution_order = 1, conditions_logic = 'AND' 
WHERE execution_order IS NULL OR conditions_logic IS NULL;

-- Create index for execution_order if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_chat_rules_execution_order ON chat_rules(execution_order);

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'chat_rules' 
ORDER BY ordinal_position; 