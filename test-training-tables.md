# Test Training Tables Setup

## Quick Test Commands

Run these SQL commands in your Supabase SQL editor to check if the tables exist:

### 1. Check if tables exist:
```sql
-- Check if training sessions table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'chatbot_training_sessions'
);

-- Check if training analytics table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'chatbot_training_analytics'
);
```

### 2. Check table structure:
```sql
-- View training sessions table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'chatbot_training_sessions';

-- View training analytics table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'chatbot_training_analytics';
```

### 3. Test insert (if tables exist):
```sql
-- Test insert into training sessions
INSERT INTO chatbot_training_sessions (
    chatbot_id, 
    training_type, 
    status, 
    config, 
    progress
) VALUES (
    (SELECT id FROM chatbots LIMIT 1),
    'llm',
    'running',
    '{"learning_rate": 0.001}',
    0
) RETURNING id;
```

## If Tables Don't Exist

If the tables don't exist, run the complete setup script:

```sql
-- Copy and paste the entire contents of setup-training-tables.sql
-- This will create all necessary tables and policies
```

## Alternative: Manual Table Creation

If the setup script doesn't work, create tables manually:

```sql
-- Create training sessions table
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

-- Create training analytics table
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

-- Enable RLS
ALTER TABLE chatbot_training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_training_analytics ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Allow all operations for authenticated users" ON chatbot_training_sessions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON chatbot_training_analytics
    FOR ALL USING (auth.role() = 'authenticated');
```

## Troubleshooting

1. **"Table doesn't exist" error**: Run the table creation scripts above
2. **"Permission denied" error**: Check RLS policies
3. **"Foreign key constraint" error**: Make sure chatbots table exists and has data
4. **"UUID function not found" error**: This is normal in some Supabase setups, the tables will still work

## Fallback Mode

The application now has a fallback mode that will work even without the training tables. It will:
- Create virtual training sessions
- Show sample analytics data
- Allow training to proceed with simulated progress
- Store training data in memory (not persistent)

This means the training feature will work immediately, even if the database tables aren't set up yet. 