-- CSAT Management Database Schema
-- Run this SQL in your Supabase SQL editor to create all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CSAT Surveys Table
CREATE TABLE IF NOT EXISTS csat_surveys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('CSAT', 'NPS', 'CES')),
    description TEXT,
    channels TEXT[] DEFAULT '{}',
    triggers JSONB DEFAULT '[]',
    questions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- CSAT Survey Responses Table
CREATE TABLE IF NOT EXISTS csat_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    survey_id UUID REFERENCES csat_surveys(id) ON DELETE CASCADE,
    customer_id UUID, -- Optional, no foreign key constraint
    agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    ticket_id UUID, -- Optional, no foreign key constraint
    chat_id UUID, -- Optional, no foreign key constraint
    channel VARCHAR(50) NOT NULL,
    responses JSONB NOT NULL DEFAULT '[]',
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 10),
    sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    feedback_text TEXT,
    themes TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- CSAT Analytics Table
CREATE TABLE IF NOT EXISTS csat_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    survey_id UUID REFERENCES csat_surveys(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    average_rating DECIMAL(3,2),
    total_responses INTEGER DEFAULT 0,
    response_rate DECIMAL(5,2),
    sentiment_breakdown JSONB DEFAULT '{"positive": 0, "neutral": 0, "negative": 0}',
    theme_analysis JSONB DEFAULT '{}',
    agent_performance JSONB DEFAULT '{}',
    department_performance JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(survey_id, date)
);

-- CSAT Settings Table
CREATE TABLE IF NOT EXISTS csat_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    auto_surveys BOOLEAN DEFAULT true,
    sentiment_monitoring BOOLEAN DEFAULT true,
    real_time_alerts BOOLEAN DEFAULT true,
    escalation_threshold DECIMAL(3,2) DEFAULT 2.0,
    response_rate_target INTEGER DEFAULT 70,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    in_app_notifications BOOLEAN DEFAULT true,
    survey_delay INTEGER DEFAULT 30, -- minutes
    reminder_frequency INTEGER DEFAULT 7, -- days
    notification_recipients JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- CSAT Feedback Themes Table
CREATE TABLE IF NOT EXISTS csat_feedback_themes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    theme VARCHAR(255) NOT NULL,
    sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    keywords TEXT[] DEFAULT '{}',
    count INTEGER DEFAULT 0,
    change_percentage DECIMAL(5,2) DEFAULT 0,
    examples TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CSAT Agent Performance Table
CREATE TABLE IF NOT EXISTS csat_agent_performance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    survey_id UUID REFERENCES csat_surveys(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    average_rating DECIMAL(3,2),
    total_responses INTEGER DEFAULT 0,
    sentiment_breakdown JSONB DEFAULT '{"positive": 0, "neutral": 0, "negative": 0}',
    improvement_areas TEXT[] DEFAULT '{}',
    strengths TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, survey_id, date)
);

-- CSAT Department Performance Table
CREATE TABLE IF NOT EXISTS csat_department_performance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    department VARCHAR(255) NOT NULL,
    survey_id UUID REFERENCES csat_surveys(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    average_rating DECIMAL(3,2),
    total_responses INTEGER DEFAULT 0,
    sentiment_breakdown JSONB DEFAULT '{"positive": 0, "neutral": 0, "negative": 0}',
    trend VARCHAR(20) CHECK (trend IN ('up', 'down', 'neutral')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(department, survey_id, date)
);

-- CSAT Notifications Table
CREATE TABLE IF NOT EXISTS csat_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('low_rating', 'escalation', 'trend_alert', 'response_rate')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    survey_id UUID REFERENCES csat_surveys(id) ON DELETE SET NULL,
    response_id UUID REFERENCES csat_responses(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_csat_surveys_created_by ON csat_surveys(created_by);
CREATE INDEX IF NOT EXISTS idx_csat_surveys_active ON csat_surveys(is_active);
CREATE INDEX IF NOT EXISTS idx_csat_responses_survey ON csat_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_csat_responses_customer ON csat_responses(customer_id);
CREATE INDEX IF NOT EXISTS idx_csat_responses_agent ON csat_responses(agent_id);
CREATE INDEX IF NOT EXISTS idx_csat_responses_submitted ON csat_responses(submitted_at);
CREATE INDEX IF NOT EXISTS idx_csat_analytics_survey_date ON csat_analytics(survey_id, date);
CREATE INDEX IF NOT EXISTS idx_csat_agent_performance_agent ON csat_agent_performance(agent_id);
CREATE INDEX IF NOT EXISTS idx_csat_agent_performance_date ON csat_agent_performance(date);
CREATE INDEX IF NOT EXISTS idx_csat_department_performance_dept ON csat_department_performance(department);
CREATE INDEX IF NOT EXISTS idx_csat_department_performance_date ON csat_department_performance(date);
CREATE INDEX IF NOT EXISTS idx_csat_notifications_recipient ON csat_notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_csat_notifications_read ON csat_notifications(is_read);

-- Create RLS policies
ALTER TABLE csat_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE csat_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE csat_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE csat_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE csat_feedback_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE csat_agent_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE csat_department_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE csat_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for csat_surveys
CREATE POLICY "Users can view surveys they created" ON csat_surveys
    FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can manage surveys they created" ON csat_surveys
    FOR ALL USING (created_by = auth.uid());

-- RLS Policies for csat_responses
CREATE POLICY "Users can view responses for their surveys" ON csat_responses
    FOR SELECT USING (
        survey_id IN (
            SELECT id FROM csat_surveys WHERE created_by = auth.uid()
        )
    );

CREATE POLICY "Users can insert responses" ON csat_responses
    FOR INSERT WITH CHECK (true);

-- RLS Policies for csat_analytics
CREATE POLICY "Users can view analytics for their surveys" ON csat_analytics
    FOR SELECT USING (
        survey_id IN (
            SELECT id FROM csat_surveys WHERE created_by = auth.uid()
        )
    );

-- RLS Policies for csat_settings
CREATE POLICY "Users can manage their own CSAT settings" ON csat_settings
    FOR ALL USING (user_id = auth.uid());

-- RLS Policies for csat_agent_performance
CREATE POLICY "Users can view agent performance for their surveys" ON csat_agent_performance
    FOR SELECT USING (
        survey_id IN (
            SELECT id FROM csat_surveys WHERE created_by = auth.uid()
        )
    );

-- RLS Policies for csat_department_performance
CREATE POLICY "Users can view department performance for their surveys" ON csat_department_performance
    FOR SELECT USING (
        survey_id IN (
            SELECT id FROM csat_surveys WHERE created_by = auth.uid()
        )
    );

-- RLS Policies for csat_notifications
CREATE POLICY "Users can view their own notifications" ON csat_notifications
    FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON csat_notifications
    FOR UPDATE USING (recipient_id = auth.uid());

-- Create functions for CSAT analytics
CREATE OR REPLACE FUNCTION get_csat_stats(
    p_user_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'averageCSAT', COALESCE(AVG(cr.overall_rating), 0),
        'averageNPS', COALESCE(AVG(CASE WHEN cs.type = 'NPS' THEN cr.overall_rating END), 0),
        'averageCES', COALESCE(AVG(CASE WHEN cs.type = 'CES' THEN cr.overall_rating END), 0),
        'responseRate', COALESCE(
            (COUNT(cr.id)::DECIMAL / NULLIF(COUNT(DISTINCT cr.chat_id), 0)) * 100, 0
        ),
        'totalResponses', COUNT(cr.id),
        'sentimentBreakdown', jsonb_build_object(
            'positive', COUNT(CASE WHEN cr.sentiment = 'positive' THEN 1 END),
            'neutral', COUNT(CASE WHEN cr.sentiment = 'neutral' THEN 1 END),
            'negative', COUNT(CASE WHEN cr.sentiment = 'negative' THEN 1 END)
        ),
        'trendData', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'date', date_series.date,
                    'csat', COALESCE(daily_stats.avg_rating, 0),
                    'nps', COALESCE(daily_stats.avg_nps, 0),
                    'ces', COALESCE(daily_stats.avg_ces, 0)
                )
            )
            FROM (
                SELECT generate_series(p_start_date, p_end_date, '1 day'::interval)::date as date
            ) date_series
            LEFT JOIN (
                SELECT 
                    DATE(cr.submitted_at) as response_date,
                    AVG(CASE WHEN cs.type = 'CSAT' THEN cr.overall_rating END) as avg_rating,
                    AVG(CASE WHEN cs.type = 'NPS' THEN cr.overall_rating END) as avg_nps,
                    AVG(CASE WHEN cs.type = 'CES' THEN cr.overall_rating END) as avg_ces
                FROM csat_responses cr
                JOIN csat_surveys cs ON cr.survey_id = cs.id
                WHERE cs.created_by = p_user_id
                AND cr.submitted_at >= p_start_date
                AND cr.submitted_at <= p_end_date
                GROUP BY DATE(cr.submitted_at)
            ) daily_stats ON date_series.date = daily_stats.response_date
        )
    ) INTO result
    FROM csat_responses cr
    JOIN csat_surveys cs ON cr.survey_id = cs.id
    WHERE cs.created_by = p_user_id
    AND cr.submitted_at >= p_start_date
    AND cr.submitted_at <= p_end_date;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get agent CSAT performance
CREATE OR REPLACE FUNCTION get_agent_csat_performance(
    p_user_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    agent_id UUID,
    agent_name TEXT,
    average_rating DECIMAL(3,2),
    total_responses INTEGER,
    sentiment_breakdown JSONB,
    improvement_areas TEXT[],
    strengths TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as agent_id,
        p.full_name as agent_name,
        COALESCE(AVG(cr.overall_rating), 0) as average_rating,
        COUNT(cr.id) as total_responses,
        jsonb_build_object(
            'positive', COUNT(CASE WHEN cr.sentiment = 'positive' THEN 1 END),
            'neutral', COUNT(CASE WHEN cr.sentiment = 'neutral' THEN 1 END),
            'negative', COUNT(CASE WHEN cr.sentiment = 'negative' THEN 1 END)
        ) as sentiment_breakdown,
        ARRAY[]::TEXT[] as improvement_areas,
        ARRAY[]::TEXT[] as strengths
    FROM profiles p
    LEFT JOIN csat_responses cr ON p.id = cr.agent_id
    LEFT JOIN csat_surveys cs ON cr.survey_id = cs.id
    WHERE cs.created_by = p_user_id
    AND p.role = 'agent'
    AND (cr.submitted_at IS NULL OR (cr.submitted_at >= p_start_date AND cr.submitted_at <= p_end_date))
    GROUP BY p.id, p.full_name
    HAVING COUNT(cr.id) > 0
    ORDER BY average_rating DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get department CSAT performance
CREATE OR REPLACE FUNCTION get_department_csat_performance(
    p_user_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    department TEXT,
    average_rating DECIMAL(3,2),
    total_responses INTEGER,
    sentiment_breakdown JSONB,
    trend TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.department,
        COALESCE(AVG(cr.overall_rating), 0) as average_rating,
        COUNT(cr.id) as total_responses,
        jsonb_build_object(
            'positive', COUNT(CASE WHEN cr.sentiment = 'positive' THEN 1 END),
            'neutral', COUNT(CASE WHEN cr.sentiment = 'neutral' THEN 1 END),
            'negative', COUNT(CASE WHEN cr.sentiment = 'negative' THEN 1 END)
        ) as sentiment_breakdown,
        CASE 
            WHEN AVG(cr.overall_rating) > 4.0 THEN 'up'
            WHEN AVG(cr.overall_rating) < 3.0 THEN 'down'
            ELSE 'neutral'
        END as trend
    FROM profiles p
    LEFT JOIN csat_responses cr ON p.id = cr.agent_id
    LEFT JOIN csat_surveys cs ON cr.survey_id = cs.id
    WHERE cs.created_by = p_user_id
    AND p.role = 'agent'
    AND (cr.submitted_at IS NULL OR (cr.submitted_at >= p_start_date AND cr.submitted_at <= p_end_date))
    GROUP BY p.department
    HAVING COUNT(cr.id) > 0
    ORDER BY average_rating DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to analyze feedback themes
CREATE OR REPLACE FUNCTION analyze_feedback_themes(
    p_user_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    theme TEXT,
    count INTEGER,
    sentiment TEXT,
    keywords TEXT[],
    examples TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        unnest(cr.themes) as theme,
        COUNT(*) as count,
        cr.sentiment,
        array_agg(DISTINCT unnest(cr.keywords)) as keywords,
        array_agg(DISTINCT cr.feedback_text) FILTER (WHERE cr.feedback_text IS NOT NULL) as examples
    FROM csat_responses cr
    JOIN csat_surveys cs ON cr.survey_id = cs.id
    WHERE cs.created_by = p_user_id
    AND cr.submitted_at >= p_start_date
    AND cr.submitted_at <= p_end_date
    AND cr.themes IS NOT NULL
    GROUP BY unnest(cr.themes), cr.sentiment
    ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for testing
INSERT INTO csat_surveys (name, type, description, channels, is_active, created_by) VALUES
('Post-Chat CSAT', 'CSAT', 'Customer satisfaction survey after chat interactions', ARRAY['in-app', 'email'], true, (SELECT id FROM auth.users LIMIT 1)),
('NPS Survey', 'NPS', 'Net Promoter Score survey for overall experience', ARRAY['email', 'sms'], true, (SELECT id FROM auth.users LIMIT 1)),
('Support Effort Score', 'CES', 'Customer Effort Score for support interactions', ARRAY['email'], true, (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert sample CSAT settings
INSERT INTO csat_settings (user_id, auto_surveys, sentiment_monitoring, real_time_alerts) VALUES
((SELECT id FROM auth.users LIMIT 1), true, true, true)
ON CONFLICT DO NOTHING; 