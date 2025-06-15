
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, Search, BookOpen, Code, Settings, Users, Zap, Shield, FileText, Video, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Documentation = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const documentationSections = [
    {
      title: "Getting Started",
      description: "Quick setup guides and basic configuration",
      icon: Zap,
      color: "from-green-500 to-emerald-500",
      articles: [
        { title: "Quick Start Guide", time: "5 min read", type: "guide" },
        { title: "Initial Setup", time: "10 min read", type: "guide" },
        { title: "First Chat Widget", time: "8 min read", type: "tutorial" },
        { title: "User Management Basics", time: "6 min read", type: "guide" }
      ]
    },
    {
      title: "API Reference",
      description: "Complete API documentation and examples",
      icon: Code,
      color: "from-blue-500 to-cyan-500",
      articles: [
        { title: "REST API Overview", time: "15 min read", type: "reference" },
        { title: "Webhook Integration", time: "12 min read", type: "tutorial" },
        { title: "Authentication", time: "8 min read", type: "guide" },
        { title: "Rate Limiting", time: "5 min read", type: "reference" }
      ]
    },
    {
      title: "Configuration",
      description: "Advanced configuration and customization options",
      icon: Settings,
      color: "from-purple-500 to-indigo-500",
      articles: [
        { title: "Chat Widget Customization", time: "20 min read", type: "tutorial" },
        { title: "Routing Rules", time: "15 min read", type: "guide" },
        { title: "Automation Setup", time: "25 min read", type: "tutorial" },
        { title: "Integration Configuration", time: "18 min read", type: "guide" }
      ]
    },
    {
      title: "User Management",
      description: "Managing agents, roles, and permissions",
      icon: Users,
      color: "from-orange-500 to-red-500",
      articles: [
        { title: "Role-Based Access Control", time: "12 min read", type: "guide" },
        { title: "Agent Onboarding", time: "10 min read", type: "tutorial" },
        { title: "Permission Management", time: "8 min read", type: "guide" },
        { title: "Team Organization", time: "15 min read", type: "guide" }
      ]
    },
    {
      title: "Security & Compliance",
      description: "Security features and compliance guidelines",
      icon: Shield,
      color: "from-red-500 to-pink-500",
      articles: [
        { title: "Data Encryption", time: "10 min read", type: "reference" },
        { title: "GDPR Compliance", time: "20 min read", type: "guide" },
        { title: "SOC 2 Overview", time: "15 min read", type: "reference" },
        { title: "Security Best Practices", time: "18 min read", type: "guide" }
      ]
    },
    {
      title: "Advanced Features",
      description: "AI, analytics, and enterprise features",
      icon: BookOpen,
      color: "from-teal-500 to-cyan-500",
      articles: [
        { title: "AI Training & Optimization", time: "30 min read", type: "tutorial" },
        { title: "Custom Analytics", time: "25 min read", type: "guide" },
        { title: "Advanced Reporting", time: "20 min read", type: "tutorial" },
        { title: "White-label Configuration", time: "35 min read", type: "guide" }
      ]
    }
  ];

  const quickLinks = [
    { title: "API Keys Setup", icon: Code, path: "/docs/api-keys" },
    { title: "Widget Installation", icon: Settings, path: "/docs/widget" },
    { title: "Troubleshooting", icon: FileText, path: "/docs/troubleshooting" },
    { title: "Video Tutorials", icon: Video, path: "/docs/videos" }
  ];

  const resources = [
    {
      title: "SDK Downloads",
      description: "Official SDKs for popular programming languages",
      icon: Download,
      items: ["JavaScript SDK", "Python SDK", "PHP SDK", "Node.js SDK"]
    },
    {
      title: "Sample Code",
      description: "Ready-to-use code examples and templates",
      icon: Code,
      items: ["Widget Examples", "API Integrations", "Webhook Handlers", "Custom Themes"]
    },
    {
      title: "Postman Collection",
      description: "Complete API collection for testing and development",
      icon: Zap,
      items: ["All Endpoints", "Authentication Examples", "Sample Requests", "Response Schemas"]
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
                <Button variant="ghost" onClick={() => navigate('/documentation')} className="text-blue-600">Documentation</Button>
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
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Documentation</span> & Guides
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Everything you need to integrate, configure, and optimize your Trichat experience. From quick start guides to advanced API documentation.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <IconComponent className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">{link.title}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Documentation Sections */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {documentationSections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${section.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{section.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.articles.map((article, articleIndex) => (
                        <div key={articleIndex} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{article.title}</div>
                            <div className="text-sm text-gray-500">{article.time}</div>
                          </div>
                          <Badge className={getTypeColor(article.type)} variant="secondary">
                            {article.type}
                          </Badge>
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

      {/* Resources Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Developer Resources</h2>
            <p className="text-xl text-gray-600">Tools and resources to accelerate your development</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader>
                    <IconComponent className="w-8 h-8 text-blue-600 mb-4" />
                    <CardTitle className="text-xl text-gray-900">{resource.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {resource.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Download
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Join Our Developer Community</h2>
            <p className="text-xl text-gray-600 mb-8">Get help, share knowledge, and connect with other developers</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline">
                Join Discord
              </Button>
              <Button size="lg" variant="outline">
                GitHub Discussions
              </Button>
              <Button size="lg" variant="outline">
                Stack Overflow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to build with Trichat?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start integrating our powerful chat platform into your application today.
          </p>
          
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/auth')}
          >
            Get API Keys
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
