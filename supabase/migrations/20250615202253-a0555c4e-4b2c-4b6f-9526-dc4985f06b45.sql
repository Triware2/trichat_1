
-- Insert default plan features
INSERT INTO public.plan_features (plan_type, feature_key, is_enabled, feature_limit) VALUES
-- Free Plan (25% functionality)
('free', 'basic_chat', true, NULL),
('free', 'agent_management', true, 5),
('free', 'basic_reports', true, NULL),
('free', 'email_support', true, NULL),
('free', 'canned_responses', false, NULL),
('free', 'file_sharing', false, NULL),
('free', 'advanced_routing', false, NULL),
('free', 'api_access', false, NULL),
('free', 'custom_fields', false, NULL),
('free', 'integrations', false, NULL),
('free', 'advanced_analytics', false, NULL),
('free', 'priority_support', false, NULL),
('free', 'white_labeling', false, NULL),
('free', 'sso', false, NULL),
('free', 'advanced_automation', false, NULL),
('free', 'custom_workflows', false, NULL),

-- Growth Plan (50% functionality)
('growth', 'basic_chat', true, NULL),
('growth', 'agent_management', true, NULL),
('growth', 'basic_reports', true, NULL),
('growth', 'email_support', true, NULL),
('growth', 'canned_responses', true, NULL),
('growth', 'file_sharing', true, NULL),
('growth', 'advanced_routing', true, NULL),
('growth', 'api_access', true, NULL),
('growth', 'custom_fields', false, NULL),
('growth', 'integrations', false, NULL),
('growth', 'advanced_analytics', false, NULL),
('growth', 'priority_support', false, NULL),
('growth', 'white_labeling', false, NULL),
('growth', 'sso', false, NULL),
('growth', 'advanced_automation', false, NULL),
('growth', 'custom_workflows', false, NULL),

-- Pro Plan (75% functionality)
('pro', 'basic_chat', true, NULL),
('pro', 'agent_management', true, NULL),
('pro', 'basic_reports', true, NULL),
('pro', 'email_support', true, NULL),
('pro', 'canned_responses', true, NULL),
('pro', 'file_sharing', true, NULL),
('pro', 'advanced_routing', true, NULL),
('pro', 'api_access', true, NULL),
('pro', 'custom_fields', true, NULL),
('pro', 'integrations', true, NULL),
('pro', 'advanced_analytics', true, NULL),
('pro', 'priority_support', true, NULL),
('pro', 'white_labeling', false, NULL),
('pro', 'sso', false, NULL),
('pro', 'advanced_automation', false, NULL),
('pro', 'custom_workflows', false, NULL),

-- Enterprise Plan (100% functionality)
('enterprise', 'basic_chat', true, NULL),
('enterprise', 'agent_management', true, NULL),
('enterprise', 'basic_reports', true, NULL),
('enterprise', 'email_support', true, NULL),
('enterprise', 'canned_responses', true, NULL),
('enterprise', 'file_sharing', true, NULL),
('enterprise', 'advanced_routing', true, NULL),
('enterprise', 'api_access', true, NULL),
('enterprise', 'custom_fields', true, NULL),
('enterprise', 'integrations', true, NULL),
('enterprise', 'advanced_analytics', true, NULL),
('enterprise', 'priority_support', true, NULL),
('enterprise', 'white_labeling', true, NULL),
('enterprise', 'sso', true, NULL),
('enterprise', 'advanced_automation', true, NULL),
('enterprise', 'custom_workflows', true, NULL);

-- Create function to check if user has access to a feature
CREATE OR REPLACE FUNCTION public.user_has_feature_access(user_id UUID, feature_key TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(pf.is_enabled, false)
  FROM public.subscriptions s
  LEFT JOIN public.plan_features pf ON pf.plan_type = COALESCE(s.plan_type, 'free')
  WHERE s.user_id = user_has_feature_access.user_id 
  AND pf.feature_key = user_has_feature_access.feature_key
  AND (
    (s.status = 'trial' AND s.trial_end_date > now()) 
    OR s.status = 'active'
    OR s.status = 'free'
  );
$$;

-- Create function to get user's current plan details
CREATE OR REPLACE FUNCTION public.get_user_plan_details(user_id UUID)
RETURNS TABLE(
  plan_type TEXT,
  status subscription_status,
  agent_limit INTEGER,
  current_agent_count INTEGER,
  trial_days_remaining INTEGER
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(s.plan_type, 'free') as plan_type,
    s.status,
    s.agent_limit,
    s.current_agent_count,
    CASE 
      WHEN s.status = 'trial' THEN GREATEST(0, EXTRACT(DAY FROM (s.trial_end_date - now()))::INTEGER)
      ELSE 0
    END as trial_days_remaining
  FROM public.subscriptions s
  WHERE s.user_id = get_user_plan_details.user_id;
$$;

-- Update handle_new_user function to set free plan by default
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
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'admin')
    );
    
    -- Insert into subscriptions table with free plan
    INSERT INTO public.subscriptions (user_id, status, plan_type, agent_limit, current_agent_count)
    VALUES (
        NEW.id,
        'free',
        'free',
        5,
        0
    );
    
    RETURN NEW;
END;
$$;
