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

async function checkEmailQueue() {
  try {
    console.log('🔍 Checking email queue...');
    
    const { data: emails, error } = await supabase
      .from('email_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching email queue:', error);
      return;
    }

    console.log(`📧 Found ${emails.length} emails in queue:`);
    console.log('');

    if (emails.length === 0) {
      console.log('No emails found in queue.');
      return;
    }

    emails.forEach((email, index) => {
      console.log(`${index + 1}. To: ${email.to_email}`);
      console.log(`   Subject: ${email.subject}`);
      console.log(`   Status: ${email.status}`);
      console.log(`   Type: ${email.type}`);
      console.log(`   Created: ${email.created_at}`);
      if (email.error_message) {
        console.log(`   Error: ${email.error_message}`);
      }
      console.log('');
    });

    // Check if email processor is running
    console.log('🔧 Email Processor Status:');
    console.log('The email processor should be running in the background to send emails.');
    console.log('To start it manually, run: node scripts/email-processor.js');
    console.log('');

  } catch (error) {
    console.error('❌ Error checking email queue:', error);
  }
}

checkEmailQueue().catch(console.error); 