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

// Sample data for analytics
const sampleChats = [
  { subject: 'Technical Support', channel: 'website', priority: 'medium', status: 'resolved', satisfaction_rating: 4.5, response_time: 180, resolution_time: 600 },
  { subject: 'Billing Question', channel: 'email', priority: 'low', status: 'resolved', satisfaction_rating: 4.2, response_time: 300, resolution_time: 900 },
  { subject: 'Product Inquiry', channel: 'website', priority: 'medium', status: 'resolved', satisfaction_rating: 4.8, response_time: 120, resolution_time: 480 },
  { subject: 'Account Access', channel: 'mobile', priority: 'high', status: 'resolved', satisfaction_rating: 4.0, response_time: 240, resolution_time: 720 },
  { subject: 'Feature Request', channel: 'email', priority: 'low', status: 'resolved', satisfaction_rating: 4.6, response_time: 360, resolution_time: 1200 },
  { subject: 'Bug Report', channel: 'website', priority: 'high', status: 'resolved', satisfaction_rating: 4.3, response_time: 180, resolution_time: 600 },
  { subject: 'Payment Issue', channel: 'phone', priority: 'urgent', status: 'resolved', satisfaction_rating: 4.1, response_time: 60, resolution_time: 300 },
  { subject: 'General Inquiry', channel: 'website', priority: 'low', status: 'resolved', satisfaction_rating: 4.7, response_time: 150, resolution_time: 450 },
  { subject: 'Integration Help', channel: 'email', priority: 'medium', status: 'resolved', satisfaction_rating: 4.4, response_time: 300, resolution_time: 900 },
  { subject: 'Training Request', channel: 'website', priority: 'low', status: 'resolved', satisfaction_rating: 4.9, response_time: 200, resolution_time: 600 }
];

const sampleMessages = [
  { content: 'Hello, I need help with my account', sender_type: 'customer' },
  { content: 'Hi! I\'d be happy to help you with your account. What specific issue are you experiencing?', sender_type: 'agent' },
  { content: 'I can\'t log in to my dashboard', sender_type: 'customer' },
  { content: 'I understand. Let me help you reset your password. Can you provide your email address?', sender_type: 'agent' },
  { content: 'john.smith@example.com', sender_type: 'customer' },
  { content: 'Perfect! I\'ve sent a password reset link to your email. Please check your inbox.', sender_type: 'agent' },
  { content: 'Thank you! I received the email and can now log in.', sender_type: 'customer' },
  { content: 'Great! Is there anything else I can help you with today?', sender_type: 'agent' },
  { content: 'No, that\'s all. Thank you for your help!', sender_type: 'customer' },
  { content: 'You\'re welcome! Have a great day!', sender_type: 'agent' }
];

async function seedAnalyticsData() {
  console.log('🌱 Seeding analytics data...');

  try {
    // Create sample chats with realistic timestamps
    console.log('💬 Creating sample chats...');
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < 30; i++) {
      const chat = sampleChats[i % sampleChats.length];
      
      // Create random timestamp within last 30 days
      const randomTime = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
      const created_at = randomTime.toISOString();
      
      // Use integer values for response and resolution times
      const response_time = Math.round(chat.response_time + (Math.random() - 0.5) * 60);
      const resolution_time = Math.round(chat.resolution_time + (Math.random() - 0.5) * 120);
      const satisfaction_rating = Math.round(chat.satisfaction_rating + (Math.random() - 0.5) * 0.6);

      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .insert({
          subject: chat.subject,
          channel: chat.channel,
          priority: chat.priority,
          status: chat.status,
          satisfaction_rating: Math.max(1, Math.min(5, satisfaction_rating)),
          response_time: Math.max(30, response_time),
          resolution_time: Math.max(60, resolution_time),
          created_at: created_at,
          updated_at: new Date(randomTime.getTime() + resolution_time * 1000).toISOString()
        })
        .select()
        .single();

      if (chatError) {
        console.error(`Error creating chat ${i}:`, chatError);
        continue;
      }

      // Create messages for this chat
      console.log(`📨 Creating messages for chat ${i + 1}...`);
      const messageCount = Math.floor(Math.random() * 6) + 3; // 3-8 messages per chat
      
      for (let j = 0; j < messageCount; j++) {
        const message = sampleMessages[j % sampleMessages.length];
        const messageTime = new Date(randomTime.getTime() + j * 60000); // 1 minute apart
        
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            chat_id: chatData.id,
            content: message.content,
            sender_type: message.sender_type,
            created_at: messageTime.toISOString()
          });

        if (messageError) {
          console.error(`Error creating message ${j} for chat ${i}:`, messageError);
        }
      }
    }

    console.log('✅ Analytics data seeded successfully!');
    console.log(`💬 Created 30 sample chats`);
    console.log(`📨 Created messages for each chat`);

  } catch (error) {
    console.error('❌ Error seeding analytics data:', error);
  }
}

seedAnalyticsData().catch(console.error); 