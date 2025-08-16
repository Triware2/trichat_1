const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables are not set');
  console.error('Please check your .env file contains:');
  console.error('VITE_SUPABASE_URL=your_supabase_project_url');
  console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Setting up database...');

  try {
    // Test connection
    const { data, error } = await supabase.from('chatbots').select('count').limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('\n📋 Please run the SQL setup script in your Supabase dashboard:');
      console.log('1. Go to your Supabase project dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of supabase/setup-database.sql');
      console.log('4. Run the script');
      return;
    }

    console.log('✅ Database connection successful');
    console.log('✅ Database tables are ready');
    console.log('\n🎉 You can now create chatbots!');

  } catch (err) {
    console.error('❌ Setup failed:', err);
  }
}

setupDatabase(); 