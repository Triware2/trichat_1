-- Support System Database Schema
-- This schema creates tables for managing user support requests and responses

-- Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'billing', 'features', 'account', 'integration', 'training', 'security', 'general')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  response TEXT,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Support Ticket Responses Table (for multiple responses per ticket)
CREATE TABLE IF NOT EXISTS support_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES auth.users(id),
  responder_name TEXT NOT NULL,
  responder_email TEXT NOT NULL,
  response TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Categories Table (for dynamic categories)
CREATE TABLE IF NOT EXISTS support_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support FAQ Table
CREATE TABLE IF NOT EXISTS support_faq (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Resources Table
CREATE TABLE IF NOT EXISTS support_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  type TEXT NOT NULL CHECK (type IN ('documentation', 'video', 'community', 'api')),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Settings Table
CREATE TABLE IF NOT EXISTS support_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'string',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_category ON support_tickets(category);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON support_tickets(assigned_to);

CREATE INDEX IF NOT EXISTS idx_support_responses_ticket_id ON support_responses(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_responses_created_at ON support_responses(created_at);

CREATE INDEX IF NOT EXISTS idx_support_faq_category ON support_faq(category);
CREATE INDEX IF NOT EXISTS idx_support_faq_published ON support_faq(is_published);

-- RLS Policies for support_tickets
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Users can view their own tickets
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own support tickets" ON support_tickets;
  CREATE POLICY "Users can view their own support tickets" ON support_tickets
    FOR SELECT USING (auth.uid() = user_id);
END $$;

-- Users can create their own tickets
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can create their own support tickets" ON support_tickets;
  CREATE POLICY "Users can create their own support tickets" ON support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);
END $$;

-- Users can update their own tickets
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can update their own support tickets" ON support_tickets;
  CREATE POLICY "Users can update their own support tickets" ON support_tickets
    FOR UPDATE USING (auth.uid() = user_id);
END $$;

-- Admins can view all tickets
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can view all support tickets" ON support_tickets;
  CREATE POLICY "Admins can view all support tickets" ON support_tickets
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
END $$;

-- RLS Policies for support_responses
ALTER TABLE support_responses ENABLE ROW LEVEL SECURITY;

-- Users can view responses to their tickets
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view responses to their tickets" ON support_responses;
  CREATE POLICY "Users can view responses to their tickets" ON support_responses
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM support_tickets 
        WHERE id = support_responses.ticket_id 
        AND user_id = auth.uid()
      )
    );
END $$;

-- Admins can manage all responses
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can manage all support responses" ON support_responses;
  CREATE POLICY "Admins can manage all support responses" ON support_responses
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
END $$;

-- RLS Policies for other tables
ALTER TABLE support_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for categories, FAQ, and resources
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public read access for support categories" ON support_categories;
  CREATE POLICY "Public read access for support categories" ON support_categories
    FOR SELECT USING (is_active = TRUE);
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public read access for support FAQ" ON support_faq;
  CREATE POLICY "Public read access for support FAQ" ON support_faq
    FOR SELECT USING (is_published = TRUE);
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public read access for support resources" ON support_resources;
  CREATE POLICY "Public read access for support resources" ON support_resources
    FOR SELECT USING (is_active = TRUE);
END $$;

-- Admin access for all support tables
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can manage support categories" ON support_categories;
  CREATE POLICY "Admins can manage support categories" ON support_categories
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can manage support FAQ" ON support_faq;
  CREATE POLICY "Admins can manage support FAQ" ON support_faq
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can manage support resources" ON support_resources;
  CREATE POLICY "Admins can manage support resources" ON support_resources
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can manage support settings" ON support_settings;
  CREATE POLICY "Admins can manage support settings" ON support_settings
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
END $$;

-- Functions for support system
CREATE OR REPLACE FUNCTION update_support_ticket_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_support_ticket_updated_at_trigger ON support_tickets;
CREATE TRIGGER update_support_ticket_updated_at_trigger
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_support_ticket_updated_at();

-- Function to get support ticket statistics
CREATE OR REPLACE FUNCTION get_support_stats()
RETURNS TABLE (
  total_tickets BIGINT,
  open_tickets BIGINT,
  in_progress_tickets BIGINT,
  resolved_tickets BIGINT,
  urgent_tickets BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_tickets,
    COUNT(*) FILTER (WHERE status = 'open') as open_tickets,
    COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_tickets,
    COUNT(*) FILTER (WHERE status = 'resolved') as resolved_tickets,
    COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_tickets
  FROM support_tickets;
END;
$$ LANGUAGE plpgsql;

-- Insert default support categories
INSERT INTO support_categories (name, description, icon, color, sort_order) VALUES
  ('Technical Issues', 'Bugs, errors, or technical problems', 'cpu', 'blue', 1),
  ('Billing & Payments', 'Subscription, payments, or billing questions', 'credit-card', 'green', 2),
  ('Feature Requests', 'New features or improvements', 'lightbulb', 'yellow', 3),
  ('Account Management', 'Account settings, access, or permissions', 'users', 'purple', 4),
  ('Integrations', 'Third-party integrations or API issues', 'network', 'orange', 5),
  ('Training & Onboarding', 'Help with getting started or training', 'book-open', 'indigo', 6),
  ('Security Concerns', 'Security issues or privacy concerns', 'shield', 'red', 7),
  ('General Inquiry', 'General questions or other support', 'help-circle', 'gray', 8)
ON CONFLICT (name) DO NOTHING;

-- Insert default support resources
INSERT INTO support_resources (title, description, url, type, sort_order) VALUES
  ('Documentation', 'Comprehensive guides and API references', '/docs', 'documentation', 1),
  ('Video Tutorials', 'Step-by-step video guides', '/tutorials', 'video', 2),
  ('Community Forum', 'Connect with other users', '/community', 'community', 3),
  ('API Reference', 'Technical API documentation', '/api', 'api', 4)
ON CONFLICT DO NOTHING;

-- Insert default support settings
INSERT INTO support_settings (setting_key, setting_value, setting_type, description) VALUES
  ('support_email', 'support@stellar-cx.com', 'string', 'Primary support email address'),
  ('support_phone', '+1-800-STELLAR', 'string', 'Support phone number'),
  ('business_hours', '9:00 AM - 6:00 PM EST', 'string', 'Business hours for support'),
  ('response_time', '24', 'number', 'Expected response time in hours'),
  ('auto_assign', 'true', 'boolean', 'Automatically assign tickets to support team')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample FAQ entries
INSERT INTO support_faq (category, question, answer, sort_order) VALUES
  ('Getting Started', 'How do I create my first chatbot?', 'Navigate to the Chatbot section in your dashboard, click "Create New Bot", and follow the step-by-step wizard to configure your chatbot.', 1),
  ('Getting Started', 'What payment methods do you accept?', 'We accept all major credit cards (Visa, Mastercard, American Express) and digital wallets through Stripe and Razorpay.', 2),
  ('Getting Started', 'How do I invite team members?', 'Go to Access Management in your admin dashboard, click "Add User", and enter their email address to send an invitation.', 3),
  ('Billing & Subscriptions', 'How do I upgrade my plan?', 'Visit the Billing & Subscription page, select your desired plan, and complete the payment process to upgrade immediately.', 1),
  ('Billing & Subscriptions', 'Can I cancel my subscription anytime?', 'Yes, you can cancel your subscription at any time from the billing page. You''ll continue to have access until the end of your billing period.', 2),
  ('Billing & Subscriptions', 'Do you offer refunds?', 'We offer a 30-day money-back guarantee for new subscriptions. Contact our support team for refund requests.', 3),
  ('Technical Support', 'How do I integrate the chatbot on my website?', 'Copy the provided JavaScript code snippet and paste it into your website''s HTML. The widget will appear automatically.', 1),
  ('Technical Support', 'What browsers are supported?', 'Our platform supports all modern browsers including Chrome, Firefox, Safari, and Edge (version 88+).', 2),
  ('Technical Support', 'How do I export my chat data?', 'Go to Analytics > Export Data, select your date range and data type, then click "Export" to download your data.', 3)
ON CONFLICT DO NOTHING; 