
import { ReactNode } from 'react';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeatureGuardProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

export const FeatureGuard = ({ 
  feature, 
  children, 
  fallback, 
  showUpgradePrompt = true 
}: FeatureGuardProps) => {
  const { hasFeatureAccess, planDetails, isLoading, isPlatformCreator, functionalityPercent } = useFeatureAccess();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const hasAccess = hasFeatureAccess(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  const getUpgradeMessage = () => {
    if (isPlatformCreator) {
      return "This feature is temporarily unavailable.";
    }

    const currentPlan = planDetails?.plan_type || 'free';
    const planName = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);
    
    return `This feature is not included in your current ${planName} plan (${functionalityPercent}% platform access). Upgrade to unlock more functionality.`;
  };

  const getNextPlan = () => {
    const currentPlan = planDetails?.plan_type || 'free';
    switch (currentPlan) {
      case 'free':
        return { name: 'Growth', percent: 50 };
      case 'growth':
        return { name: 'Pro', percent: 75 };
      case 'pro':
        return { name: 'Enterprise', percent: 100 };
      default:
        return { name: 'Growth', percent: 50 };
    }
  };

  const nextPlan = getNextPlan();

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
          {isPlatformCreator ? <Crown className="w-6 h-6 text-yellow-600" /> : <Lock className="w-6 h-6 text-gray-500" />}
        </div>
        <CardTitle className="text-lg text-gray-900">Feature Not Available</CardTitle>
        <CardDescription>
          {getUpgradeMessage()}
        </CardDescription>
      </CardHeader>
      {!isPlatformCreator && (
        <CardContent className="text-center space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Upgrade to {nextPlan.name}:</strong> Get {nextPlan.percent}% platform access and unlock this feature
            </p>
          </div>
          <Button onClick={() => navigate('/pricing')}>
            View Pricing Plans
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      )}
    </Card>
  );
};
