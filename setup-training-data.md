# Training Analytics Data Setup

This document explains how to set up real training analytics data for the chatbot training system.

## Database Setup

### Option 1: Run SQL Script in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `setup-training-tables.sql`
4. Execute the script

### Option 2: Use Supabase CLI (if available)

```bash
cd stellar-cx-nexus
npx supabase db push
```

## What the Setup Does

The setup script creates:

1. **Training Sessions Table** (`chatbot_training_sessions`)
   - Stores individual training session data
   - Includes metrics, progress, and final results
   - Links to chatbots and SOP documents

2. **Training Analytics Table** (`chatbot_training_analytics`)
   - Aggregated analytics data per chatbot
   - Overall accuracy, knowledge retention, response times
   - Trend calculations and performance metrics

3. **Sample Data**
   - Sample training sessions with realistic metrics
   - Sample conversations and messages for response time analysis
   - Sample analytics data for immediate testing

## Data Sources for Analytics

The training analytics now pulls data from multiple sources:

### 1. Conversations (`chatbot_conversations`)
- **User Satisfaction**: Calculated from `satisfaction_rating` field
- **Resolution Time**: Used for performance metrics
- **Status**: Active, resolved, escalated conversations

### 2. Messages (`chatbot_messages`)
- **Response Time**: Calculated from time differences between bot messages
- **Message Count**: Total interaction volume
- **Confidence**: Bot response confidence levels

### 3. Training Sessions (`chatbot_training_sessions`)
- **Accuracy**: From `final_metrics.accuracy`
- **Training Progress**: Session completion status
- **SOP Documents**: Number of documents processed

### 4. SOP Documents (`chatbot_sops`)
- **Knowledge Retention**: Based on number of active SOPs
- **Document Processing**: Training material availability

## Analytics Calculations

### Overall Accuracy
- Average of all completed training session accuracies
- Falls back to 85.5% if no training data

### Knowledge Retention
- Base 80% + 2% per active SOP document
- Maximum 95%
- Falls back to 92.3% if no SOP data

### Average Response Time
- Calculated from time differences between consecutive bot messages
- Falls back to 1.2s if no message data

### User Satisfaction
- Average of all conversation satisfaction ratings
- Falls back to 4.6/5 if no satisfaction data

### Trends
- Compare recent (7 days) vs older data
- Show improvement/decline indicators
- Color-coded (green for positive, red for negative)

## UI Features

The updated Training Analytics UI includes:

1. **Data Source Indicators**: Shows which data sources are available (✓/✗)
2. **Trend Indicators**: Up/down arrows with color coding
3. **Performance Overview**: Summary of total counts
4. **Training History**: Real training sessions with status and metrics
5. **Fallback Data**: Graceful handling when data is missing

## Testing the Analytics

After running the setup:

1. Navigate to the Training Analytics tab
2. You should see:
   - Real metrics calculated from database data
   - Data source indicators showing available sources
   - Training history with sample sessions
   - Performance overview with counts

## Troubleshooting

### No Data Showing
- Check if the SQL script ran successfully
- Verify tables exist in Supabase dashboard
- Check browser console for any errors

### Missing Data Sources
- Ensure you have chatbots with `type = 'llm'`
- Check if conversations and messages exist
- Verify training sessions were created

### Permission Issues
- Ensure RLS policies are properly set
- Check if user is authenticated
- Verify table permissions in Supabase

## Next Steps

1. **Add Real Training Data**: Start actual training sessions to see real metrics
2. **Upload SOP Documents**: Add real SOP files to improve knowledge retention
3. **Monitor Conversations**: Track real user interactions for satisfaction data
4. **Customize Metrics**: Modify calculation logic based on your specific needs 