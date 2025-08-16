-- Simple Payment Integration Fix
-- Run this to add missing columns to existing tables

-- =====================================================
-- STEP 1: ADD MISSING COLUMNS TO SUBSCRIPTIONS TABLE
-- =====================================================

-- Add gateway column
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS gateway TEXT;

-- Add gateway_subscription_id column
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS gateway_subscription_id TEXT;

-- Add gateway_customer_id column
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS gateway_customer_id TEXT;

-- Add payment_method_id column
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS payment_method_id UUID;

-- Add updated_at column
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- =====================================================
-- STEP 2: CREATE PAYMENT TABLES
-- =====================================================

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('card', 'bank_account')),
  last4 TEXT NOT NULL,
  brand TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT FALSE,
  gateway TEXT NOT NULL CHECK (gateway IN ('stripe', 'razorpay')),
  gateway_payment_method_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  number TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('paid', 'open', 'void', 'uncollectible', 'unpaid', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  pdf_url TEXT,
  gateway TEXT NOT NULL CHECK (gateway IN ('stripe', 'razorpay')),
  gateway_invoice_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create checkout_sessions table
CREATE TABLE IF NOT EXISTS checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'expired')),
  success_url TEXT NOT NULL,
  cancel_url TEXT NOT NULL,
  gateway TEXT NOT NULL CHECK (gateway IN ('stripe', 'razorpay')),
  gateway_session_id TEXT,
  session_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create payment_events table
CREATE TABLE IF NOT EXISTS payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  gateway TEXT NOT NULL CHECK (gateway IN ('stripe', 'razorpay')),
  gateway_event_id TEXT,
  event_data JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 3: CREATE INDEXES
-- =====================================================

-- Payment methods indexes
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_gateway ON payment_methods(gateway);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(is_default);

-- Invoices indexes
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_gateway ON invoices(gateway);

-- Checkout sessions indexes
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id ON checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON checkout_sessions(status);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_gateway ON checkout_sessions(gateway);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_created_at ON checkout_sessions(created_at);

-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_type ON subscriptions(plan_type);
CREATE INDEX IF NOT EXISTS idx_subscriptions_gateway ON subscriptions(gateway);

-- Payment events indexes
CREATE INDEX IF NOT EXISTS idx_payment_events_user_id ON payment_events(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_event_type ON payment_events(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_events_gateway ON payment_events(gateway);
CREATE INDEX IF NOT EXISTS idx_payment_events_processed ON payment_events(processed);

-- =====================================================
-- STEP 4: ENABLE RLS
-- =====================================================

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 5: CREATE RLS POLICIES
-- =====================================================

-- Payment Methods RLS Policies
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own payment methods" ON payment_methods;
    DROP POLICY IF EXISTS "Users can insert their own payment methods" ON payment_methods;
    DROP POLICY IF EXISTS "Users can update their own payment methods" ON payment_methods;
    DROP POLICY IF EXISTS "Users can delete their own payment methods" ON payment_methods;
    
    -- Create new policies
    CREATE POLICY "Users can view their own payment methods" ON payment_methods
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own payment methods" ON payment_methods
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own payment methods" ON payment_methods
      FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own payment methods" ON payment_methods
      FOR DELETE USING (auth.uid() = user_id);
END $$;

-- Invoices RLS Policies
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own invoices" ON invoices;
    DROP POLICY IF EXISTS "Users can insert their own invoices" ON invoices;
    DROP POLICY IF EXISTS "Users can update their own invoices" ON invoices;
    
    -- Create new policies
    CREATE POLICY "Users can view their own invoices" ON invoices
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own invoices" ON invoices
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own invoices" ON invoices
      FOR UPDATE USING (auth.uid() = user_id);
END $$;

-- Checkout Sessions RLS Policies
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own checkout sessions" ON checkout_sessions;
    DROP POLICY IF EXISTS "Users can insert their own checkout sessions" ON checkout_sessions;
    DROP POLICY IF EXISTS "Users can update their own checkout sessions" ON checkout_sessions;
    
    -- Create new policies
    CREATE POLICY "Users can view their own checkout sessions" ON checkout_sessions
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own checkout sessions" ON checkout_sessions
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own checkout sessions" ON checkout_sessions
      FOR UPDATE USING (auth.uid() = user_id);
END $$;

-- Subscriptions RLS Policies
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;
    
    -- Create new policies
    CREATE POLICY "Users can view their own subscriptions" ON subscriptions
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own subscriptions" ON subscriptions
      FOR UPDATE USING (auth.uid() = user_id);
END $$;

-- Payment Events RLS Policies
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own payment events" ON payment_events;
    DROP POLICY IF EXISTS "Users can insert their own payment events" ON payment_events;
    
    -- Create new policies
    CREATE POLICY "Users can view their own payment events" ON payment_events
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own payment events" ON payment_events
      FOR INSERT WITH CHECK (auth.uid() = user_id);
END $$;

-- =====================================================
-- STEP 6: CREATE FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to ensure only one default payment method per user
CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    -- Set all other payment methods for this user to not default
    UPDATE payment_methods 
    SET is_default = FALSE 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Helper functions
CREATE OR REPLACE FUNCTION get_user_plan_details(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'plan_type', s.plan_type,
    'status', s.status,
    'agent_limit', s.agent_limit,
    'current_agent_count', s.current_agent_count,
    'subscription_start_date', s.subscription_start_date,
    'subscription_end_date', s.subscription_end_date,
    'trial_start_date', s.trial_start_date,
    'trial_end_date', s.trial_end_date,
    'cancel_at_period_end', s.cancel_at_period_end,
    'gateway', s.gateway
  ) INTO result
  FROM subscriptions s
  WHERE s.user_id = user_uuid
  ORDER BY s.created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(result, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_has_feature_access(user_uuid UUID, feature_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  functionality_percent INTEGER;
BEGIN
  SELECT plan_type INTO user_plan
  FROM subscriptions
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF user_plan IS NULL THEN
    RETURN TRUE;
  END IF;
  
  CASE user_plan
    WHEN 'free' THEN functionality_percent := 25;
    WHEN 'growth' THEN functionality_percent := 50;
    WHEN 'pro' THEN functionality_percent := 75;
    WHEN 'enterprise' THEN functionality_percent := 100;
    ELSE functionality_percent := 25;
  END CASE;
  
  RETURN functionality_percent > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_trial_active(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  trial_end TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT trial_end_date INTO trial_end
  FROM subscriptions
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN trial_end IS NOT NULL AND trial_end > NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_trial_days_remaining(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  trial_end TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT trial_end_date INTO trial_end
  FROM subscriptions
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF trial_end IS NULL OR trial_end <= NOW() THEN
    RETURN 0;
  END IF;
  
  RETURN EXTRACT(DAY FROM (trial_end - NOW()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 7: CREATE TRIGGERS
-- =====================================================

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at 
  BEFORE UPDATE ON payment_methods 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_checkout_sessions_updated_at ON checkout_sessions;
CREATE TRIGGER update_checkout_sessions_updated_at 
  BEFORE UPDATE ON checkout_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for single default payment method
DROP TRIGGER IF EXISTS ensure_single_default_payment_method_trigger ON payment_methods;
CREATE TRIGGER ensure_single_default_payment_method_trigger
  BEFORE INSERT OR UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION ensure_single_default_payment_method();

-- =====================================================
-- STEP 8: VERIFICATION
-- =====================================================

-- Check if gateway column was added successfully
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'subscriptions' 
AND column_name = 'gateway';

-- Check if all payment tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('payment_methods', 'invoices', 'checkout_sessions', 'payment_events')
ORDER BY table_name;

-- Check if functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('get_user_plan_details', 'user_has_feature_access', 'is_trial_active', 'get_trial_days_remaining'); 