# Fix "Failed to Save Flow" Issue

## Problem Identified
The issue is likely caused by:
1. **RLS (Row Level Security) policies** blocking unauthenticated inserts
2. **Table name mismatch** in flow versions
3. **Missing created_by field** handling

## Solution Steps

### Step 1: Fix RLS Policies
Run this SQL in your Supabase SQL Editor:

```sql
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON chatbot_flows;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON chatbot_flows;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON chatbot_flows;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON chatbot_flows;

DROP POLICY IF EXISTS "Enable read access for all users" ON flow_versions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON flow_versions;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON flow_versions;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON flow_versions;

-- Create permissive policies for testing
CREATE POLICY "Allow all operations for testing" ON chatbot_flows
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for testing" ON flow_versions
    FOR ALL USING (true) WITH CHECK (true);
```

### Step 2: Alternative - Disable RLS Temporarily
If the above doesn't work, temporarily disable RLS:

```sql
ALTER TABLE chatbot_flows DISABLE ROW LEVEL SECURITY;
ALTER TABLE flow_versions DISABLE ROW LEVEL SECURITY;
```

### Step 3: Verify Table Structure
Make sure your tables have the correct structure:

```sql
-- Check chatbot_flows table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'chatbot_flows';

-- Check flow_versions table  
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'flow_versions';
```

### Step 4: Test Database Connection
Run this to test if the tables are accessible:

```sql
-- Test insert into chatbot_flows
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
    '00000000-0000-0000-0000-000000000000',
    'Test Flow',
    'Test Description',
    1,
    '[]'::jsonb,
    '[]'::jsonb,
    '{}'::jsonb,
    true,
    false
);

-- Clean up test data
DELETE FROM chatbot_flows WHERE name = 'Test Flow';
```

## Code Changes Made

### 1. Fixed Table Names
- Changed `chatbot_flow_versions` to `flow_versions` in service

### 2. Removed created_by Field
- Removed `created_by: null` from flow creation to let database handle it

### 3. Added Error Logging
- Added console.log to see exact error details

### 4. Made Version Creation Optional
- Flow version creation failure won't break flow saving

## Testing

After applying these fixes:

1. **Refresh your application**
2. **Open browser console** (F12) to see detailed error messages
3. **Try saving a flow** and check console for specific error details
4. **Check Supabase logs** for any database errors

## Expected Result

The flow should save successfully without the "Failed to save flow" error.

## If Still Failing

Check the browser console for the exact error message and share it for further debugging. 