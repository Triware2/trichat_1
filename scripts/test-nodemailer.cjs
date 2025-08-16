// Try different import approaches
console.log('Testing different nodemailer imports...');

// Method 1: Default require
const nodemailer1 = require('nodemailer');
console.log('Method 1 - nodemailer1.createTransporter:', typeof nodemailer1.createTransporter);

// Method 2: Destructuring
const { createTransporter, createTestAccount } = require('nodemailer');
console.log('Method 2 - createTransporter:', typeof createTransporter);

// Method 3: Default property
const nodemailer3 = require('nodemailer').default;
console.log('Method 3 - nodemailer3.createTransporter:', typeof nodemailer3?.createTransporter);

// Method 4: Direct property access
const nodemailer4 = require('nodemailer');
console.log('Method 4 - nodemailer4.default.createTransporter:', typeof nodemailer4.default?.createTransporter);

// Test the working method
if (typeof createTransporter === 'function') {
  console.log('✅ Using destructured import works!');
  try {
    const transporter = createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'test@example.com',
        pass: 'testpass',
      },
    });
    console.log('✅ createTransporter works with destructuring!');
  } catch (error) {
    console.error('❌ createTransporter failed:', error.message);
  }
} 