
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Rocket, Building2, Globe, Crown, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavicon } from '@/hooks/use-favicon';

const BySize = () => {
  const navigate = useNavigate();
  useFavicon('landing');

  const organizationSizes = [
    {
      title: "Startups",
      subtitle: "1-10 employees",
      description: "Get started quickly with essential features to support your growing customer base",
      icon: Rocket,
      color: "from-green-500 to-emerald-500",
      price: "Starting at $29/month",
      features: [
        "Quick 5-minute setup",
        "Essential chat widget",
        "Basic automation",
        "Email integration",
        "Mobile app access",
        "Community support"
      ],
      benefits: [
        "Professional customer support from day one",
        "Scale as you grow",
        "Affordable pricing",
        "No technical expertise required"
      ],
      challenges: [
        "Limited resources",
        "Need to move fast",
        "Budget constraints",
        "Wearing multiple hats"
      ],
      testimonial: {
        quote: "Trichat helped us provide professional customer support from day one without breaking our startup budget.",
        author: "Sarah Kim, CEO at TechStart"
      }
    },
    {
      title: "Small & Medium Business",
      subtitle: "10-500 employees",
      description: "Comprehensive solution with advanced features for growing businesses",
      icon: Building2,
      color: "from-blue-500 to-cyan-500",
      price: "Starting at $79/month",
      features: [
        "Advanced AI routing",
        "Team collaboration tools",
        "Custom reporting",
        "CRM integrations",
        "Department routing",
        "Priority support"
      ],
      benefits: [
        "Improved team efficiency",
        "Better customer insights",
        "Seamless growth scaling",
        "Professional appearance"
      ],
      challenges: [
        "Growing customer volume",
        "Team coordination",
        "Process standardization",
        "Resource optimization"
      ],
      testimonial: {
        quote: "Our customer satisfaction improved by 40% after implementing Trichat's SMB solution. The team loves the collaboration features.",
        author: "Michael Chen, Operations Director at GrowthCorp"
      }
    },
    {
      title: "Enterprise",
      subtitle: "500-10,000 employees",
      description: "Enterprise-grade platform with advanced security and customization",
      icon: Building2,
      color: "from-purple-500 to-indigo-500",
      price: "Starting at $199/month",
      features: [
        "Advanced security controls",
        "Custom workflows",
        "API access",
        "SSO integration",
        "Dedicated support",
        "Custom training"
      ],
      benefits: [
        "Enterprise-grade security",
        "Scalable infrastructure",
        "Custom integrations",
        "Compliance support"
      ],
      challenges: [
        "Complex requirements",
        "Security compliance",
        "Integration needs",
        "Change management"
      ],
      testimonial: {
        quote: "Trichat's enterprise solution seamlessly integrated with our existing systems and improved our global support operations.",
        author: "Jennifer Martinez, VP Customer Success at EnterpriseTech"
      }
    },
    {
      title: "Global Enterprise",
      subtitle: "10,000+ employees",
      description: "Complete platform with global deployment and custom solutions",
      icon: Globe,
      color: "from-orange-500 to-red-500",
      price: "Custom pricing",
      features: [
        "Global deployment",
        "Multi-region data residency",
        "Custom development",
        "24/7 dedicated support",
        "Success manager",
        "Executive reviews"
      ],
      benefits: [
        "Global scale capabilities",
        "Regulatory compliance",
        "Custom solutions",
        "Strategic partnership"
      ],
      challenges: [
        "Global coordination",
        "Regulatory requirements",
        "Complex integrations",
        "Massive scale"
      ],
      testimonial: {
        quote: "Trichat's global enterprise solution handles our 50+ countries seamlessly with full compliance and 99.99% uptime.",
        author: "David Thompson, Global CTO at MegaCorp International"
      }
    }
  ];

  const comparisonFeatures = [
    { feature: "Chat Widget", startup: "Basic", smb: "Advanced", enterprise: "Custom", global: "Multi-brand" },
    { feature: "Agents", startup: "Up to 5", smb: "Up to 25", enterprise: "Unlimited", global: "Unlimited" },
    { feature: "Conversations", startup: "1,000/month", smb: "10,000/month", enterprise: "Unlimited", global: "Unlimited" },
    { feature: "AI Routing", startup: "Basic", smb: "Advanced", enterprise: "Custom", global: "AI Engine" },
    { feature: "Integrations", startup: "Standard", smb: "Premium", enterprise: "Custom API", global: "Full Stack" },
    { feature: "Support", startup: "Community", smb: "Priority", enterprise: "Dedicated", global: "White Glove" },
    { feature: "Security", startup: "Standard", smb: "Enhanced", enterprise: "Enterprise", global: "Maximum" },
    { feature: "Compliance", startup: "Basic", smb: "SOC 2", enterprise: "Full Suite", global: "Global" }
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
            <Badge className="mb-6 bg-blue-100 text-blue-700">Solutions by Organization Size</Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Scalable Solutions for <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Every Stage</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From startup to global enterprise, discover the perfect solution that grows with your business and meets your unique requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Organization Sizes Grid */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {organizationSizes.map((org, index) => {
              const IconComponent = org.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${org.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-900">{org.title}</CardTitle>
                        <div className="text-sm text-gray-500">{org.subtitle}</div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">{org.price}</Badge>
                    </div>
                    <CardDescription className="text-gray-600 mt-2">
                      {org.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-6">
                      {/* Key Features */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {org.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Testimonial */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 italic mb-2">"{org.testimonial.quote}"</p>
                        <div className="text-sm font-medium text-gray-900">— {org.testimonial.author}</div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-6">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Feature Comparison</h2>
            <p className="text-xl text-gray-600">Compare features across different organization sizes</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Startup</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">SMB</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Enterprise</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Global</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonFeatures.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{row.startup}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{row.smb}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{row.enterprise}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{row.global}</td>
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
            Find your perfect fit
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Not sure which solution is right for you? Let our experts help you choose the perfect plan for your organization.
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
              Talk to Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BySize;
