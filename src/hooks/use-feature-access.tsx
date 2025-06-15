
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
  isPlatformCreator: boolean;
}

const FeatureAccessContext = createContext<FeatureAccessContextType | undefined>(undefined);

export const FeatureAccessProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [featureCache, setFeatureCache] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Check if this is the platform creator
  const isPlatformCreator = user?.email === 'Admin@trichat.com' || user?.email === 'admin@trichat.com';

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
    if (!user) return false;
    
    // Platform creator has access to everything without limitations
    if (isPlatformCreator) return true;
    
    // Check cache first
    if (featureCache[featureKey] !== undefined) {
      return featureCache[featureKey];
    }

    // For regular users, check plan-based access
    // This would normally make an API call to check feature access based on pricing tiers
    return true; // For now, return true for basic features to avoid blocking
  };

  const checkFeatureAccess = async (featureKey: string): Promise<boolean> => {
    if (!user) return false;

    // Platform creator has unlimited access
    if (isPlatformCreator) return true;

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
    isPlatformCreator,
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
