-- Billing and Payment Management Schema
-- This schema supports subscription management, payment processing, and billing history

-- Create enum for payment method types
CREATE TYPE public.payment_method_type AS ENUM ('card', 'bank_account', 'paypal');

-- Create enum for invoice status
CREATE TYPE public.invoice_status AS ENUM ('draft', 'open', 'paid', 'void', 'uncollectible');

-- Create enum for checkout session status
CREATE TYPE public.checkout_session_status AS ENUM ('pending', 'completed', 'expired', 'cancelled');

-- Create payment_methods table
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type payment_method_type NOT NULL,
  last4 TEXT NOT NULL,
  brand TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  stripe_payment_method_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create checkout_sessions table
CREATE TABLE public.checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL,
  status checkout_session_status NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  success_url TEXT NOT NULL,
  cancel_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_invoice_id TEXT,
  number TEXT NOT NULL,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'USD',
  status invoice_status NOT NULL DEFAULT 'draft',
  due_date TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create billing_events table for tracking billing-related activities
CREATE TABLE public.billing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX idx_payment_methods_default ON public.payment_methods(user_id, is_default) WHERE is_default = true;
CREATE INDEX idx_checkout_sessions_user_id ON public.checkout_sessions(user_id);
CREATE INDEX idx_checkout_sessions_status ON public.checkout_sessions(status);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_billing_events_user_id ON public.billing_events(user_id);
CREATE INDEX idx_billing_events_type ON public.billing_events(event_type);

-- Enable Row Level Security
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_methods
CREATE POLICY "Users can view their own payment methods" 
  ON public.payment_methods 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods" 
  ON public.payment_methods 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods" 
  ON public.payment_methods 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods" 
  ON public.payment_methods 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for checkout_sessions
CREATE POLICY "Users can view their own checkout sessions" 
  ON public.checkout_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checkout sessions" 
  ON public.checkout_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkout sessions" 
  ON public.checkout_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for invoices
CREATE POLICY "Users can view their own invoices" 
  ON public.invoices 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices" 
  ON public.invoices 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" 
  ON public.invoices 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for billing_events
CREATE POLICY "Users can view their own billing events" 
  ON public.billing_events 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own billing events" 
  ON public.billing_events 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_payment_methods_updated_at 
    BEFORE UPDATE ON public.payment_methods 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_checkout_sessions_updated_at 
    BEFORE UPDATE ON public.checkout_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at 
    BEFORE UPDATE ON public.invoices 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to log billing events
CREATE OR REPLACE FUNCTION public.log_billing_event(user_id UUID, event_type TEXT, event_data JSONB DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.billing_events (user_id, event_type, event_data)
    VALUES (log_billing_event.user_id, log_billing_event.event_type, log_billing_event.event_data);
END;
$$;

-- Create function to get user's billing summary
CREATE OR REPLACE FUNCTION public.get_user_billing_summary(user_id UUID)
RETURNS TABLE(
  total_invoices INTEGER,
  total_paid INTEGER,
  total_outstanding INTEGER,
  payment_methods_count INTEGER,
  last_payment_date TIMESTAMPTZ
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*) as total_invoices,
    COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as total_paid,
    COALESCE(SUM(CASE WHEN status = 'open' THEN amount ELSE 0 END), 0) as total_outstanding,
    (SELECT COUNT(*) FROM public.payment_methods WHERE payment_methods.user_id = get_user_billing_summary.user_id) as payment_methods_count,
    MAX(CASE WHEN status = 'paid' THEN paid_at END) as last_payment_date
  FROM public.invoices
  WHERE invoices.user_id = get_user_billing_summary.user_id;
$$;

-- Create function to ensure only one default payment method per user
CREATE OR REPLACE FUNCTION public.ensure_single_default_payment_method()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- If this payment method is being set as default
    IF NEW.is_default = true THEN
        -- Set all other payment methods for this user to not default
        UPDATE public.payment_methods 
        SET is_default = false 
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for single default payment method
CREATE TRIGGER ensure_single_default_payment_method_trigger
    BEFORE INSERT OR UPDATE ON public.payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION public.ensure_single_default_payment_method();

-- Insert sample data for testing (optional)
-- INSERT INTO public.payment_methods (user_id, type, last4, brand, exp_month, exp_year, is_default)
-- VALUES 
--   ('sample-user-id', 'card', '4242', 'visa', 12, 2025, true);

-- INSERT INTO public.invoices (user_id, number, amount, currency, status, due_date)
-- VALUES 
--   ('sample-user-id', 'INV-2024-001', 5000, 'USD', 'paid', now() - interval '30 days');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.payment_methods TO authenticated;
GRANT ALL ON public.checkout_sessions TO authenticated;
GRANT ALL ON public.invoices TO authenticated;
GRANT ALL ON public.billing_events TO authenticated; 