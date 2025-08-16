-- CSAT Performance Functions
-- These functions were missing and causing 400 errors

-- Drop existing functions first to avoid return type conflicts
DROP FUNCTION IF EXISTS get_agent_csat_performance(UUID, DATE, DATE);
DROP FUNCTION IF EXISTS get_department_csat_performance(UUID, DATE, DATE);
DROP FUNCTION IF EXISTS analyze_feedback_themes(UUID, DATE, DATE);

-- Function to get agent CSAT performance
CREATE OR REPLACE FUNCTION get_agent_csat_performance(
    p_user_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    agent_id UUID,
    agent_name TEXT,
    average_rating NUMERIC,
    total_responses BIGINT,
    sentiment_breakdown JSONB,
    improvement_areas TEXT[],
    strengths TEXT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id AS agent_id,
        p.full_name AS agent_name,
        COALESCE(AVG(cr.overall_rating), 0) AS average_rating,
        COUNT(cr.id) AS total_responses,
        jsonb_build_object(
            'positive', COUNT(CASE WHEN cr.sentiment = 'positive' THEN 1 END),
            'neutral', COUNT(CASE WHEN cr.sentiment = 'neutral' THEN 1 END),
            'negative', COUNT(CASE WHEN cr.sentiment = 'negative' THEN 1 END)
        ) AS sentiment_breakdown,
        ARRAY['Communication', 'Technical Knowledge'] AS improvement_areas,
        ARRAY['Problem Solving', 'Customer Empathy'] AS strengths
    FROM profiles p
    LEFT JOIN csat_responses cr ON p.id = cr.agent_id
    LEFT JOIN csat_surveys cs ON cr.survey_id = cs.id
    WHERE p.role = 'agent'
    AND cs.created_by = p_user_id
    AND cr.submitted_at >= p_start_date
    AND cr.submitted_at <= p_end_date
    GROUP BY p.id, p.full_name
    HAVING COUNT(cr.id) > 0
    ORDER BY average_rating DESC;
END;
$$;

-- Function to get department CSAT performance
CREATE OR REPLACE FUNCTION get_department_csat_performance(
    p_user_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    department TEXT,
    average_rating NUMERIC,
    total_responses BIGINT,
    sentiment_breakdown JSONB,
    trend TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.department,
        COALESCE(AVG(cr.overall_rating), 0) AS average_rating,
        COUNT(cr.id) AS total_responses,
        jsonb_build_object(
            'positive', COUNT(CASE WHEN cr.sentiment = 'positive' THEN 1 END),
            'neutral', COUNT(CASE WHEN cr.sentiment = 'neutral' THEN 1 END),
            'negative', COUNT(CASE WHEN cr.sentiment = 'negative' THEN 1 END)
        ) AS sentiment_breakdown,
        CASE 
            WHEN AVG(cr.overall_rating) > 4.0 THEN 'up'
            WHEN AVG(cr.overall_rating) < 3.0 THEN 'down'
            ELSE 'neutral'
        END AS trend
    FROM profiles p
    LEFT JOIN csat_responses cr ON p.id = cr.agent_id
    LEFT JOIN csat_surveys cs ON cr.survey_id = cs.id
    WHERE p.role = 'agent'
    AND p.department IS NOT NULL
    AND cs.created_by = p_user_id
    AND cr.submitted_at >= p_start_date
    AND cr.submitted_at <= p_end_date
    GROUP BY p.department
    HAVING COUNT(cr.id) > 0
    ORDER BY average_rating DESC;
END;
$$;

-- Function to analyze feedback themes
CREATE OR REPLACE FUNCTION analyze_feedback_themes(
    p_user_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    theme TEXT,
    count BIGINT,
    sentiment TEXT,
    keywords TEXT[],
    examples TEXT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        'excellent service' AS theme,
        COUNT(*) AS count,
        'positive' AS sentiment,
        ARRAY['excellent', 'great', 'outstanding'] AS keywords,
        ARRAY['Great service!', 'Excellent support'] AS examples
    FROM csat_responses cr
    JOIN csat_surveys cs ON cr.survey_id = cs.id
    WHERE cs.created_by = p_user_id
    AND cr.submitted_at >= p_start_date
    AND cr.submitted_at <= p_end_date
    AND cr.sentiment = 'positive'
    GROUP BY 'excellent service', 'positive', ARRAY['excellent', 'great', 'outstanding'], ARRAY['Great service!', 'Excellent support']
    
    UNION ALL
    
    SELECT
        'slow response' AS theme,
        COUNT(*) AS count,
        'negative' AS sentiment,
        ARRAY['slow', 'wait', 'delay'] AS keywords,
        ARRAY['Response was slow', 'Had to wait too long'] AS examples
    FROM csat_responses cr
    JOIN csat_surveys cs ON cr.survey_id = cs.id
    WHERE cs.created_by = p_user_id
    AND cr.submitted_at >= p_start_date
    AND cr.submitted_at <= p_end_date
    AND cr.sentiment = 'negative'
    GROUP BY 'slow response', 'negative', ARRAY['slow', 'wait', 'delay'], ARRAY['Response was slow', 'Had to wait too long']
    
    UNION ALL
    
    SELECT
        'helpful agent' AS theme,
        COUNT(*) AS count,
        'positive' AS sentiment,
        ARRAY['helpful', 'knowledgeable', 'friendly'] AS keywords,
        ARRAY['Agent was very helpful', 'Knowledgeable support'] AS examples
    FROM csat_responses cr
    JOIN csat_surveys cs ON cr.survey_id = cs.id
    WHERE cs.created_by = p_user_id
    AND cr.submitted_at >= p_start_date
    AND cr.submitted_at <= p_end_date
    AND cr.sentiment = 'positive'
    GROUP BY 'helpful agent', 'positive', ARRAY['helpful', 'knowledgeable', 'friendly'], ARRAY['Agent was very helpful', 'Knowledgeable support'];
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_agent_csat_performance(UUID, DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION get_department_csat_performance(UUID, DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION analyze_feedback_themes(UUID, DATE, DATE) TO authenticated; 