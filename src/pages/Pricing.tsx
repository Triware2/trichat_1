
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Check, ArrowRight, Star, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  const pricingTiers = [
    {
      name: "Starter",
      price: "$29",
      period: "per agent/month",
      description: "Perfect for small teams getting started with customer support",
      features: [
        "Up to 5 agents",
        "1,000 conversations/month",
        "Basic chat widget",
        "Email support",
        "Standard reporting",
        "Mobile app access"
      ],
      limitations: [
        "No AI routing",
        "Limited integrations",
        "Basic analytics"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "from-gray-500 to-gray-600"
    },
    {
      name: "Professional",
      price: "$79",
      period: "per agent/month",
      description: "Advanced features for growing businesses with higher volume",
      features: [
        "Up to 25 agents",
        "10,000 conversations/month",
        "AI-powered routing",
        "Advanced chat widget",
        "Priority support",
        "Custom reporting",
        "API access",
        "Integrations (Slack, CRM)",
        "File sharing",
        "Canned responses"
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: true,
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "per agent/month",
      description: "Full-featured solution for large organizations with advanced needs",
      features: [
        "Unlimited agents",
        "Unlimited conversations",
        "Advanced AI & automation",
        "White-label solution",
        "24/7 dedicated support",
        "Custom integrations",
        "Advanced analytics",
        "SSO & SAML",
        "Data residency options",
        "Custom workflows",
        "Dedicated success manager"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
      color: "from-purple-500 to-indigo-500"
    }
  ];

  const addOns = [
    {
      name: "Advanced AI Package",
      price: "$50",
      period: "per agent/month",
      description: "Enhanced AI capabilities with custom training and advanced automation",
      icon: Zap
    },
    {
      name: "Security & Compliance",
      price: "$30",
      period: "per agent/month", 
      description: "SOC 2, HIPAA, GDPR compliance with advanced security features",
      icon: Shield
    },
    {
      name: "Premium Analytics",
      price: "$25",
      period: "per agent/month",
      description: "Advanced reporting, custom dashboards, and predictive insights",
      icon: Star
    }
  ];

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "What happens during the free trial?",
      answer: "You get full access to Professional plan features for 14 days. No credit card required to start."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees for Starter and Professional plans. Enterprise plans include complimentary onboarding."
    },
    {
      question: "Can I get volume discounts?",
      answer: "Yes, we offer volume discounts for organizations with 100+ agents. Contact sales for custom pricing."
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
              Simple, Transparent <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pricing</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your team. Start with a 14-day free trial, no credit card required.
            </p>
            
            <div className="flex justify-center space-x-4 mb-8">
              <Badge className="bg-green-100 text-green-700">14-day free trial</Badge>
              <Badge className="bg-blue-100 text-blue-700">No setup fees</Badge>
              <Badge className="bg-purple-100 text-purple-700">Cancel anytime</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 relative ${tier.popular ? 'border-blue-500 scale-105' : 'border-gray-200'}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tier.color} flex items-center justify-center mb-4`}>
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{tier.name}</CardTitle>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600">{tier.period}</span>
                  </div>
                  <CardDescription className="text-gray-600">
                    {tier.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full ${tier.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={tier.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/auth')}
                  >
                    {tier.cta}
                    {tier.cta !== 'Contact Sales' && <ArrowRight className="ml-2 w-4 h-4" />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Enhance Your Plan</h2>
            <p className="text-xl text-gray-600">Add powerful features to any plan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {addOns.map((addon, index) => {
              const IconComponent = addon.icon;
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader>
                    <IconComponent className="w-8 h-8 text-blue-600 mb-4" />
                    <CardTitle className="text-xl text-gray-900">{addon.name}</CardTitle>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-gray-900">{addon.price}</span>
                      <span className="text-gray-600">{addon.period}</span>
                    </div>
                    <CardDescription className="text-gray-600">
                      {addon.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
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
            Start your 14-day free trial today. No credit card required.
          </p>
          
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/auth')}
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
