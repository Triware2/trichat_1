-- Fix the get_chat_stats function to resolve ambiguous column reference
CREATE OR REPLACE FUNCTION get_chat_stats(user_id UUID, time_range INTERVAL DEFAULT INTERVAL '24 hours')
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_chats', COUNT(*),
        'active_chats', COUNT(*) FILTER (WHERE cc.status = 'active'),
        'waiting_chats', COUNT(*) FILTER (WHERE cc.status = 'queued'),
        'avg_response_time', AVG(cc.response_time),
        'channels_active', COUNT(DISTINCT cc.channel_id),
        'rules_active', (
            SELECT COUNT(*) FROM chat_rules 
            WHERE created_by = user_id AND is_active = true
        )
    ) INTO result
    FROM chat_conversations cc
    JOIN chat_channels ch ON ch.id = cc.channel_id
    WHERE ch.created_by = user_id
    AND cc.created_at >= NOW() - time_range;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 