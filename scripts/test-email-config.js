import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Email Configuration Test');
console.log('==========================');
console.log('');

console.log('Environment Variables:');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('');

if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  console.log('✅ Email configuration found!');
  console.log('📧 Will use Gmail for sending emails');
} else {
  console.log('❌ Email configuration missing!');
  console.log('📧 Will use test account (Ethereal) for sending emails');
}

console.log('');
console.log('To test Gmail, run: node scripts/test-gmail.js');
console.log('To start email processor, run: node scripts/email-processor.js'); 