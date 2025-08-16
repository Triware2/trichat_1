# Create Email Queue Table

## Problem
The email_queue table doesn't exist in your Supabase database, which is why welcome emails are not being sent.

## Solution
Run this SQL in your Supabase SQL Editor to create the email_queue table:

```sql
-- Email Queue table for handling email notifications
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    html_body TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('welcome_email', 'password_reset', 'notification', 'general')),
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for email queue
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_type ON email_queue(type);
CREATE INDEX IF NOT EXISTS idx_email_queue_created_at ON email_queue(created_at);
```

## Steps
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Paste and run the SQL above
4. Run the email queue check script again: `node scripts/check-email-queue.js`
5. Start the email processor: `node scripts/email-processor.js`

## What This Creates
- ✅ Email queue table to store pending emails
- ✅ Proper indexes for performance
- ✅ Status tracking for email delivery
- ✅ Error message storage for failed emails

After creating this table, the welcome emails should be properly queued and sent! 