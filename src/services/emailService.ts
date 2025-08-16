import { supabase } from '@/integrations/supabase/client';

export interface EmailData {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export interface WelcomeEmailData {
  email: string;
  fullName: string;
  password: string;
  role: string;
}

class EmailService {
  async sendWelcomeEmail(userEmail: string, userName: string, userRole: string): Promise<void> {
    try {
      const emailData = {
        to: userEmail,
        subject: 'Welcome to Trichat - Your Account Details',
        text: `
          Welcome to Trichat, ${userName}!

          Your account has been successfully created with the following details:

          Email: ${userEmail}
          Role: ${userRole}

          IMPORTANT: To access your account, you'll need to set up your password:
          1. Go to the Trichat login page
          2. Click on "Forgot Password" or "Reset Password"
          3. Enter your email address (${userEmail})
          4. Follow the password reset instructions sent to your email
          5. Set a secure password of your choice

          Once you've set your password, you can log in and start using Trichat.

          If you have any questions or need assistance, please contact your administrator.

          Best regards,
          The Trichat Team
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to Trichat, ${userName}!</h2>
            
            <p>Your account has been successfully created with the following details:</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Role:</strong> ${userRole}</p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #d97706; margin-top: 0;">🔐 Set Up Your Password</h3>
              <p><strong>To access your account, follow these steps:</strong></p>
              <ol style="margin: 10px 0; padding-left: 20px;">
                <li>Go to the Trichat login page</li>
                <li>Click on "Forgot Password" or "Reset Password"</li>
                <li>Enter your email address: <strong>${userEmail}</strong></li>
                <li>Check your email for password reset instructions</li>
                <li>Set a secure password of your choice</li>
              </ol>
              <p style="margin-bottom: 0;"><strong>Note:</strong> For security reasons, passwords are not stored in our system. You must set your own password through the reset process.</p>
            </div>
            
            <p>Once you've set your password, you can log in and start using Trichat with your ${userRole} privileges.</p>
            
            <p>If you have any questions or need assistance, please contact your administrator.</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <p style="color: #6b7280; font-size: 14px;">
              Best regards,<br>
              The Trichat Team
            </p>
          </div>
        `,
        type: 'welcome_email' as const,
        status: 'pending' as const,
        created_at: new Date().toISOString(),
      };

      // Queue the email
      await this.sendEmail({
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.text,
        html: emailData.html
      });

      // Create notification
      await this.createNotification(userEmail, `Welcome to Trichat! Your account has been created successfully. Check your email (${userEmail}) for login instructions.`);

      console.log(`✅ Welcome email queued for ${userEmail}`);
    } catch (error) {
      console.error(`❌ Error queuing welcome email for ${userEmail}:`, error);
      throw error;
    }
  }

  private async createNotification(email: string, message: string): Promise<void> {
    try {
      // Find the user by email to get their ID
      const { data: user } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (user) {
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            title: 'Welcome to Trichat',
            message: message,
            type: 'system_alert',
            is_read: false,
            created_at: new Date().toISOString(),
          });
        
        console.log('✅ Welcome notification created for user:', user.id);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  async sendEmail(emailData: EmailData): Promise<void> {
    try {
      // In a production environment, this would integrate with an email service
      // For now, we'll queue the email for backend processing
      const { error } = await supabase
        .from('email_queue')
        .insert({
          to_email: emailData.to,
          subject: emailData.subject,
          body: emailData.body,
          html_body: emailData.html,
          status: 'pending',
          created_at: new Date().toISOString(),
          type: 'general'
        });

      if (error) {
        console.error('Error queuing email:', error);
        throw new Error('Failed to queue email');
      }

      console.log('✅ Email queued for sending:', {
        to: emailData.to,
        subject: emailData.subject
      });

    } catch (error) {
      console.error('Error in sendEmail:', error);
      throw error;
    }
  }

  // Method to check email queue status
  async getEmailQueueStatus(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('email_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching email queue:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getEmailQueueStatus:', error);
      return [];
    }
  }
}

export const emailService = new EmailService(); 