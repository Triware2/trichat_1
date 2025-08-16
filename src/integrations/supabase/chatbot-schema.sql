-- Chatbot Management Tables

-- Create chatbots table
CREATE TABLE IF NOT EXISTS chatbots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('standard', 'llm')) DEFAULT 'llm',
  status TEXT CHECK (status IN ('active', 'inactive', 'training')) DEFAULT 'inactive',
  model TEXT,
  resolution_rate DECIMAL(5,2),
  total_chats INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE,
  sop_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  config JSONB,
  system_prompt TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Create chatbot_rules table
CREATE TABLE IF NOT EXISTS chatbot_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
  trigger TEXT NOT NULL,
  conditions JSONB,
  response TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Create chatbot_sops table
CREATE TABLE IF NOT EXISTS chatbot_sops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size DECIMAL(10,2),
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT CHECK (status IN ('processing', 'active', 'error')) DEFAULT 'processing',
  description TEXT,
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  processed_content TEXT
);

-- Create chatbot_conversations table
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  session_id TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  total_messages INTEGER DEFAULT 0,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  resolution_time INTEGER, -- in seconds
  status TEXT CHECK (status IN ('active', 'resolved', 'escalated')),
  metadata JSONB
);

-- Create chatbot_messages table
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
  sender_type TEXT CHECK (sender_type IN ('customer', 'bot', 'agent')) NOT NULL,
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'file', 'image', 'system')) DEFAULT 'text',
  confidence DECIMAL(3,2),
  intent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chatbots_created_by ON chatbots(created_by);
CREATE INDEX IF NOT EXISTS idx_chatbots_status ON chatbots(status);
CREATE INDEX IF NOT EXISTS idx_chatbot_rules_chatbot_id ON chatbot_rules(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_rules_active ON chatbot_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_chatbot_sops_chatbot_id ON chatbot_sops(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_sops_status ON chatbot_sops(status);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_chatbot_id ON chatbot_conversations(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_customer_id ON chatbot_conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_conversation_id ON chatbot_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_created_at ON chatbot_messages(created_at);

-- Enable Row Level Security
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view chatbots they created" ON chatbots
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can insert chatbots" ON chatbots
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update chatbots they created" ON chatbots
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete chatbots they created" ON chatbots
  FOR DELETE USING (created_by = auth.uid());

-- Similar policies for other tables
CREATE POLICY "Users can view chatbot rules for their chatbots" ON chatbot_rules
  FOR SELECT USING (
    chatbot_id IN (
      SELECT id FROM chatbots WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can insert chatbot rules" ON chatbot_rules
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update chatbot rules" ON chatbot_rules
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete chatbot rules" ON chatbot_rules
  FOR DELETE USING (created_by = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_chatbots_updated_at BEFORE UPDATE ON chatbots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chatbot_rules_updated_at BEFORE UPDATE ON chatbot_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 