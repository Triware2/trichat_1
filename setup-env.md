# Environment Setup Guide

## Step 1: Create .env file

Create a `.env` file in the root directory (`stellar-cx-nexus/.env`) with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 2: Get Supabase Credentials

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key
5. Paste them in your `.env` file

## Step 3: Set up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/setup-database.sql`
3. Paste and run the SQL script
4. This will create all necessary tables and insert 2 test bots

## Step 4: Test the Application

1. Start the development server: `npm run dev`
2. Navigate to the chatbot training page
3. You should see 2 bots:
   - **Customer Support Bot** (Traditional/Rule-based)
   - **AI Assistant Pro** (LLM/GPT-4)

## Troubleshooting

If you encounter issues:

1. **Check Supabase Connection**: Verify your `.env` file has correct credentials
2. **Database Tables**: Ensure the SQL script ran successfully
3. **RLS Policies**: Make sure you're authenticated in Supabase
4. **Console Errors**: Check browser console for any error messages

## Test Bots Created

The setup script creates 2 test bots:

### 1. Customer Support Bot (Traditional)
- **Type**: Standard/Rule-based
- **Model**: rule-based
- **Features**: 3 sample rules for billing, orders, and technical support
- **SOPs**: 2 sample documents

### 2. AI Assistant Pro (LLM)
- **Type**: LLM
- **Model**: gpt-4
- **Features**: AI-powered responses
- **SOPs**: 1 training document

Both bots come with sample conversations and messages for testing. 