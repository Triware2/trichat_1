-- Create API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  key TEXT NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  permissions TEXT[] DEFAULT '{}',
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  ip_whitelist TEXT[] DEFAULT '{}',
  rate_limit INTEGER,
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Security Settings table
CREATE TABLE IF NOT EXISTS security_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  session_timeout INTEGER DEFAULT 30,
  ip_whitelist TEXT[] DEFAULT '{}',
  encryption_level VARCHAR(50) DEFAULT 'standard' CHECK (encryption_level IN ('standard', 'enhanced', 'enterprise')),
  audit_logging BOOLEAN DEFAULT TRUE,
  data_retention INTEGER DEFAULT 90,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_email VARCHAR(255),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  severity VARCHAR(50) DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  resource_type VARCHAR(100),
  resource_id UUID,
  session_id VARCHAR(255)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(status);
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON api_keys(created_at);
CREATE INDEX IF NOT EXISTS idx_api_keys_created_by ON api_keys(created_by);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Insert default security settings
INSERT INTO security_settings (id, mfa_enabled, session_timeout, encryption_level, audit_logging, data_retention)
VALUES (
  gen_random_uuid(),
  FALSE,
  30,
  'standard',
  TRUE,
  90
) ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for API Keys
CREATE POLICY "Users can view their own API keys" ON api_keys
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own API keys" ON api_keys
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own API keys" ON api_keys
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own API keys" ON api_keys
  FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for Security Settings (admin only)
CREATE POLICY "Admins can manage security settings" ON security_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create RLS policies for Audit Logs (admin only)
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_api_keys_updated_at 
  BEFORE UPDATE ON api_keys 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_settings_updated_at 
  BEFORE UPDATE ON security_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to log API key usage
CREATE OR REPLACE FUNCTION log_api_key_usage(key_id UUID, ip_address INET)
RETURNS VOID AS $$
BEGIN
  UPDATE api_keys 
  SET 
    last_used = NOW(),
    usage_count = usage_count + 1
  WHERE id = key_id;
  
  INSERT INTO audit_logs (action, user_id, ip_address, details, severity, resource_type, resource_id)
  VALUES (
    'api_key_used',
    (SELECT created_by FROM api_keys WHERE id = key_id),
    ip_address,
    jsonb_build_object('api_key_id', key_id, 'key_name', (SELECT name FROM api_keys WHERE id = key_id)),
    'low',
    'api_key',
    key_id
  );
END;
$$ LANGUAGE plpgsql; 