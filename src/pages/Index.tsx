
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, Users, BarChart3, Shield, Zap, Globe, ArrowRight, CheckCircle, Star, 
  TrendingUp, Award, Building, Briefcase, Bot, Settings, Database, Cloud, Lock,
  Phone, Mail, Smartphone, Monitor, Headphones, FileText, Search, Filter,
  Calendar, Clock, Bell, Target, Workflow, Code, Plug, LineChart,
  UserCheck, MessageCircle, Eye, Activity, Brain, Layers, Network
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
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

  const coreFeatures = [
    {
      icon: MessageSquare,
      title: "AI-Powered Chat Engine",
      description: "Advanced natural language processing with multi-language support and intelligent routing",
      features: ["Real-time messaging", "Auto-translation", "Smart routing", "Context awareness"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Omnichannel Support",
      description: "Unified platform supporting web chat, mobile apps, social media, and voice channels",
      features: ["Web chat widget", "Mobile SDK", "Social media integration", "Voice support"],
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time reporting with custom dashboards, KPI tracking, and predictive insights",
      features: ["Custom dashboards", "Performance metrics", "Predictive analytics", "Export capabilities"],
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Bot,
      title: "Intelligent Chatbots",
      description: "AI-powered chatbots with machine learning capabilities and workflow automation",
      features: ["NLP processing", "Learning algorithms", "Workflow automation", "Custom training"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const platformFeatures = [
    {
      category: "Communication & Messaging",
      icon: MessageCircle,
      features: [
        { name: "Real-time Chat", description: "Instant messaging with typing indicators" },
        { name: "File Sharing", description: "Secure document and media sharing" },
        { name: "Canned Responses", description: "Pre-built response templates" },
        { name: "Message Threading", description: "Organized conversation threads" },
        { name: "Emoji & Reactions", description: "Rich messaging experience" },
        { name: "Message Encryption", description: "End-to-end encryption" }
      ]
    },
    {
      category: "Agent Management",
      icon: UserCheck,
      features: [
        { name: "Agent Routing", description: "Intelligent assignment algorithms" },
        { name: "Skill-based Routing", description: "Match agents to customer needs" },
        { name: "Queue Management", description: "Advanced queue handling" },
        { name: "Agent Status", description: "Real-time availability tracking" },
        { name: "Workload Balancing", description: "Automatic load distribution" },
        { name: "Performance Tracking", description: "Individual agent metrics" }
      ]
    },
    {
      category: "Analytics & Reporting",
      icon: LineChart,
      features: [
        { name: "Real-time Dashboards", description: "Live performance monitoring" },
        { name: "Custom Reports", description: "Tailored business intelligence" },
        { name: "CSAT Surveys", description: "Customer satisfaction tracking" },
        { name: "Response Time Analysis", description: "Performance optimization" },
        { name: "Conversation Analytics", description: "Deep chat insights" },
        { name: "Export & API", description: "Data integration capabilities" }
      ]
    },
    {
      category: "Automation & AI",
      icon: Brain,
      features: [
        { name: "Chatbot Builder", description: "Visual bot creation tools" },
        { name: "Intent Recognition", description: "AI-powered understanding" },
        { name: "Auto-escalation", description: "Smart handoff to agents" },
        { name: "Sentiment Analysis", description: "Emotion detection" },
        { name: "Predictive Routing", description: "ML-based assignments" },
        { name: "Smart Suggestions", description: "AI-powered responses" }
      ]
    },
    {
      category: "Integration & API",
      icon: Plug,
      features: [
        { name: "REST API", description: "Full platform API access" },
        { name: "Webhooks", description: "Real-time event notifications" },
        { name: "CRM Integration", description: "Connect with existing systems" },
        { name: "SSO Support", description: "Single sign-on capabilities" },
        { name: "Custom Fields", description: "Flexible data structures" },
        { name: "Third-party Apps", description: "Extensive app marketplace" }
      ]
    },
    {
      category: "Security & Compliance",
      icon: Shield,
      features: [
        { name: "SOC 2 Compliance", description: "Enterprise security standards" },
        { name: "GDPR Ready", description: "Data protection compliance" },
        { name: "Role-based Access", description: "Granular permissions" },
        { name: "Audit Trails", description: "Complete activity logs" },
        { name: "Data Encryption", description: "256-bit encryption" },
        { name: "IP Whitelisting", description: "Network security controls" }
      ]
    }
  ];

  const useCases = [
    {
      icon: Headphones,
      title: "Customer Support",
      description: "Reduce response times by 80% with intelligent ticket routing and automated workflows",
      metrics: ["80% faster response", "95% satisfaction", "60% cost reduction"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "Sales Enablement",
      description: "Increase conversion rates with AI-powered lead qualification and real-time engagement",
      metrics: ["3x conversion rate", "50% more leads", "40% revenue growth"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Settings,
      title: "Technical Support",
      description: "Resolve complex issues with integrated knowledge base and expert routing",
      metrics: ["60% self-service", "45% faster resolution", "90% first-contact"],
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Building,
      title: "Enterprise Operations",
      description: "Scale customer operations with enterprise-grade security and compliance features",
      metrics: ["99.9% uptime", "SOC 2 compliant", "Global deployment"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Head of Customer Success",
      company: "TechCorp Inc.",
      content: "Trichat transformed our customer support operations. We've seen a 70% reduction in response times and 95% customer satisfaction.",
      rating: 5,
      metrics: "70% faster responses"
    },
    {
      name: "Michael Rodriguez",
      role: "VP of Operations",
      company: "Global Retail Ltd.",
      content: "The AI-powered routing and analytics have been game-changers. Our team efficiency has improved dramatically.",
      rating: 5,
      metrics: "3x team efficiency"
    },
    {
      name: "Dr. Emily Watson",
      role: "CTO",
      company: "HealthTech Solutions",
      content: "Security and compliance features are outstanding. HIPAA compliance made our healthcare deployment seamless.",
      rating: 5,
      metrics: "100% compliance"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
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
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
                <Award className="w-3 h-3 mr-1" />
                Trusted by 10,000+ businesses worldwide
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Enterprise-Grade <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Customer Experience</span> Platform
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your customer interactions with AI-powered chat management, real-time analytics, and seamless omnichannel support. Built for enterprise scale with uncompromising security.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => navigate('/auth')}
                >
                  Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/solutions')}
                >
                  View Solutions
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">SOC 2 compliant</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">Live Chat Dashboard</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">247</div>
                      <div className="text-xs text-gray-500">Active Chats</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">98%</div>
                      <div className="text-xs text-gray-500">Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">1.2s</div>
                      <div className="text-xs text-gray-500">Avg Response</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        </div>
                        <Badge variant="outline" className="text-xs">Online</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating metrics */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-xs text-gray-600">Uptime</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border">
                <div className="text-2xl font-bold text-blue-600">&lt; 200ms</div>
                <div className="text-xs text-gray-600">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Core Platform Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive suite of tools designed to transform your customer interactions and drive business growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-sm text-gray-600">{item}</span>
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

      {/* Detailed Features Grid */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Feature Overview</h2>
            <p className="text-xl text-gray-600">Every tool you need for exceptional customer experience</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {platformFeatures.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{category.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900">{feature.name}</div>
                            <div className="text-sm text-gray-600">{feature.description}</div>
                          </div>
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

      {/* Use Cases Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Proven Results Across Industries</h2>
            <p className="text-xl text-gray-600">See how Trichat drives measurable business outcomes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => {
              const IconComponent = useCase.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${useCase.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-900">{useCase.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {useCase.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {useCase.metrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-sm font-medium text-green-700">{metric}</span>
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

      {/* Testimonials */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-gray-600">Real results from real customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardDescription className="text-lg text-gray-700 mb-4">
                    "{testimonial.content}"
                  </CardDescription>
                  <div className="space-y-2">
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600">{testimonial.role}, {testimonial.company}</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">{testimonial.metrics}</Badge>
                  </div>
                </CardHeader>
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
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
              onClick={() => navigate('/pricing')}
            >
              View Pricing
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold">Trichat</span>
              </div>
              <p className="text-gray-400">
                Enterprise-grade customer experience platform trusted by thousands of businesses worldwide.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/solutions/by-usecase')}>By Use Case</button></li>
                <li><button onClick={() => navigate('/solutions/by-industry')}>By Industry</button></li>
                <li><button onClick={() => navigate('/solutions/by-size')}>By Organization Size</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/documentation')}>Documentation</button></li>
                <li><button onClick={() => navigate('/pricing')}>Pricing</button></li>
                <li><button onClick={() => navigate('/resources')}>Resource Center</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Trichat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
