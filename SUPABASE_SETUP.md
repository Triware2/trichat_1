# Supabase Setup Guide

## Database Connection Issue

The chatbot creation is failing because the Supabase environment variables are not configured. Follow these steps to fix this:

### 1. Create Environment File

Create a `.env` file in the `stellar-cx-nexus` directory with the following content:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. Go to Settings → API
4. Copy the "Project URL" and "anon public" key
5. Replace the placeholder values in your `.env` file

### 3. Run Database Setup

After setting up your environment variables, run the database setup:

```bash
# Navigate to the project directory
cd stellar-cx-nexus

# Run the database setup script
# This will create all necessary tables and policies
```

### 4. Restart Development Server

```bash
npm run dev
```

## Bot Types Supported

The application now supports both types of chatbots:

### LLM-Powered Bots
- **GPT-4 (Advanced)**: Most capable AI model
- **GPT-3.5 Turbo (Fast)**: Faster, more cost-effective
- **Claude 3 (Balanced)**: Good balance of capability and speed
- **Custom Model**: For custom AI implementations

### Rule-Based Bots
- **Rule Engine (Standard)**: Traditional rule-based system
- **Decision Tree**: Tree-based decision making
- **Pattern Matching**: Pattern-based responses
- **Custom Rules**: Custom rule implementations

## Features

- ✅ Create both LLM and rule-based bots
- ✅ Modern UI with bot type selection
- ✅ Real-time database integration
- ✅ Error handling and validation
- ✅ Professional design with glass morphism 