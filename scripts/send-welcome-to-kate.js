import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function sendWelcomeToKate() {
  try {
    console.log('📧 Sending welcome email to Kate...');
    
    const welcomeMessage = `
      Welcome to Trichat, Kate!

      Your account has been successfully created with the following details:

      Email: Triware.in@gmail.com
      Password: [Your password from when you were created]
      Role: Supervisor

      Please log in to your account and change your password for security purposes.

      If you have any questions, please contact your administrator.

      Best regards,
      The Trichat Team
    `;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Trichat, Kate!</h2>
        
        <p>Your account has been successfully created with the following details:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Email:</strong> Triware.in@gmail.com</p>
          <p><strong>Password:</strong> [Your password from when you were created]</p>
          <p><strong>Role:</strong> Supervisor</p>
        </div>
        
        <p><strong>Important:</strong> Please log in to your account and change your password for security purposes.</p>
        
        <p>If you have any questions, please contact your administrator.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <p style="color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The Trichat Team
        </p>
      </div>
    `;

    // Insert into email queue
    const { error } = await supabase
      .from('email_queue')
      .insert({
        to_email: 'Triware.in@gmail.com',
        subject: 'Welcome to Trichat - Your Account Details',
        body: welcomeMessage,
        html_body: htmlMessage,
        status: 'pending',
        created_at: new Date().toISOString(),
        type: 'welcome_email'
      });

    if (error) {
      console.error('❌ Error queuing email:', error);
      return;
    }

    console.log('✅ Welcome email queued successfully for Kate!');
    console.log('📧 Email will be sent when the email processor runs.');
    console.log('');
    console.log('To send it immediately, run: node scripts/email-processor.js');

  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
  }
}

sendWelcomeToKate().catch(console.error); 