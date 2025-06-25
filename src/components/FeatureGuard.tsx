import { ReactNode } from 'react';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AccessRestrictedOverlay } from '@/components/common/AccessRestrictedOverlay';

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

  if (isPlatformCreator) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
            <Crown className="w-6 h-6 text-yellow-600" />
          </div>
          <CardTitle className="text-lg text-gray-900">Feature Not Available</CardTitle>
          <CardDescription>
            This feature is temporarily unavailable.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentPlan = planDetails?.plan_type || 'Free';
  const planName = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);

  return (
    <AccessRestrictedOverlay
      plan={planName}
      featureName={feature}
      onUpgrade={() => navigate('/pricing')}
    >
      {children}
    </AccessRestrictedOverlay>
  );
};
