# Analytics Dashboard - Complete Guide

## Overview

The Analytics Dashboard provides comprehensive insights into your customer support operations, including real-time metrics, historical trends, agent performance, customer analytics, and custom analytics creation.

## Key Features

### 📊 **Overview Analytics**
- **KPI Metrics**: Total conversations, response times, satisfaction ratings, active agents, resolution rates
- **Trend Analysis**: Monthly and daily conversation trends with visual charts
- **Real-time Metrics**: Live updates on active chats, queued chats, and online agents

### 🎯 **Performance Analytics**
- **Agent Performance**: Individual agent metrics including conversations handled, response times, satisfaction scores
- **Team Performance**: Overall team efficiency and productivity metrics
- **Performance Trends**: Historical performance data with trend analysis

### 🌐 **Channel Analytics**
- **Channel Distribution**: Breakdown of conversations by channel (website, mobile, email, phone)
- **Channel Performance**: Response times and satisfaction by channel
- **Channel Trends**: Historical channel usage patterns

### ⭐ **Satisfaction Analytics**
- **Customer Satisfaction**: Overall satisfaction scores and trends
- **Satisfaction Breakdown**: Detailed satisfaction analysis by various factors
- **Satisfaction Trends**: Historical satisfaction data visualization

### 👥 **Customer Analytics**
- **Customer Overview**: Total customers, new customers, returning customers
- **Customer Insights**: Detailed customer behavior patterns
- **Top Issues**: Most common customer issues and their frequency
- **Customer List**: Detailed customer analytics with search functionality
- **Churn Risk Analysis**: Customer churn risk assessment

### 🛠️ **Custom Analytics** ⭐ **NEW**
- **Custom Report Creation**: Create personalized analytics reports
- **Custom Metrics**: Select specific metrics to include in reports
- **Custom Filters**: Apply custom filters to data
- **Report Management**: View, run, and delete custom reports
- **Results Storage**: Store and retrieve custom analytics results

## Data Sources

The Analytics Dashboard pulls data from multiple Supabase tables:

- **`chats`**: Conversation data, status, timestamps, satisfaction ratings
- **`messages`**: Message content, sender information, timestamps
- **`profiles`**: Agent information, roles, status
- **`customers`**: Customer data, contact information
- **`custom_analytics`**: Custom analytics configurations and results ⭐ **NEW**
- **`analytics_events`**: Analytics event tracking ⭐ **NEW**

## Custom Analytics System

### Creating Custom Analytics

1. **Navigate to Custom Analytics Tab**: Click on the "Custom Analytics" tab in the dashboard
2. **Create New Report**: Click "Create New" button
3. **Configure Report**:
   - **Name**: Give your report a descriptive name
   - **Description**: Explain what the report analyzes
   - **Metrics**: Select from available metrics:
     - Conversations (total count)
     - Response Time (average)
     - Satisfaction (average rating)
     - Resolution Rate (percentage)
   - **Time Range**: Select data range (7d, 30d, 90d)
   - **Data Source**: Choose data source (chats, agents, customers)
4. **Save Report**: Click "Save & Deploy"

### Managing Custom Analytics

- **View Reports**: See all your created custom analytics
- **Run Reports**: Execute custom analytics to get current results
- **Delete Reports**: Remove reports you no longer need
- **Results Storage**: Results are automatically stored and can be viewed

### Available Metrics

- **Conversations**: Total number of conversations in the selected time range
- **Response Time**: Average response time in minutes
- **Satisfaction**: Average customer satisfaction rating
- **Resolution Rate**: Percentage of resolved conversations

## Production-Ready Components

### ✅ **Data Validation**
- Input validation for all forms
- Error handling for database operations
- Graceful fallbacks for missing data

### ✅ **Performance Optimization**
- Efficient database queries with proper indexing
- Pagination for large datasets
- Optimized chart rendering

### ✅ **User Experience**
- Loading states for all operations
- Toast notifications for user feedback
- Responsive design for all screen sizes
- Intuitive navigation and filtering

### ✅ **Security**
- Row Level Security (RLS) policies
- User authentication required
- Data access controls

### ✅ **Scalability**
- Modular component architecture
- Service layer abstraction
- Configurable data sources

## Database Setup

### Required Tables

The following tables must exist in your Supabase database:

1. **`chats`** - Main conversation data
2. **`messages`** - Message content and metadata
3. **`profiles`** - User/agent profiles
4. **`customers`** - Customer information
5. **`custom_analytics`** - Custom analytics configurations ⭐ **NEW**
6. **`analytics_events`** - Analytics event tracking ⭐ **NEW**

### Setup Instructions

1. **Run Database Schema**: Execute the SQL commands in `CREATE_ANALYTICS_TABLES.md`
2. **Verify Tables**: Ensure all required tables exist
3. **Check Permissions**: Verify RLS policies are in place
4. **Test Functionality**: Create and run a custom analytics report

## Usage Examples

### Creating a Customer Satisfaction Report

1. Go to Custom Analytics tab
2. Click "Create New"
3. Name: "Customer Satisfaction Report"
4. Description: "Monthly customer satisfaction analysis"
5. Metrics: Select "Satisfaction"
6. Time Range: "30d"
7. Save the report

### Running Custom Analytics

1. In the Custom Analytics tab, find your report
2. Click the "Run" button
3. View the results in the report details
4. Results are automatically saved for future reference

### Viewing Customer Analytics

1. Navigate to "Customer Analytics" tab
2. Use the search bar to find specific customers
3. View customer overview cards
4. Check top issues and customer segments
5. Browse the detailed customer list

## Troubleshooting

### Common Issues

**"Failed to create custom analytics"**
- Ensure the `custom_analytics` table exists
- Check RLS policies are properly configured
- Verify user authentication

**"No data available"**
- Check if source tables have data
- Verify time range selection
- Ensure proper data permissions

**"Custom analytics not visible"**
- Refresh the page after creating analytics
- Check if analytics were saved successfully
- Verify the Custom Analytics tab is selected

### Data Issues

**Empty Analytics Dashboard**
- Run the seed script: `node scripts/seed-analytics-data.js`
- Check if RLS policies allow data access
- Verify database connection

**Missing Custom Analytics**
- Ensure `custom_analytics` table was created
- Check RLS policies for the table
- Verify user has proper permissions

## API Reference

### AnalyticsService Methods

```typescript
// Get main analytics data
analyticsService.getAnalyticsData(timeRange: '7d' | '30d' | '90d')

// Get customer analytics
analyticsService.getCustomerAnalytics()

// Create custom analytics
analyticsService.createCustomAnalytics(config)

// Get custom analytics
analyticsService.getCustomAnalytics()

// Run custom analytics
analyticsService.runCustomAnalytics(id)

// Update custom analytics
analyticsService.updateCustomAnalytics(id, updates)

// Delete custom analytics
analyticsService.deleteCustomAnalytics(id)
```

## Future Enhancements

- **Advanced Filtering**: More granular filter options
- **Export Functionality**: Export reports to PDF/Excel
- **Scheduled Reports**: Automated report generation
- **Advanced Visualizations**: More chart types and options
- **Real-time Updates**: Live data updates without refresh
- **Collaborative Analytics**: Share reports with team members

## Support

For issues or questions about the Analytics Dashboard:

1. Check this documentation
2. Review the troubleshooting section
3. Verify database setup
4. Check browser console for errors
5. Contact support if issues persist

---

**Last Updated**: December 2024
**Version**: 2.0 (Added Custom Analytics) 