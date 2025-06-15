
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, FileText, Video, Users, BookOpen, Download, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Resources = () => {
  const navigate = useNavigate();

  const resourceCategories = [
    {
      title: "Documentation",
      description: "Comprehensive guides and API documentation",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      resources: [
        { title: "Quick Start Guide", type: "guide", time: "5 min read" },
        { title: "API Reference", type: "reference", time: "30 min read" },
        { title: "Integration Examples", type: "tutorial", time: "15 min read" },
        { title: "Best Practices", type: "guide", time: "20 min read" }
      ]
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides and webinars",
      icon: Video,
      color: "from-purple-500 to-indigo-500",
      resources: [
        { title: "Platform Overview", type: "video", time: "10 min watch" },
        { title: "Setup & Configuration", type: "video", time: "15 min watch" },
        { title: "Advanced Features", type: "webinar", time: "45 min watch" },
        { title: "Customer Success Stories", type: "video", time: "20 min watch" }
      ]
    },
    {
      title: "White Papers",
      description: "Industry insights and research reports",
      icon: FileText,
      color: "from-green-500 to-emerald-500",
      resources: [
        { title: "Future of Customer Support", type: "whitepaper", time: "25 min read" },
        { title: "AI in Customer Service", type: "research", time: "20 min read" },
        { title: "ROI of Chat Platforms", type: "case-study", time: "15 min read" },
        { title: "Security Best Practices", type: "whitepaper", time: "30 min read" }
      ]
    },
    {
      title: "Community",
      description: "Connect with other users and experts",
      icon: Users,
      color: "from-orange-500 to-red-500",
      resources: [
        { title: "Developer Forum", type: "forum", time: "Active" },
        { title: "User Groups", type: "community", time: "Monthly" },
        { title: "Expert Q&A", type: "forum", time: "Daily" },
        { title: "Feature Requests", type: "feedback", time: "Ongoing" }
      ]
    }
  ];

  const featuredResources = [
    {
      title: "The Complete Guide to AI-Powered Customer Support",
      description: "A comprehensive guide to implementing AI in your customer support strategy",
      type: "E-book",
      pages: "45 pages",
      color: "from-blue-500 to-cyan-500",
      badge: "Popular"
    },
    {
      title: "Enterprise Security & Compliance Checklist",
      description: "Essential security considerations for enterprise chat implementations",
      type: "Checklist",
      pages: "12 pages",
      color: "from-red-500 to-orange-500",
      badge: "New"
    },
    {
      title: "Customer Experience Metrics That Matter",
      description: "Key performance indicators for measuring customer experience success",
      type: "Report",
      pages: "28 pages",
      color: "from-purple-500 to-indigo-500",
      badge: "Trending"
    }
  ];

  const upcomingWebinars = [
    {
      title: "Mastering AI-Powered Customer Support",
      date: "Dec 15, 2024",
      time: "2:00 PM EST",
      speaker: "Dr. Sarah Johnson, VP of AI Research",
      attendees: "1,200+ registered"
    },
    {
      title: "Building Scalable Support Operations",
      date: "Dec 22, 2024", 
      time: "11:00 AM EST",
      speaker: "Michael Chen, Customer Success Director",
      attendees: "800+ registered"
    },
    {
      title: "2025 Customer Experience Trends",
      date: "Jan 5, 2025",
      time: "1:00 PM EST",
      speaker: "Lisa Thompson, Industry Analyst",
      attendees: "500+ registered"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-700';
      case 'tutorial': return 'bg-green-100 text-green-700';
      case 'reference': return 'bg-purple-100 text-purple-700';
      case 'video': return 'bg-red-100 text-red-700';
      case 'webinar': return 'bg-orange-100 text-orange-700';
      case 'whitepaper': return 'bg-teal-100 text-teal-700';
      case 'research': return 'bg-indigo-100 text-indigo-700';
      case 'case-study': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Popular': return 'bg-blue-100 text-blue-700';
      case 'New': return 'bg-green-100 text-green-700';
      case 'Trending': return 'bg-purple-100 text-purple-700';
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
              Resource <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Center</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover guides, tutorials, case studies, and tools to help you maximize your success with Trichat.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Resources */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Resources</h2>
            <p className="text-xl text-gray-600">Our most popular and valuable resources</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredResources.map((resource, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getBadgeColor(resource.badge)}>
                      {resource.badge}
                    </Badge>
                    <Download className="w-5 h-5 text-gray-400" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{resource.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{resource.type}</span>
                    <span>{resource.pages}</span>
                  </div>
                  <Button className="w-full">
                    Download Free <Download className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Categories */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {resourceCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{category.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.resources.map((resource, resourceIndex) => (
                        <div key={resourceIndex} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{resource.title}</div>
                            <div className="text-sm text-gray-500">{resource.time}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getTypeColor(resource.type)} variant="secondary">
                              {resource.type}
                            </Badge>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Webinars */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Webinars</h2>
            <p className="text-xl text-gray-600">Join our live sessions and learn from experts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-green-100 text-green-700">
                      {webinar.attendees}
                    </Badge>
                    <span className="text-sm text-gray-500">Free</span>
                  </div>
                  <Button className="w-full">
                    Register Now
                  </Button>
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
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Have questions? Our team is here to help you succeed with Trichat.
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
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
