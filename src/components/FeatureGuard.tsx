
import { ReactNode } from 'react';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight } from 'lucide-react';
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
  const { hasFeatureAccess, planDetails, isLoading, isPlatformCreator } = useFeatureAccess();
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

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-gray-500" />
        </div>
        <CardTitle className="text-lg text-gray-900">Feature Not Available</CardTitle>
        <CardDescription>
          {isPlatformCreator 
            ? "This feature is temporarily unavailable."
            : `This feature is not included in your current plan (${planDetails?.plan_type || 'Free'}). Upgrade to unlock this functionality.`
          }
        </CardDescription>
      </CardHeader>
      {!isPlatformCreator && (
        <CardContent className="text-center">
          <Button onClick={() => navigate('/pricing')}>
            View Pricing Plans
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      )}
    </Card>
  );
};
