-- Fix RLS for Testing Interface
-- This script ensures the testing interface can create conversations and messages

-- First, disable RLS on conversation and message tables for development
ALTER TABLE chatbot_conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages DISABLE ROW LEVEL SECURITY;

-- Also ensure chatbots table RLS is disabled
ALTER TABLE chatbots DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('chatbots', 'chatbot_conversations', 'chatbot_messages');

-- Test data insertion (optional - for debugging)
-- INSERT INTO chatbot_conversations (chatbot_id, customer_id, session_id, status) 
-- VALUES ('test-bot-id', 'test-user', 'test-session-123', 'active');

SELECT 'RLS disabled for testing interface. You can now create conversations and messages!' as message; 