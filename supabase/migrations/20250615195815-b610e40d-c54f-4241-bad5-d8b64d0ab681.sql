
-- Create enum for subscription status
CREATE TYPE public.subscription_status AS ENUM ('trial', 'active', 'expired', 'cancelled');

-- Create subscriptions table to track user trial and payment status
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status subscription_status NOT NULL DEFAULT 'trial',
  trial_start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  trial_end_date TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '14 days'),
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,
  plan_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscription
CREATE POLICY "Users can view their own subscription" 
  ON public.subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to update their own subscription
CREATE POLICY "Users can update their own subscription" 
  ON public.subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow inserting subscriptions (for new users)
CREATE POLICY "Allow inserting subscriptions" 
  ON public.subscriptions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create function to check if user's trial is active
CREATE OR REPLACE FUNCTION public.is_trial_active(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.subscriptions 
    WHERE subscriptions.user_id = is_trial_active.user_id 
    AND (
      (status = 'trial' AND trial_end_date > now()) 
      OR status = 'active'
    )
  );
$$;

-- Create function to get trial days remaining
CREATE OR REPLACE FUNCTION public.get_trial_days_remaining(user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT GREATEST(0, EXTRACT(DAY FROM (trial_end_date - now()))::INTEGER)
  FROM public.subscriptions 
  WHERE subscriptions.user_id = get_trial_days_remaining.user_id 
  AND status = 'trial';
$$;

-- Update the handle_new_user function to create subscription record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
    -- Insert into profiles table
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'agent')
    );
    
    -- Insert into subscriptions table for trial tracking
    INSERT INTO public.subscriptions (user_id, status, trial_start_date, trial_end_date)
    VALUES (
        NEW.id,
        'trial',
        now(),
        now() + INTERVAL '14 days'
    );
    
    RETURN NEW;
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON public.subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();
