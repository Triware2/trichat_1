import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { emailService } from '@/services/emailService';
import { Loader2, Mail, RefreshCw } from 'lucide-react';

export const EmailTestPanel = () => {
  const { toast } = useToast();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [isLoading, setIsLoading] = useState(false);
  const [emailQueue, setEmailQueue] = useState<any[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);

  const handleTestEmail = async () => {
    setIsLoading(true);
    try {
      await emailService.sendWelcomeEmail({
        email: testEmail,
        fullName: 'Test User',
        password: 'testpassword123',
        role: 'agent'
      });

      toast({
        title: "Test Email Sent",
        description: `Welcome email has been queued for ${testEmail}. Check the email queue below.`,
      });

      // Refresh email queue
      await loadEmailQueue();
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "Failed to send test email. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmailQueue = async () => {
    setIsLoadingQueue(true);
    try {
      const queue = await emailService.getEmailQueueStatus();
      setEmailQueue(queue);
    } catch (error) {
      console.error('Error loading email queue:', error);
      toast({
        title: "Error",
        description: "Failed to load email queue.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingQueue(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Test Panel
          </CardTitle>
          <CardDescription>
            Test the email functionality and monitor the email queue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testEmail">Test Email Address</Label>
            <Input
              id="testEmail"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          
          <Button 
            onClick={handleTestEmail} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending Test Email...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Test Welcome Email
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Queue</CardTitle>
              <CardDescription>
                Recent emails in the queue
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadEmailQueue}
              disabled={isLoadingQueue}
            >
              {isLoadingQueue ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {emailQueue.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No emails in queue
            </div>
          ) : (
            <div className="space-y-3">
              {emailQueue.map((email) => (
                <div key={email.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{email.subject}</div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      email.status === 'sent' ? 'bg-green-100 text-green-800' :
                      email.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {email.status}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    To: {email.to_email}
                  </div>
                  <div className="text-xs text-gray-500">
                    Created: {new Date(email.created_at).toLocaleString()}
                  </div>
                  {email.error_message && (
                    <div className="text-xs text-red-600 mt-2">
                      Error: {email.error_message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 