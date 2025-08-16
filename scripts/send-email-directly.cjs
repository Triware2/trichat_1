const { createTransport } = require('nodemailer');
require('dotenv').config();

async function sendEmailDirectly() {
  console.log('📧 Sending email directly to Kate...');
  console.log('Email User:', process.env.EMAIL_USER);
  console.log('Email Password:', process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('❌ Email configuration not found');
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
    console.log('✅ Gmail connection verified!');

    // Send email
    console.log('📧 Sending welcome email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@trichat.com',
      to: 'Triware.in@gmail.com',
      subject: 'Welcome to Trichat - Your Account Details',
      text: `
        Welcome to Trichat, Kate!

        Your account has been successfully created with the following details:

        Email: Triware.in@gmail.com
        Role: Supervisor

        IMPORTANT: To access your account, you'll need to set up your password:
        1. Go to the Trichat login page
        2. Click on "Forgot Password" or "Reset Password"
        3. Enter your email address (Triware.in@gmail.com)
        4. Follow the password reset instructions sent to your email
        5. Set a secure password of your choice

        Once you've set your password, you can log in and start using Trichat.

        If you have any questions or need assistance, please contact your administrator.

        Best regards,
        The Trichat Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Trichat, Kate!</h2>
          
          <p>Your account has been successfully created with the following details:</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> Triware.in@gmail.com</p>
            <p><strong>Role:</strong> Supervisor</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #d97706; margin-top: 0;">🔐 Set Up Your Password</h3>
            <p><strong>To access your account, follow these steps:</strong></p>
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>Go to the Trichat login page</li>
              <li>Click on "Forgot Password" or "Reset Password"</li>
              <li>Enter your email address: <strong>Triware.in@gmail.com</strong></li>
              <li>Check your email for password reset instructions</li>
              <li>Set a secure password of your choice</li>
            </ol>
            <p style="margin-bottom: 0;"><strong>Note:</strong> For security reasons, passwords are not stored in our system. You must set your own password through the reset process.</p>
          </div>
          
          <p>Once you've set your password, you can log in and start using Trichat with your supervisor privileges.</p>
          
          <p>If you have any questions or need assistance, please contact your administrator.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The Trichat Team
          </p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 To: Triware.in@gmail.com');
    console.log('📧 Subject: Welcome to Trichat - Your Account Details');

  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('1. Make sure 2-Factor Authentication is enabled on your Gmail account');
      console.log('2. Generate an App Password (not your regular password)');
      console.log('3. Check that EMAIL_USER and EMAIL_PASSWORD are correct in .env');
      console.log('4. Make sure the App Password is 16 characters long');
    }
  }
}

sendEmailDirectly().catch(console.error); 