import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { NavigationHeader } from '@/components/NavigationHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Users, Activity, Gauge } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const features: Feature[] = [
  {
    title: 'Real-Time Chat',
    description: 'Engage with customers instantly using our advanced chat interface.',
    icon: Activity,
  },
  {
    title: 'AI-Powered Assistance',
    description: 'Let our AI handle routine tasks and provide smart suggestions.',
    icon: Bot,
  },
  {
    title: 'Comprehensive Analytics',
    description: 'Track key metrics and gain insights into customer behavior.',
    icon: BarChart3,
  },
];

const getDashboardRoute = (user: any) => {
  switch (user?.role) {
    case 'admin':
      return '/admin';
    case 'supervisor':
      return '/supervisor';
    case 'agent':
      return '/agent';
    default:
      return '/';
  }
};

import { Bot, BarChart3 } from 'lucide-react';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate(getDashboardRoute(user));
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavigationHeader title="Trichat" />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Trichat</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The most advanced customer support platform with real-time chat, AI-powered assistance, and comprehensive analytics.
          </p>
          
          {!user ? (
            <div className="space-x-4">
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
              >
                Get Started
              </Button>
            </div>
          ) : (
            <div className="space-x-4">
              <Button 
                onClick={() => navigate(getDashboardRoute(user))}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Admin Platform Access */}
        {user?.role === 'admin' && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Management</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Settings className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">Standard Platform</h3>
                      <p className="text-gray-600 text-sm">Client management, pricing, and analytics</p>
                    </div>
                    <Button 
                      onClick={() => navigate('/platform')}
                      variant="outline"
                      className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                    >
                      Access
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Gauge className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">Control Center</h3>
                      <p className="text-gray-600 text-sm">Advanced system control and automation</p>
                    </div>
                    <Button 
                      onClick={() => navigate('/control')}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                    >
                      Launch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Demo Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Experience the Difference</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of businesses that trust Trichat for their customer support needs.
          </p>
          {!user && (
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 text-lg"
            >
              Start Free Trial
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
