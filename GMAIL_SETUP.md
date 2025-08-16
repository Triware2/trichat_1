# Gmail Setup Guide for Trichat

This guide will help you set up Gmail to send welcome emails for new users in your Trichat application.

## Prerequisites

- A Gmail account
- 2-Factor Authentication enabled on your Gmail account

## Step 1: Enable 2-Factor Authentication

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the steps to enable 2-Factor Authentication

## Step 2: Generate an App Password

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Scroll down and click on "App passwords"
5. Select "Mail" as the app and "Other" as the device
6. Enter "Trichat" as the name
7. Click "Generate"
8. **Copy the 16-character password** (you'll need this for the .env file)

## Step 3: Update Environment Variables

Edit your `.env` file in the `stellar-cx-nexus` directory:

```env
VITE_SUPABASE_URL="https://lxgugjdhaxbyvhtfokrq.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4Z3VnamRoYXhieXZodGZva3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDY2NzgsImV4cCI6MjA2NTU4MjY3OH0.t6N33OLEBOvH8SfgoPDupS8G1bpbvUISjJLfjhgY9mc"

# Email Configuration for Gmail
EMAIL_SERVICE=gmail
EMAIL_USER=your-actual-gmail@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
EMAIL_FROM=noreply@trichat.com

# Environment
NODE_ENV=development
```

**Replace the following:**
- `your-actual-gmail@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the app password you generated in Step 2

## Step 4: Test the Email Setup

1. **Start the email processor:**
   ```bash
   cd stellar-cx-nexus
   node scripts/email-processor.js
   ```

2. **You should see output like:**
   ```
   🚀 Starting email processor...
   Environment: development
   Setting up Gmail transporter...
   Email User: your-gmail@gmail.com
   Email Service: gmail
   ✅ Gmail connection verified successfully!
   ✅ Email processor is running. Press Ctrl+C to stop.
   📧 Using Gmail for sending emails
   ```

3. **Test in the application:**
   - Go to the User Management page
   - Use the Email Test Panel to send a test email
   - Or create a new user to trigger a welcome email

## Step 5: Verify Email Delivery

1. **Check the email processor console** for success messages
2. **Check the recipient's email inbox** (and spam folder)
3. **Check the email queue status** in the application

## Troubleshooting

### Common Issues:

1. **"Invalid login" error:**
   - Make sure you're using the App Password, not your regular Gmail password
   - Verify that 2-Factor Authentication is enabled
   - Regenerate the App Password if needed

2. **"Less secure app access" error:**
   - This is normal - App Passwords are designed for this use case
   - The error message is misleading, App Passwords are secure

3. **Emails going to spam:**
   - This is common for new email addresses
   - Add the sender email to contacts
   - Check spam folder regularly

4. **Connection timeout:**
   - Check your internet connection
   - Verify Gmail settings
   - Try regenerating the App Password

### Security Best Practices:

1. **Never commit your .env file** to version control
2. **Use App Passwords** instead of your main password
3. **Regularly rotate App Passwords** for security
4. **Monitor email sending** for unusual activity

## Production Deployment

For production, consider:

1. **Using a dedicated email service** like SendGrid or AWS SES
2. **Setting up proper email authentication** (SPF, DKIM, DMARC)
3. **Monitoring email delivery rates**
4. **Setting up bounce handling**

## Support

If you encounter issues:

1. Check the email processor console for error messages
2. Verify your Gmail settings
3. Test with a simple email first
4. Check the email queue status in the database

## Example .env Configuration

```env
# Supabase Configuration
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"

# Gmail Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=admin@yourcompany.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=noreply@yourcompany.com

# Environment
NODE_ENV=production
```

**Note:** The App Password should be entered without spaces, but Gmail displays it with spaces for readability. 