# Fix 403 Forbidden Error

## 🔍 **Problem Identified**
The 403 Forbidden error is caused by **Row Level Security (RLS)** policies blocking access to the database tables.

## 🛠️ **Quick Fix (Development Only)**

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**

### Step 2: Run This SQL Script
Copy and paste this SQL into the editor and run it:

```sql
-- Temporarily disable RLS for development
-- WARNING: Only use this for development/testing, not production!

ALTER TABLE chatbots DISABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_rules DISABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_sops DISABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages DISABLE ROW LEVEL SECURITY;

SELECT 'RLS disabled for development. Remember to re-enable for production!' as message;
```

### Step 3: Try Creating a Bot Again
After running the SQL script, try creating a chatbot again. It should work now!

## 🔒 **For Production**
When you're ready for production, re-enable RLS with proper authentication:

```sql
-- Re-enable RLS for production
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;
```

## 🎯 **Why This Happened**
- The database tables have RLS policies that require user authentication
- Your app is running without authentication in development
- The policies block all operations when no user is authenticated

## ✅ **Expected Result**
After running the SQL script, you should be able to:
- Create chatbots successfully
- See "Chatbot created successfully" in the console
- No more 403 Forbidden errors 