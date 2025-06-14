
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Zap, 
  Globe, 
  Headphones,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Play,
  Quote,
  Building2
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: "Intelligent Chat Engine",
      description: "AI-powered conversations with real-time sentiment analysis and automated routing."
    },
    {
      icon: Users,
      title: "Advanced Team Management",
      description: "Role-based access control with comprehensive performance tracking and workload distribution."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Deep insights with customizable dashboards and predictive analytics for better decision making."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption with SOC 2 compliance and advanced threat protection."
    },
    {
      icon: Zap,
      title: "Lightning Performance",
      description: "Sub-second response times with 99.99% uptime and global edge network delivery."
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Multi-language support with 24/7 coverage across all time zones and regions."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "VP of Customer Success",
      company: "TechFlow Solutions",
      content: "Our customer satisfaction increased by 40% and resolution time decreased by 60%. Game-changing platform.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Head of Support Operations",
      company: "CloudScale Inc",
      content: "The analytics and automation capabilities have transformed how we handle customer interactions.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Experience Director",
      company: "RetailMax",
      content: "Seamless integration and intuitive interface. Our team adoption was immediate and impactful.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const stats = [
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "150+", label: "Countries Served" },
    { value: "2.3s", label: "Avg Response Time" },
    { value: "50M+", label: "Messages Processed" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              {/* Triware Company Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-lexend font-semibold text-slate-800">
                  Triware
                </span>
              </div>
              
              {/* Separator */}
              <div className="text-slate-300">|</div>
              
              {/* Trichat Product Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-lexend font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Trichat
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/demo')}
                className="hover:bg-blue-50 text-slate-700 font-lexend"
              >
                <Play className="w-4 h-4 mr-2" />
                Live Demo
              </Button>
              <Button 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg font-lexend"
              >
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Company Badge */}
            <Badge className="mb-4 bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200 px-4 py-2 font-lexend">
              <Building2 className="w-4 h-4 mr-2" />
              From Triware Technologies
            </Badge>
            
            {/* Product Badge */}
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 px-4 py-2 font-lexend">
              🚀 Trusted by 10,000+ Support Teams Worldwide
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight font-lexend">
              Transform Customer
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block font-lexend">
                Support Excellence
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed font-lexend">
              Enterprise-grade customer support platform with AI-powered insights, 
              real-time collaboration, and world-class analytics. Deliver exceptional 
              customer experiences at scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 h-14 shadow-xl font-lexend font-semibold"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/demo')}
                className="text-lg px-8 py-4 h-14 border-2 border-slate-300 hover:border-blue-300 hover:bg-blue-50 font-lexend font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 font-lexend">{stat.value}</div>
                  <div className="text-sm text-slate-600 font-lexend">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-slate-100 text-slate-800 font-lexend">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-lexend">
              Everything You Need for Perfect Support
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-lexend">
              Comprehensive tools designed to streamline operations and deliver exceptional customer experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold font-lexend">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 leading-relaxed font-lexend">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30 font-lexend">Dashboards</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-lexend">
              Role-Based Workspaces
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto font-lexend">
              Tailored interfaces designed for maximum productivity and user experience
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-red-500 to-orange-500 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-6 h-6" />
                  <CardTitle className="text-xl font-lexend">Admin Command Center</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-red-100 mb-6 leading-relaxed font-lexend">
                  Complete organizational control with advanced user management and system configuration
                </p>
                <ul className="space-y-3 text-sm text-red-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-red-200" />
                    <span className="font-lexend">Advanced User Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-red-200" />
                    <span className="font-lexend">System-wide Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-red-200" />
                    <span className="font-lexend">Integration Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-red-200" />
                    <span className="font-lexend">Security & Compliance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6" />
                  <CardTitle className="text-xl font-lexend">Supervisor Hub</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100 mb-6 leading-relaxed font-lexend">
                  Real-time team oversight with performance optimization and quality management
                </p>
                <ul className="space-y-3 text-sm text-blue-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-200" />
                    <span className="font-lexend">Live Team Monitoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-200" />
                    <span className="font-lexend">Performance Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-200" />
                    <span className="font-lexend">Queue Optimization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-200" />
                    <span className="font-lexend">Quality Assurance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6" />
                  <CardTitle className="text-xl font-lexend">Agent Workspace</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-100 mb-6 leading-relaxed font-lexend">
                  Streamlined interface for efficient customer interaction and case resolution
                </p>
                <ul className="space-y-3 text-sm text-emerald-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-200" />
                    <span className="font-lexend">Unified Communication</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-200" />
                    <span className="font-lexend">Customer 360° View</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-200" />
                    <span className="font-lexend">Smart Responses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-200" />
                    <span className="font-lexend">Case Management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-slate-100 text-slate-800 font-lexend">Testimonials</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-lexend">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-lexend">
              See how teams worldwide are transforming their customer support operations with Trichat
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-slate-300 mb-4" />
                  <p className="text-slate-700 mb-6 leading-relaxed italic font-lexend">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold font-lexend">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 font-lexend">{testimonial.name}</p>
                      <p className="text-sm text-slate-600 font-lexend">{testimonial.role}</p>
                      <p className="text-sm text-blue-600 font-medium font-lexend">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight font-lexend">
            Ready to Transform Your Customer Support?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed font-lexend">
            Join thousands of companies delivering world-class customer experiences with Trichat
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 h-14 shadow-xl font-semibold font-lexend"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 h-14 font-semibold font-lexend"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              {/* Company and Product Logos */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold font-lexend">Triware</span>
                </div>
                <div className="text-slate-600">•</div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-lexend">Trichat</span>
                </div>
              </div>
              <p className="text-slate-400 mb-6 max-w-md leading-relaxed font-lexend">
                The world's most advanced customer support platform from Triware Technologies, trusted by industry leaders worldwide.
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-lexend">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  All Systems Operational
                </Badge>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-6 text-lg font-lexend">Product</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors font-lexend">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-lexend">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-lexend">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-lexend">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-6 text-lg font-lexend">Support</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors font-lexend">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-lexend">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-lexend">System Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-lexend">Training</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 font-lexend">&copy; 2024 Triware Technologies. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors font-lexend">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors font-lexend">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors font-lexend">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
