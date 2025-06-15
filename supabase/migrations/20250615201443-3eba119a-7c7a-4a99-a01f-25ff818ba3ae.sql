
-- First, add the new enum value
ALTER TYPE public.subscription_status ADD VALUE IF NOT EXISTS 'free';

-- Add plan_features table to define what features are available for each plan
CREATE TABLE public.plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type TEXT NOT NULL,
  feature_key TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  feature_limit INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(plan_type, feature_key)
);

-- Add agent_limit column to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS agent_limit INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS current_agent_count INTEGER DEFAULT 0;

-- Enable RLS on plan_features
ALTER TABLE public.plan_features ENABLE ROW LEVEL SECURITY;

-- Create policy for plan_features (read-only for all authenticated users)
CREATE POLICY "Anyone can view plan features" 
  ON public.plan_features 
  FOR SELECT 
  TO authenticated
  USING (true);
