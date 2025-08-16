
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Shield, ShoppingCart, GraduationCap, Building, Briefcase, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavicon } from '@/hooks/use-favicon';

const ByIndustry = () => {
  const navigate = useNavigate();
  useFavicon('landing');

  const industries = [
    {
      title: "Healthcare",
      description: "HIPAA-compliant patient communication and telehealth support",
      icon: Heart,
      color: "from-red-500 to-pink-500",
      compliance: ["HIPAA", "SOC 2", "ISO 27001"],
      features: [
        "Secure patient messaging",
        "Appointment scheduling",
        "Telehealth integration",
        "Medical record integration",
        "Provider collaboration"
      ],
      benefits: [
        "Improved patient satisfaction",
        "Reduced administrative burden",
        "Better care coordination",
        "Enhanced data security"
      ],
      caseStudy: "Regional Health Network reduced patient wait times by 40% and improved satisfaction scores by 25%"
    },
    {
      title: "Financial Services",
      description: "Secure, compliant customer support for banking and fintech",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      compliance: ["PCI DSS", "SOX", "GDPR"],
      features: [
        "Secure document sharing",
        "Account verification",
        "Fraud prevention",
        "Regulatory compliance",
        "Multi-factor authentication"
      ],
      benefits: [
        "Enhanced security",
        "Faster issue resolution",
        "Improved compliance",
        "Better customer trust"
      ],
      caseStudy: "Digital Bank increased customer onboarding completion by 60% while maintaining 100% compliance"
    },
    {
      title: "E-commerce & Retail",
      description: "Drive sales and support customers throughout their shopping journey",
      icon: ShoppingCart,
      color: "from-green-500 to-emerald-500",
      compliance: ["PCI DSS", "GDPR"],
      features: [
        "Product recommendations",
        "Order tracking",
        "Return assistance",
        "Inventory integration",
        "Cart abandonment recovery"
      ],
      benefits: [
        "Increased conversion rates",
        "Reduced cart abandonment",
        "Higher customer lifetime value",
        "Improved shopping experience"
      ],
      caseStudy: "Fashion Retailer saw 45% increase in conversion rates and 30% reduction in cart abandonment"
    },
    {
      title: "SaaS & Technology",
      description: "Technical support and user onboarding for software platforms",
      icon: Briefcase,
      color: "from-purple-500 to-indigo-500",
      compliance: ["SOC 2", "ISO 27001"],
      features: [
        "Technical troubleshooting",
        "Feature guidance",
        "API support",
        "Integration assistance",
        "User training"
      ],
      benefits: [
        "Reduced churn",
        "Faster user adoption",
        "Improved product satisfaction",
        "Lower support costs"
      ],
      caseStudy: "SaaS Platform reduced time-to-value by 50% and increased user activation by 35%"
    },
    {
      title: "Education",
      description: "Support for students, faculty, and administrative processes",
      icon: GraduationCap,
      color: "from-yellow-500 to-orange-500",
      compliance: ["FERPA", "COPPA"],
      features: [
        "Student support services",
        "Faculty assistance",
        "Course enrollment help",
        "Technical support",
        "Emergency notifications"
      ],
      benefits: [
        "Improved student satisfaction",
        "Better learning outcomes",
        "Streamlined administration",
        "Enhanced accessibility"
      ],
      caseStudy: "University increased student satisfaction by 40% and reduced administrative workload by 30%"
    },
    {
      title: "Real Estate",
      description: "Connect buyers, sellers, and agents with seamless communication",
      icon: Building,
      color: "from-teal-500 to-cyan-500",
      compliance: ["GDPR", "State Regulations"],
      features: [
        "Property inquiry handling",
        "Appointment scheduling",
        "Document sharing",
        "Market insights",
        "Lead qualification"
      ],
      benefits: [
        "Faster lead response",
        "Higher conversion rates",
        "Better client relationships",
        "Streamlined processes"
      ],
      caseStudy: "Real Estate Agency increased lead conversion by 55% and reduced response time by 70%"
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
            <Badge className="mb-6 bg-blue-100 text-blue-700">Solutions by Industry</Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Industry-Specific <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Solutions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized implementations designed for your industry's unique requirements, regulations, and customer expectations.
            </p>
          </div>
        </div>
      </div>

      {/* Industries Grid */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {industries.map((industry, index) => {
              const IconComponent = industry.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${industry.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{industry.title}</CardTitle>
                    <CardDescription className="text-gray-600 mb-4">
                      {industry.description}
                    </CardDescription>
                    
                    {/* Compliance */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {industry.compliance.map((cert, certIndex) => (
                        <Badge key={certIndex} className="bg-green-100 text-green-700">
                          {cert} Compliant
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-6">
                      {/* Features */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {industry.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Business Benefits</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {industry.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Case Study */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Success Story</h4>
                        <p className="text-sm text-gray-600 italic">"{industry.caseStudy}"</p>
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

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready for an industry-specific solution?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get a customized demo showcasing how Trichat addresses your industry's unique challenges and requirements.
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
              Schedule Industry Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ByIndustry;
