
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Check, ArrowRight, Star, Zap, Shield, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with basic customer support",
      features: [
        "Up to 5 agents",
        "Basic chat functionality",
        "Basic reports",
        "Email support",
        "25% of platform features"
      ],
      limitations: [
        "No canned responses",
        "No file sharing",
        "No advanced routing",
        "No API access",
        "Limited functionality"
      ],
      cta: "Get Started Free",
      popular: false,
      color: "from-gray-500 to-gray-600",
      agentLimit: 5,
      functionalityPercent: 25
    },
    {
      name: "Growth",
      price: "$5",
      period: "per agent/month",
      description: "Growing businesses with enhanced features and capabilities",
      features: [
        "Unlimited agents",
        "14-day free trial",
        "Canned responses",
        "File sharing",
        "Advanced routing",
        "API access",
        "50% of platform features"
      ],
      limitations: [
        "No custom fields",
        "No integrations",
        "No advanced analytics",
        "No priority support"
      ],
      cta: "Start Free Trial",
      popular: true,
      color: "from-blue-500 to-cyan-500",
      agentLimit: null,
      functionalityPercent: 50
    },
    {
      name: "Pro",
      price: "$10",
      period: "per agent/month",
      description: "Professional teams with advanced tools and integrations",
      features: [
        "Unlimited agents",
        "14-day free trial",
        "All Growth features",
        "Custom fields",
        "Integrations",
        "Advanced analytics",
        "Priority support",
        "75% of platform features"
      ],
      limitations: [
        "No white labeling",
        "No SSO",
        "No advanced automation",
        "No custom workflows"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "from-purple-500 to-indigo-500",
      agentLimit: null,
      functionalityPercent: 75
    },
    {
      name: "Enterprise",
      price: "$15",
      period: "per agent/month",
      description: "Large organizations with complete platform access",
      features: [
        "Unlimited agents",
        "14-day free trial",
        "All Pro features",
        "White labeling",
        "SSO integration",
        "Advanced automation",
        "Custom workflows",
        "100% platform access",
        "Dedicated support"
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: false,
      color: "from-emerald-500 to-teal-500",
      agentLimit: null,
      functionalityPercent: 100
    }
  ];

  const featureComparison = [
    { feature: "Basic Chat", free: true, growth: true, pro: true, enterprise: true },
    { feature: "Agent Management", free: "5 agents", growth: "Unlimited", pro: "Unlimited", enterprise: "Unlimited" },
    { feature: "Basic Reports", free: true, growth: true, pro: true, enterprise: true },
    { feature: "Email Support", free: true, growth: true, pro: true, enterprise: true },
    { feature: "Canned Responses", free: false, growth: true, pro: true, enterprise: true },
    { feature: "File Sharing", free: false, growth: true, pro: true, enterprise: true },
    { feature: "Advanced Routing", free: false, growth: true, pro: true, enterprise: true },
    { feature: "API Access", free: false, growth: true, pro: true, enterprise: true },
    { feature: "Custom Fields", free: false, growth: false, pro: true, enterprise: true },
    { feature: "Integrations", free: false, growth: false, pro: true, enterprise: true },
    { feature: "Advanced Analytics", free: false, growth: false, pro: true, enterprise: true },
    { feature: "Priority Support", free: false, growth: false, pro: true, enterprise: true },
    { feature: "White Labeling", free: false, growth: false, pro: false, enterprise: true },
    { feature: "SSO", free: false, growth: false, pro: false, enterprise: true },
    { feature: "Advanced Automation", free: false, growth: false, pro: false, enterprise: true },
    { feature: "Custom Workflows", free: false, growth: false, pro: false, enterprise: true }
  ];

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-red-500" />
      );
    }
    return <span className="text-sm text-gray-600">{value}</span>;
  };

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
                <Button variant="ghost" onClick={() => navigate('/solutions')}>Solutions</Button>
                <Button variant="ghost" onClick={() => navigate('/pricing')} className="text-blue-600">Pricing</Button>
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
              Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Perfect Plan</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              From free forever to enterprise-grade features, find the right plan for your team size and needs.
            </p>
            
            <div className="flex justify-center space-x-4 mb-8">
              <Badge className="bg-green-100 text-green-700">Free plan available</Badge>
              <Badge className="bg-blue-100 text-blue-700">14-day trial on paid plans</Badge>
              <Badge className="bg-purple-100 text-purple-700">No setup fees</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 relative ${tier.popular ? 'border-blue-500 scale-105' : 'border-gray-200'}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tier.color} flex items-center justify-center mb-4 mx-auto`}>
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{tier.name}</CardTitle>
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600">{tier.period}</span>
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {tier.functionalityPercent}% Platform Access
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-600 mt-4">
                    {tier.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {tier.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-center space-x-3">
                        <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full ${tier.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={tier.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/auth')}
                  >
                    {tier.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Detailed Feature Comparison</h2>
            <p className="text-xl text-gray-600">See exactly what's included in each plan</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Free</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Growth</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Pro</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {featureComparison.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center">{renderFeatureValue(row.free)}</td>
                      <td className="px-6 py-4 text-center">{renderFeatureValue(row.growth)}</td>
                      <td className="px-6 py-4 text-center">{renderFeatureValue(row.pro)}</td>
                      <td className="px-6 py-4 text-center">{renderFeatureValue(row.enterprise)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start with our free plan or try any paid plan with a 14-day free trial.
          </p>
          
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/auth')}
          >
            Get Started Now
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
