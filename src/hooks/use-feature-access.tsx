
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
  functionalityPercent: number;
}

const FeatureAccessContext = createContext<FeatureAccessContextType | undefined>(undefined);

// Define functionality percentages by plan
const PLAN_FUNCTIONALITY: Record<string, number> = {
  'free': 25,
  'growth': 50,
  'pro': 75,
  'enterprise': 100
};

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

  const functionalityPercent = planDetails?.plan_type 
    ? PLAN_FUNCTIONALITY[planDetails.plan_type] || 25
    : 25;

  const hasFeatureAccess = (featureKey: string): boolean => {
    if (!user) return false;
    
    // Platform creator has access to everything without limitations
    if (isPlatformCreator) return true;
    
    // Check cache first
    if (featureCache[featureKey] !== undefined) {
      return featureCache[featureKey];
    }

    // For regular users, check plan-based access and trial status
    if (!planDetails) return false;

    // Check if trial is active or subscription is active
    const hasActiveAccess = 
      (planDetails.status === 'trial' && planDetails.trial_days_remaining > 0) ||
      planDetails.status === 'active' ||
      planDetails.status === 'free';

    if (!hasActiveAccess) return false;

    // For now, return access based on basic feature mapping
    // This will be enhanced by the database function
    return true;
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
    functionalityPercent,
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
