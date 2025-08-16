
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useFavicon } from '@/hooks/use-favicon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { NavigationHeader } from '@/components/NavigationHeader';
import { useToast } from '@/hooks/use-toast';
import { Shield, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthPage = () => {
  console.log('AuthPage component is rendering');

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  useFavicon('landing');

  console.log('AuthPage - User:', user, 'Loading:', loading);

  useEffect(() => {
    console.log('AuthPage useEffect - checking for stored plan');
    // Check if user came from pricing page with a selected plan
    const storedPlan = localStorage.getItem('selectedPlan');
    if (storedPlan) {
      setSelectedPlan(JSON.parse(storedPlan));
      setIsLogin(false); // Force signup mode if coming from pricing
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          navigate('/admin');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          // After successful signup, wait a moment and check for the user
          setTimeout(async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            
            if (currentUser && selectedPlan) {
              const planType = selectedPlan.name;
              const status = selectedPlan.hasTrial ? 'trial' : 'free';
              const agentLimit = selectedPlan.agentLimit || 999;

              await supabase
                .from('subscriptions')
                .update({
                  plan_type: planType,
                  status: status,
                  agent_limit: agentLimit,
                  trial_start_date: selectedPlan.hasTrial ? new Date().toISOString() : null,
                  trial_end_date: selectedPlan.hasTrial ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : null
                })
                .eq('user_id', currentUser.id);

              // Clear stored plan
              localStorage.removeItem('selectedPlan');
            }

            toast({
              title: "Welcome to Trichat!",
              description: selectedPlan?.hasTrial 
                ? `Your account has been created with ${selectedPlan.name} plan. You now have 14 days of free access!`
                : "Your free account has been created. You now have access to 25% of platform features!",
            });
            
            navigate('/admin');
          }, 1000);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavigationHeader title="Trichat" />
      
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Auth Form */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {isLogin ? 'Welcome Back' : selectedPlan ? `Start Your ${selectedPlan.name} Plan` : 'Start Your Free Trial'}
              </CardTitle>
              {!isLogin && selectedPlan && (
                <p className="text-center text-gray-600 mt-2">
                  {selectedPlan.hasTrial 
                    ? `Get 14 days of ${selectedPlan.functionalityPercent}% platform access - no credit card required`
                    : `Get started with ${selectedPlan.functionalityPercent}% platform access - completely free`
                  }
                </p>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    minLength={6}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Loading...' : (isLogin ? 'Sign In' : selectedPlan?.hasTrial ? 'Start Free Trial' : 'Create Free Account')}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm"
                >
                  {isLogin ? "Don't have an account? Start your free trial" : "Already have an account? Sign in"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Selected Plan Benefits or Login Benefits */}
          {!isLogin && selectedPlan ? (
            <Card className="w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="w-6 h-6" />
                  <CardTitle className="text-xl">{selectedPlan.name} Plan Includes:</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>{selectedPlan.functionalityPercent}% of platform features</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Admin dashboard access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Create supervisor & agent accounts</span>
                  </div>
                  {selectedPlan.hasTrial && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>14-day free trial period</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>No credit card required</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/10 rounded-lg">
                  <p className="text-sm text-center">
                    {selectedPlan.hasTrial 
                      ? "After your trial, continue with subscription or switch to free plan"
                      : "Upgrade anytime to unlock more features"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : isLogin ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl">Access Your Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Sign in to access your personalized dashboard with all your chat management tools, analytics, and settings.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• Manage your customer conversations</p>
                  <p>• View detailed analytics and reports</p>
                  <p>• Configure your AI chatbots</p>
                  <p>• Customize your platform settings</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="w-6 h-6" />
                  <CardTitle className="text-xl">Choose Your Plan</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center">
                  Go back to pricing to select your preferred plan and get the right level of access for your needs.
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => navigate('/pricing')}
                >
                  View Pricing Plans
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
