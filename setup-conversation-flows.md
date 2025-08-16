# Setup Conversation Flows Database Tables

## Issue
The "Failed to save flow" error occurs because the required database tables for conversation flows are missing.

## Solution
Run the following SQL migration in your Supabase dashboard:

### Step 1: Open Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" section

### Step 2: Run the Migration
Copy and paste the following SQL into the SQL editor and run it:

```sql
-- Migration: Add Conversation Flows Tables
-- This migration adds the missing chatbot_flows and flow_versions tables

-- Chatbot Flows table
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

-- Flow Versions table
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

-- Create indexes for flows
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_chatbot_id ON chatbot_flows(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_version ON chatbot_flows(version);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_is_active ON chatbot_flows(is_active);
CREATE INDEX IF NOT EXISTS idx_flow_versions_flow_id ON flow_versions(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_versions_version ON flow_versions(version);

-- Enable Row Level Security (RLS)
ALTER TABLE chatbot_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_versions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chatbot_flows
CREATE POLICY "Enable read access for all users" ON chatbot_flows
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON chatbot_flows
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON chatbot_flows
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON chatbot_flows
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for flow_versions
CREATE POLICY "Enable read access for all users" ON flow_versions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON flow_versions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON flow_versions
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON flow_versions
    FOR DELETE USING (auth.role() = 'authenticated');
```

### Step 3: Verify Tables Created
After running the migration, you should see two new tables in your Supabase dashboard:
- `chatbot_flows`
- `flow_versions`

### Step 4: Test the Flow Builder
1. Refresh your application
2. Go to the Conversation Flow Builder
3. Try creating and saving a flow

The "Failed to save flow" error should now be resolved!

## Alternative: Quick Fix
If you want to test without setting up the database, you can temporarily modify the `chatbotService.ts` to use mock data instead of real database calls. 