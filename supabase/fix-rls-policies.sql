-- Fix RLS Policies for Conversation Flows
-- This script creates more permissive policies for testing

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON chatbot_flows;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON chatbot_flows;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON chatbot_flows;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON chatbot_flows;

DROP POLICY IF EXISTS "Enable read access for all users" ON flow_versions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON flow_versions;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON flow_versions;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON flow_versions;

-- Create more permissive policies for testing
CREATE POLICY "Allow all operations for testing" ON chatbot_flows
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for testing" ON flow_versions
    FOR ALL USING (true) WITH CHECK (true);

-- Alternative: Disable RLS temporarily for testing
-- ALTER TABLE chatbot_flows DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE flow_versions DISABLE ROW LEVEL SECURITY; 