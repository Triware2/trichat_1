
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, BarChart3, Shield, Zap, Globe } from 'lucide-react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { useAuth } from '@/hooks/use-auth';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // Auto-redirect authenticated users to admin dashboard
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const features = [
    {
      icon: MessageSquare,
      title: "Intelligent Chat Management",
      description: "AI-powered routing and real-time conversation handling",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Multi-Role Dashboard",
      description: "Specialized interfaces for agents, supervisors, and admins",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into performance and customer satisfaction",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Role-based access control and data protection",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Zap,
      title: "Real-time Operations",
      description: "Instant updates and live monitoring capabilities",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "Scalable Platform",
      description: "Built to handle enterprise-level chat operations",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavigationHeader title="Welcome to Trichat" />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Enterprise-Grade <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Chat Platform</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Transform your customer support with AI-powered chat management, real-time analytics, and seamless team collaboration
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
              onClick={() => navigate('/auth')}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Role-based Access Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Role-Based Dashboards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardHeader>
                <Badge className="bg-emerald-100 text-emerald-700 w-fit">Agent</Badge>
                <CardTitle className="text-emerald-900">Agent Dashboard</CardTitle>
                <CardDescription>
                  Streamlined interface for handling customer conversations, accessing knowledge base, and managing tickets
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader>
                <Badge className="bg-blue-100 text-blue-700 w-fit">Supervisor</Badge>
                <CardTitle className="text-blue-900">Supervisor Dashboard</CardTitle>
                <CardDescription>
                  Monitor team performance, manage chat queues, and oversee agent activities in real-time
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <CardHeader>
                <Badge className="bg-red-100 text-red-700 w-fit">Admin</Badge>
                <CardTitle className="text-red-900">Admin Dashboard</CardTitle>
                <CardDescription>
                  Complete system control, user management, analytics, and platform configuration
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
