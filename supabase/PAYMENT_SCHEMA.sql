-- Payment Integration Database Schema
-- Run this in your Supabase SQL Editor to set up payment tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PAYMENT METHODS TABLE
-- =====================================================
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
  gateway_payment_method_id TEXT, -- Store the payment method ID from the gateway
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for payment_methods
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_gateway ON payment_methods(gateway);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(is_default);

-- =====================================================
-- INVOICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  number TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL, -- Amount in cents/paise
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('paid', 'open', 'void', 'uncollectible', 'unpaid', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  pdf_url TEXT,
  gateway TEXT NOT NULL CHECK (gateway IN ('stripe', 'razorpay')),
  gateway_invoice_id TEXT, -- Store the invoice ID from the gateway
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for invoices
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_gateway ON invoices(gateway);

-- =====================================================
-- CHECKOUT SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'expired')),
  success_url TEXT NOT NULL,
  cancel_url TEXT NOT NULL,
  gateway TEXT NOT NULL CHECK (gateway IN ('stripe', 'razorpay')),
  gateway_session_id TEXT, -- Store the session ID from the gateway
  session_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for checkout_sessions
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id ON checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON checkout_sessions(status);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_gateway ON checkout_sessions(gateway);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_created_at ON checkout_sessions(created_at);

-- =====================================================
-- SUBSCRIPTIONS TABLE (Enhanced)
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'free' CHECK (status IN ('free', 'active', 'cancelled', 'past_due', 'unpaid', 'trialing')),
  agent_limit INTEGER,
  current_agent_count INTEGER DEFAULT 0,
  subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  trial_start_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  gateway TEXT CHECK (gateway IN ('stripe', 'razorpay')),
  gateway_subscription_id TEXT, -- Store the subscription ID from the gateway
  gateway_customer_id TEXT, -- Store the customer ID from the gateway
  payment_method_id UUID REFERENCES payment_methods(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_type ON subscriptions(plan_type);
CREATE INDEX IF NOT EXISTS idx_subscriptions_gateway ON subscriptions(gateway);

-- =====================================================
-- PAYMENT EVENTS TABLE (For webhook tracking)
-- =====================================================
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

-- Indexes for payment_events
CREATE INDEX IF NOT EXISTS idx_payment_events_user_id ON payment_events(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_event_type ON payment_events(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_events_gateway ON payment_events(gateway);
CREATE INDEX IF NOT EXISTS idx_payment_events_processed ON payment_events(processed);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- Payment Methods RLS Policies
CREATE POLICY "Users can view their own payment methods" ON payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods" ON payment_methods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods" ON payment_methods
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods" ON payment_methods
  FOR DELETE USING (auth.uid() = user_id);

-- Invoices RLS Policies
CREATE POLICY "Users can view their own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices" ON invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" ON invoices
  FOR UPDATE USING (auth.uid() = user_id);

-- Checkout Sessions RLS Policies
CREATE POLICY "Users can view their own checkout sessions" ON checkout_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checkout sessions" ON checkout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkout sessions" ON checkout_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions RLS Policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Payment Events RLS Policies
CREATE POLICY "Users can view their own payment events" ON payment_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment events" ON payment_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_payment_methods_updated_at 
  BEFORE UPDATE ON payment_methods 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checkout_sessions_updated_at 
  BEFORE UPDATE ON checkout_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- Trigger for single default payment method
CREATE TRIGGER ensure_single_default_payment_method_trigger
  BEFORE INSERT OR UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION ensure_single_default_payment_method();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get user plan details
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

-- Function to check if user has feature access
CREATE OR REPLACE FUNCTION user_has_feature_access(user_uuid UUID, feature_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  functionality_percent INTEGER;
BEGIN
  -- Get user's current plan
  SELECT plan_type INTO user_plan
  FROM subscriptions
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Return TRUE if no subscription found (free tier)
  IF user_plan IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Define functionality percentages based on plan
  CASE user_plan
    WHEN 'free' THEN functionality_percent := 25;
    WHEN 'growth' THEN functionality_percent := 50;
    WHEN 'pro' THEN functionality_percent := 75;
    WHEN 'enterprise' THEN functionality_percent := 100;
    ELSE functionality_percent := 25;
  END CASE;
  
  -- For now, return TRUE if functionality_percent > 0
  -- You can add more specific feature checks here
  RETURN functionality_percent > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if trial is active
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

-- Function to get trial days remaining
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
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample subscription plans (if needed)
-- INSERT INTO subscriptions (user_id, plan_type, status, agent_limit) 
-- VALUES 
--   ('your-user-id', 'free', 'free', 5),
--   ('your-user-id', 'growth', 'active', NULL);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE payment_methods IS 'Stores user payment methods from Stripe and Razorpay';
COMMENT ON TABLE invoices IS 'Stores billing invoices from payment gateways';
COMMENT ON TABLE checkout_sessions IS 'Stores checkout sessions for subscription upgrades';
COMMENT ON TABLE subscriptions IS 'Stores user subscription information';
COMMENT ON TABLE payment_events IS 'Stores payment events from webhooks';

COMMENT ON COLUMN payment_methods.gateway_payment_method_id IS 'Payment method ID from the gateway (e.g., pm_1234567890 from Stripe)';
COMMENT ON COLUMN invoices.amount IS 'Amount in cents/paise (smallest currency unit)';
COMMENT ON COLUMN invoices.gateway_invoice_id IS 'Invoice ID from the gateway (e.g., in_1234567890 from Stripe)';
COMMENT ON COLUMN checkout_sessions.gateway_session_id IS 'Session ID from the gateway (e.g., cs_1234567890 from Stripe)';
COMMENT ON COLUMN subscriptions.gateway_subscription_id IS 'Subscription ID from the gateway (e.g., sub_1234567890 from Stripe)';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Uncomment these queries to verify the schema was created correctly

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('payment_methods', 'invoices', 'checkout_sessions', 'subscriptions', 'payment_events');

-- Check if indexes exist
-- SELECT indexname, tablename FROM pg_indexes 
-- WHERE tablename IN ('payment_methods', 'invoices', 'checkout_sessions', 'subscriptions', 'payment_events');

-- Check if functions exist
-- SELECT routine_name FROM information_schema.routines 
-- WHERE routine_schema = 'public' 
-- AND routine_name IN ('get_user_plan_details', 'user_has_feature_access', 'is_trial_active', 'get_trial_days_remaining'); 