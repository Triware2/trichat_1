-- Temporarily disable RLS for development
-- WARNING: Only use this for development/testing, not production!

-- Disable RLS on all chatbot tables
ALTER TABLE chatbots DISABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_rules DISABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_sops DISABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename LIKE 'chatbot%';

SELECT 'RLS disabled for development. Remember to re-enable for production!' as message; 