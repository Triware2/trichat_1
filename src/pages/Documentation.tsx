import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, Search, BookOpen, Code, Settings, Users, Zap, Shield, FileText, Video, Download, DollarSign, Globe, Headphones, Bot, BarChart3, Lock, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Documentation = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const platformCapabilities = [
    {
      title: "AI-Powered Chat Engine",
      description: "Advanced natural language processing with multi-language support",
      icon: Bot,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Real-time messaging with instant delivery",
        "Auto-translation for 100+ languages", 
        "Smart routing based on intent and urgency",
        "Context-aware conversations with memory",
        "Sentiment analysis and mood detection",
        "Customizable chat workflows"
      ],
      pricing: "Included in all plans",
      setupTime: "5 minutes"
    },
    {
      title: "Omnichannel Support",
      description: "Unified platform supporting all communication channels",
      icon: Globe,
      color: "from-emerald-500 to-teal-500",
      features: [
        "Website chat widget integration",
        "Mobile app SDK for iOS/Android",
        "Social media integration (WhatsApp, Facebook, Instagram)",
        "Voice support with VoIP integration",
        "Email ticketing system",
        "SMS and messaging apps support"
      ],
      pricing: "Growth plan and above",
      setupTime: "15 minutes per channel"
    },
    {
      title: "Advanced Analytics & Reporting",
      description: "Real-time insights with custom dashboards and KPI tracking",
      icon: BarChart3,
      color: "from-purple-500 to-indigo-500",
      features: [
        "Real-time performance dashboards",
        "Custom KPI tracking and alerts",
        "Predictive analytics with AI insights",
        "Export capabilities (PDF, Excel, CSV)",
        "Historical data analysis up to 5 years",
        "API access for custom integrations"
      ],
      pricing: "Pro plan and above",
      setupTime: "10 minutes"
    },
    {
      title: "Intelligent Chatbots",
      description: "AI-powered chatbots with machine learning capabilities",
      icon: Bot,
      color: "from-orange-500 to-red-500",
      features: [
        "Natural language processing (NLP)",
        "Machine learning algorithms for continuous improvement",
        "Workflow automation with conditional logic",
        "Custom training with your data",
        "Escalation to human agents",
        "Multi-bot management"
      ],
      pricing: "Growth plan and above",
      setupTime: "30 minutes setup + training"
    },
    {
      title: "Enterprise Security & Compliance",
      description: "Bank-grade security with comprehensive compliance features",
      icon: Shield,
      color: "from-red-500 to-pink-500",
      features: [
        "End-to-end encryption (AES-256)",
        "GDPR, HIPAA, SOC 2 compliance",
        "Single Sign-On (SSO) integration",
        "Role-based access control (RBAC)",
        "Audit logs and compliance reporting",
        "Data residency options"
      ],
      pricing: "Enterprise plan",
      setupTime: "1-2 hours"
    },
    {
      title: "Team Management & Collaboration",
      description: "Comprehensive tools for managing agents and teams",
      icon: Users,
      color: "from-teal-500 to-cyan-500",
      features: [
        "Unlimited agent accounts",
        "Real-time collaboration tools",
        "Performance monitoring and coaching",
        "Shift scheduling and workload management",
        "Internal chat and notes system",
        "Skills-based routing"
      ],
      pricing: "All plans",
      setupTime: "20 minutes"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for small teams getting started",
      features: ["Up to 5 agents", "Basic chat functionality", "Email support", "25% platform access"],
      limitations: ["No API access", "Limited integrations", "Basic reporting only"]
    },
    {
      name: "Growth",
      price: "$5/agent/month",
      description: "Growing businesses with enhanced capabilities", 
      features: ["Unlimited agents", "Advanced routing", "API access", "50% platform access"],
      limitations: ["No white labeling", "Limited analytics"]
    },
    {
      name: "Pro", 
      price: "$10/agent/month",
      description: "Professional teams with advanced tools",
      features: ["All Growth features", "Advanced analytics", "Integrations", "75% platform access"],
      limitations: ["No SSO", "Basic automation"]
    },
    {
      name: "Enterprise",
      price: "$15/agent/month", 
      description: "Large organizations with complete access",
      features: ["100% platform access", "White labeling", "SSO", "Dedicated support"],
      limitations: []
    }
  ];

  const setupGuides = [
    {
      title: "Quick Start Guide",
      description: "Get up and running in 5 minutes",
      icon: Zap,
      color: "from-green-500 to-emerald-500",
      steps: [
        "Create your Trichat account",
        "Set up your first chat widget",
        "Configure basic routing rules",
        "Add your team members",
        "Test your first conversation"
      ],
      time: "5 minutes",
      difficulty: "Beginner"
    },
    {
      title: "Widget Integration",
      description: "Add chat to your website or mobile app",
      icon: Code,
      color: "from-blue-500 to-cyan-500", 
      steps: [
        "Generate your widget code",
        "Copy the JavaScript snippet",
        "Paste before closing </body> tag",
        "Customize appearance and behavior",
        "Configure targeting rules"
      ],
      time: "10 minutes",
      difficulty: "Beginner"
    },
    {
      title: "API Integration",
      description: "Connect Trichat with your existing systems",
      icon: Settings,
      color: "from-purple-500 to-indigo-500",
      steps: [
        "Generate API keys",
        "Review API documentation", 
        "Implement authentication",
        "Set up webhooks",
        "Test integration endpoints"
      ],
      time: "30 minutes",
      difficulty: "Advanced"
    },
    {
      title: "Team Setup & Training",
      description: "Onboard your support team effectively",
      icon: Users,
      color: "from-orange-500 to-red-500",
      steps: [
        "Create agent accounts",
        "Set up departments and skills",
        "Configure routing rules",
        "Train agents on the platform",
        "Set up performance monitoring"
      ],
      time: "45 minutes",
      difficulty: "Intermediate"
    }
  ];

  const advancedFeatures = [
    {
      category: "Automation & AI",
      features: [
        { name: "Smart Routing", description: "AI-powered conversation routing based on content analysis" },
        { name: "Auto-responses", description: "Intelligent automated responses with context awareness" },
        { name: "Sentiment Detection", description: "Real-time mood analysis for better customer insights" },
        { name: "Predictive Analytics", description: "AI-driven predictions for customer behavior" }
      ]
    },
    {
      category: "Integration Ecosystem", 
      features: [
        { name: "CRM Integration", description: "Seamless connection with Salesforce, HubSpot, Zendesk" },
        { name: "E-commerce", description: "Direct integration with Shopify, WooCommerce, Magento" },
        { name: "Social Media", description: "Unified inbox for Facebook, Instagram, WhatsApp" },
        { name: "Voice Systems", description: "Integration with Twilio, RingCentral, 8x8" }
      ]
    },
    {
      category: "Security & Compliance",
      features: [
        { name: "Data Encryption", description: "AES-256 encryption for all data in transit and at rest" },
        { name: "Compliance Certifications", description: "GDPR, HIPAA, SOC 2 Type II certified" },
        { name: "Access Controls", description: "Role-based permissions with granular controls" },
        { name: "Audit Logging", description: "Comprehensive audit trails for all activities" }
      ]
    },
    {
      category: "Performance & Scale",
      features: [
        { name: "Global Infrastructure", description: "99.9% uptime with global data centers" },
        { name: "Auto-scaling", description: "Automatic scaling to handle traffic spikes" },
        { name: "Load Balancing", description: "Intelligent distribution across multiple servers" },
        { name: "CDN Integration", description: "Fast content delivery worldwide" }
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-700';
      case 'tutorial': return 'bg-green-100 text-green-700';
      case 'reference': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 lg:space-x-8">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Trichat
                </span>
              </div>
              
              <div className="hidden lg:flex space-x-8">
                <Button variant="ghost" onClick={() => navigate('/solutions')}>Solutions</Button>
                <Button variant="ghost" onClick={() => navigate('/pricing')}>Pricing</Button>
                <Button variant="ghost" onClick={() => navigate('/documentation')} className="text-blue-600">Documentation</Button>
                <Button variant="ghost" onClick={() => navigate('/resources')}>Resources</Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="outline" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              </div>
              
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/solutions'); setIsMobileMenuOpen(false); }}>Solutions</Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/pricing'); setIsMobileMenuOpen(false); }}>Pricing</Button>
                <Button variant="ghost" className="w-full justify-start text-blue-600" onClick={() => { navigate('/documentation'); setIsMobileMenuOpen(false); }}>Documentation</Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/resources'); setIsMobileMenuOpen(false); }}>Resources</Button>
                <div className="pt-4 space-y-2 md:hidden">
                  <Button variant="outline" className="w-full" onClick={() => { navigate('/auth'); setIsMobileMenuOpen(false); }}>Sign In</Button>
                  <Button className="w-full" onClick={() => { navigate('/auth'); setIsMobileMenuOpen(false); }}>Get Started</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Complete <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Platform Guide</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Everything you need to know about Trichat's capabilities, pricing, setup, and advanced features. Your complete knowledge base for successful implementation.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto px-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-base sm:text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Capabilities Overview */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Platform Capabilities</h2>
            <p className="text-lg sm:text-xl text-gray-600">Comprehensive overview of what Trichat can do for your business</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {platformCapabilities.map((capability, index) => {
              const IconComponent = capability.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="p-4 sm:p-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${capability.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl text-gray-900">{capability.title}</CardTitle>
                    <CardDescription className="text-gray-600 text-sm sm:text-base">
                      {capability.description}
                    </CardDescription>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                      <Badge className="bg-blue-100 text-blue-700 text-xs sm:text-sm">{capability.pricing}</Badge>
                      <Badge variant="outline" className="text-xs sm:text-sm">{capability.setupTime}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="space-y-2">
                      {capability.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pricing Overview */}
      <div className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Pricing Overview</h2>
            <p className="text-lg sm:text-xl text-gray-600">Choose the plan that fits your business needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4 mx-auto">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900">{plan.price}</div>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  {plan.limitations.length > 0 && (
                    <div className="space-y-2 border-t pt-4">
                      <div className="text-sm font-medium text-gray-500">Limitations:</div>
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Setup Guides */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Setup Guides</h2>
            <p className="text-lg sm:text-xl text-gray-600">Step-by-step guides to get you started quickly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {setupGuides.map((guide, index) => {
              const IconComponent = guide.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${guide.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{guide.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {guide.description}
                    </CardDescription>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge className={getDifficultyColor(guide.difficulty)}>{guide.difficulty}</Badge>
                      <Badge variant="outline">{guide.time}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {guide.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                            {stepIndex + 1}
                          </div>
                          <span className="text-sm text-gray-600">{step}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View Full Guide
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Advanced Features</h2>
            <p className="text-lg sm:text-xl text-gray-600">Deep dive into Trichat's powerful capabilities</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {advancedFeatures.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="border-l-4 border-blue-500 pl-4">
                        <div className="font-medium text-gray-900">{feature.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{feature.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to build with Trichat?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Start your journey with our comprehensive platform today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth')}
              className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              onClick={() => navigate('/pricing')}
            >
              View Pricing Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
