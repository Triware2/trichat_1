import { createTransport, createTestAccount, getTestMessageUrl } from 'nodemailer';

async function testEmail() {
  console.log('Testing email functionality...');

  // Create a test account
  const testAccount = await createTestAccount();
  console.log('Test account created:', testAccount.user);

  // Create transporter
  const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Send test email
  const info = await transporter.sendMail({
    from: 'noreply@trichat.com',
    to: 'test@example.com',
    subject: 'Welcome to Trichat - Test Email',
    text: 'This is a test welcome email from Trichat.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Trichat!</h2>
        <p>This is a test welcome email to verify the email functionality.</p>
        <p>If you can see this email, the email system is working correctly.</p>
      </div>
    `,
  });

  console.log('Email sent successfully!');
  console.log('Preview URL:', getTestMessageUrl(info));
  console.log('Message ID:', info.messageId);
}

testEmail().catch(console.error); 