# Email Setup Guide for Trichat

This guide explains how to set up email functionality for the Trichat application, including welcome emails for new users.

## Overview

The email system consists of:
1. **Frontend**: Queues emails in the database
2. **Backend**: Processes the email queue and sends actual emails
3. **Database**: Stores email queue and notifications

## Database Setup

### 1. Email Queue Table

The `email_queue` table has been added to the schema. Run the following SQL in your Supabase SQL editor:

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

## Email Service Setup

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"

3. **Set Environment Variables**:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@trichat.com
```

### Option 2: SendGrid (Recommended for Production)

1. **Create a SendGrid Account**
2. **Create an API Key** with Mail Send permissions
3. **Verify your sender domain**

4. **Set Environment Variables**:
```env
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=verified-sender@yourdomain.com
```

### Option 3: AWS SES

1. **Set up AWS SES** in your AWS account
2. **Verify your email address or domain**
3. **Create SMTP credentials**

4. **Set Environment Variables**:
```env
AWS_SES_ACCESS_KEY_ID=your-access-key
AWS_SES_SECRET_ACCESS_KEY=your-secret-key
AWS_SES_REGION=us-east-1
EMAIL_FROM=verified-sender@yourdomain.com
```

## Backend Setup

### 1. Install Dependencies

```bash
npm install nodemailer dotenv
```

### 2. Configure Email Processor

Update the `scripts/email-processor.js` file with your email service configuration.

For **Gmail**:
```javascript
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

For **SendGrid**:
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Replace transporter.sendMail with:
await sgMail.send({
  to: email.to_email,
  from: process.env.EMAIL_FROM,
  subject: email.subject,
  text: email.body,
  html: email.html_body || email.body,
});
```

### 3. Set Environment Variables

Create a `.env` file in the project root:

```env
# Supabase
VITE_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Service
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@trichat.com
```

### 4. Run Email Processor

```bash
node scripts/email-processor.js
```

For production, use a process manager like PM2:

```bash
npm install -g pm2
pm2 start scripts/email-processor.js --name "email-processor"
pm2 startup
pm2 save
```

## Frontend Integration

The frontend automatically queues welcome emails when new users are created. The system:

1. **Creates user profile** in the database
2. **Queues welcome email** with login credentials
3. **Creates notification** for the user
4. **Shows success message** to admin

## Email Templates

### Welcome Email Template

The welcome email includes:
- User's full name
- Email address
- Temporary password
- Role information
- Security reminder to change password

### Customizing Templates

To customize email templates, edit the `emailService.ts` file:

```typescript
const htmlMessage = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2563eb;">Welcome to Trichat, ${data.fullName}!</h2>
    <!-- Customize the HTML template here -->
  </div>
`;
```

## Testing

### 1. Test Email Queue

Create a test user through the admin interface and check:
- Email appears in `email_queue` table with status 'pending'
- Email processor processes and sends the email
- Status changes to 'sent' or 'failed'

### 2. Monitor Email Queue

```sql
-- Check pending emails
SELECT * FROM email_queue WHERE status = 'pending';

-- Check failed emails
SELECT * FROM email_queue WHERE status = 'failed';

-- Check sent emails
SELECT * FROM email_queue WHERE status = 'sent';
```

## Troubleshooting

### Common Issues

1. **"User not allowed" Error**:
   - This has been fixed by removing Supabase Auth admin operations
   - Users are now created directly in the profiles table

2. **Emails not sending**:
   - Check email service credentials
   - Verify sender email address
   - Check email queue status

3. **Authentication Errors**:
   - Ensure 2FA is enabled for Gmail
   - Use App Password, not regular password
   - Verify API keys for SendGrid/AWS SES

### Debug Mode

Enable debug logging in the email processor:

```javascript
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true, // Enable debug mode
  logger: true, // Log to console
});
```

## Security Considerations

1. **Never commit email credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** for email sending
4. **Use verified sender addresses** in production
5. **Monitor email delivery rates** and bounces

## Production Deployment

1. **Use a reliable email service** (SendGrid, AWS SES, etc.)
2. **Set up email monitoring** and alerts
3. **Implement email templates** with your branding
4. **Set up bounce handling** and suppression lists
5. **Monitor email queue** performance

## Support

For issues with email setup:
1. Check the email queue status in the database
2. Review email service logs
3. Verify environment variables
4. Test with a simple email first 