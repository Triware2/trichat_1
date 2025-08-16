-- Fix test data for chatbot management
-- Run this after the main setup-database.sql script

-- First, let's check if we have any users in the auth.users table
-- If not, we'll need to create a test user or modify the RLS policies

-- Option 1: If you have users, update the test bots to be associated with a user
-- Replace 'your-actual-user-id' with a real user ID from your auth.users table
UPDATE chatbots 
SET created_by = (
    SELECT id FROM auth.users LIMIT 1
)
WHERE created_by IS NULL;

-- Option 2: If you want to temporarily disable RLS for testing
-- (Only use this for development/testing, not production)
-- ALTER TABLE chatbots DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE chatbot_rules DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE chatbot_sops DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE chatbot_conversations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE chatbot_messages DISABLE ROW LEVEL SECURITY;

-- Option 3: Create a more permissive policy for development
-- This allows any authenticated user to access chatbots (for testing purposes)
DROP POLICY IF EXISTS "Users can view their own chatbots" ON chatbots;
CREATE POLICY "Allow authenticated users to view chatbots" ON chatbots
    FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert their own chatbots" ON chatbots;
CREATE POLICY "Allow authenticated users to insert chatbots" ON chatbots
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update their own chatbots" ON chatbots;
CREATE POLICY "Allow authenticated users to update chatbots" ON chatbots
    FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete their own chatbots" ON chatbots;
CREATE POLICY "Allow authenticated users to delete chatbots" ON chatbots
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Similar policies for other tables
DROP POLICY IF EXISTS "Users can view rules for their chatbots" ON chatbot_rules;
CREATE POLICY "Allow authenticated users to view rules" ON chatbot_rules
    FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert rules for their chatbots" ON chatbot_rules;
CREATE POLICY "Allow authenticated users to insert rules" ON chatbot_rules
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update rules for their chatbots" ON chatbot_rules;
CREATE POLICY "Allow authenticated users to update rules" ON chatbot_rules
    FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete rules for their chatbots" ON chatbot_rules;
CREATE POLICY "Allow authenticated users to delete rules" ON chatbot_rules
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- SOPs policies
DROP POLICY IF EXISTS "Users can view SOPs for their chatbots" ON chatbot_sops;
CREATE POLICY "Allow authenticated users to view SOPs" ON chatbot_sops
    FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert SOPs for their chatbots" ON chatbot_sops;
CREATE POLICY "Allow authenticated users to insert SOPs" ON chatbot_sops
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update SOPs for their chatbots" ON chatbot_sops;
CREATE POLICY "Allow authenticated users to update SOPs" ON chatbot_sops
    FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete SOPs for their chatbots" ON chatbot_sops;
CREATE POLICY "Allow authenticated users to delete SOPs" ON chatbot_sops
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Conversations policies
DROP POLICY IF EXISTS "Users can view conversations for their chatbots" ON chatbot_conversations;
CREATE POLICY "Allow authenticated users to view conversations" ON chatbot_conversations
    FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert conversations for their chatbots" ON chatbot_conversations;
CREATE POLICY "Allow authenticated users to insert conversations" ON chatbot_conversations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update conversations for their chatbots" ON chatbot_conversations;
CREATE POLICY "Allow authenticated users to update conversations" ON chatbot_conversations
    FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete conversations for their chatbots" ON chatbot_conversations;
CREATE POLICY "Allow authenticated users to delete conversations" ON chatbot_conversations
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Messages policies
DROP POLICY IF EXISTS "Users can view messages for their chatbot conversations" ON chatbot_messages;
CREATE POLICY "Allow authenticated users to view messages" ON chatbot_messages
    FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert messages for their chatbot conversations" ON chatbot_messages;
CREATE POLICY "Allow authenticated users to insert messages" ON chatbot_messages
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update messages for their chatbot conversations" ON chatbot_messages;
CREATE POLICY "Allow authenticated users to update messages" ON chatbot_messages
    FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete messages for their chatbot conversations" ON chatbot_messages;
CREATE POLICY "Allow authenticated users to delete messages" ON chatbot_messages
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Verify the test data is accessible
SELECT 'Test bots count:' as info, COUNT(*) as count FROM chatbots;
SELECT 'Test rules count:' as info, COUNT(*) as count FROM chatbot_rules;
SELECT 'Test SOPs count:' as info, COUNT(*) as count FROM chatbot_sops;

SELECT 'Setup completed successfully!' as status; 