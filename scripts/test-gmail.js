import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function testGmail() {
  console.log('🧪 Testing Gmail Configuration...');
  console.log('Email User:', process.env.EMAIL_USER);
  console.log('Email Service:', process.env.EMAIL_SERVICE);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('❌ Email configuration not found in .env file');
    console.log('Please update your .env file with Gmail credentials');
    return;
  }

  try {
    // Create Gmail transporter
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify connection
    console.log('🔍 Verifying Gmail connection...');
    await transporter.verify();
    console.log('✅ Gmail connection verified successfully!');

    // Send test email
    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@trichat.com',
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Trichat - Gmail Test Email',
      text: 'This is a test email to verify Gmail configuration for Trichat.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Trichat Gmail Test</h2>
          <p>This is a test email to verify that Gmail is properly configured for sending welcome emails.</p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Test Details:</strong></p>
            <p>✅ Gmail connection verified</p>
            <p>✅ Email sent successfully</p>
            <p>✅ Configuration is working</p>
          </div>
          <p>If you received this email, your Gmail setup is working correctly!</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Sent from Trichat Email System
          </p>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 To:', process.env.EMAIL_USER);
    console.log('📧 Subject: Trichat - Gmail Test Email');
    
    console.log('\n🎉 Gmail configuration is working correctly!');
    console.log('You can now create users and they will receive welcome emails.');

  } catch (error) {
    console.error('❌ Gmail test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('1. Make sure 2-Factor Authentication is enabled on your Gmail account');
      console.log('2. Generate an App Password (not your regular password)');
      console.log('3. Check that EMAIL_USER and EMAIL_PASSWORD are correct in .env');
      console.log('4. Make sure the App Password is 16 characters long');
    }
  }
}

// Also run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testGmail().catch(console.error);
} 