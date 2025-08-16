# CSAT Database Setup Guide

## 🚀 Quick Setup Instructions

### Step 1: Run the Database Schema
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy the entire content from `CREATE_CSAT_SCHEMA.sql`
4. Paste it into the SQL editor
5. Click **Run** to execute the script

### Step 2: Add Mock Data (Optional but Recommended)
1. Copy the entire content from `INSERT_CSAT_MOCK_DATA.sql`
2. Paste it into the SQL editor
3. Click **Run** to populate with realistic sample data

### Step 3: Verify Setup
After running both scripts, you should see:
- ✅ All CSAT tables created successfully
- ✅ RLS policies enabled
- ✅ Database functions created
- ✅ Sample data inserted (if you ran the mock data script)

### Step 4: Test the Application
1. Refresh your application
2. Navigate to the **CSAT Management** section
3. The dashboard should now load with real data
4. You should see realistic metrics and sample surveys

## 🔧 What the Scripts Create

### Tables:
- `csat_surveys` - Survey definitions
- `csat_responses` - Customer responses
- `csat_analytics` - Analytics data
- `csat_settings` - User settings
- `csat_feedback_themes` - Feedback analysis
- `csat_agent_performance` - Agent performance
- `csat_department_performance` - Department performance
- `csat_notifications` - System notifications

### Functions:
- `get_csat_stats()` - Main metrics calculation
- `get_agent_csat_performance()` - Agent performance
- `get_department_csat_performance()` - Department performance
- `analyze_feedback_themes()` - Feedback analysis

### Sample Data (if mock data script is run):
- **5 Realistic Surveys**: Post-Chat CSAT, NPS, CES, Product Feedback, Onboarding
- **15+ Customer Responses** with varied ratings and feedback
- **Agent Performance Data** with strengths and improvement areas
- **Department Performance** across different teams
- **Feedback Themes** with sentiment analysis
- **System Notifications** for alerts and trends

## 🎯 Expected Results

### Without Mock Data:
- **Average CSAT**: 0.0 (until you have responses)
- **Response Rate**: 0.0% (until you have responses)
- **NPS Score**: 0 (until you have responses)
- **Total Responses**: 0 (until you have responses)
- **3 Basic Surveys** in the Survey Builder tab

### With Mock Data:
- **Average CSAT**: ~4.2 (realistic average)
- **Response Rate**: ~68% (calculated from responses)
- **NPS Score**: ~7.3 (realistic NPS)
- **Total Responses**: 15+ (varied responses)
- **5 Detailed Surveys** with realistic questions and triggers
- **Rich Analytics** with agent performance, department trends, and feedback themes
- **Real Notifications** for low ratings and trends

## 📊 Mock Data Details

### Surveys Included:
1. **Post-Chat Customer Satisfaction** - CSAT survey for chat interactions
2. **Net Promoter Score Survey** - NPS for customer loyalty
3. **Support Effort Score** - CES for issue resolution ease
4. **Product Feedback Survey** - CSAT for product satisfaction
5. **Onboarding Experience** - NPS for onboarding effectiveness

### Response Types:
- **Positive**: 60% (5-star ratings, glowing feedback)
- **Neutral**: 20% (3-4 star ratings, mixed feedback)
- **Negative**: 20% (1-2 star ratings, constructive criticism)

### Realistic Features:
- **Varied Channels**: Email, chat, in-app, SMS
- **Different Triggers**: Chat completion, ticket resolution, purchases
- **Rich Feedback**: Detailed comments with themes and keywords
- **Time Distribution**: Responses spread over recent days/hours
- **Agent Attribution**: Some responses linked to specific agents

## 🚨 Troubleshooting

### If you see "Failed to load performance data":
- This is normal when there's no data yet
- Run the mock data script to see realistic metrics
- The system will show default values (0.0) without data

### If you see database errors:
- Make sure you're running the scripts in the correct Supabase project
- Check that you have the necessary permissions
- Verify both scripts ran completely without errors
- Ensure the `profiles` table exists (required for agent data)

### If mock data doesn't appear:
- Check that the `profiles` table has agents with `role = 'agent'`
- Verify the user authentication is working
- Check the RLS policies are correctly applied

## 📈 What You'll See With Mock Data

### Dashboard Metrics:
- **Average CSAT**: 4.2/5.0
- **NPS Score**: 7.3/10
- **Response Rate**: 68%
- **Total Responses**: 15

### Survey Builder:
- 5 detailed surveys with realistic questions
- Different survey types (CSAT, NPS, CES)
- Various channels and triggers
- Active/inactive status

### Responses Tab:
- 15+ customer responses
- Sentiment breakdown (positive/neutral/negative)
- Detailed feedback with themes
- Time-based filtering

### Analytics Tab:
- Agent performance data
- Department trends
- Feedback theme analysis
- Export functionality

## 📊 Next Steps

1. **Explore the mock data** to understand the system capabilities
2. **Create your own surveys** using the Survey Builder
3. **Add real responses** to see analytics in action
4. **Customize settings** in the CSAT Settings tab
5. **Set up notifications** for alerts and trends

The CSAT system is now ready with comprehensive mock data! 🎉 