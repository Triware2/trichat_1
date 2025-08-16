
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, FileText, Video, Users, BookOpen, Download, Calendar, ArrowRight, ExternalLink, DollarSign, Zap, Shield, Globe, Bot, BarChart3, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavicon } from '@/hooks/use-favicon';

const Resources = () => {
  const navigate = useNavigate();
  useFavicon('landing');

  const platformOverview = {
    totalFeatures: "200+",
    supportedLanguages: "100+",
    uptime: "99.9%",
    globalDataCenters: "15+",
    integrations: "500+",
    customers: "10,000+"
  };

  const detailedCapabilities = [
    {
      category: "Core Platform",
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-500",
      capabilities: [
        { name: "Real-time Messaging", description: "Instant message delivery with typing indicators and read receipts" },
        { name: "Multi-language Support", description: "Auto-translation for 100+ languages with cultural context" },
        { name: "Cross-platform SDKs", description: "Native SDKs for web, iOS, Android, and desktop applications" },
        { name: "Offline Message Queue", description: "Messages stored and delivered when users come back online" },
        { name: "Message History", description: "Complete conversation history with search and filtering" },
        { name: "File Sharing", description: "Support for documents, images, videos up to 100MB" }
      ]
    },
    {
      category: "AI & Automation",
      icon: Bot,
      color: "from-purple-500 to-indigo-500",
      capabilities: [
        { name: "Natural Language Processing", description: "Advanced NLP for intent recognition and entity extraction" },
        { name: "Sentiment Analysis", description: "Real-time emotion detection for better customer understanding" },
        { name: "Auto-routing", description: "Intelligent conversation routing based on content and urgency" },
        { name: "Chatbot Builder", description: "Drag-and-drop interface for creating sophisticated chatbots" },
        { name: "Machine Learning", description: "Continuous learning from interactions to improve responses" },
        { name: "Predictive Analytics", description: "AI-powered insights for customer behavior prediction" }
      ]
    },
    {
      category: "Analytics & Reporting",
      icon: BarChart3,
      color: "from-green-500 to-emerald-500",
      capabilities: [
        { name: "Real-time Dashboards", description: "Live performance metrics with customizable widgets" },
        { name: "Custom Reports", description: "Build reports with 50+ metrics and dimensions" },
        { name: "Performance Tracking", description: "Agent performance monitoring with coaching insights" },
        { name: "Customer Journey Analytics", description: "Track customer interactions across all touchpoints" },
        { name: "ROI Measurement", description: "Calculate chat impact on sales and customer satisfaction" },
        { name: "Data Export", description: "Export data in multiple formats (CSV, PDF, Excel)" }
      ]
    },
    {
      category: "Security & Compliance",
      icon: Shield,
      color: "from-red-500 to-pink-500",
      capabilities: [
        { name: "End-to-end Encryption", description: "AES-256 encryption for all data in transit and at rest" },
        { name: "GDPR Compliance", description: "Built-in data protection and privacy controls" },
        { name: "HIPAA Compliance", description: "Healthcare-grade security for medical organizations" },
        { name: "SOC 2 Type II", description: "Annual security audits and compliance certifications" },
        { name: "Access Controls", description: "Role-based permissions with granular control" },
        { name: "Audit Logging", description: "Comprehensive activity logs for compliance reporting" }
      ]
    },
    {
      category: "Integrations",
      icon: Globe,
      color: "from-orange-500 to-red-500",
      capabilities: [
        { name: "CRM Integration", description: "Seamless connection with Salesforce, HubSpot, Pipedrive" },
        { name: "E-commerce Platforms", description: "Direct integration with Shopify, WooCommerce, Magento" },
        { name: "Communication Tools", description: "Connect with Slack, Microsoft Teams, Discord" },
        { name: "Social Media", description: "Unified inbox for Facebook, Instagram, WhatsApp, Twitter" },
        { name: "Voice Systems", description: "Integration with Twilio, RingCentral, 8x8" },
        { name: "Custom APIs", description: "RESTful APIs and webhooks for custom integrations" }
      ]
    },
    {
      category: "Customer Experience",
      icon: Headphones,
      color: "from-teal-500 to-cyan-500",
      capabilities: [
        { name: "Omnichannel Support", description: "Consistent experience across web, mobile, and social" },
        { name: "Customer Context", description: "Complete customer history and interaction timeline" },
        { name: "Proactive Engagement", description: "Trigger chats based on user behavior and rules" },
        { name: "CSAT Surveys", description: "Automated satisfaction surveys with custom questions" },
        { name: "Queue Management", description: "Intelligent queue with estimated wait times" },
        { name: "Co-browsing", description: "Screen sharing for complex issue resolution" }
      ]
    }
  ];

  const pricingBreakdown = [
    {
      plan: "Free",
      price: "$0",
      description: "Perfect for startups and small teams",
      included: [
        "Up to 5 agents",
        "1,000 conversations/month",
        "Basic chat widget",
        "Email support",
        "Basic reporting",
        "25% of platform features"
      ],
      notIncluded: [
        "API access",
        "Custom integrations",
        "Advanced analytics",
        "Priority support",
        "White labeling"
      ],
      bestFor: "Small businesses, startups, testing"
    },
    {
      plan: "Growth",
      price: "$5/agent/month",
      description: "Growing businesses with enhanced needs",
      included: [
        "Unlimited agents",
        "10,000 conversations/month",
        "Advanced chat widget",
        "API access",
        "Canned responses",
        "File sharing",
        "Advanced routing",
        "50% of platform features"
      ],
      notIncluded: [
        "Custom fields",
        "Advanced integrations",
        "White labeling",
        "SSO",
        "Priority support"
      ],
      bestFor: "Growing companies, small customer support teams"
    },
    {
      plan: "Pro",
      price: "$10/agent/month",
      description: "Professional teams with advanced requirements",
      included: [
        "Unlimited conversations",
        "All Growth features",
        "Custom fields",
        "Advanced integrations",
        "Advanced analytics",
        "Priority support",
        "API rate limit: 10,000/hour",
        "75% of platform features"
      ],
      notIncluded: [
        "White labeling",
        "SSO integration",
        "Custom SLA",
        "Dedicated support"
      ],
      bestFor: "Medium businesses, professional support teams"
    },
    {
      plan: "Enterprise",
      price: "$15/agent/month",
      description: "Large organizations with complete requirements",
      included: [
        "All Pro features",
        "White labeling",
        "SSO integration",
        "Custom SLA",
        "Dedicated support manager",
        "Advanced automation",
        "Custom workflows",
        "API rate limit: Unlimited",
        "100% platform access"
      ],
      notIncluded: [],
      bestFor: "Large enterprises, complex organizations"
    }
  ];

  const implementationGuide = [
    {
      phase: "Planning & Discovery",
      duration: "1-2 weeks",
      description: "Understand requirements and plan implementation",
      activities: [
        "Business requirements analysis",
        "Technical architecture review",
        "Integration planning",
        "Team structure planning",
        "Success metrics definition"
      ]
    },
    {
      phase: "Setup & Configuration",
      duration: "1-3 weeks",
      description: "Platform setup and basic configuration",
      activities: [
        "Account setup and user creation",
        "Chat widget installation",
        "Basic routing configuration",
        "Team and department setup",
        "Initial testing"
      ]
    },
    {
      phase: "Integration & Customization",
      duration: "2-4 weeks",
      description: "Connect with existing systems and customize",
      activities: [
        "CRM integration setup",
        "API integrations",
        "Custom field configuration",
        "Workflow automation",
        "Advanced routing rules"
      ]
    },
    {
      phase: "Training & Launch",
      duration: "1-2 weeks",
      description: "Team training and go-live preparation",
      activities: [
        "Agent training sessions",
        "Supervisor training",
        "Admin training",
        "Soft launch with limited users",
        "Full production launch"
      ]
    },
    {
      phase: "Optimization",
      duration: "Ongoing",
      description: "Continuous improvement and optimization",
      activities: [
        "Performance monitoring",
        "Analytics review",
        "Process optimization",
        "Feature adoption",
        "Regular health checks"
      ]
    }
  ];

  const industryUse = [
    {
      industry: "E-commerce & Retail",
      description: "Boost sales and reduce cart abandonment",
      metrics: ["40% increase in conversion", "60% reduction in cart abandonment", "25% increase in average order value"],
      features: ["Product recommendations", "Order tracking", "Inventory inquiries", "Return assistance"]
    },
    {
      industry: "Healthcare",
      description: "HIPAA-compliant patient communication",
      metrics: ["50% faster appointment scheduling", "80% reduction in phone calls", "95% patient satisfaction"],
      features: ["Appointment scheduling", "Prescription inquiries", "Insurance verification", "Secure messaging"]
    },
    {
      industry: "Financial Services",
      description: "Secure customer support and sales",
      metrics: ["70% faster issue resolution", "45% increase in cross-selling", "99.9% security compliance"],
      features: ["Account inquiries", "Loan applications", "Fraud reporting", "Investment advice"]
    },
    {
      industry: "SaaS & Technology",
      description: "Technical support and user onboarding",
      metrics: ["60% reduction in support tickets", "80% faster onboarding", "90% user adoption"],
      features: ["Technical troubleshooting", "Feature guidance", "Integration support", "User training"]
    }
  ];

  const upcomingWebinars = [
    {
      title: "Maximizing ROI with AI-Powered Customer Support",
      date: "Dec 20, 2024",
      time: "2:00 PM EST",
      speaker: "Dr. Sarah Johnson, VP of AI Research",
      attendees: "1,500+ registered",
      topics: ["AI implementation strategies", "ROI measurement", "Best practices", "Q&A session"]
    },
    {
      title: "Building Scalable Support Operations",
      date: "Jan 3, 2025", 
      time: "11:00 AM EST",
      speaker: "Michael Chen, Customer Success Director",
      attendees: "1,200+ registered",
      topics: ["Team scaling strategies", "Process optimization", "Performance metrics", "Case studies"]
    },
    {
      title: "Security & Compliance in Customer Communications",
      date: "Jan 10, 2025",
      time: "1:00 PM EST",
      speaker: "Lisa Thompson, Security Expert",
      attendees: "800+ registered",
      topics: ["GDPR compliance", "Data security", "Audit requirements", "Best practices"]
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
                <Button variant="ghost" onClick={() => navigate('/pricing')}>Pricing</Button>
                <Button variant="ghost" onClick={() => navigate('/documentation')}>Documentation</Button>
                <Button variant="ghost" onClick={() => navigate('/resources')} className="text-blue-600">Resources</Button>
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
              Complete <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Knowledge Base</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Comprehensive platform overview, detailed pricing breakdown, implementation guides, and industry-specific use cases.
            </p>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {Object.entries(platformOverview).map(([key, value], index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{value}</div>
                  <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Platform Capabilities */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Capabilities Deep Dive</h2>
            <p className="text-xl text-gray-600">Explore every feature and capability in detail</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {detailedCapabilities.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.capabilities.map((capability, capIndex) => (
                        <div key={capIndex} className="border-l-4 border-blue-500 pl-4">
                          <div className="font-medium text-gray-900">{capability.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{capability.description}</div>
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

      {/* Detailed Pricing Breakdown */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Detailed Pricing Breakdown</h2>
            <p className="text-xl text-gray-600">Complete overview of what's included in each plan</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pricingBreakdown.map((plan, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <CardTitle className="text-2xl text-gray-900">{plan.plan}</CardTitle>
                      <div className="text-3xl font-bold text-blue-600">{plan.price}</div>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                  <Badge className="bg-blue-100 text-blue-700 w-fit">{plan.bestFor}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium text-green-700 mb-2">✓ What's Included:</div>
                      <div className="space-y-1">
                        {plan.included.map((item, itemIndex) => (
                          <div key={itemIndex} className="text-sm text-gray-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    {plan.notIncluded.length > 0 && (
                      <div>
                        <div className="font-medium text-red-700 mb-2">✗ Not Included:</div>
                        <div className="space-y-1">
                          {plan.notIncluded.map((item, itemIndex) => (
                            <div key={itemIndex} className="text-sm text-gray-500 flex items-center">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button className="w-full mt-4" onClick={() => navigate('/auth')}>
                    Start {plan.plan} Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Implementation Roadmap</h2>
            <p className="text-xl text-gray-600">Step-by-step guide to successful platform adoption</p>
          </div>

          <div className="space-y-8">
            {implementationGuide.map((phase, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{phase.phase}</h3>
                        <Badge variant="outline">{phase.duration}</Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{phase.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {phase.activities.map((activity, activityIndex) => (
                          <div key={activityIndex} className="text-sm text-gray-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Industry Use Cases */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Industry-Specific Solutions</h2>
            <p className="text-xl text-gray-600">How different industries benefit from Trichat</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {industryUse.map((industry, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{industry.industry}</CardTitle>
                  <CardDescription className="text-gray-600">{industry.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium text-green-700 mb-2">Key Metrics:</div>
                      <div className="grid grid-cols-1 gap-1">
                        {industry.metrics.map((metric, metricIndex) => (
                          <div key={metricIndex} className="text-sm text-gray-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            {metric}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-700 mb-2">Common Features:</div>
                      <div className="grid grid-cols-2 gap-1">
                        {industry.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="text-sm text-gray-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Webinars */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Educational Webinars</h2>
            <p className="text-xl text-gray-600">Learn from experts and get the most out of your platform</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {upcomingWebinars.map((webinar, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">{webinar.date}</span>
                  </div>
                  <CardTitle className="text-xl text-gray-900">{webinar.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {webinar.time} • {webinar.speaker}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Badge className="bg-green-100 text-green-700">
                      {webinar.attendees}
                    </Badge>
                    <div>
                      <div className="font-medium text-gray-700 mb-2">Topics Covered:</div>
                      <div className="space-y-1">
                        {webinar.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="text-sm text-gray-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full">
                      Register Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to transform your customer experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies that trust Trichat to deliver exceptional customer experiences at scale.
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
              onClick={() => navigate('/pricing')}
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
