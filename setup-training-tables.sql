-- Setup Training Tables for Chatbot LLM Training

-- Create chatbot_training_sessions table
CREATE TABLE IF NOT EXISTS chatbot_training_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
    training_type VARCHAR(50) NOT NULL DEFAULT 'llm',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    config JSONB,
    progress INTEGER DEFAULT 0,
    metrics JSONB,
    final_metrics JSONB,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    sop_documents TEXT[]
);

-- Create chatbot_training_analytics table
CREATE TABLE IF NOT EXISTS chatbot_training_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
    overall_accuracy DECIMAL(5,2) DEFAULT 0,
    knowledge_retention DECIMAL(5,2) DEFAULT 0,
    avg_response_time DECIMAL(5,2) DEFAULT 0,
    user_satisfaction DECIMAL(5,2) DEFAULT 0,
    accuracy_trend DECIMAL(5,2) DEFAULT 0,
    retention_trend DECIMAL(5,2) DEFAULT 0,
    response_time_trend DECIMAL(5,2) DEFAULT 0,
    satisfaction_trend DECIMAL(5,2) DEFAULT 0,
    training_sessions JSONB,
    performance_trends JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_training_sessions_chatbot_id ON chatbot_training_sessions(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_status ON chatbot_training_sessions(status);
CREATE INDEX IF NOT EXISTS idx_training_analytics_chatbot_id ON chatbot_training_analytics(chatbot_id);

-- Enable Row Level Security
ALTER TABLE chatbot_training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_training_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chatbot_training_sessions
CREATE POLICY "Allow authenticated users to view training sessions" ON chatbot_training_sessions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert training sessions" ON chatbot_training_sessions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update training sessions" ON chatbot_training_sessions
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete training sessions" ON chatbot_training_sessions
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for chatbot_training_analytics
CREATE POLICY "Allow authenticated users to view training analytics" ON chatbot_training_analytics
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert training analytics" ON chatbot_training_analytics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update training analytics" ON chatbot_training_analytics
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete training analytics" ON chatbot_training_analytics
    FOR DELETE USING (auth.role() = 'authenticated');

-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_training_sessions_updated_at 
    BEFORE UPDATE ON chatbot_training_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_analytics_updated_at 
    BEFORE UPDATE ON chatbot_training_analytics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample training sessions for existing chatbots
INSERT INTO chatbot_training_sessions (chatbot_id, training_type, status, progress, final_metrics, sop_documents, created_at)
SELECT 
    id,
    'llm',
    'completed',
    100,
    jsonb_build_object(
        'accuracy', 85.0 + (random() * 15),
        'confidence', 80.0 + (random() * 20),
        'responseTime', 1.0 + (random() * 2),
        'knowledgeRetention', 85.0 + (random() * 15)
    ),
    ARRAY['sop_doc_1.pdf', 'sop_doc_2.pdf'],
    NOW() - INTERVAL '7 days'
FROM chatbots 
WHERE type = 'llm'
ON CONFLICT DO NOTHING;

-- Insert another sample training session (older)
INSERT INTO chatbot_training_sessions (chatbot_id, training_type, status, progress, final_metrics, sop_documents, created_at)
SELECT 
    id,
    'llm',
    'completed',
    100,
    jsonb_build_object(
        'accuracy', 80.0 + (random() * 15),
        'confidence', 75.0 + (random() * 20),
        'responseTime', 1.5 + (random() * 2),
        'knowledgeRetention', 80.0 + (random() * 15)
    ),
    ARRAY['sop_doc_1.pdf'],
    NOW() - INTERVAL '14 days'
FROM chatbots 
WHERE type = 'llm'
ON CONFLICT DO NOTHING;

-- Insert sample training analytics for existing chatbots
INSERT INTO chatbot_training_analytics (chatbot_id, overall_accuracy, knowledge_retention, avg_response_time, user_satisfaction, accuracy_trend, retention_trend, response_time_trend, satisfaction_trend, performance_trends)
SELECT 
    id,
    85.0 + (random() * 15), -- Random accuracy between 85-100
    80.0 + (random() * 20), -- Random retention between 80-100
    1.0 + (random() * 2),   -- Random response time between 1-3 seconds
    4.0 + (random() * 1),   -- Random satisfaction between 4-5
    2.1,                    -- Positive accuracy trend
    1.8,                    -- Positive retention trend
    -0.3,                   -- Negative response time trend (improvement)
    0.2,                    -- Positive satisfaction trend
    jsonb_build_object(
        'conversations_count', 50 + (random() * 100),
        'messages_count', 200 + (random() * 500),
        'training_sessions_count', 2,
        'sops_count', 3 + (random() * 5),
        'recent_activity', jsonb_build_object(
            'conversations_last_7_days', 10 + (random() * 20),
            'new_sops_last_7_days', 1,
            'completed_trainings_last_7_days', 1
        )
    )
FROM chatbots 
WHERE type = 'llm'
ON CONFLICT (chatbot_id) DO NOTHING;

-- Create sample conversations for analytics
INSERT INTO chatbot_conversations (chatbot_id, customer_id, session_id, started_at, ended_at, total_messages, satisfaction_rating, resolution_time, status)
SELECT 
    id,
    'customer_' || floor(random() * 1000),
    'session_' || floor(random() * 10000),
    NOW() - INTERVAL '1 day' * (random() * 30),
    NOW() - INTERVAL '1 day' * (random() * 30) + INTERVAL '1 hour',
    5 + floor(random() * 15),
    3.5 + random() * 1.5,
    300 + floor(random() * 600),
    CASE WHEN random() > 0.7 THEN 'resolved' ELSE 'active' END
FROM chatbots 
WHERE type = 'llm'
ON CONFLICT DO NOTHING;

-- Create sample messages for response time analysis
INSERT INTO chatbot_messages (conversation_id, sender_type, sender_id, content, message_type, confidence, intent, created_at)
SELECT 
    c.id,
    CASE WHEN random() > 0.5 THEN 'bot' ELSE 'customer' END,
    CASE WHEN random() > 0.5 THEN 'bot_1' ELSE 'customer_1' END,
    'Sample message content ' || floor(random() * 1000),
    'text',
    0.7 + random() * 0.3,
    'general_inquiry',
    c.started_at + INTERVAL '1 minute' * floor(random() * 60)
FROM chatbot_conversations c
JOIN chatbots cb ON c.chatbot_id = cb.id
WHERE cb.type = 'llm'
ON CONFLICT DO NOTHING; 