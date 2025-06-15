
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CreditCard } from 'lucide-react';

interface TrialGuardProps {
  children: React.ReactNode;
}

export const TrialGuard = ({ children }: TrialGuardProps) => {
  const { user } = useAuth();
  const { subscription, trialDaysRemaining, isTrialActive, isLoading } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isTrialActive && subscription?.status !== 'active') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">Trial Expired</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Your 14-day free trial has ended. To continue using Trichat, please upgrade to a paid plan.
            </p>
            <div className="space-y-3">
              <Button 
                className="w-full"
                onClick={() => {
                  // This would typically redirect to a payment page
                  console.log('Redirect to upgrade page');
                }}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/auth')}
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
