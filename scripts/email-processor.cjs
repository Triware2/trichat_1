const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Email service configuration - use correct function names
const { createTransport, createTestAccount, getTestMessageUrl } = require('nodemailer');

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Use anonymous key

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Create test account for Ethereal Email (fake SMTP for testing)
async function createEtherealAccount() {
  const testAccount = await createTestAccount();
  console.log('Test account created:', testAccount.user);
  return testAccount;
}

// Email transporter configuration
let transporter;

async function setupTransporter() {
  if (process.env.NODE_ENV === 'production' || process.env.EMAIL_USER) {
    // Production/Real email configuration
    console.log('Setting up Gmail transporter...');
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Service:', process.env.EMAIL_SERVICE);
    
    transporter = createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify the connection
    try {
      await transporter.verify();
      console.log('✅ Gmail connection verified successfully!');
    } catch (error) {
      console.error('❌ Gmail connection failed:', error.message);
      console.log('Falling back to test account...');
      
      // Fallback to test account
      const testAccount = await createEtherealAccount();
      transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
  } else {
    // Development: Use Ethereal Email for testing
    console.log('Setting up test email transporter...');
    const testAccount = await createEtherealAccount();
    transporter = createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
}

async function processEmailQueue() {
  try {
    console.log('Processing email queue...');

    // Get pending emails
    const { data: pendingEmails, error } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10); // Process 10 emails at a time

    if (error) {
      console.error('Error fetching pending emails:', error);
      return;
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      console.log('No pending emails to process');
      return;
    }

    console.log(`Found ${pendingEmails.length} pending emails`);

    for (const email of pendingEmails) {
      try {
        // Send the email
        const mailOptions = {
          from: process.env.EMAIL_FROM || 'noreply@trichat.com',
          to: email.to_email,
          subject: email.subject,
          text: email.body,
          html: email.html_body || email.body,
        };

        const info = await transporter.sendMail(mailOptions);

        // Update email status to sent
        await supabase
          .from('email_queue')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', email.id);

        if (process.env.NODE_ENV !== 'production' && !process.env.EMAIL_USER) {
          // In development with test account, show the preview URL
          console.log(`✅ Email sent successfully to ${email.to_email}`);
          console.log('📧 Preview URL:', getTestMessageUrl(info));
        } else {
          console.log(`✅ Email sent successfully to ${email.to_email}`);
          console.log('📧 Message ID:', info.messageId);
        }

      } catch (emailError) {
        console.error(`❌ Error sending email to ${email.to_email}:`, emailError.message);

        // Update email status to failed
        await supabase
          .from('email_queue')
          .update({
            status: 'failed',
            error_message: emailError.message,
            updated_at: new Date().toISOString(),
          })
          .eq('id', email.id);
      }
    }

  } catch (error) {
    console.error('Error processing email queue:', error);
  }
}

// Run the email processor
async function main() {
  console.log('🚀 Starting email processor...');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  
  // Setup email transporter
  await setupTransporter();
  
  // Process emails immediately
  await processEmailQueue();
  
  // Set up interval to process emails every 2 minutes
  setInterval(processEmailQueue, 2 * 60 * 1000);
  
  console.log('✅ Email processor is running. Press Ctrl+C to stop.');
  if (process.env.EMAIL_USER) {
    console.log('📧 Using Gmail for sending emails');
  } else {
    console.log('📧 Using test account - emails will be shown in preview URLs');
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down email processor...');
  process.exit(0);
});

// Start the processor
main().catch(console.error); 