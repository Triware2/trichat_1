
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PricingTier } from './types/pricing';

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with basic customer support",
    features: [
      "Admin dashboard (basic)",
      "Add/remove agents (up to 5)",
      "Agent chat dashboard",
      "Canned responses",
      "Customer contacts",
      "Web widget (basic floating)",
      "Basic system settings",
      "Basic reports"
    ],
    limitations: [],
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
      "All Free features",
      "Unlimited agents",
      "Supervisor tools (chat monitor, reports)",
      "Access control (basic)",
      "Web widget variants + APIs/Webhooks",
      "Slack, WordPress, Shopify integrations",
      "CSAT dashboard",
      "Analytics (basic)",
      "Chat rules & bulk operations",
      "14-day free trial"
    ],
    limitations: [],
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
    description: "Professional teams with advanced tools and automation",
    features: [
      "All Growth features",
      "Bot training studio",
      "SOP upload, LLM configuration",
      "Sentiment analysis",
      "SLA creation & notifications",
      "Escalation management",
      "Business rule engine",
      "Form builder, theme editor",
      "CRM integrations",
      "Custom fields, custom objects",
      "Customer 360 view",
      "Full analytics & reporting",
      "14-day free trial"
    ],
    limitations: [],
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
    description: "Large organizations with complete platform access and enterprise features",
    features: [
      "All Pro features",
      "Sandbox environment",
      "Script editor",
      "Mobile SDKs",
      "WhatsApp, Teams, Telegram messaging",
      "Dedicated API management",
      "Data security & audit logs",
      "Priority support",
      "SLA breach monitoring",
      "Workflow automation",
      "White labeling & SSO",
      "100% platform access",
      "14-day free trial"
    ],
    limitations: [],
    cta: "Start Free Trial",
    popular: false,
    color: "from-emerald-500 to-teal-500",
    agentLimit: null,
    functionalityPercent: 100
  }
];

export const PricingCards = () => {
  const navigate = useNavigate();

  const handlePlanSelection = (tier: PricingTier) => {
    // Store selected plan in localStorage to pass to signup
    localStorage.setItem('selectedPlan', JSON.stringify({
      name: tier.name.toLowerCase(),
      functionalityPercent: tier.functionalityPercent,
      agentLimit: tier.agentLimit,
      hasTrial: tier.name !== 'Free'
    }));
    
    navigate('/auth');
  };

  return (
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
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full ${tier.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={tier.popular ? 'default' : 'outline'}
                  onClick={() => handlePlanSelection(tier)}
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
  );
};
