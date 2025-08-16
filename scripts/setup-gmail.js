import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupGmail() {
  console.log('🚀 Trichat Gmail Setup Wizard');
  console.log('==============================\n');

  console.log('📋 Prerequisites:');
  console.log('1. Gmail account with 2-Factor Authentication enabled');
  console.log('2. App Password generated for "Mail" app\n');

  const gmailUser = await question('Enter your Gmail address: ');
  const appPassword = await question('Enter your 16-character App Password: ');

  console.log('\n📧 Email Configuration:');
  console.log(`Gmail Address: ${gmailUser}`);
  console.log(`App Password: ${appPassword.replace(/./g, '*')}`);

  const confirm = await question('\nIs this correct? (y/n): ');

  if (confirm.toLowerCase() !== 'y') {
    console.log('Setup cancelled.');
    rl.close();
    return;
  }

  // Read current .env file
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = '';

  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.log('Creating new .env file...');
  }

  // Update or add email configuration
  const emailConfig = `# Email Configuration for Gmail
EMAIL_SERVICE=gmail
EMAIL_USER=${gmailUser}
EMAIL_PASSWORD=${appPassword}
EMAIL_FROM=noreply@trichat.com

# Environment
NODE_ENV=development`;

  // Remove existing email config if present
  const lines = envContent.split('\n');
  const filteredLines = lines.filter(line => 
    !line.startsWith('EMAIL_') && 
    !line.startsWith('# Email Configuration') &&
    !line.startsWith('# Environment')
  );

  // Add new email config
  const newEnvContent = filteredLines.join('\n') + '\n\n' + emailConfig;

  try {
    fs.writeFileSync(envPath, newEnvContent);
    console.log('\n✅ .env file updated successfully!');
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
    rl.close();
    return;
  }

  console.log('\n🧪 Testing Gmail configuration...');
  
  // Test the configuration
  try {
    const { testGmail } = await import('./test-gmail.js');
    await testGmail();
  } catch (error) {
    console.log('❌ Gmail test failed. Please check your configuration.');
  }

  console.log('\n📚 Next Steps:');
  console.log('1. Start the email processor: node scripts/email-processor.js');
  console.log('2. Test in the application by creating a new user');
  console.log('3. Check the Email Test Panel in User Management');

  rl.close();
}

setupGmail().catch(console.error); 