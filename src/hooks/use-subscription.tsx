
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  id: string;
  status: 'trial' | 'active' | 'expired' | 'cancelled';
  trial_start_date: string;
  trial_end_date: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  plan_type?: string;
}

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  trialDaysRemaining: number;
  isTrialActive: boolean;
  isLoading: boolean;
  checkSubscriptionStatus: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkSubscriptionStatus = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Get subscription data
      const { data: subscriptionData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subError && subError.code !== 'PGRST116') {
        console.error('Error fetching subscription:', subError);
        setIsLoading(false);
        return;
      }

      if (subscriptionData) {
        setSubscription(subscriptionData);

        // Check if trial is active using the database function
        const { data: trialActiveData, error: trialError } = await supabase
          .rpc('is_trial_active', { user_id: user.id });

        if (!trialError) {
          setIsTrialActive(trialActiveData);
        }

        // Get trial days remaining using the database function
        const { data: daysRemainingData, error: daysError } = await supabase
          .rpc('get_trial_days_remaining', { user_id: user.id });

        if (!daysError) {
          setTrialDaysRemaining(daysRemainingData || 0);
        }
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user]);

  const value = {
    subscription,
    trialDaysRemaining,
    isTrialActive,
    isLoading,
    checkSubscriptionStatus,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
