
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ArrowRight, Users, Building, Briefcase, TrendingUp, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Solutions = () => {
  const navigate = useNavigate();

  const solutionCategories = [
    {
      title: "By Use Case",
      description: "Tailored solutions for specific business needs",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      path: "/solutions/by-usecase",
      items: ["Customer Support", "Sales Enablement", "Technical Support", "Lead Generation"]
    },
    {
      title: "By Industry",
      description: "Industry-specific implementations and compliance",
      icon: Building,
      color: "from-purple-500 to-indigo-500",
      path: "/solutions/by-industry",
      items: ["Healthcare", "Financial Services", "E-commerce", "SaaS", "Education"]
    },
    {
      title: "By Organization Size",
      description: "Scalable solutions for every business size",
      icon: Users,
      color: "from-emerald-500 to-teal-500",
      path: "/solutions/by-size",
      items: ["Startups", "SMB", "Enterprise", "Global Enterprise"]
    }
  ];

  const featuredSolutions = [
    {
      title: "AI-Powered Customer Support",
      description: "Reduce response times by 80% with intelligent routing and automated responses",
      benefits: ["24/7 Availability", "Multi-language Support", "Smart Escalation"],
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Omnichannel Experience",
      description: "Unified customer experience across web, mobile, social, and voice channels",
      benefits: ["Single Customer View", "Seamless Handoffs", "Context Preservation"],
      icon: Zap,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Enterprise Security & Compliance",
      description: "SOC 2, GDPR, HIPAA compliant with advanced security features",
      benefits: ["End-to-end Encryption", "Audit Trails", "Data Residency"],
      icon: Shield,
      color: "from-red-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Trichat
                </span>
              </div>
              
              <div className="hidden md:flex space-x-8">
                <Button variant="ghost" onClick={() => navigate('/solutions')} className="text-blue-600">Solutions</Button>
                <Button variant="ghost" onClick={() => navigate('/pricing')}>Pricing</Button>
                <Button variant="ghost" onClick={() => navigate('/documentation')}>Documentation</Button>
                <Button variant="ghost" onClick={() => navigate('/resources')}>Resources</Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Solutions for Every <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Business Need</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how Trichat transforms customer experiences across industries, use cases, and organization sizes with tailored solutions and proven methodologies.
            </p>
          </div>
        </div>
      </div>

      {/* Solution Categories */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Solutions</h2>
            <p className="text-xl text-gray-600">Find the perfect solution tailored to your specific needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutionCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => navigate(category.path)}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{category.title}</CardTitle>
                    <CardDescription className="text-gray-600 mb-4">
                      {category.description}
                    </CardDescription>
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <Badge key={itemIndex} variant="secondary" className="mr-2">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full justify-between">
                      Explore Solutions
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Solutions */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Solutions</h2>
            <p className="text-xl text-gray-600">Our most popular and impactful solutions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredSolutions.map((solution, index) => {
              const IconComponent = solution.icon;
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${solution.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{solution.title}</CardTitle>
                    <CardDescription className="text-gray-600 mb-4">
                      {solution.description}
                    </CardDescription>
                    <div className="space-y-2">
                      {solution.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to find your perfect solution?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let our experts help you design a custom solution that meets your specific business requirements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth')}
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solutions;
