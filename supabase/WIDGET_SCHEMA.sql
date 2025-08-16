-- Widget System Schema
-- This schema supports the complete widget generation and management system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Widget instances table
CREATE TABLE IF NOT EXISTS widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  integration_type VARCHAR(50) NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Widget analytics table
CREATE TABLE IF NOT EXISTS widget_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  widget_id UUID NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_conversations INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  total_visitors INTEGER DEFAULT 0,
  average_response_time INTEGER DEFAULT 0, -- in seconds
  satisfaction_score DECIMAL(3,2) DEFAULT 0,
  resolution_rate DECIMAL(5,2) DEFAULT 0, -- percentage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(widget_id, date)
);

-- Widget sessions table
CREATE TABLE IF NOT EXISTS widget_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  widget_id UUID NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  customer_data JSONB DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'archived')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  agent_id UUID REFERENCES auth.users(id),
  department VARCHAR(100),
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  metadata JSONB DEFAULT '{}'
);

-- Widget messages table
CREATE TABLE IF NOT EXISTS widget_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES widget_sessions(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('customer', 'agent', 'system')),
  sender_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  attachments JSONB DEFAULT '[]',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'
);

-- Widget templates table
CREATE TABLE IF NOT EXISTS widget_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  integration_type VARCHAR(50) NOT NULL,
  template_code TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Widget deployments table
CREATE TABLE IF NOT EXISTS widget_deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  widget_id UUID NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  environment VARCHAR(20) NOT NULL DEFAULT 'production' CHECK (environment IN ('development', 'staging', 'production')),
  domain VARCHAR(255),
  deployment_url VARCHAR(500),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'deployed', 'failed', 'rolled_back')),
  deployed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Widget webhooks table
CREATE TABLE IF NOT EXISTS widget_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  widget_id UUID NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  events JSONB DEFAULT '[]', -- array of event types to listen for
  secret VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Widget custom fields table
CREATE TABLE IF NOT EXISTS widget_custom_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  widget_id UUID NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  field_type VARCHAR(20) NOT NULL CHECK (field_type IN ('text', 'email', 'phone', 'select', 'textarea', 'number', 'date')),
  label VARCHAR(255) NOT NULL,
  placeholder VARCHAR(255),
  required BOOLEAN DEFAULT FALSE,
  options JSONB DEFAULT '[]', -- for select fields
  validation_rules JSONB DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Widget auto-responders table
CREATE TABLE IF NOT EXISTS widget_auto_responders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  widget_id UUID NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('welcome', 'offline', 'after_hours', 'no_response', 'custom')),
  trigger_conditions JSONB DEFAULT '{}',
  response_message TEXT NOT NULL,
  response_type VARCHAR(20) DEFAULT 'text' CHECK (response_type IN ('text', 'rich_text', 'template')),
  delay_seconds INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Widget working hours table
CREATE TABLE IF NOT EXISTS widget_working_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  widget_id UUID NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_enabled BOOLEAN DEFAULT TRUE,
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(widget_id, day_of_week)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_widgets_user_id ON widgets(user_id);
CREATE INDEX IF NOT EXISTS idx_widgets_status ON widgets(status);
CREATE INDEX IF NOT EXISTS idx_widgets_integration_type ON widgets(integration_type);
CREATE INDEX IF NOT EXISTS idx_widget_analytics_widget_id ON widget_analytics(widget_id);
CREATE INDEX IF NOT EXISTS idx_widget_analytics_date ON widget_analytics(date);
CREATE INDEX IF NOT EXISTS idx_widget_sessions_widget_id ON widget_sessions(widget_id);
CREATE INDEX IF NOT EXISTS idx_widget_sessions_status ON widget_sessions(status);
CREATE INDEX IF NOT EXISTS idx_widget_sessions_token ON widget_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_widget_messages_session_id ON widget_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_widget_messages_timestamp ON widget_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_widget_deployments_widget_id ON widget_deployments(widget_id);
CREATE INDEX IF NOT EXISTS idx_widget_webhooks_widget_id ON widget_webhooks(widget_id);
CREATE INDEX IF NOT EXISTS idx_widget_custom_fields_widget_id ON widget_custom_fields(widget_id);
CREATE INDEX IF NOT EXISTS idx_widget_auto_responders_widget_id ON widget_auto_responders(widget_id);
CREATE INDEX IF NOT EXISTS idx_widget_working_hours_widget_id ON widget_working_hours(widget_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_widgets_updated_at BEFORE UPDATE ON widgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_widget_templates_updated_at BEFORE UPDATE ON widget_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_widget_deployments_updated_at BEFORE UPDATE ON widget_deployments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_widget_webhooks_updated_at BEFORE UPDATE ON widget_webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_widget_auto_responders_updated_at BEFORE UPDATE ON widget_auto_responders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_auto_responders ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_working_hours ENABLE ROW LEVEL SECURITY;

-- Widgets policies
CREATE POLICY "Users can view their own widgets" ON widgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own widgets" ON widgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own widgets" ON widgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own widgets" ON widgets FOR DELETE USING (auth.uid() = user_id);

-- Widget analytics policies
CREATE POLICY "Users can view analytics for their widgets" ON widget_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_analytics.widget_id AND widgets.user_id = auth.uid())
);

-- Widget sessions policies
CREATE POLICY "Users can view sessions for their widgets" ON widget_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_sessions.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can insert sessions for their widgets" ON widget_sessions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_sessions.widget_id AND widgets.user_id = auth.uid())
);

-- Widget messages policies
CREATE POLICY "Users can view messages for their widget sessions" ON widget_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM widget_sessions 
    JOIN widgets ON widgets.id = widget_sessions.widget_id 
    WHERE widget_sessions.id = widget_messages.session_id AND widgets.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert messages for their widget sessions" ON widget_messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM widget_sessions 
    JOIN widgets ON widgets.id = widget_sessions.widget_id 
    WHERE widget_sessions.id = widget_messages.session_id AND widgets.user_id = auth.uid()
  )
);

-- Widget templates policies
CREATE POLICY "Users can view public templates" ON widget_templates FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own templates" ON widget_templates FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Users can insert their own templates" ON widget_templates FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own templates" ON widget_templates FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own templates" ON widget_templates FOR DELETE USING (auth.uid() = created_by);

-- Widget deployments policies
CREATE POLICY "Users can view deployments for their widgets" ON widget_deployments FOR SELECT USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_deployments.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can insert deployments for their widgets" ON widget_deployments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_deployments.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can update deployments for their widgets" ON widget_deployments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_deployments.widget_id AND widgets.user_id = auth.uid())
);

-- Widget webhooks policies
CREATE POLICY "Users can view webhooks for their widgets" ON widget_webhooks FOR SELECT USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_webhooks.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can insert webhooks for their widgets" ON widget_webhooks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_webhooks.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can update webhooks for their widgets" ON widget_webhooks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_webhooks.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can delete webhooks for their widgets" ON widget_webhooks FOR DELETE USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_webhooks.widget_id AND widgets.user_id = auth.uid())
);

-- Widget custom fields policies
CREATE POLICY "Users can view custom fields for their widgets" ON widget_custom_fields FOR SELECT USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_custom_fields.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can insert custom fields for their widgets" ON widget_custom_fields FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_custom_fields.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can update custom fields for their widgets" ON widget_custom_fields FOR UPDATE USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_custom_fields.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can delete custom fields for their widgets" ON widget_custom_fields FOR DELETE USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_custom_fields.widget_id AND widgets.user_id = auth.uid())
);

-- Widget auto-responders policies
CREATE POLICY "Users can view auto-responders for their widgets" ON widget_auto_responders FOR SELECT USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_auto_responders.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can insert auto-responders for their widgets" ON widget_auto_responders FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_auto_responders.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can update auto-responders for their widgets" ON widget_auto_responders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_auto_responders.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can delete auto-responders for their widgets" ON widget_auto_responders FOR DELETE USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_auto_responders.widget_id AND widgets.user_id = auth.uid())
);

-- Widget working hours policies
CREATE POLICY "Users can view working hours for their widgets" ON widget_working_hours FOR SELECT USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_working_hours.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can insert working hours for their widgets" ON widget_working_hours FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_working_hours.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can update working hours for their widgets" ON widget_working_hours FOR UPDATE USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_working_hours.widget_id AND widgets.user_id = auth.uid())
);
CREATE POLICY "Users can delete working hours for their widgets" ON widget_working_hours FOR DELETE USING (
  EXISTS (SELECT 1 FROM widgets WHERE widgets.id = widget_working_hours.widget_id AND widgets.user_id = auth.uid())
);

-- Functions for widget analytics
CREATE OR REPLACE FUNCTION get_widget_analytics(widget_id UUID)
RETURNS TABLE (
  total_conversations BIGINT,
  total_messages BIGINT,
  total_visitors BIGINT,
  average_response_time NUMERIC,
  satisfaction_score NUMERIC,
  resolution_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(wa.total_conversations), 0)::BIGINT as total_conversations,
    COALESCE(SUM(wa.total_messages), 0)::BIGINT as total_messages,
    COALESCE(SUM(wa.total_visitors), 0)::BIGINT as total_visitors,
    COALESCE(AVG(wa.average_response_time), 0)::NUMERIC as average_response_time,
    COALESCE(AVG(wa.satisfaction_score), 0)::NUMERIC as satisfaction_score,
    COALESCE(AVG(wa.resolution_rate), 0)::NUMERIC as resolution_rate
  FROM widget_analytics wa
  WHERE wa.widget_id = get_widget_analytics.widget_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create widget session
CREATE OR REPLACE FUNCTION create_widget_session(
  p_widget_id UUID,
  p_customer_data JSONB DEFAULT '{}',
  p_department VARCHAR(100) DEFAULT 'general',
  p_language VARCHAR(10) DEFAULT 'en',
  p_timezone VARCHAR(50) DEFAULT 'UTC'
)
RETURNS TABLE (
  session_id UUID,
  session_token VARCHAR(255)
) AS $$
DECLARE
  v_session_id UUID;
  v_session_token VARCHAR(255);
BEGIN
  -- Generate session token
  v_session_token := encode(gen_random_bytes(32), 'hex');
  
  -- Create session
  INSERT INTO widget_sessions (
    widget_id, 
    session_token, 
    customer_data, 
    department, 
    language, 
    timezone
  ) VALUES (
    p_widget_id, 
    v_session_token, 
    p_customer_data, 
    p_department, 
    p_language, 
    p_timezone
  ) RETURNING id INTO v_session_id;
  
  RETURN QUERY SELECT v_session_id, v_session_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add message to session
CREATE OR REPLACE FUNCTION add_widget_message(
  p_session_id UUID,
  p_sender_type VARCHAR(20),
  p_message TEXT,
  p_message_type VARCHAR(20) DEFAULT 'text',
  p_attachments JSONB DEFAULT '[]',
  p_sender_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_message_id UUID;
BEGIN
  INSERT INTO widget_messages (
    session_id,
    sender_type,
    sender_id,
    message,
    message_type,
    attachments
  ) VALUES (
    p_session_id,
    p_sender_type,
    p_sender_id,
    p_message,
    p_message_type,
    p_attachments
  ) RETURNING id INTO v_message_id;
  
  RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get widget configuration
CREATE OR REPLACE FUNCTION get_widget_config(p_widget_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_config JSONB;
BEGIN
  SELECT config INTO v_config
  FROM widgets
  WHERE id = p_widget_id AND status = 'active';
  
  RETURN COALESCE(v_config, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for testing
INSERT INTO widget_templates (name, description, integration_type, template_code, variables, is_public, created_by) VALUES
(
  'Basic Floating Widget',
  'A simple floating chat widget for websites',
  'widget',
  '// Basic floating widget template code here',
  '["widgetId", "title", "primaryColor", "position"]',
  true,
  NULL
),
(
  'API Integration Template',
  'REST API integration template for custom implementations',
  'api',
  '// API integration template code here',
  '["baseUrl", "apiKey", "widgetId"]',
  true,
  NULL
),
(
  'Webhook Integration Template',
  'Webhook integration template for server-side implementations',
  'webhook',
  '// Webhook integration template code here',
  '["webhookUrl", "webhookSecret"]',
  true,
  NULL
); 