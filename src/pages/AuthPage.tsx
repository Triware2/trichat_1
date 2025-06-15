
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { NavigationHeader } from '@/components/NavigationHeader';
import { useToast } from '@/hooks/use-toast';
import { Shield, CheckCircle } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
          navigate('/');
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
          toast({
            title: "Welcome to Trichat!",
            description: "Your account has been created. You now have 14 days of free access to all features!",
          });
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
                {isLogin ? 'Welcome Back' : 'Start Your Free Trial'}
              </CardTitle>
              {!isLogin && (
                <p className="text-center text-gray-600 mt-2">
                  Get 14 days of complete platform access - no credit card required
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
                  {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Start Free Trial')}
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

          {/* Trial Benefits */}
          {!isLogin && (
            <Card className="w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="w-6 h-6" />
                  <CardTitle className="text-xl">14-Day Free Trial Includes:</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Complete admin dashboard access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Agent and supervisor tools</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Advanced analytics and reporting</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>AI chatbot training and management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Customization and integration tools</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>No credit card required</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/10 rounded-lg">
                  <p className="text-sm text-center">
                    After your trial, choose from our flexible pricing plans to continue
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Login Benefits */}
          {isLogin && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
