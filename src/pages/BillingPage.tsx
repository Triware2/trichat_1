
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { NavigationHeader } from '@/components/NavigationHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Clock, 
  Crown, 
  Calendar, 
  Users, 
  CheckCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

const BillingPage = () => {
  const { user } = useAuth();
  const { 
    planDetails, 
    functionalityPercent, 
    isPlatformCreator, 
    isLoading, 
    refreshPlanDetails 
  } = useFeatureAccess();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshPlanDetails();
    setRefreshing(false);
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'trial':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'free':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'expired':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'free':
        return 'from-gray-500 to-gray-600';
      case 'growth':
        return 'from-blue-500 to-cyan-500';
      case 'pro':
        return 'from-purple-500 to-indigo-500';
      case 'enterprise':
        return 'from-emerald-500 to-teal-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPlanFeatures = (planType: string) => {
    const features = {
      free: [
        'Up to 5 agents',
        'Basic chat functionality',
        'Basic reports',
        'Email support'
      ],
      growth: [
        'Unlimited agents',
        'Canned responses',
        'File sharing',
        'Advanced routing',
        'API access'
      ],
      pro: [
        'All Growth features',
        'Custom fields',
        'Integrations',
        'Advanced analytics',
        'Priority support'
      ],
      enterprise: [
        'All Pro features',
        'White labeling',
        'SSO integration',
        'Advanced automation',
        'Custom workflows',
        'Dedicated support'
      ]
    };
    return features[planType as keyof typeof features] || features.free;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader title="Billing & Subscription" />
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader title="Billing & Subscription" />
      
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
            <p className="text-gray-600 mt-2">Manage your subscription and billing details</p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Current Plan Overview */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getPlanColor(planDetails?.plan_type || 'free')} flex items-center justify-center`}>
                  {isPlatformCreator ? (
                    <Crown className="w-6 h-6 text-white" />
                  ) : (
                    <CreditCard className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {isPlatformCreator ? 'Platform Creator' : `${planDetails?.plan_type?.charAt(0).toUpperCase()}${planDetails?.plan_type?.slice(1)} Plan`}
                  </CardTitle>
                  <CardDescription>
                    {isPlatformCreator ? 'Unlimited access to all features' : `${functionalityPercent}% platform access`}
                  </CardDescription>
                </div>
              </div>
              <Badge className={getStatusColor(planDetails?.status || 'free')}>
                {planDetails?.status === 'trial' ? 'Free Trial' : planDetails?.status?.charAt(0).toUpperCase() + planDetails?.status?.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            {!isPlatformCreator && (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Platform Access</span>
                  <span>{functionalityPercent}%</span>
                </div>
                <Progress value={functionalityPercent} className="h-2" />
              </div>
            )}

            {/* Trial Information */}
            {planDetails?.status === 'trial' && planDetails.trial_days_remaining > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">
                      {planDetails.trial_days_remaining} day{planDetails.trial_days_remaining === 1 ? '' : 's'} left in your free trial
                    </p>
                    <p className="text-sm text-blue-600">
                      Upgrade now to continue accessing all features after your trial ends
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Plan Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Agent Limit</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {isPlatformCreator ? '∞' : planDetails?.agent_limit || 5}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Current Agents</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {planDetails?.current_agent_count || 0}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Features</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {isPlatformCreator ? '100%' : `${functionalityPercent}%`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card>
          <CardHeader>
            <CardTitle>Your Plan Includes</CardTitle>
            <CardDescription>
              {isPlatformCreator ? 'Full platform access with all features' : `Features available in your ${planDetails?.plan_type || 'free'} plan`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getPlanFeatures(planDetails?.plan_type || 'free').map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Section */}
        {!isPlatformCreator && planDetails?.plan_type !== 'enterprise' && (
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Unlock More Features</CardTitle>
              <CardDescription className="text-blue-700">
                Upgrade your plan to get access to more powerful features and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <p className="text-sm text-blue-800 mb-2">
                    Get access to more features and increase your platform capabilities
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• More agent capacity</li>
                    <li>• Advanced analytics</li>
                    <li>• Priority support</li>
                    <li>• Custom integrations</li>
                  </ul>
                </div>
                <Button onClick={handleUpgrade} className="bg-blue-600 hover:bg-blue-700">
                  View Pricing Plans
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Type</span>
              <span className="font-medium">
                {isPlatformCreator ? 'Platform Creator' : 'Admin'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Plan</span>
              <span className="font-medium capitalize">
                {planDetails?.plan_type || 'Free'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <Badge variant="outline" className={getStatusColor(planDetails?.status || 'free')}>
                {planDetails?.status?.charAt(0).toUpperCase() + planDetails?.status?.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingPage;
