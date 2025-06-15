
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

interface PlanDetails {
  plan_type: string;
  status: 'trial' | 'active' | 'expired' | 'cancelled' | 'free';
  agent_limit: number;
  current_agent_count: number;
  trial_days_remaining: number;
}

interface FeatureAccessContextType {
  planDetails: PlanDetails | null;
  hasFeatureAccess: (featureKey: string) => boolean;
  isLoading: boolean;
  refreshPlanDetails: () => Promise<void>;
}

const FeatureAccessContext = createContext<FeatureAccessContextType | undefined>(undefined);

export const FeatureAccessProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [featureCache, setFeatureCache] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const refreshPlanDetails = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('get_user_plan_details', { user_id: user.id });

      if (error) {
        console.error('Error fetching plan details:', error);
        return;
      }

      if (data && data.length > 0) {
        setPlanDetails(data[0]);
      }
    } catch (error) {
      console.error('Error fetching plan details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasFeatureAccess = (featureKey: string): boolean => {
    if (!user || !planDetails) return false;
    
    // Check cache first
    if (featureCache[featureKey] !== undefined) {
      return featureCache[featureKey];
    }

    // For now, return true for basic features to avoid blocking
    // In production, this would make an API call to check feature access
    return true;
  };

  const checkFeatureAccess = async (featureKey: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .rpc('user_has_feature_access', { 
          user_id: user.id, 
          feature_key: featureKey 
        });

      if (error) {
        console.error('Error checking feature access:', error);
        return false;
      }

      // Update cache
      setFeatureCache(prev => ({ ...prev, [featureKey]: data }));
      return data;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  };

  useEffect(() => {
    refreshPlanDetails();
  }, [user]);

  const value = {
    planDetails,
    hasFeatureAccess,
    isLoading,
    refreshPlanDetails,
  };

  return (
    <FeatureAccessContext.Provider value={value}>
      {children}
    </FeatureAccessContext.Provider>
  );
};

export const useFeatureAccess = () => {
  const context = useContext(FeatureAccessContext);
  if (context === undefined) {
    throw new Error('useFeatureAccess must be used within a FeatureAccessProvider');
  }
  return context;
};
