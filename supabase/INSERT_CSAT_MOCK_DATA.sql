-- CSAT Mock Data Insertion Script
-- Run this after CREATE_CSAT_SCHEMA.sql to populate the system with realistic data

-- Insert sample surveys with more realistic data
INSERT INTO csat_surveys (name, type, description, channels, triggers, questions, is_active, settings, created_by) VALUES
(
  'Post-Chat Customer Satisfaction',
  'CSAT',
  'Measure customer satisfaction after live chat interactions to improve service quality',
  ARRAY['in-app', 'email', 'chat'],
  '[
    {"type": "chat_completion", "delay_minutes": 5},
    {"type": "resolution", "delay_minutes": 30}
  ]',
  '[
    {"id": "q1", "type": "rating", "question": "How satisfied were you with our support?", "scale": "1-5"},
    {"id": "q2", "type": "text", "question": "What could we have done better?", "required": false},
    {"id": "q3", "type": "multiple_choice", "question": "Would you recommend us to others?", "options": ["Yes", "No", "Maybe"]}
  ]',
  true,
  '{"auto_send": true, "reminder_days": 3, "escalation_threshold": 3}',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Net Promoter Score Survey',
  'NPS',
  'Track customer loyalty and likelihood to recommend our services',
  ARRAY['email', 'sms', 'in-app'],
  '[
    {"type": "purchase", "delay_minutes": 60},
    {"type": "subscription_renewal", "delay_minutes": 1440}
  ]',
  '[
    {"id": "q1", "type": "rating", "question": "How likely are you to recommend us to a friend or colleague?", "scale": "0-10"},
    {"id": "q2", "type": "text", "question": "What is the primary reason for your score?", "required": false},
    {"id": "q3", "type": "text", "question": "What could we do to improve your experience?", "required": false}
  ]',
  true,
  '{"auto_send": true, "reminder_days": 7, "escalation_threshold": 6}',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Support Effort Score',
  'CES',
  'Measure how easy it was for customers to get their issues resolved',
  ARRAY['email', 'chat'],
  '[
    {"type": "ticket_resolution", "delay_minutes": 15},
    {"type": "chat_completion", "delay_minutes": 10}
  ]',
  '[
    {"id": "q1", "type": "rating", "question": "How easy was it to get your issue resolved?", "scale": "1-7"},
    {"id": "q2", "type": "text", "question": "What made it easy or difficult?", "required": false},
    {"id": "q3", "type": "multiple_choice", "question": "How many contacts did it take to resolve?", "options": ["1", "2", "3", "4+"]}
  ]',
  true,
  '{"auto_send": true, "reminder_days": 1, "escalation_threshold": 4}',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Product Feedback Survey',
  'CSAT',
  'Gather feedback on new product features and overall product satisfaction',
  ARRAY['in-app', 'email'],
  '[
    {"type": "feature_usage", "delay_minutes": 1440},
    {"type": "app_session", "delay_minutes": 30}
  ]',
  '[
    {"id": "q1", "type": "rating", "question": "How satisfied are you with our product?", "scale": "1-5"},
    {"id": "q2", "type": "text", "question": "What features do you like most?", "required": false},
    {"id": "q3", "type": "text", "question": "What features would you like to see added?", "required": false}
  ]',
  true,
  '{"auto_send": true, "reminder_days": 14, "escalation_threshold": 3}',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Onboarding Experience',
  'NPS',
  'Evaluate the effectiveness of our customer onboarding process',
  ARRAY['email', 'in-app'],
  '[
    {"type": "onboarding_completion", "delay_minutes": 2880},
    {"type": "first_feature_usage", "delay_minutes": 1440}
  ]',
  '[
    {"id": "q1", "type": "rating", "question": "How likely are you to recommend our onboarding to others?", "scale": "0-10"},
    {"id": "q2", "type": "text", "question": "What was most helpful during onboarding?", "required": false},
    {"id": "q3", "type": "text", "question": "What could we improve in the onboarding process?", "required": false}
  ]',
  true,
  '{"auto_send": true, "reminder_days": 5, "escalation_threshold": 7}',
  (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT DO NOTHING;

-- Insert sample responses with realistic data
INSERT INTO csat_responses (survey_id, customer_id, agent_id, channel, responses, overall_rating, sentiment, feedback_text, themes, keywords, submitted_at) VALUES
-- Post-Chat CSAT Responses
(
  (SELECT id FROM csat_surveys WHERE name = 'Post-Chat Customer Satisfaction' LIMIT 1),
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE role = 'agent' LIMIT 1),
  'chat',
  '[{"question_id": "q1", "answer": 5}, {"question_id": "q2", "answer": "Great service, very helpful!"}, {"question_id": "q3", "answer": "Yes"}]',
  5,
  'positive',
  'Great service, very helpful! The agent was knowledgeable and resolved my issue quickly.',
  ARRAY['excellent service', 'quick resolution', 'knowledgeable agent'],
  ARRAY['helpful', 'quick', 'knowledgeable', 'excellent'],
  NOW() - INTERVAL '2 hours'
),
(
  (SELECT id FROM csat_surveys WHERE name = 'Post-Chat Customer Satisfaction' LIMIT 1),
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE role = 'agent' LIMIT 1),
  'chat',
  '[{"question_id": "q1", "answer": 4}, {"question_id": "q2", "answer": "Good but could be faster"}, {"question_id": "q3", "answer": "Yes"}]',
  4,
  'positive',
  'Good but could be faster. The agent was helpful but the wait time was a bit long.',
  ARRAY['good service', 'slow response', 'helpful agent'],
  ARRAY['good', 'slow', 'helpful', 'wait'],
  NOW() - INTERVAL '4 hours'
),
(
  (SELECT id FROM csat_surveys WHERE name = 'Post-Chat Customer Satisfaction' LIMIT 1),
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE role = 'agent' LIMIT 1),
  'chat',
  '[{"question_id": "q1", "answer": 2}, {"question_id": "q2", "answer": "Agent was not helpful"}, {"question_id": "q3", "answer": "No"}]',
  2,
  'negative',
  'Agent was not helpful at all. They didn''t understand my problem and kept asking the same questions.',
  ARRAY['unhelpful agent', 'poor communication', 'frustrating experience'],
  ARRAY['unhelpful', 'poor', 'frustrating', 'confusing'],
  NOW() - INTERVAL '6 hours'
),
(
  (SELECT id FROM csat_surveys WHERE name = 'Post-Chat Customer Satisfaction' LIMIT 1),
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE role = 'agent' LIMIT 1),
  'chat',
  '[{"question_id": "q1", "answer": 3}, {"question_id": "q2", "answer": "Average experience"}, {"question_id": "q3", "answer": "Maybe"}]',
  3,
  'neutral',
  'Average experience. The agent was okay but nothing special.',
  ARRAY['average service', 'mediocre experience'],
  ARRAY['average', 'okay', 'mediocre'],
  NOW() - INTERVAL '8 hours'
),
(
  (SELECT id FROM csat_surveys WHERE name = 'Post-Chat Customer Satisfaction' LIMIT 1),
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE role = 'agent' LIMIT 1),
  'chat',
  '[{"question_id": "q1", "answer": 5}, {"question_id": "q2", "answer": "Outstanding support!"}, {"question_id": "q3", "answer": "Yes"}]',
  5,
  'positive',
  'Outstanding support! The agent went above and beyond to help me. Very impressed!',
  ARRAY['outstanding support', 'above and beyond', 'excellent service'],
  ARRAY['outstanding', 'excellent', 'impressed', 'beyond'],
  NOW() - INTERVAL '12 hours'
),

-- NPS Survey Responses
(
  (SELECT id FROM csat_surveys WHERE name = 'Net Promoter Score Survey' LIMIT 1),
  gen_random_uuid(),
  NULL,
  'email',
  '[{"question_id": "q1", "answer": 9}, {"question_id": "q2", "answer": "Great product and service"}, {"question_id": "q3", "answer": "Keep innovating"}]',
  9,
  'positive',
  'Great product and service. I love how easy it is to use and the customer support is excellent.',
  ARRAY['great product', 'easy to use', 'excellent support'],
  ARRAY['great', 'easy', 'excellent', 'love'],
  NOW() - INTERVAL '1 day'
),
(
  (SELECT id FROM csat_surveys WHERE name = 'Net Promoter Score Survey' LIMIT 1),
  gen_random_uuid(),
  NULL,
  'email',
  '[{"question_id": "q1", "answer": 7}, {"question_id": "q2", "answer": "Good but expensive"}, {"question_id": "q3", "answer": "Lower prices"}]',
  7,
  'positive',
  'Good but expensive. The product is great but the pricing could be more competitive.',
  ARRAY['good product', 'expensive pricing', 'competitive pricing'],
  ARRAY['good', 'expensive', 'competitive', 'pricing'],
  NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM csat_surveys WHERE name = 'Net Promoter Score Survey' LIMIT 1),
  gen_random_uuid(),
  NULL,
  'email',
  '[{"question_id": "q1", "answer": 4}, {"question_id": "q2", "answer": "Too many bugs"}, {"question_id": "q3", "answer": "Fix bugs"}]',
  4,
  'negative',
  'Too many bugs and glitches. The product has potential but needs better quality control.',
  ARRAY['bugs and glitches', 'quality issues', 'needs improvement'],
  ARRAY['bugs', 'glitches', 'quality', 'improvement'],
  NOW() - INTERVAL '3 days'
),

-- CES Survey Responses
(
  (SELECT id FROM csat_surveys WHERE name = 'Support Effort Score' LIMIT 1),
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE role = 'agent' LIMIT 1),
  'chat',
  '[{"question_id": "q1", "answer": 2}, {"question_id": "q2", "answer": "Very easy, one contact"}, {"question_id": "q3", "answer": "1"}]',
  2,
  'positive',
  'Very easy, one contact and my issue was resolved immediately. Great experience!',
  ARRAY['very easy', 'one contact', 'immediate resolution'],
  ARRAY['easy', 'immediate', 'resolved', 'great'],
  NOW() - INTERVAL '1 day'
),
(
  (SELECT id FROM csat_surveys WHERE name = 'Support Effort Score' LIMIT 1),
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE role = 'agent' LIMIT 1),
  'chat',
  '[{"question_id": "q1", "answer": 5}, {"question_id": "q2", "answer": "Had to contact multiple times"}, {"question_id": "q3", "answer": "3"}]',
  5,
  'negative',
  'Had to contact multiple times and was transferred between departments. Very frustrating.',
  ARRAY['multiple contacts', 'department transfers', 'frustrating experience'],
  ARRAY['multiple', 'transfers', 'frustrating', 'departments'],
  NOW() - INTERVAL '2 days'
),

-- Product Feedback Responses
(
  (SELECT id FROM csat_surveys WHERE name = 'Product Feedback Survey' LIMIT 1),
  gen_random_uuid(),
  NULL,
  'in-app',
  '[{"question_id": "q1", "answer": 5}, {"question_id": "q2", "answer": "Love the dashboard"}, {"question_id": "q3", "answer": "Mobile app"}]',
  5,
  'positive',
  'Love the dashboard and analytics features. Would love to see a mobile app version.',
  ARRAY['love dashboard', 'analytics features', 'mobile app request'],
  ARRAY['love', 'dashboard', 'analytics', 'mobile'],
  NOW() - INTERVAL '3 days'
),
(
  (SELECT id FROM csat_surveys WHERE name = 'Product Feedback Survey' LIMIT 1),
  gen_random_uuid(),
  NULL,
  'in-app',
  '[{"question_id": "q1", "answer": 3}, {"question_id": "q2", "answer": "Interface is okay"}, {"question_id": "q3", "answer": "Better UI"}]',
  3,
  'neutral',
  'Interface is okay but could be more intuitive. The features are good but the UI needs work.',
  ARRAY['okay interface', 'needs better UI', 'good features'],
  ARRAY['okay', 'intuitive', 'UI', 'features'],
  NOW() - INTERVAL '4 days'
),

-- Onboarding Experience Responses
(
  (SELECT id FROM csat_surveys WHERE name = 'Onboarding Experience' LIMIT 1),
  gen_random_uuid(),
  NULL,
  'email',
  '[{"question_id": "q1", "answer": 8}, {"question_id": "q2", "answer": "Video tutorials were great"}, {"question_id": "q3", "answer": "More examples"}]',
  8,
  'positive',
  'Video tutorials were great and helped me get started quickly. Would like more examples though.',
  ARRAY['great tutorials', 'quick start', 'more examples needed'],
  ARRAY['tutorials', 'quick', 'examples', 'started'],
  NOW() - INTERVAL '5 days'
),
(
  (SELECT id FROM csat_surveys WHERE name = 'Onboarding Experience' LIMIT 1),
  gen_random_uuid(),
  NULL,
  'email',
  '[{"question_id": "q1", "answer": 6}, {"question_id": "q2", "answer": "Documentation was helpful"}, {"question_id": "q3", "answer": "Live demo"}]',
  6,
  'positive',
  'Documentation was helpful but would have preferred a live demo to see the product in action.',
  ARRAY['helpful documentation', 'live demo request'],
  ARRAY['documentation', 'helpful', 'demo', 'live'],
  NOW() - INTERVAL '6 days'
)
ON CONFLICT DO NOTHING;

-- Insert sample agent performance data
INSERT INTO csat_agent_performance (agent_id, survey_id, date, average_rating, total_responses, sentiment_breakdown, improvement_areas, strengths) VALUES
(
  (SELECT id FROM profiles WHERE role = 'agent' LIMIT 1),
  (SELECT id FROM csat_surveys WHERE name = 'Post-Chat Customer Satisfaction' LIMIT 1),
  CURRENT_DATE - INTERVAL '1 day',
  4.2,
  5,
  '{"positive": 3, "neutral": 1, "negative": 1}',
  ARRAY['Response time', 'Technical knowledge'],
  ARRAY['Communication skills', 'Problem solving', 'Patience']
),
(
  (SELECT id FROM profiles WHERE role = 'agent' LIMIT 1),
  (SELECT id FROM csat_surveys WHERE name = 'Post-Chat Customer Satisfaction' LIMIT 1),
  CURRENT_DATE - INTERVAL '2 days',
  4.5,
  3,
  '{"positive": 2, "neutral": 1, "negative": 0}',
  ARRAY['Documentation'],
  ARRAY['Quick resolution', 'Customer empathy', 'Technical expertise']
),
(
  (SELECT id FROM profiles WHERE role = 'agent' LIMIT 1),
  (SELECT id FROM csat_surveys WHERE name = 'Support Effort Score' LIMIT 1),
  CURRENT_DATE - INTERVAL '1 day',
  3.5,
  2,
  '{"positive": 1, "neutral": 0, "negative": 1}',
  ARRAY['First contact resolution', 'Escalation process'],
  ARRAY['Professionalism', 'Follow-up']
)
ON CONFLICT DO NOTHING;

-- Insert sample department performance data
INSERT INTO csat_department_performance (department, survey_id, date, average_rating, total_responses, sentiment_breakdown, trend) VALUES
(
  'Customer Support',
  (SELECT id FROM csat_surveys WHERE name = 'Post-Chat Customer Satisfaction' LIMIT 1),
  CURRENT_DATE - INTERVAL '1 day',
  4.2,
  5,
  '{"positive": 3, "neutral": 1, "negative": 1}',
  'up'
),
(
  'Technical Support',
  (SELECT id FROM csat_surveys WHERE name = 'Support Effort Score' LIMIT 1),
  CURRENT_DATE - INTERVAL '1 day',
  3.5,
  2,
  '{"positive": 1, "neutral": 0, "negative": 1}',
  'neutral'
),
(
  'Product Team',
  (SELECT id FROM csat_surveys WHERE name = 'Product Feedback Survey' LIMIT 1),
  CURRENT_DATE - INTERVAL '3 days',
  4.0,
  2,
  '{"positive": 1, "neutral": 1, "negative": 0}',
  'up'
)
ON CONFLICT DO NOTHING;

-- Insert sample feedback themes
INSERT INTO csat_feedback_themes (theme, sentiment, keywords, count, change_percentage, examples) VALUES
(
  'excellent service',
  'positive',
  ARRAY['excellent', 'great', 'outstanding', 'amazing'],
  3,
  15.5,
  ARRAY['Great service, very helpful!', 'Outstanding support!', 'Excellent customer service']
),
(
  'slow response',
  'negative',
  ARRAY['slow', 'wait', 'delay', 'time'],
  2,
  -8.2,
  ARRAY['Good but could be faster', 'Had to wait too long']
),
(
  'unhelpful agent',
  'negative',
  ARRAY['unhelpful', 'poor', 'frustrating', 'confusing'],
  1,
  -12.0,
  ARRAY['Agent was not helpful at all']
),
(
  'easy to use',
  'positive',
  ARRAY['easy', 'simple', 'intuitive', 'user-friendly'],
  2,
  5.3,
  ARRAY['Very easy, one contact', 'Love how easy it is to use']
),
(
  'bugs and glitches',
  'negative',
  ARRAY['bugs', 'glitches', 'issues', 'problems'],
  1,
  -3.1,
  ARRAY['Too many bugs and glitches']
),
(
  'great product',
  'positive',
  ARRAY['great', 'good', 'love', 'excellent'],
  2,
  8.7,
  ARRAY['Great product and service', 'Love the dashboard']
),
(
  'expensive pricing',
  'neutral',
  ARRAY['expensive', 'cost', 'price', 'pricing'],
  1,
  2.1,
  ARRAY['Good but expensive']
),
(
  'helpful tutorials',
  'positive',
  ARRAY['tutorials', 'helpful', 'documentation', 'guide'],
  2,
  6.4,
  ARRAY['Video tutorials were great', 'Documentation was helpful']
)
ON CONFLICT DO NOTHING;

-- Insert sample notifications
INSERT INTO csat_notifications (type, title, message, severity, recipient_id, survey_id, response_id, is_read) VALUES
(
  'low_rating',
  'Low CSAT Score Alert',
  'A customer gave a 2-star rating for Post-Chat CSAT survey. Consider reviewing the interaction.',
  'medium',
  (SELECT id FROM profiles WHERE role = 'agent' LIMIT 1),
  (SELECT id FROM csat_surveys WHERE name = 'Post-Chat Customer Satisfaction' LIMIT 1),
  (SELECT id FROM csat_responses WHERE overall_rating = 2 LIMIT 1),
  false
),
(
  'trend_alert',
  'Positive CSAT Trend',
  'Your CSAT scores have improved by 15% over the last week. Great job!',
  'low',
  (SELECT id FROM profiles WHERE role = 'agent' LIMIT 1),
  NULL,
  NULL,
  false
),
(
  'response_rate',
  'Low Response Rate',
  'Your NPS survey response rate has dropped to 12%. Consider reviewing your survey timing.',
  'high',
  (SELECT id FROM profiles WHERE role = 'agent' LIMIT 1),
  (SELECT id FROM csat_surveys WHERE name = 'Net Promoter Score Survey' LIMIT 1),
  NULL,
  false
)
ON CONFLICT DO NOTHING;

-- Update CSAT settings with more realistic values
UPDATE csat_settings SET
  auto_surveys = true,
  sentiment_monitoring = true,
  real_time_alerts = true,
  escalation_threshold = 2.5,
  response_rate_target = 75,
  email_notifications = true,
  sms_notifications = false,
  in_app_notifications = true,
  survey_delay = 30,
  reminder_frequency = 7,
  notification_recipients = '["admin@company.com", "support@company.com"]',
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users LIMIT 1);

-- Insert additional CSAT settings if none exist
INSERT INTO csat_settings (user_id, auto_surveys, sentiment_monitoring, real_time_alerts, escalation_threshold, response_rate_target, email_notifications, sms_notifications, in_app_notifications, survey_delay, reminder_frequency, notification_recipients)
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  true,
  true,
  true,
  2.5,
  75,
  true,
  false,
  true,
  30,
  7,
  '["admin@company.com", "support@company.com"]'
WHERE NOT EXISTS (SELECT 1 FROM csat_settings WHERE user_id = (SELECT id FROM auth.users LIMIT 1));

-- Display summary of inserted data
SELECT 
  'CSAT Surveys' as table_name,
  COUNT(*) as record_count
FROM csat_surveys
UNION ALL
SELECT 
  'CSAT Responses',
  COUNT(*)
FROM csat_responses
UNION ALL
SELECT 
  'Agent Performance',
  COUNT(*)
FROM csat_agent_performance
UNION ALL
SELECT 
  'Department Performance',
  COUNT(*)
FROM csat_department_performance
UNION ALL
SELECT 
  'Feedback Themes',
  COUNT(*)
FROM csat_feedback_themes
UNION ALL
SELECT 
  'Notifications',
  COUNT(*)
FROM csat_notifications; 