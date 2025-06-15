
import { useState } from 'react';
import { useSubscription } from '@/hooks/use-subscription';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CreditCard, X } from 'lucide-react';

export const TrialBanner = () => {
  const { subscription, trialDaysRemaining, isTrialActive } = useSubscription();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isTrialActive || subscription?.status !== 'trial' || isDismissed) {
    return null;
  }

  const isNearExpiry = trialDaysRemaining <= 3;

  return (
    <Card className={`m-4 ${isNearExpiry ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className={`w-5 h-5 ${isNearExpiry ? 'text-red-600' : 'text-yellow-600'}`} />
          <div>
            <p className={`font-medium ${isNearExpiry ? 'text-red-800' : 'text-yellow-800'}`}>
              {trialDaysRemaining === 0 
                ? 'Your trial expires today!'
                : `${trialDaysRemaining} day${trialDaysRemaining === 1 ? '' : 's'} left in your free trial`}
            </p>
            <p className={`text-sm ${isNearExpiry ? 'text-red-600' : 'text-yellow-600'}`}>
              Upgrade now to continue accessing all features
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm"
            onClick={() => {
              // This would typically redirect to a payment page
              console.log('Redirect to upgrade page');
            }}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Upgrade Now
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsDismissed(true)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
