-- Fix Missing Tables Issue
-- This script ensures all required tables exist with proper structure

-- Step 1: Check if tables exist
SELECT 'Checking existing tables...' as status;

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('chatbots', 'chatbot_flows', 'flow_versions');

-- Step 2: Create chatbot_flows table if it doesn't exist
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

-- Step 3: Create flow_versions table if it doesn't exist
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

-- Step 4: Create indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_chatbot_id ON chatbot_flows(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_version ON chatbot_flows(version);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_is_active ON chatbot_flows(is_active);
CREATE INDEX IF NOT EXISTS idx_flow_versions_flow_id ON flow_versions(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_versions_version ON flow_versions(version);

-- Step 5: Disable RLS temporarily for testing
ALTER TABLE chatbot_flows DISABLE ROW LEVEL SECURITY;
ALTER TABLE flow_versions DISABLE ROW LEVEL SECURITY;

-- Step 6: Verify tables were created
SELECT 'Verifying tables...' as status;

SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('chatbots', 'chatbot_flows', 'flow_versions');

-- Step 7: Test insert (optional - uncomment to test)
/*
-- Get a chatbot ID first
SELECT id, name FROM chatbots LIMIT 1;

-- Test insert (replace 'YOUR_CHATBOT_ID' with actual ID)
INSERT INTO chatbot_flows (
    chatbot_id, 
    name, 
    description, 
    version, 
    nodes, 
    edges, 
    validation_rules, 
    is_active, 
    is_published
) VALUES (
    'YOUR_CHATBOT_ID',
    'Test Flow',
    'Test Description',
    1,
    '[]'::jsonb,
    '[]'::jsonb,
    '{}'::jsonb,
    true,
    false
) RETURNING id, name;

-- Clean up test
DELETE FROM chatbot_flows WHERE name = 'Test Flow';
*/

SELECT 'Tables should now be ready!' as status; 