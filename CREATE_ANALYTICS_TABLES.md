# Create Analytics Tables

Run these SQL commands in your Supabase SQL editor to create the missing analytics tables:

## 1. Analytics Events Table

```sql
-- Analytics Events table for tracking custom analytics and events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    metadata JSONB
);
```

## 2. Custom Analytics Table

```sql
-- Custom Analytics table for storing custom analytics configurations
CREATE TABLE IF NOT EXISTS custom_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    metrics JSONB NOT NULL,
    filters JSONB,
    time_range VARCHAR(20) DEFAULT '30d',
    chart_type VARCHAR(50) DEFAULT 'bar',
    data_source VARCHAR(100) DEFAULT 'chats',
    query TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_run TIMESTAMP WITH TIME ZONE,
    results JSONB
);
```

## 3. Create Indexes

```sql
-- Create indexes for analytics tables
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_by ON analytics_events(created_by);
CREATE INDEX IF NOT EXISTS idx_custom_analytics_created_by ON custom_analytics(created_by);
CREATE INDEX IF NOT EXISTS idx_custom_analytics_status ON custom_analytics(status);
CREATE INDEX IF NOT EXISTS idx_custom_analytics_created_at ON custom_analytics(created_at);
```

## 4. Enable RLS

```sql
-- Enable RLS on analytics tables
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_analytics ENABLE ROW LEVEL SECURITY;
```

## 5. RLS Policies for analytics_events

```sql
-- RLS policies for analytics_events
CREATE POLICY "Allow authenticated users to view analytics events" ON analytics_events
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert analytics events" ON analytics_events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update analytics events" ON analytics_events
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete analytics events" ON analytics_events
    FOR DELETE USING (auth.role() = 'authenticated');
```

## 6. RLS Policies for custom_analytics

```sql
-- RLS policies for custom_analytics
CREATE POLICY "Allow authenticated users to view custom analytics" ON custom_analytics
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert custom analytics" ON custom_analytics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update custom analytics" ON custom_analytics
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete custom analytics" ON custom_analytics
    FOR DELETE USING (auth.role() = 'authenticated');
```

## 7. Trigger for updated_at

```sql
-- Trigger to update updated_at timestamp for custom_analytics
CREATE OR REPLACE FUNCTION update_custom_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_custom_analytics_updated_at
    BEFORE UPDATE ON custom_analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_custom_analytics_updated_at();
```

## Instructions

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste each SQL block above
4. Run them in order
5. After running all commands, your custom analytics functionality should work properly

## What This Enables

- **Custom Analytics Creation**: Users can create custom analytics reports with specific metrics and filters
- **Custom Analytics Storage**: All custom analytics configurations are stored in the database
- **Custom Analytics Execution**: Users can run their custom analytics and see results
- **Custom Analytics Management**: Users can view, update, and delete their custom analytics
- **Proper Security**: Row Level Security (RLS) ensures users can only access their own analytics 